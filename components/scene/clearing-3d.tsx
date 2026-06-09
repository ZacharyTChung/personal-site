"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Instances,
  Instance,
  MeshReflectorMaterial,
  RoundedBox,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

const go = (id: string) => () =>
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const setCursor = (on: boolean) => {
  document.body.style.cursor = on ? "pointer" : "";
};

/* ---------- camera: intro fly-in, then pointer drift ---------- */
function Rig() {
  const INTRO = 2.8;
  useFrame((state) => {
    const e = state.clock.elapsedTime;
    const t = Math.min(1, e / INTRO);
    const k = 1 - Math.pow(1 - t, 3); // ease-out
    const rx = state.pointer.x * 1.8 * k;
    const ry = 3.6 + state.pointer.y * 0.7 * k;
    const rz = 13.5;
    const sx = 0,
      sy = 9,
      sz = 26;
    const cx = sx + (rx - sx) * k;
    const cy = sy + (ry - sy) * k;
    const cz = sz + (rz - sz) * k;
    const f = t < 1 ? 0.12 : 0.04;
    state.camera.position.x += (cx - state.camera.position.x) * f;
    state.camera.position.y += (cy - state.camera.position.y) * f;
    state.camera.position.z += (cz - state.camera.position.z) * f;
    state.camera.lookAt(0, 1, -3);
  });
  return null;
}

/* ---------- clickable wrapper (hover lift + cursor) ---------- */
function Hotspot3D({
  target,
  position,
  rotation = 0,
  scale = 1,
  children,
}: {
  target: string;
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useFrame(() => {
    if (!ref.current) return;
    const ts = hovered ? scale * 1.12 : scale;
    ref.current.scale.x += (ts - ref.current.scale.x) * 0.18;
    ref.current.scale.y = ref.current.scale.z = ref.current.scale.x;
    const ty = hovered ? 0.25 : 0;
    ref.current.position.y += (ty - ref.current.position.y) * 0.18;
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
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.15, 0);
    s.lineTo(1.15, 0);
    s.lineTo(0, 1.5);
    s.closePath();
    return s;
  }, []);
  const door = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.45, 0);
    s.lineTo(0.45, 0);
    s.lineTo(0, 1.0);
    s.closePath();
    return s;
  }, []);
  return (
    <group>
      <mesh castShadow position={[0, 0, -1.3]}>
        <extrudeGeometry args={[shape, { depth: 2.6, bevelEnabled: false }]} />
        <meshStandardMaterial color="#d98c5f" flatShading />
      </mesh>
      <mesh position={[0, 0.01, 1.31]}>
        <shapeGeometry args={[door]} />
        <meshStandardMaterial color="#4a3122" side={THREE.DoubleSide} />
      </mesh>
      {/* ridge pole tips */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.7, 6]} />
        <meshStandardMaterial color="#6b4a2e" />
      </mesh>
    </group>
  );
}

function Backpack() {
  return (
    <group>
      <RoundedBox args={[1, 1.4, 0.7]} radius={0.18} position={[0, 0.75, 0]} castShadow>
        <meshStandardMaterial color="#3f8275" flatShading />
      </RoundedBox>
      <RoundedBox args={[1.06, 0.5, 0.78]} radius={0.16} position={[0, 1.26, 0.02]} castShadow>
        <meshStandardMaterial color="#2f6256" flatShading />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.55, 0.18]} radius={0.1} position={[0, 0.55, 0.42]}>
        <meshStandardMaterial color="#54a594" flatShading />
      </RoundedBox>
      <mesh position={[-0.3, 0.8, -0.4]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#2c5a4f" />
      </mesh>
      <mesh position={[0.3, 0.8, -0.4]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#2c5a4f" />
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
  const spots = useMemo(() => {
    const v: [number, number, number][] = [];
    const ico = new THREE.IcosahedronGeometry(0.4, 0);
    const pos = ico.attributes.position;
    const seen = new Set<string>();
    for (let i = 0; i < pos.count; i++) {
      const x = +pos.getX(i).toFixed(2);
      const y = +pos.getY(i).toFixed(2);
      const z = +pos.getZ(i).toFixed(2);
      const key = `${x},${y},${z}`;
      if (seen.has(key)) continue;
      seen.add(key);
      v.push([x, y, z]);
    }
    ico.dispose();
    return v;
  }, []);
  return (
    <group position={[0, 0.4, 0]}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial color="#f5f5ef" />
      </mesh>
      {spots.map((s, i) => (
        <mesh key={i} position={[s[0] * 1.0, s[1] * 1.0, s[2] * 1.0]}>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshStandardMaterial color="#1f2430" />
        </mesh>
      ))}
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
}: {
  position: [number, number, number];
  height: number;
  radius: number;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[radius, height, 6]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, height * 0.32, 0]}>
        <coneGeometry args={[radius * 0.4, height * 0.36, 6]} />
        <meshStandardMaterial color="#eef4fa" flatShading />
      </mesh>
    </group>
  );
}

function Forest({ night }: { night: boolean }) {
  const trees = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = [];
    let guard = 0;
    while (out.length < 64 && guard < 600) {
      guard++;
      const x = (Math.random() - 0.5) * 46;
      const z = -24 + Math.random() * 32;
      // keep off the lake footprint (x [-11,11], z [-11,3])
      if (x > -11 && x < 11 && z > -11 && z < 3) continue;
      // keep the near foreground clear for the objects
      if (z > 2 && Math.abs(x) < 11) continue;
      out.push({ p: [x, 0, z], s: 0.7 + Math.random() * 1.0 });
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

function Birds() {
  const ref = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = ((t * 1.6) % 44) - 22;
      ref.current.position.y = 9 + Math.sin(t * 0.6) * 0.6;
    }
    wings.current.forEach((w, i) => {
      if (w) w.rotation.z = Math.sin(t * 8 + i) * 0.5;
    });
  });
  return (
    <group ref={ref}>
      {[
        [0, 0, -14],
        [2.5, 0.8, -15],
        [-2, 1.2, -16],
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

/* ---------- scene ---------- */
function Scene({ night }: { night: boolean }) {
  const sky = night ? "#0e1430" : "#bfe6f3";
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 18, 48]} />

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
        shadow-camera-far={60}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0004}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={night ? "#1d2a1c" : "#6fa86a"} />
      </mesh>

      {/* lake */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]}>
        <planeGeometry args={[22, 14]} />
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

      <Mountain position={[-13, 0, -20]} height={12} radius={6.5} color={night ? "#2a3550" : "#8e9fb8"} />
      <Mountain position={[-2, 0, -24]} height={15} radius={7.5} color={night ? "#222c46" : "#8698b4"} />
      <Mountain position={[10, 0, -21]} height={13} radius={6.8} color={night ? "#2a3550" : "#92a2bc"} />
      <Mountain position={[18, 0, -25]} height={11} radius={6.2} color={night ? "#1f2840" : "#8090ac"} />

      <Forest night={night} />
      <Clouds />
      <Birds />
      <Lilypads />
      <Duck x={-3} z={-3} rot={0.6} />
      <Duck x={2.5} z={-6} rot={-1.2} />
      <Rabbit x={-9.5} z={5} />

      {/* clickable objects — one per section, on the near grass */}
      <Hotspot3D target="#about" position={[-8, 0, 3.4]} rotation={0.5}>
        <Tent />
      </Hotspot3D>
      <Hotspot3D target="#stack" position={[-5.2, 0, 5]} rotation={0.2}>
        <Backpack />
      </Hotspot3D>
      <Hotspot3D target="#ironman" position={[-2.4, 0, 4]} rotation={-0.3}>
        <Bike />
      </Hotspot3D>
      <Hotspot3D target="#contact" position={[0.3, 0, 5.6]}>
        <Campfire night={night} />
      </Hotspot3D>
      <Hotspot3D target="#music" position={[2.6, 0, 4.6]}>
        <Lantern night={night} />
      </Hotspot3D>
      <Hotspot3D target="#interests" position={[4.6, 0, 5.6]} scale={1.1}>
        <SoccerBall />
      </Hotspot3D>
      <Hotspot3D target="#projects" position={[6.8, 0, 4.3]} rotation={-0.4}>
        <LaptopLog />
      </Hotspot3D>
      <Hotspot3D target="#awards" position={[8.6, 0, 3.2]}>
        <Flag />
      </Hotspot3D>

      <Rig />

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

export default function Clearing3D({ night }: { night: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 9, 26], fov: 45 }}
      gl={{ antialias: true }}
    >
      <Scene night={night} />
    </Canvas>
  );
}
