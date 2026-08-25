"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Instances,
  Instance,
  MeshReflectorMaterial,
  RoundedBox,
  Html,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import type { SectionKey } from "./section-keys";

const setCursor = (on: boolean) => {
  document.body.style.cursor = on ? "pointer" : "";
};

/* ---------- camera journey ----------
   The camera glides along these stops as the page scrolls: a wide
   establishing aerial, a slow descent into the clearing, a left-to-right
   sweep past the landmarks, a gaze up the mountains, then a pull-back to a
   wide dusk view. Scroll progress (0..1) drives the position along the path. */
type Waypoint = { pos: [number, number, number]; look: [number, number, number] };
const WAYPOINTS: Waypoint[] = [
  { pos: [0, 16, 40], look: [0, 2.5, -6] }, // 0 establishing aerial
  { pos: [-12, 3.4, 12], look: [-9, 1.1, 4.6] }, // 1 tent / about
  { pos: [-6, 2.8, 10.6], look: [-5.4, 1, 3.9] }, // 2 pack + bike
  { pos: [-1.7, 2.3, 8.6], look: [-1.7, 0.9, 3.1] }, // 3 campfire
  { pos: [5, 2.8, 10.6], look: [5.4, 1, 3.9] }, // 4 lantern / ball / laptop
  { pos: [9.5, 4.2, 13], look: [3, 7, -22] }, // 5 gaze up the mountains
  { pos: [0, 14, 36], look: [0, 2, -8] }, // 6 pull back, wide
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep

function JourneyRig({ progress }: { progress?: MotionValue<number> }) {
  const desired = useRef(new THREE.Vector3(0, 16, 40));
  const lookAt = useRef(new THREE.Vector3(0, 2.5, -6));
  const tmp = useRef(new THREE.Vector3());
  useFrame((state, delta) => {
    const p = progress ? clamp01(progress.get()) : 0;
    const N = WAYPOINTS.length;
    const seg = p * (N - 1);
    const i = Math.min(Math.floor(seg), N - 2);
    const f = smooth(seg - i);
    const a = WAYPOINTS[i];
    const b = WAYPOINTS[i + 1];
    const t = state.clock.elapsedTime;

    // pointer drift + a slow idle bob keep the frame alive even when still
    desired.current.set(
      lerp(a.pos[0], b.pos[0], f) + state.pointer.x * 1.1,
      lerp(a.pos[1], b.pos[1], f) + state.pointer.y * 0.5 + Math.sin(t * 0.5) * 0.12,
      lerp(a.pos[2], b.pos[2], f),
    );
    tmp.current.set(
      lerp(a.look[0], b.look[0], f),
      lerp(a.look[1], b.look[1], f),
      lerp(a.look[2], b.look[2], f),
    );

    // frame-rate independent damping toward the target for a cinematic glide
    const al = 1 - Math.exp(-3.4 * delta);
    state.camera.position.lerp(desired.current, al);
    lookAt.current.lerp(tmp.current, al);
    state.camera.lookAt(lookAt.current);
  });
  return null;
}

/* ---------- clickable wrapper (hover lift + cursor) ---------- */
function Hotspot3D({
  section,
  label,
  position,
  rotation = 0,
  scale = 1,
  tagHeight = 2.9,
  hit = [2.2, 2.4, 1.8],
  onSelect,
  children,
}: {
  section: SectionKey;
  label: string;
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  tagHeight?: number;
  /** width, height, depth of the invisible click target */
  hit?: [number, number, number];
  onSelect?: (k: SectionKey) => void;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const world = useMemo(
    () => new THREE.Vector3(position[0], tagHeight, position[2]),
    [position, tagHeight],
  );
  const phase = useMemo(() => Math.abs(position[0]) * 1.7, [position]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const ts = hovered ? scale * 1.12 : scale;
      ref.current.scale.x += (ts - ref.current.scale.x) * 0.18;
      ref.current.scale.y = ref.current.scale.z = ref.current.scale.x;
      // a soft idle bob makes the objects feel alive and touchable
      const ty = (hovered ? 0.3 : 0) + Math.sin(t * 1.4 + phase) * 0.05;
      ref.current.position.y += (ty - ref.current.position.y) * 0.18;
    }
    // pulsing ground ring marks every object as an interactive hotspot
    if (ringRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + phase);
      const s = 1 + pulse * 0.12;
      ringRef.current.scale.set(s, s, s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        (hovered ? 0.85 : 0.32) + pulse * 0.16;
    }
    // labels fade in as the camera travels close, then full on hover
    if (labelRef.current) {
      const d = state.camera.position.distanceTo(world);
      let o = (30 - d) / (30 - 13);
      o = o < 0 ? 0 : o > 1 ? 1 : o;
      labelRef.current.style.opacity = String(hovered ? 1 : o);
    }
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(section);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setCursor(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor(false);
        }}
      >
        {/* generous invisible click target: thin shapes like the bike frame
            are nearly impossible to hit with a raycast against the real mesh */}
        <mesh position={[0, hit[1] / 2, 0]}>
          <boxGeometry args={hit} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {children}
      </group>

      {/* glowing ground ring — a clear "you can click me" marker */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.95, 1.18, 40]} />
        <meshBasicMaterial
          color="#ffb84a"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* always-mounted label; opacity driven per-frame (no re-render) */}
      <Html position={[0, tagHeight, 0]} center pointerEvents="none" zIndexRange={[40, 0]}>
        <div
          ref={labelRef}
          style={{ opacity: 0 }}
          className="flex -translate-y-1/2 flex-col items-center"
        >
          <span
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1 font-hand text-lg leading-none shadow-lg ring-1 transition-colors ${
              hovered
                ? "bg-[rgb(var(--c-warm-1))] text-white ring-[rgb(var(--c-warm-1))]"
                : "bg-[rgb(var(--c-bg-2)/0.96)] text-foreground ring-[rgb(var(--c-fg)/0.12)]"
            }`}
          >
            {label}
            <span aria-hidden>→</span>
          </span>
          <span
            className={`-mt-px h-2 w-2 rotate-45 ring-1 ${
              hovered
                ? "bg-[rgb(var(--c-warm-1))] ring-[rgb(var(--c-warm-1))]"
                : "bg-[rgb(var(--c-bg-2)/0.96)] ring-[rgb(var(--c-fg)/0.12)]"
            }`}
          />
        </div>
      </Html>
    </group>
  );
}

/* a cylinder between two points (for bike frames) */
function Bar({
  a,
  b,
  r = 0.045,
  color = "#2f3338",
}: {
  a: [number, number, number];
  b: [number, number, number];
  r?: number;
  color?: string;
}) {
  const { pos, rot, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = new THREE.Vector3().subVectors(vb, va);
    const length = dir.length();
    const mid = new THREE.Vector3().addVectors(va, vb).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    const eu = new THREE.Euler().setFromQuaternion(q);
    return {
      pos: [mid.x, mid.y, mid.z] as [number, number, number],
      rot: [eu.x, eu.y, eu.z] as [number, number, number],
      len: length,
    };
  }, [a, b]);
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <cylinderGeometry args={[r, r, len, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/* ---------- objects (one per section) ---------- */
function Tent() {
  // wide, low ridge tent so the silhouette reads clearly
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.7, 0);
    s.lineTo(1.7, 0);
    s.lineTo(0, 1.45);
    s.closePath();
    return s;
  }, []);
  const door = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.6, 0);
    s.lineTo(0.6, 0);
    s.lineTo(0, 1.1);
    s.closePath();
    return s;
  }, []);
  return (
    <group>
      {/* fabric body (extruded triangle, end caps closed) */}
      <mesh castShadow position={[0, 0, -1.6]}>
        <extrudeGeometry args={[shape, { depth: 3.2, bevelEnabled: false }]} />
        <meshStandardMaterial color="#e08a4f" flatShading />
      </mesh>
      {/* dark doorway on the front */}
      <mesh position={[0, 0.01, 1.61]}>
        <shapeGeometry args={[door]} />
        <meshStandardMaterial color="#34211a" side={THREE.DoubleSide} />
      </mesh>
      {/* two open flaps peeled back from the door */}
      <mesh position={[-0.34, 0.55, 1.63]} rotation={[0, 0, 0.32]}>
        <planeGeometry args={[0.42, 1.1]} />
        <meshStandardMaterial color="#c2703a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.34, 0.55, 1.63]} rotation={[0, 0, -0.32]}>
        <planeGeometry args={[0.42, 1.1]} />
        <meshStandardMaterial color="#c2703a" side={THREE.DoubleSide} />
      </mesh>
      {/* ridge pole poking out each end */}
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3.5, 6]} />
        <meshStandardMaterial color="#5a3d28" />
      </mesh>
      {/* guy lines to pegs */}
      {[
        [-1.7, 1.9],
        [1.7, 1.9],
        [-1.7, -1.9],
        [1.7, -1.9],
      ].map((p, i) => (
        <Bar key={i} a={[0, 1.45, p[1] > 0 ? 1.6 : -1.6]} b={[p[0] * 0.9, 0, p[1]]} r={0.012} color="#cdbfae" />
      ))}
    </group>
  );
}

function Backpack() {
  const body = "#2f8f6e";
  const dark = "#1c4c3b";
  const buckle = "#d8b84a";
  return (
    <group>
      {/* main body */}
      <RoundedBox args={[1.05, 1.5, 0.72]} radius={0.16} position={[0, 0.85, 0]} castShadow>
        <meshStandardMaterial color={body} flatShading />
      </RoundedBox>
      {/* rounded top lid */}
      <RoundedBox args={[1.12, 0.5, 0.8]} radius={0.2} position={[0, 1.62, 0.02]} castShadow>
        <meshStandardMaterial color="#256f55" flatShading />
      </RoundedBox>
      {/* lid strap + buckle */}
      <mesh position={[0, 1.5, 0.44]}>
        <boxGeometry args={[0.16, 0.55, 0.05]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0, 1.3, 0.46]}>
        <boxGeometry args={[0.2, 0.12, 0.05]} />
        <meshStandardMaterial color={buckle} metalness={0.3} />
      </mesh>
      {/* big front pocket */}
      <RoundedBox args={[0.72, 0.66, 0.24]} radius={0.1} position={[0, 0.6, 0.42]} castShadow>
        <meshStandardMaterial color="#3aa884" flatShading />
      </RoundedBox>
      <mesh position={[0, 0.6, 0.56]}>
        <boxGeometry args={[0.14, 0.5, 0.04]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      {/* padded shoulder straps on the front */}
      <mesh position={[-0.32, 0.95, 0.34]} rotation={[0.12, 0, 0.05]} castShadow>
        <boxGeometry args={[0.17, 1.25, 0.12]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
      <mesh position={[0.32, 0.95, 0.34]} rotation={[0.12, 0, -0.05]} castShadow>
        <boxGeometry args={[0.17, 1.25, 0.12]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
      {/* side bottle pocket */}
      <mesh position={[0.56, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.55, 10]} />
        <meshStandardMaterial color="#256f55" flatShading />
      </mesh>
      {/* bedroll strapped under the pack */}
      <mesh position={[0, 0.12, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 1.0, 12]} />
        <meshStandardMaterial color="#d98c5f" flatShading />
      </mesh>
    </group>
  );
}

function LaptopLog() {
  return (
    <group>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]} position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.3, 14]} />
        <meshStandardMaterial color="#7d4f2d" flatShading />
      </mesh>
      <mesh position={[0.95, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.355, 0.355, 0.04, 14]} />
        <meshStandardMaterial color="#a9744a" flatShading />
      </mesh>
      <mesh position={[0, 0.74, 0.12]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.06, 0.72]} />
        <meshStandardMaterial color="#3a3f45" />
      </mesh>
      <mesh position={[0, 1.04, -0.24]} rotation={[-1.25, 0, 0]}>
        <boxGeometry args={[1.1, 0.72, 0.05]} />
        <meshStandardMaterial color="#23262b" />
      </mesh>
      <mesh position={[0, 1.04, -0.21]} rotation={[-1.25, 0, 0]}>
        <planeGeometry args={[0.96, 0.56]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffcf6a" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Flag() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 6]} />
        <meshStandardMaterial color="#7b8390" flatShading />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshStandardMaterial color="#6b5536" />
      </mesh>
      <mesh position={[0.5, 1.9, 0]}>
        <boxGeometry args={[1, 0.55, 0.03]} />
        <meshStandardMaterial color="#e8a23f" flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SoccerBall() {
  const R = 0.48;
  // The real soccer ball: an actual truncated icosahedron built from the
  // icosahedron by cutting each vertex at 1/3 of every edge. That yields 12
  // flat pentagon panels (black) and 20 flat hexagon panels (white), with
  // clean straight panel edges.
  const geo = useMemo(() => {
    const t = (1 + Math.sqrt(5)) / 2;
    const V = [
      [0, 1, t], [0, 1, -t], [0, -1, t], [0, -1, -t],
      [1, t, 0], [1, -t, 0], [-1, t, 0], [-1, -t, 0],
      [t, 0, 1], [t, 0, -1], [-t, 0, 1], [-t, 0, -1],
    ].map((p) => new THREE.Vector3(p[0], p[1], p[2]));

    // adjacency: icosahedron edges have squared length 4
    const adj: number[][] = V.map(() => []);
    for (let i = 0; i < 12; i++)
      for (let j = i + 1; j < 12; j++)
        if (Math.abs(V[i].distanceToSquared(V[j]) - 4) < 0.5) {
          adj[i].push(j);
          adj[j].push(i);
        }

    // triangular faces = mutually adjacent triples
    const faces: [number, number, number][] = [];
    for (let i = 0; i < 12; i++)
      for (const j of adj[i])
        if (j > i)
          for (const k of adj[j])
            if (k > j && adj[i].includes(k)) faces.push([i, j, k]);

    // truncation point on edge a->b, sitting 1/3 of the way from a
    const tp = (a: number, b: number) =>
      V[a].clone().addScaledVector(V[b].clone().sub(V[a]), 1 / 3);

    const positions: number[] = [];
    const colors: number[] = [];
    const black = new THREE.Color("#16181f");
    const white = new THREE.Color("#f3f3ec");

    const addPanel = (
      pts: THREE.Vector3[],
      center: THREE.Vector3,
      color: THREE.Color,
    ) => {
      const cn = center.clone().normalize();
      let ref = new THREE.Vector3(0, 1, 0);
      if (Math.abs(cn.dot(ref)) > 0.95) ref = new THREE.Vector3(1, 0, 0);
      const t1 = ref.clone().cross(cn).normalize();
      const t2 = cn.clone().cross(t1).normalize();
      // order the panel's points around its centre
      const ordered = pts
        .map((p) => {
          const d = p.clone().sub(center);
          return { p, ang: Math.atan2(d.dot(t2), d.dot(t1)) };
        })
        .sort((m, n) => m.ang - n.ang)
        .map((o) => o.p);
      // triangle fan, forcing outward winding
      for (let i = 1; i < ordered.length - 1; i++) {
        const a = ordered[0];
        let b = ordered[i];
        let c = ordered[i + 1];
        const nrm = b.clone().sub(a).cross(c.clone().sub(a));
        if (nrm.dot(cn) < 0) [b, c] = [c, b];
        for (const v of [a, b, c]) positions.push(v.x, v.y, v.z);
        for (let k = 0; k < 3; k++) colors.push(color.r, color.g, color.b);
      }
    };

    // 12 pentagons, one around each icosahedron vertex
    for (let i = 0; i < 12; i++) {
      addPanel(adj[i].map((j) => tp(i, j)), V[i].clone(), black);
    }
    // 20 hexagons, one per icosahedron face (both truncation points per edge)
    for (const [i, j, k] of faces) {
      const pts = [tp(i, j), tp(j, i), tp(j, k), tp(k, j), tp(k, i), tp(i, k)];
      addPanel(pts, V[i].clone().add(V[j]).add(V[k]), white);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const s = R / Math.hypot(positions[0], positions[1], positions[2]);
    g.scale(s, s, s);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={[0, R, 0]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.6} />
      </mesh>
    </group>
  );
}

function Lantern({ night }: { night: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.33, 0.2, 12]} />
        <meshStandardMaterial color="#3a3631" flatShading />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.72, 12]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffb84a" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[0.32, 0.3, 12]} />
        <meshStandardMaterial color="#3a3631" flatShading />
      </mesh>
      <mesh position={[0, 1.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#3a3631" />
      </mesh>
      <pointLight position={[0, 0.56, 0]} color="#ffb84a" intensity={night ? 2.5 : 1.2} distance={5} decay={2} />
    </group>
  );
}

function Bike() {
  const R: [number, number, number] = [-0.75, 0.5, 0];
  const F: [number, number, number] = [0.75, 0.5, 0];
  const BB: [number, number, number] = [0, 0.42, 0];
  const S: [number, number, number] = [-0.18, 1.15, 0];
  const H: [number, number, number] = [0.58, 1.08, 0];
  const frame = "#e8734f";
  return (
    <group>
      {[R, F].map((c, i) => (
        <group key={i}>
          <mesh position={c} castShadow>
            <torusGeometry args={[0.5, 0.055, 8, 22]} />
            <meshStandardMaterial color="#2a2d31" />
          </mesh>
          <mesh position={c}>
            <torusGeometry args={[0.46, 0.012, 6, 22]} />
            <meshStandardMaterial color="#9aa0a6" />
          </mesh>
        </group>
      ))}
      <Bar a={R} b={BB} color={frame} />
      <Bar a={BB} b={F} color={frame} />
      <Bar a={R} b={S} color={frame} />
      <Bar a={BB} b={S} color={frame} />
      <Bar a={BB} b={H} color={frame} />
      <Bar a={S} b={H} color={frame} />
      <Bar a={H} b={F} color="#2f3338" />
      {/* seat */}
      <mesh position={[S[0], S[1] + 0.05, 0]} castShadow>
        <boxGeometry args={[0.34, 0.07, 0.16]} />
        <meshStandardMaterial color="#2f3338" />
      </mesh>
      {/* handlebar */}
      <mesh position={[H[0], H[1] + 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
        <meshStandardMaterial color="#2f3338" />
      </mesh>
    </group>
  );
}

function Campfire({ night }: { night: boolean }) {
  const flame = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const f = 1 + Math.sin(t * 9) * 0.12 + Math.sin(t * 17) * 0.06;
    if (flame.current) flame.current.scale.set(1, f, 1);
    if (light.current) light.current.intensity = (night ? 7 : 3.5) + Math.sin(t * 12) * 1.2;
  });
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 1.15, 6]} />
          <meshStandardMaterial color="#6b4226" flatShading />
        </mesh>
      ))}
      {/* stones */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={`s${i}`} position={[Math.cos(a) * 0.7, 0.08, Math.sin(a) * 0.7]}>
            <sphereGeometry args={[0.16, 6, 5]} />
            <meshStandardMaterial color="#6b7280" flatShading />
          </mesh>
        );
      })}
      <mesh ref={flame} position={[0, 0.6, 0]}>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#ff9f3a" emissive="#ff7a1a" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.9, 0]} color="#ff9a3c" distance={14} decay={2} />
    </group>
  );
}

/* ---------- scenery ---------- */
function Mountain({
  position,
  height,
  radius,
  color,
  night,
  seed = 0,
  treeCount = 12,
}: {
  position: [number, number, number];
  height: number;
  radius: number;
  color: string;
  night: boolean;
  seed?: number;
  treeCount?: number;
}) {
  // faceted peak with ridge lines running down the slopes and snow blended in
  // along the silhouette — and it recedes into the sky at night.
  // All displacement is a function of the vertex's original position, so the
  // cone's duplicated seam vertices move together and the surface never tears.
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(radius, height, 10, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const colors: number[] = [];
    const rock = new THREE.Color(color);
    const snow = new THREE.Color(night ? "#525e80" : "#eef4fa");
    const tint = new THREE.Color();
    const phase = seed * 2.399;
    const hash = (a: number, b: number, c: number) => {
      const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719 + phase) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const yn = (v.y + height / 2) / height; // 0 base .. 1 tip
      const theta = Math.atan2(v.z, v.x);
      // coherent ridges: the radial bulge depends on the angle around the
      // peak, so facets line up into spurs instead of random crumple
      const ridge =
        Math.sin(theta * 3 + phase) * 0.5 +
        Math.sin(theta * 7 + phase * 2.1) * 0.3 +
        Math.sin(theta * 11 + phase * 4.7) * 0.2;
      const crumple = hash(v.x, v.y, v.z) - 0.5;
      const rs = 1 + ridge * 0.13 + crumple * 0.1;
      v.x *= rs;
      v.z *= rs;
      // uneven ring heights, but keep the base on the ground and the tip sharp
      if (yn > 0.05 && yn < 0.9) {
        v.y += (hash(v.z, v.x, v.y) - 0.5) * height * 0.05;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
      // soft snow band that dips and rises with the ridges
      const snowLine = 0.62 + ridge * 0.05 + crumple * 0.06;
      const t = Math.min(1, Math.max(0, (yn - snowLine) / 0.1));
      // slightly darker feet fading lighter toward the summit adds depth
      tint.copy(rock).multiplyScalar(0.86 + yn * 0.24).lerp(snow, t);
      colors.push(tint.r, tint.g, tint.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [height, radius, color, night, seed]);

  // a light scatter of trees on the lower slopes
  const trees = useMemo(() => {
    const out: { x: number; y: number; z: number; s: number }[] = [];
    for (let i = 0; i < treeCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = 0.04 + Math.random() * 0.24; // lower slopes only
      const r = radius * (1 - f) * 0.88;
      out.push({ x: Math.cos(a) * r, y: height * f, z: Math.sin(a) * r, s: 0.6 + Math.random() * 0.7 });
    }
    return out;
  }, [height, radius, treeCount]);

  return (
    <group position={position}>
      <mesh geometry={geo} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} />
      </mesh>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, t.y + 0.6 * t.s, t.z]} scale={t.s} castShadow>
          <coneGeometry args={[0.55, 1.6, 6]} />
          <meshStandardMaterial color={night ? "#16271c" : "#2f6a4a"} flatShading />
        </mesh>
      ))}
    </group>
  );
}

const TREE_GREENS_DAY = ["#2f6a4a", "#3a7a52", "#28603f", "#437f4e"];
const TREE_GREENS_NIGHT = ["#1d3a2a", "#234531", "#183322", "#2a4a33"];

function Forest({ night }: { night: boolean }) {
  const trees = useMemo(() => {
    const out: { p: [number, number, number]; s: number; c: number }[] = [];
    let guard = 0;
    while (out.length < 240 && guard < 3200) {
      guard++;
      const x = (Math.random() - 0.5) * 176; // a forest belt spanning the full width
      const z = -34 + Math.random() * 42;
      // keep off the (larger) lake
      if (x > -14 && x < 14 && z > -16 && z < 2) continue;
      // keep the near foreground clear for the objects
      if (z > 1.5 && Math.abs(x) < 12) continue;
      out.push({
        p: [x, 0, z],
        s: 0.7 + Math.random() * 1.2,
        c: Math.floor(Math.random() * 4),
      });
    }
    return out;
  }, []);
  const greens = night ? TREE_GREENS_NIGHT : TREE_GREENS_DAY;
  // three stacked foliage tiers per pine, with the green varying per tree
  const tiers: Array<{ r: number; h: number; y: number }> = [
    { r: 0.8, h: 1.5, y: 1.05 },
    { r: 0.58, h: 1.2, y: 1.9 },
    { r: 0.36, h: 0.95, y: 2.65 },
  ];
  return (
    <group>
      <Instances limit={trees.length} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 6]} />
        <meshStandardMaterial color="#5a3d28" flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], 0.35 * t.s, t.p[2]]} scale={t.s} />
        ))}
      </Instances>
      {tiers.map((tier, ti) => (
        <Instances key={ti} limit={trees.length} castShadow>
          <coneGeometry args={[tier.r, tier.h, 7]} />
          <meshStandardMaterial color="#ffffff" flatShading />
          {trees.map((t, i) => (
            <Instance
              key={i}
              color={greens[t.c]}
              position={[t.p[0], tier.y * t.s, t.p[2]]}
              scale={t.s}
            />
          ))}
        </Instances>
      ))}
    </group>
  );
}

function Cloud({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      {[
        [0, 0, 0, 1],
        [1.1, -0.15, 0, 0.8],
        [-1.1, -0.1, 0.2, 0.75],
        [0.4, 0.3, -0.3, 0.7],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} scale={[p[3] * 1.6, p[3], p[3]]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Clouds() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.x = ((s.clock.elapsedTime * 0.25) % 50) - 25;
  });
  return (
    <group ref={ref}>
      <Cloud x={-8} y={11} z={-18} />
      <Cloud x={10} y={13} z={-22} />
      <Cloud x={2} y={12} z={-26} />
    </group>
  );
}

function Birds({
  speed = 1.6,
  span = 44,
  y = 9,
  baseZ = -14,
}: {
  speed?: number;
  span?: number;
  y?: number;
  baseZ?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = ((t * speed) % span) - span / 2;
      ref.current.position.y = y + Math.sin(t * 0.6) * 0.6;
    }
    wings.current.forEach((w, i) => {
      if (w) w.rotation.z = Math.sin(t * 8 + i) * 0.5;
    });
  });
  return (
    <group ref={ref}>
      {[
        [0, 0, baseZ],
        [2.5, 0.8, baseZ - 1],
        [-2, 1.2, baseZ - 2],
      ].map((p, i) => (
        <group
          key={i}
          position={[p[0], p[1], p[2]]}
          ref={(el) => {
            if (el) wings.current[i] = el;
          }}
        >
          <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.4, 0.04, 0.12]} />
            <meshStandardMaterial color="#33414d" />
          </mesh>
          <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.4, 0.04, 0.12]} />
            <meshStandardMaterial color="#33414d" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* drifting motes — soft pollen by day, glowing fireflies by night */
function Fireflies({ night, count = 70 }: { night: boolean; count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 40,
        y: 0.6 + Math.random() * 6,
        z: -12 + Math.random() * 22,
        r: 0.6 + Math.random() * 1.6,
        sx: 0.2 + Math.random() * 0.5,
        sy: 0.4 + Math.random() * 0.8,
        sz: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );
  useFrame((s) => {
    if (!mesh.current) return;
    const t = s.clock.elapsedTime;
    seeds.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.sx + p.phase) * p.r,
        p.y + Math.sin(t * p.sy + p.phase) * 0.6,
        p.z + Math.cos(t * p.sz + p.phase) * p.r,
      );
      const tw = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);
      dummy.scale.setScalar(0.04 + tw * (night ? 0.06 : 0.04));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color={night ? "#ffe79a" : "#fff6cf"}
        transparent
        opacity={night ? 0.95 : 0.55}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

/* a few autumn leaves tumbling down through the clearing */
const LEAF_PALETTE = ["#e0843f", "#d8a23a", "#c2703a", "#7c9a4a", "#e6b35a"];

function Leaves({ count = 16 }: { count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        // fall near the tree line at the sides and back, not over open grass
        x: (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 18),
        z: -26 + Math.random() * 28,
        top: 3.5 + Math.random() * 3,
        speed: 0.5 + Math.random() * 0.6,
        sway: 0.5 + Math.random() * 1.1,
        phase: Math.random() * 6,
        spin: 0.6 + Math.random() * 1.2,
        color: LEAF_PALETTE[i % LEAF_PALETTE.length],
      })),
    [count],
  );
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const p = seeds[i];
      const fall = (t * p.speed + p.phase) % (p.top + 0.6);
      m.position.set(
        p.x + Math.sin(t * p.sway + p.phase) * 1.2,
        p.top - fall + 0.1,
        p.z + Math.cos(t * p.sway * 0.7 + p.phase) * 0.8,
      );
      m.rotation.set(t * 1.3 + p.phase, t * 0.6, p.phase + t * p.spin);
    });
  });
  return (
    <group>
      {seeds.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
        >
          <planeGeometry args={[0.26, 0.17]} />
          <meshStandardMaterial color={p.color} side={THREE.DoubleSide} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* gentle life in the lake — lily pads with lotus, edge reeds, a few rocks */
function LakeLife({ night }: { night: boolean }) {
  const { pads, reeds, rocks } = useMemo(() => {
    const cx = 0;
    const cz = -6.5;
    const rx = 12;
    const rz = 6.5;
    const at = (rr: number, a: number) => ({
      x: cx + Math.cos(a) * rx * rr,
      z: cz + Math.sin(a) * rz * rr,
    });
    const pads = Array.from({ length: 9 }, () => ({
      ...at(0.15 + Math.random() * 0.65, Math.random() * Math.PI * 2),
      r: 0.34 + Math.random() * 0.24,
      lotus: Math.random() > 0.45,
    }));
    const reeds = Array.from({ length: 4 }, (_, i) => ({
      ...at(0.82 + Math.random() * 0.12, Math.random() * Math.PI * 2),
      n: 3 + Math.floor(Math.random() * 3),
      seed: i + 1,
    }));
    const rocks = Array.from({ length: 3 }, (_, i) => ({
      ...at(0.45 + Math.random() * 0.35, Math.random() * Math.PI * 2),
      s: 0.4 + Math.random() * 0.4,
      seed: i + 1,
    }));
    return { pads, reeds, rocks };
  }, []);
  return (
    <group>
      {pads.map((p, i) => (
        <group key={`p${i}`} position={[p.x, 0.07, p.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[p.r, 18]} />
            <meshStandardMaterial color={night ? "#27613f" : "#3e8e5a"} flatShading side={THREE.DoubleSide} />
          </mesh>
          {p.lotus && (
            <group position={[0, 0.05, 0]}>
              <mesh scale={[1, 0.5, 1]}>
                <sphereGeometry args={[0.12, 8, 6]} />
                <meshStandardMaterial
                  color={night ? "#d27aa2" : "#f3a0c4"}
                  emissive={night ? "#d27aa2" : "#000000"}
                  emissiveIntensity={night ? 0.3 : 0}
                />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.04, 6, 5]} />
                <meshStandardMaterial color={night ? "#d6b25a" : "#f6d24a"} />
              </mesh>
            </group>
          )}
        </group>
      ))}
      {reeds.map((r, i) => (
        <group key={`r${i}`} position={[r.x, 0, r.z]}>
          {Array.from({ length: r.n }).map((_, j) => {
            const fr = Math.sin((r.seed * 7 + j * 3) * 12.9898) * 43758.5453;
            const a = fr - Math.floor(fr);
            const h = 0.9 + a * 0.8;
            const off = (j - (r.n - 1) / 2) * 0.13;
            return (
              <group key={j} position={[off, 0, (a - 0.5) * 0.2]}>
                <mesh position={[0, h / 2, 0]}>
                  <cylinderGeometry args={[0.02, 0.035, h, 5]} />
                  <meshStandardMaterial color={night ? "#2c5036" : "#4f8f54"} flatShading />
                </mesh>
                {a > 0.45 && (
                  <mesh position={[0, h, 0]}>
                    <capsuleGeometry args={[0.05, 0.16, 4, 8]} />
                    <meshStandardMaterial color={night ? "#5a3f28" : "#7d5230"} flatShading />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      ))}
      {rocks.map((r, i) => (
        <mesh
          key={`k${i}`}
          position={[r.x, 0.02, r.z]}
          scale={[r.s, r.s * 0.5, r.s]}
          rotation={[0, r.seed, 0]}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={night ? "#4a4742" : "#8c8276"} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Lake({ night }: { night: boolean }) {
  // an organic, wobbly shoreline instead of a rectangle
  const shape = useMemo(() => {
    const N = 16;
    const pts: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const rx = 13.5 + Math.sin(a * 3 + 0.6) * 2.2 + Math.cos(a * 2) * 1.4;
      const ry = 8 + Math.cos(a * 3) * 1.5 + Math.sin(a * 5 + 1) * 0.9;
      pts.push([Math.cos(a) * rx, Math.sin(a) * ry]);
    }
    const s = new THREE.Shape();
    const m0x = (pts[0][0] + pts[N - 1][0]) / 2;
    const m0y = (pts[0][1] + pts[N - 1][1]) / 2;
    s.moveTo(m0x, m0y);
    for (let i = 0; i < N; i++) {
      const cur = pts[i];
      const next = pts[(i + 1) % N];
      s.quadraticCurveTo(cur[0], cur[1], (cur[0] + next[0]) / 2, (cur[1] + next[1]) / 2);
    }
    s.closePath();
    return s;
  }, []);
  return (
    <group position={[0, 0, -6.5]}>
      {/* a soft sandy rim just under the water edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} scale={1.07}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={night ? "#2c3a22" : "#d9c491"} />
      </mesh>
      {/* pale shallows peeking out around the deep water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={1.035}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={night ? "#1d545c" : "#7fd0c9"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <shapeGeometry args={[shape]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.55}
          mixBlur={8}
          mixStrength={1.1}
          blur={[300, 90]}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color={night ? "#16454c" : "#3fb8b0"}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

/* a glowing moon that lifts the whole scene in dark mode */
function Moon() {
  return (
    <group position={[24, 27, -38]}>
      <mesh>
        <sphereGeometry args={[3.2, 24, 24]} />
        <meshBasicMaterial color="#eef2ff" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.8, 24, 24]} />
        <meshBasicMaterial color="#9fb0e6" transparent opacity={0.16} toneMapped={false} />
      </mesh>
      <pointLight color="#cdd8ff" intensity={1.1} distance={140} decay={0} />
    </group>
  );
}

/* wildflowers — a stem, a flat ring of petals, and a golden centre */
function GroundDetail({ night }: { night: boolean }) {
  const flowers = useMemo(() => {
    const out: { p: [number, number, number]; c: number; s: number }[] = [];
    // wildflowers grow in drifts, not confetti: pick patch centres and
    // scatter a handful around each, mostly sharing the patch colour
    const centers: [number, number, number][] = [];
    let g = 0;
    while (centers.length < 12 && g < 500) {
      g++;
      const x = (Math.random() - 0.5) * 64;
      const z = -22 + Math.random() * 44;
      if (x > -17 && x < 17 && z > -18 && z < 4) continue; // off the lake
      if (z > 1.5 && z < 7.5 && Math.abs(x) < 14) continue; // off the object row
      centers.push([x, z, Math.floor(Math.random() * 4)]);
    }
    centers.forEach(([cx, cz, patchColor]) => {
      const n = 9 + Math.floor(Math.random() * 8);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.6) * 2.8;
        const x = cx + Math.cos(a) * r;
        const z = cz + Math.sin(a) * r * 0.75;
        if (x > -14 && x < 14 && z > -16 && z < 2) continue;
        if (z > 2.6 && z < 6.4 && Math.abs(x) < 12) continue;
        out.push({
          p: [x, 0, z],
          c: Math.random() < 0.75 ? patchColor : Math.floor(Math.random() * 4),
          s: 0.7 + Math.random() * 0.5,
        });
      }
    });
    return out;
  }, []);
  const petalColors = night
    ? ["#d782b0", "#d06a6a", "#a99ce0", "#e6ecff"]
    : ["#ef7fb0", "#ec6a6a", "#a99ae8", "#fbfdff"];
  const byColor = [0, 1, 2, 3].map((c) => flowers.filter((f) => f.c === c));
  return (
    <group>
      {/* stems */}
      {flowers.length > 0 && (
        <Instances limit={flowers.length}>
          <cylinderGeometry args={[0.014, 0.014, 0.36, 5]} />
          <meshStandardMaterial color={night ? "#33543a" : "#4f8f54"} />
          {flowers.map((f, i) => (
            <Instance key={i} position={[f.p[0], 0.18 * f.s, f.p[2]]} scale={f.s} />
          ))}
        </Instances>
      )}
      {/* flat disc of petals */}
      {byColor.map((list, ci) =>
        list.length > 0 ? (
          <Instances key={ci} limit={list.length}>
            <sphereGeometry args={[0.17, 9, 6]} />
            <meshStandardMaterial
              color={petalColors[ci]}
              emissive={petalColors[ci]}
              emissiveIntensity={night ? 0.35 : 0}
            />
            {list.map((f, i) => (
              <Instance
                key={i}
                position={[f.p[0], 0.38 * f.s, f.p[2]]}
                scale={[f.s, 0.3 * f.s, f.s]}
              />
            ))}
          </Instances>
        ) : null,
      )}
      {/* golden centre */}
      {flowers.length > 0 && (
        <Instances limit={flowers.length}>
          <sphereGeometry args={[0.055, 6, 5]} />
          <meshStandardMaterial
            color={night ? "#d6b25a" : "#f6d24a"}
            emissive={night ? "#d6b25a" : "#000000"}
            emissiveIntensity={night ? 0.3 : 0}
          />
          {flowers.map((f, i) => (
            <Instance key={i} position={[f.p[0], 0.41 * f.s, f.p[2]]} scale={f.s} />
          ))}
        </Instances>
      )}
    </group>
  );
}

/* layered rows of sharp cone peaks spanning the full width. The far row is
   tall and densely overlapping so it reads as a solid backdrop (no sky-holes),
   while the nearer rows give crisp foreground peaks. */
const MOUNTAIN_PEAKS = (() => {
  const rnd = (i: number, s: number) => {
    const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const out: { x: number; z: number; h: number; r: number; t: number; row: number }[] = [];
  const rows = [
    { z: -52, n: 9, span: 170, hmin: 30, hmax: 42, rmin: 18, rmax: 22, t: 0 },
    { z: -39, n: 8, span: 150, hmin: 22, hmax: 31, rmin: 13, rmax: 16, t: 0 },
    { z: -26, n: 8, span: 132, hmin: 15, hmax: 23, rmin: 11, rmax: 14, t: 5 },
  ];
  rows.forEach((R, ri) => {
    for (let i = 0; i < R.n; i++) {
      const tt = i / (R.n - 1);
      const x = -R.span / 2 + R.span * tt + (rnd(i, ri) - 0.5) * (R.span / R.n) * 0.5;
      out.push({
        x,
        z: R.z + (rnd(i, ri + 9) - 0.5) * 4,
        h: R.hmin + rnd(i, ri + 3) * (R.hmax - R.hmin),
        r: R.rmin + rnd(i, ri + 5) * (R.rmax - R.rmin),
        t: R.t,
        row: ri,
      });
    }
  });
  return out;
})();

// per-row peak colours: far rows hazier/lighter, near row a touch deeper
const PEAK_DAY = ["#9aa8c2", "#8a9ab4", "#7c8da8"];
const PEAK_NIGHT = ["#2e3c66", "#28345a", "#222e4e"];

/* gradient sky dome: the horizon stays on the fog colour so distant peaks
   fade into it seamlessly, and the zenith deepens for a taller-feeling sky */
function SkyDome({ night }: { night: boolean }) {
  const geo = useMemo(() => {
    const R = 240;
    const g = new THREE.SphereGeometry(R, 24, 12);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const horizon = new THREE.Color(night ? "#1a2347" : "#bfe6f3");
    const zenith = new THREE.Color(night ? "#0e142e" : "#7cc4e8");
    const c = new THREE.Color();
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const t = Math.min(1, Math.max(0, (pos.getY(i) / R) * 1.6));
      c.copy(horizon).lerp(zenith, t);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [night]);
  return (
    <mesh geometry={geo} renderOrder={-1}>
      <meshBasicMaterial
        vertexColors
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ground tinted into soft green biomes (forest floor, meadow, mossy ground)
   so the landscape reads as varied regions rather than one flat oasis lawn */
function BiomeGround({ night }: { night: boolean }) {
  const geo = useMemo(() => {
    const N = 96;
    const g = new THREE.PlaneGeometry(220, 220, N, N);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const lush = new THREE.Color(night ? "#2a3d22" : "#6fa86a");
    const forest = new THREE.Color(night ? "#22341d" : "#5c9356");
    const meadow = new THREE.Color(night ? "#33442a" : "#82b46a");
    const moss = new THREE.Color(night ? "#2a3326" : "#7f9070");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let base = lush;
      if (z < -24) base = moss; // mossy ground right at the mountain feet
      else if (x < -26) base = forest; // forest floor on the left
      else if (Math.abs(x) < 26) base = meadow; // meadow across the clearing + foreground
      const hsh = Math.sin(x * 0.9 + z * 0.7) * 0.5 + 0.5;
      const m = 0.92 + hsh * 0.14;
      colors.push(base.r * m, base.g * m, base.b * m);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [night]);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}

/* ---------- scene ---------- */
function Scene({
  night,
  progress,
  onSelect,
}: {
  night: boolean;
  progress?: MotionValue<number>;
  onSelect?: (k: SectionKey) => void;
}) {
  const sky = night ? "#1a2347" : "#bfe6f3";
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 32, 100]} />
      <SkyDome night={night} />

      <ambientLight intensity={night ? 0.58 : 0.62} />
      <hemisphereLight
        args={[night ? "#3c4d86" : "#cdeefb", night ? "#1e2c1e" : "#5f8a55", night ? 0.75 : 0.7]}
      />
      <directionalLight
        position={[10, 16, 6]}
        intensity={night ? 1.05 : 2.2}
        color={night ? "#c4cef2" : "#fff2d4"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={62}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
      />
      {night && <Moon />}

      <BiomeGround night={night} />

      <Lake night={night} />

      {/* sharp cone peaks — three dense overlapping rows so no canyons or
          gaps show between them */}
      {MOUNTAIN_PEAKS.map((p, i) => (
        <Mountain
          key={i}
          position={[p.x, 0, p.z]}
          height={p.h}
          radius={p.r}
          color={night ? PEAK_NIGHT[p.row] : PEAK_DAY[p.row]}
          night={night}
          seed={i + 1}
          treeCount={p.t}
        />
      ))}

      <Forest night={night} />
      <GroundDetail night={night} />
      <Clouds />
      <Birds />
      <Birds speed={1.1} span={36} y={6} baseZ={-9} />
      <Fireflies night={night} count={night ? 110 : 70} />
      <Leaves count={10} />
      <LakeLife night={night} />

      {/* clickable objects — one per section, spread across a near-grass arc */}
      <Hotspot3D section="about" label="About" onSelect={onSelect} position={[-10, 0, 5.4]} rotation={0.6} scale={1.2} hit={[3, 2.4, 2.6]}>
        <Tent />
      </Hotspot3D>
      <Hotspot3D section="stack" label="Stack" onSelect={onSelect} position={[-7.4, 0, 4.5]} rotation={0.45} scale={1.25} hit={[1.8, 2.2, 1.4]}>
        <Backpack />
      </Hotspot3D>
      <Hotspot3D section="ironman" label="Goals" onSelect={onSelect} position={[-4.8, 0, 3.9]} rotation={0.2} scale={1.3} hit={[2.8, 2, 1.4]}>
        <Bike />
      </Hotspot3D>
      <Hotspot3D section="contact" label="Contact" onSelect={onSelect} position={[-1.7, 0, 3.5]} scale={1.25} hit={[2.2, 1.8, 2.2]}>
        <Campfire night={night} />
      </Hotspot3D>
      <Hotspot3D section="music" label="Focus" onSelect={onSelect} position={[1.7, 0, 3.5]} scale={1.35} hit={[1.5, 2, 1.5]}>
        <Lantern night={night} />
      </Hotspot3D>
      <Hotspot3D section="interests" label="Interests" onSelect={onSelect} position={[4.8, 0, 3.9]} scale={1.45} hit={[1.6, 1.6, 1.6]}>
        <SoccerBall />
      </Hotspot3D>
      <Hotspot3D section="projects" label="Projects" onSelect={onSelect} position={[7.4, 0, 4.5]} rotation={-0.45} scale={1.25} hit={[2.8, 1.9, 1.8]}>
        <LaptopLog />
      </Hotspot3D>
      <Hotspot3D section="awards" label="Awards" onSelect={onSelect} position={[10, 0, 5.4]} rotation={-0.25} scale={1.15} tagHeight={3.4} hit={[1.8, 3.2, 1.4]}>
        <Flag />
      </Hotspot3D>

      <JourneyRig progress={progress} />

      <EffectComposer>
        <Bloom
          intensity={night ? 0.95 : 0.4}
          luminanceThreshold={night ? 0.2 : 0.65}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function Clearing3D({
  night,
  progress,
  onSelect,
}: {
  night: boolean;
  progress?: MotionValue<number>;
  onSelect?: (k: SectionKey) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 16, 40], fov: 49 }}
      gl={{ antialias: true }}
    >
      <Scene night={night} progress={progress} onSelect={onSelect} />
    </Canvas>
  );
}
