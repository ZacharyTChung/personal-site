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

const go = (id: string) => () =>
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  target,
  label,
  position,
  rotation = 0,
  scale = 1,
  tagHeight = 2.9,
  children,
}: {
  target: string;
  label: string;
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  tagHeight?: number;
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
          go(target)();
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
}: {
  position: [number, number, number];
  height: number;
  radius: number;
  color: string;
  night: boolean;
}) {
  // irregular, faceted peak with snow baked in along the real silhouette so
  // it doesn't read like a party hat — and recedes into the sky at night
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(radius, height, 9, 5);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const colors: number[] = [];
    const rock = new THREE.Color(color);
    const snow = new THREE.Color(night ? "#46506a" : "#eef4fa");
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const yn = (v.y + height / 2) / height; // 0 base .. 1 tip
      const s1 = Math.sin(i * 12.9898) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const s2 = Math.sin(i * 78.233) * 24634.6334;
      const r2 = s2 - Math.floor(s2);
      // jitter the side rings (leave the base ring and apex alone)
      if (yn > 0.001 && yn < 0.999) {
        const j = (1 - yn) * radius * 0.22;
        v.x += (r1 - 0.5) * j * 2;
        v.z += (r2 - 0.5) * j * 2;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      const snowLine = 0.66 + (r1 - 0.5) * 0.16;
      const c = yn > snowLine ? snow : rock;
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [height, radius, color, night]);

  // a light scatter of trees on the lower slopes
  const trees = useMemo(() => {
    const out: { x: number; y: number; z: number; s: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = 0.04 + Math.random() * 0.24; // lower slopes only
      const r = radius * (1 - f) * 0.88;
      out.push({ x: Math.cos(a) * r, y: height * f, z: Math.sin(a) * r, s: 0.6 + Math.random() * 0.7 });
    }
    return out;
  }, [height, radius]);

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

function Forest({ night }: { night: boolean }) {
  const trees = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    let guard = 0;
    while (out.length < 84 && guard < 900) {
      guard++;
      const x = (Math.random() - 0.5) * 58;
      const z = -34 + Math.random() * 42;
      // keep off the lake (organic footprint ~ x[-13,13], z[-13,3])
      if (x > -13 && x < 13 && z > -13 && z < 3) continue;
      // keep the near foreground clear for the objects
      if (z > 1 && Math.abs(x) < 12) continue;
      out.push({ p: [x, 0, z], s: 0.7 + Math.random() * 1.1 });
    }
    return out;
  }, []);
  return (
    <group>
      <Instances limit={trees.length} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 6]} />
        <meshStandardMaterial color="#5a3d28" flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], 0.35 * t.s, t.p[2]]} scale={t.s} />
        ))}
      </Instances>
      <Instances limit={trees.length} castShadow>
        <coneGeometry args={[0.75, 2.4, 7]} />
        <meshStandardMaterial color={night ? "#1d3a2a" : "#2f6a4a"} flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], 1.6 * t.s, t.p[2]]} scale={t.s} />
        ))}
      </Instances>
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
function Leaves({ count = 16 }: { count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const palette = ["#e0843f", "#d8a23a", "#c2703a", "#7c9a4a", "#e6b35a"];
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 42,
        z: -10 + Math.random() * 22,
        top: 6 + Math.random() * 6,
        speed: 0.5 + Math.random() * 0.6,
        sway: 0.5 + Math.random() * 1.1,
        phase: Math.random() * 6,
        spin: 0.6 + Math.random() * 1.2,
        color: palette[i % palette.length],
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
          <planeGeometry args={[0.34, 0.22]} />
          <meshStandardMaterial color={p.color} side={THREE.DoubleSide} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Lilypads() {
  const pads = useMemo(() => {
    const out: { x: number; z: number; r: number; flower: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      out.push({
        x: (Math.random() - 0.5) * 14,
        z: -9 + Math.random() * 9,
        r: 0.32 + Math.random() * 0.22,
        flower: Math.random() > 0.55,
      });
    }
    return out;
  }, []);
  return (
    <group>
      {pads.map((p, i) => (
        <group key={i} position={[p.x, 0.05, p.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[p.r, 16]} />
            <meshStandardMaterial color="#3e8e5a" flatShading />
          </mesh>
          {p.flower && (
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.09, 8, 6]} />
              <meshStandardMaterial color="#f08fb8" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function Duck({ x, z, rot }: { x: number; z: number; rot: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = 0.12 + Math.sin(s.clock.elapsedTime * 1.4 + x) * 0.04;
  });
  return (
    <group ref={ref} position={[x, 0.12, z]} rotation={[0, rot, 0]}>
      <mesh scale={[0.42, 0.3, 0.32]} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#8a6a4a" flatShading />
      </mesh>
      <mesh position={[0.26, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color="#5a4632" flatShading />
      </mesh>
      <mesh position={[0.42, 0.17, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.13, 8]} />
        <meshStandardMaterial color="#e0a23a" />
      </mesh>
    </group>
  );
}

function Rabbit({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.22, 0]} scale={[0.32, 0.26, 0.42]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#cdbfae" flatShading />
      </mesh>
      <mesh position={[0, 0.32, 0.2]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#cdbfae" flatShading />
      </mesh>
      <mesh position={[-0.05, 0.55, 0.2]} rotation={[0.2, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
        <meshStandardMaterial color="#cdbfae" />
      </mesh>
      <mesh position={[0.05, 0.55, 0.2]} rotation={[0.2, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
        <meshStandardMaterial color="#cdbfae" />
      </mesh>
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
      const rx = 10 + Math.sin(a * 3 + 0.6) * 1.7 + Math.cos(a * 2) * 1.0;
      const ry = 6 + Math.cos(a * 3) * 1.1 + Math.sin(a * 5 + 1) * 0.7;
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
    <group position={[0, 0, -5]}>
      {/* a darker sandy rim just under the water edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} scale={1.07}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={night ? "#243018" : "#caa86a"} />
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

/* ---------- scene ---------- */
function Scene({ night, progress }: { night: boolean; progress?: MotionValue<number> }) {
  const sky = night ? "#0e1430" : "#bfe6f3";
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 26, 82]} />

      <ambientLight intensity={night ? 0.3 : 0.62} />
      <hemisphereLight
        args={[night ? "#22305c" : "#cdeefb", night ? "#10160f" : "#5f8a55", night ? 0.4 : 0.7]}
      />
      <directionalLight
        position={[10, 14, 6]}
        intensity={night ? 0.5 : 2.2}
        color={night ? "#aebbe6" : "#fff2d4"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={55}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0004}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={night ? "#1d2a1c" : "#6fa86a"} />
      </mesh>

      <Lake night={night} />

      {/* a big mountain range behind the lake */}
      <Mountain position={[-26, 0, -30]} height={18} radius={9} color={night ? "#1a2236" : "#8e9fb8"} night={night} />
      <Mountain position={[-14, 0, -26]} height={20} radius={9.5} color={night ? "#171e30" : "#8698b4"} night={night} />
      <Mountain position={[-1, 0, -34]} height={25} radius={11.5} color={night ? "#141a2b" : "#8090ac"} night={night} />
      <Mountain position={[13, 0, -28]} height={22} radius={10.5} color={night ? "#171e30" : "#92a2bc"} night={night} />
      <Mountain position={[26, 0, -32]} height={19} radius={9.5} color={night ? "#1a2236" : "#8698b4"} night={night} />

      <Forest night={night} />
      <Clouds />
      <Birds />
      <Birds speed={1.1} span={36} y={6} baseZ={-9} />
      <Fireflies night={night} />
      <Leaves />
      <Lilypads />
      <Duck x={-3} z={-3} rot={0.6} />
      <Duck x={2.5} z={-6} rot={-1.2} />
      <Rabbit x={-9.5} z={5} />

      {/* clickable objects — one per section, spread across a near-grass arc */}
      <Hotspot3D target="#about" label="About" position={[-10, 0, 5.4]} rotation={0.6} scale={1.2}>
        <Tent />
      </Hotspot3D>
      <Hotspot3D target="#stack" label="Stack" position={[-7.4, 0, 4.5]} rotation={0.45} scale={1.25}>
        <Backpack />
      </Hotspot3D>
      <Hotspot3D target="#ironman" label="Goals" position={[-4.8, 0, 3.9]} rotation={0.2} scale={1.3}>
        <Bike />
      </Hotspot3D>
      <Hotspot3D target="#contact" label="Contact" position={[-1.7, 0, 3.5]} scale={1.25}>
        <Campfire night={night} />
      </Hotspot3D>
      <Hotspot3D target="#music" label="Focus" position={[1.7, 0, 3.5]} scale={1.35}>
        <Lantern night={night} />
      </Hotspot3D>
      <Hotspot3D target="#interests" label="Interests" position={[4.8, 0, 3.9]} scale={1.45}>
        <SoccerBall />
      </Hotspot3D>
      <Hotspot3D target="#projects" label="Projects" position={[7.4, 0, 4.5]} rotation={-0.45} scale={1.25}>
        <LaptopLog />
      </Hotspot3D>
      <Hotspot3D target="#awards" label="Awards" position={[10, 0, 5.4]} rotation={-0.25} scale={1.15} tagHeight={3.4}>
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
}: {
  night: boolean;
  progress?: MotionValue<number>;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 16, 40], fov: 49 }}
      gl={{ antialias: true }}
    >
      <Scene night={night} progress={progress} />
    </Canvas>
  );
}
