"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Instances, Instance, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const go = (id: string) => () => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
const hover = (on: boolean) => () => {
  document.body.style.cursor = on ? "pointer" : "";
};

/* slow camera drift toward the pointer */
function Rig() {
  useFrame((state) => {
    const tx = state.pointer.x * 1.6;
    const ty = 2.6 + state.pointer.y * 0.6;
    state.camera.position.x += (tx - state.camera.position.x) * 0.03;
    state.camera.position.y += (ty - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 1.1, -4);
  });
  return null;
}

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
      <mesh castShadow>
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
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * 12;
      const x = Math.cos(angle) * dist;
      const z = -4 + Math.sin(angle) * dist * 0.7;
      // keep trees off the lake / off the camera's lap
      if (Math.abs(x) < 6 && z < 0 && z > -8) continue;
      if (z > 5) continue;
      out.push({ p: [x, 0, z], s: 0.7 + Math.random() * 0.9 });
    }
    return out;
  }, []);

  return (
    <group>
      <Instances limit={trees.length} castShadow>
        <coneGeometry args={[0.7, 2.2, 7]} />
        <meshStandardMaterial color={night ? "#1d3a2a" : "#2f6a4a"} flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], 1.1 * t.s, t.p[2]]} scale={t.s} />
        ))}
      </Instances>
      <Instances limit={trees.length}>
        <coneGeometry args={[0.5, 1.6, 7]} />
        <meshStandardMaterial color={night ? "#16301f" : "#235138"} flatShading />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], 2.1 * t.s, t.p[2]]} scale={t.s} />
        ))}
      </Instances>
    </group>
  );
}

function Tent() {
  return (
    <group
      position={[-3.4, 0, 2.6]}
      rotation={[0, 0.5, 0]}
      onClick={go("#about")}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    >
      {/* triangular prism tent */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1, 1, 2.2, 3, 1]} />
        <meshStandardMaterial color="#d98c5f" flatShading />
      </mesh>
      <mesh position={[0, 0.55, 1.12]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.34, 1, 3]} />
        <meshStandardMaterial color="#5a3d2b" flatShading />
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
    if (light.current)
      light.current.intensity = (night ? 7 : 4) + Math.sin(t * 12) * 1.2;
  });
  return (
    <group
      position={[0, 0, 3.2]}
      onClick={go("#contact")}
      onPointerOver={hover(true)}
      onPointerOut={hover(false)}
    >
      {/* logs */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, 0.12, 0]}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
          castShadow
        >
          <cylinderGeometry args={[0.12, 0.12, 1.1, 6]} />
          <meshStandardMaterial color="#6b4226" flatShading />
        </mesh>
      ))}
      {/* flame */}
      <mesh ref={flame} position={[0, 0.55, 0]}>
        <coneGeometry args={[0.28, 0.9, 7]} />
        <meshStandardMaterial
          color="#ff9f3a"
          emissive="#ff7a1a"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={light} position={[0, 0.9, 0]} color="#ff9a3c" distance={12} decay={2} />
    </group>
  );
}

function Scene({ night }: { night: boolean }) {
  const sky = night ? "#0e1430" : "#bfe6f3";
  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 16, 42]} />

      <ambientLight intensity={night ? 0.28 : 0.6} />
      <hemisphereLight
        args={[night ? "#22305c" : "#cdeefb", night ? "#10160f" : "#5f8a55", night ? 0.4 : 0.7]}
      />
      <directionalLight
        position={[8, 12, 5]}
        intensity={night ? 0.5 : 2.2}
        color={night ? "#aebbe6" : "#fff2d4"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={night ? "#1d2a1c" : "#6fa86a"} />
      </mesh>

      {/* lake */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]}>
        <planeGeometry args={[20, 13]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.6}
          mixBlur={8}
          mixStrength={1.2}
          blur={[300, 80]}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color={night ? "#16454c" : "#3fb8b0"}
          metalness={0.2}
        />
      </mesh>

      {/* mountains */}
      <Mountain position={[-12, 0, -18]} height={11} radius={6} color={night ? "#2a3550" : "#8e9fb8"} />
      <Mountain position={[-2, 0, -21]} height={14} radius={7} color={night ? "#222c46" : "#8698b4"} />
      <Mountain position={[9, 0, -19]} height={12} radius={6.5} color={night ? "#2a3550" : "#92a2bc"} />
      <Mountain position={[16, 0, -22]} height={10} radius={6} color={night ? "#1f2840" : "#8090ac"} />

      <Forest night={night} />
      <Tent />
      <Campfire night={night} />

      <Rig />

      <EffectComposer>
        <Bloom
          intensity={night ? 0.9 : 0.4}
          luminanceThreshold={night ? 0.2 : 0.6}
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
      camera={{ position: [0, 2.6, 8.5], fov: 42 }}
      gl={{ antialias: true }}
    >
      <Scene night={night} />
    </Canvas>
  );
}
