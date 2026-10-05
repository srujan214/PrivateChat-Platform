import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Petal({
  position,
  color,
  speed,
  scale,
  rotation,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  scale: number;
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = position[1];
  const drift = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = startY + Math.sin(t * speed + drift) * 0.4;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.6 + drift) * 0.3;
    ref.current.rotation.z = rotation[2] + Math.sin(t * speed * 0.4 + drift) * 0.3;
    ref.current.rotation.x = rotation[0] + Math.cos(t * speed * 0.5 + drift) * 0.2;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.55}
        roughness={0.35}
        metalness={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Petals() {
  const petals = useMemo(() => {
    const arr = [];
    const colors = ["#B57EDC", "#FF8FB1", "#7C4DFF", "#FFB4D6", "#C4A0F5"];
    for (let i = 0; i < 28; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.25 + Math.random() * 0.4,
        scale: 0.15 + Math.random() * 0.4,
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
      });
    }
    return arr;
  }, []);

  return (
    <>
      {petals.map((p, i) => (
        <Petal key={i} {...p} />
      ))}
    </>
  );
}

export default function Ambient3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050210"]} />
        <fog attach="fog" args={["#050210", 6, 16]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[8, 6, 6]} intensity={2} color="#B57EDC" />
        <pointLight position={[-8, -6, 4]} intensity={1.8} color="#FF8FB1" />
        <pointLight position={[0, 0, 8]} intensity={0.8} color="#FFFFFF" />

        <Petals />

        <EffectComposer>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}