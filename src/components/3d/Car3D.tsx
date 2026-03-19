import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CarBody = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const bodyColor = '#2563eb';
  const darkColor = '#1e293b';
  const glassColor = '#93c5fd';
  const wheelColor = '#0f172a';

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Main body - lower */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.4, 0.45, 1.05]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Front hood - sloped */}
      <mesh position={[0.85, 0.42, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.12, 1.0]} />
        <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Cabin / roof */}
      <mesh position={[-0.1, 0.72, 0]} castShadow>
        <boxGeometry args={[1.3, 0.45, 0.95]} />
        <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* Windshield front */}
      <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.45, 0.4, 0.9]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* Windshield rear */}
      <mesh position={[-0.7, 0.68, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.38, 0.88]} />
        <meshStandardMaterial color={glassColor} metalness={0.9} roughness={0.05} transparent opacity={0.5} />
      </mesh>

      {/* Side windows left */}
      <mesh position={[-0.1, 0.72, 0.5]}>
        <boxGeometry args={[1.0, 0.3, 0.02]} />
        <meshStandardMaterial color={glassColor} metalness={0.8} roughness={0.05} transparent opacity={0.4} />
      </mesh>

      {/* Side windows right */}
      <mesh position={[-0.1, 0.72, -0.5]}>
        <boxGeometry args={[1.0, 0.3, 0.02]} />
        <meshStandardMaterial color={glassColor} metalness={0.8} roughness={0.05} transparent opacity={0.4} />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.21, 0.38, 0.35]}>
        <boxGeometry args={[0.05, 0.12, 0.2]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.21, 0.38, -0.35]}>
        <boxGeometry args={[0.05, 0.12, 0.2]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-1.21, 0.38, 0.35]}>
        <boxGeometry args={[0.05, 0.1, 0.18]} />
        <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.21, 0.38, -0.35]}>
        <boxGeometry args={[0.05, 0.1, 0.18]} />
        <meshStandardMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[1.15, 0.18, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.9]} />
        <meshStandardMaterial color={darkColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[-1.15, 0.18, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.9]} />
        <meshStandardMaterial color={darkColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Grille */}
      <mesh position={[1.22, 0.28, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.5]} />
        <meshStandardMaterial color={darkColor} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      {[
        [0.75, 0.12, 0.58],
        [0.75, 0.12, -0.58],
        [-0.75, 0.12, 0.58],
        [-0.75, 0.12, -0.58],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color={wheelColor} roughness={0.8} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.13, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <circleGeometry args={[3, 64]} />
    <MeshReflectorMaterial
      mirror={0.15}
      blur={[300, 100]}
      resolution={512}
      mixBlur={1}
      color="#e2e8f0"
      metalness={0.1}
      roughness={0.8}
    />
  </mesh>
);

const Car3D: React.FC<{ height?: string }> = ({ height = '280px' }) => {
  return (
    <div style={{ width: '100%', height, borderRadius: '1rem', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [3, 2.2, 3], fov: 40 }}
        style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #e2e8f0 100%)' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.4} />
          <spotLight position={[0, 8, 0]} intensity={0.3} angle={0.5} />

          <CarBody />
          <Ground />

          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2.3}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Car3D;
