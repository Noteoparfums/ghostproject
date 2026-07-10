import React, { useRef, useMemo, memo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Copy Plane — a single floating document card in 3D space          */
/* ------------------------------------------------------------------ */
const CopyPlane = memo(function CopyPlane({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[0.8, 0.55, 0.02]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
});

/* ------------------------------------------------------------------ */
/*  Woven Core — slowly rotating torus-knot at the centre             */
/* ------------------------------------------------------------------ */
const WovenCore = memo(function WovenCore({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusKnotGeometry args={[1, 0.35, 100, 16]} />
        <meshStandardMaterial
          color="#BE5A3C"
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
});

/* ------------------------------------------------------------------ */
/*  Scene — full 3D composition                                       */
/* ------------------------------------------------------------------ */
function Scene() {
  const reducedMotion = useReducedMotion() ?? false;
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const planes = useMemo(() => {
    const all: {
      position: [number, number, number];
      rotation: [number, number, number];
      color: string;
    }[] = [
      {
        position: [-1.8, 0.6, 0.5],
        rotation: [0.1, 0.3, 0.05],
        color: '#263B33',
      },
      {
        position: [1.9, -0.4, -0.3],
        rotation: [-0.1, -0.2, 0.1],
        color: '#263B33',
      },
      {
        position: [-1.4, -0.8, 0.8],
        rotation: [0.2, 0.1, -0.15],
        color: '#1e2c27',
      },
      {
        position: [1.5, 0.9, -0.6],
        rotation: [-0.05, 0.4, 0.08],
        color: '#1e2c27',
      },
      {
        position: [0.3, -1.3, 1.0],
        rotation: [0.15, -0.1, 0.2],
        color: '#D6A84B',
      },
      {
        position: [-0.5, 1.2, -0.9],
        rotation: [-0.2, 0.15, -0.1],
        color: '#D6A84B',
      },
    ];
    return isMobile ? all.slice(0, 3) : all;
  }, [isMobile]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <WovenCore reducedMotion={reducedMotion} />
      {planes.map((p, i) => (
        <CopyPlane key={i} {...p} />
      ))}
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  LoomSculpture — exported Canvas wrapper                           */
/* ------------------------------------------------------------------ */
export function LoomSculpture() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}

export default LoomSculpture;
