import React, { useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';

type VehicleType = 'sedan' | 'suv' | 'coupe';

const CarModel = ({ type }: { type: VehicleType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  const bodyMat = useMemo(() => ({
    color: '#1e293b',
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.5,
  }), []);

  const glassMat = useMemo(() => ({
    color: '#000',
    metalness: 1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.7,
  }), []);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Main Body */}
        {type === 'sedan' && (
          <>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[3.2, 0.45, 1.4]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
            <mesh position={[-0.1, 0.85, 0]} castShadow>
              <boxGeometry args={[1.6, 0.5, 1.2]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
          </>
        )}

        {type === 'suv' && (
          <>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[3.0, 0.85, 1.5]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
            <mesh position={[-0.4, 1.25, 0]} castShadow>
              <boxGeometry args={[1.8, 0.6, 1.3]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
          </>
        )}

        {type === 'coupe' && (
          <>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[3.4, 0.35, 1.5]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
            <mesh position={[-0.2, 0.65, 0]} castShadow>
              <boxGeometry args={[1.4, 0.4, 1.3]} />
              <meshStandardMaterial {...bodyMat} />
            </mesh>
          </>
        )}

        {/* Wheels */}
        {[
          [1.0, 0.2, 0.75],
          [1.0, 0.2, -0.75],
          [-1.0, 0.2, 0.75],
          [-1.0, 0.2, -0.75],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.2, 32]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.22, 32]} />
              <meshStandardMaterial color="#334155" metalness={1} roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Lights */}
        <mesh position={[1.6, 0.5, 0.5]}>
          <boxGeometry args={[0.05, 0.15, 0.3]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[1.6, 0.5, -0.5]}>
          <boxGeometry args={[0.05, 0.15, 0.3]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
};

const Car3D: React.FC<{ height?: string }> = ({ height = '320px' }) => {
  const [type, setType] = useState<VehicleType>('sedan');

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '1.25rem', overflow: 'hidden', background: '#000' }}>
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(0,0,0,0.4)',
        padding: '0.4rem',
        borderRadius: '999px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {(['sedan', 'suv', 'coupe'] as VehicleType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: type === t ? '#fff' : 'transparent',
              color: type === t ? '#000' : '#fff',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[5, 2.5, 5]} fov={30} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />
          <CarModel type={type} />
          <ContactShadows
            position={[0, -0.4, 0]}
            opacity={0.65}
            scale={10}
            blur={2.5}
            far={1.6}
            color="#000"
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1.25rem',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.65rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Rendu Temps Réel • LustraX Premium 3D
      </div>
    </div>
  );
};

export default Car3D;

