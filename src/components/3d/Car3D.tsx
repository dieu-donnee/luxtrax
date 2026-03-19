import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SEG = 8; // low-poly segment count for mobile perf

const CarBody = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const bodyMat = useMemo(() => ({ color: '#2563eb', metalness: 0.7, roughness: 0.2 }), []);
  const glassMat = useMemo(() => ({ color: '#93c5fd', metalness: 0.9, roughness: 0.05, transparent: true, opacity: 0.5 }), []);

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.4, 0.45, 1.05]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>
      {/* Hood */}
      <mesh position={[0.85, 0.42, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.12, 1.0]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.1, 0.72, 0]} castShadow>
        <boxGeometry args={[1.3, 0.45, 0.95]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>
      {/* Windshields */}
      <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.45, 0.4, 0.9]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      <mesh position={[-0.7, 0.68, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.38, 0.88]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      {/* Lights */}
      <mesh position={[1.21, 0.38, 0.35]}>
        <boxGeometry args={[0.05, 0.12, 0.2]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.21, 0.38, -0.35]}>
        <boxGeometry args={[0.05, 0.12, 0.2]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-1.21, 0.38, 0.35]}>
        <boxGeometry args={[0.05, 0.1, 0.18]} />
        <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.21, 0.38, -0.35]}>
        <boxGeometry args={[0.05, 0.1, 0.18]} />
        <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      {/* Bumpers + Grille */}
      <mesh position={[1.15, 0.18, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.9]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-1.15, 0.18, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.9]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[1.22, 0.28, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Wheels – low-poly cylinders */}
      {[
        [0.75, 0.12, 0.58],
        [0.75, 0.12, -0.58],
        [-0.75, 0.12, 0.58],
        [-0.75, 0.12, -0.58],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.12, SEG]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.13, SEG]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <planeGeometry args={[5, 5, 1, 1]} />
    <meshStandardMaterial color="#e2e8f0" />
  </mesh>
);

const Car3D: React.FC<{ height?: string }> = ({ height = '280px' }) => {
  return (
    <div style={{ width: '100%', height, borderRadius: '1rem', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [3, 2.2, 3], fov: 40 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #e2e8f0 100%)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[512, 512]} />
          <directionalLight position={[-3, 3, -3]} intensity={0.4} />
          <CarBody />
          <Ground />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.3} minPolarAngle={Math.PI / 4} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Car3D;
