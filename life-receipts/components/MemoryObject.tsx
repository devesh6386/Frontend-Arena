'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpatialReceipt } from '@/lib/layout-engine';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

interface MemoryObjectProps {
  receipt: SpatialReceipt;
  isSelected: boolean;
  isFaded: boolean;
  onClick: (receipt: SpatialReceipt) => void;
}

export default function MemoryObject({ receipt, isSelected, isFaded, onClick }: MemoryObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + receipt.position[0]) * 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const opacity = isFaded ? 0.1 : 1;
  const color = hovered || isSelected ? '#e86c45' : '#81796b';

  return (
    <group 
      ref={meshRef} 
      position={new THREE.Vector3(...receipt.position)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(receipt);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Visual differentiation by type */}
      {receipt.type === 'music' && (
        <mesh>
          <torusGeometry args={[0.5, 0.05, 16, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1 : 0.2} transparent opacity={opacity} />
        </mesh>
      )}
      {receipt.type === 'purchase' && (
        <mesh>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 0.5 : 0.1} transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
      )}
      {(receipt.type !== 'music' && receipt.type !== 'purchase') && (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1 : 0.2} transparent opacity={opacity} />
        </mesh>
      )}

      {/* Label on hover or select */}
      {(hovered || isSelected) && !isFaded && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="#f5f1e8"
          anchorX="center"
          anchorY="middle"
        >
          {receipt.title}
        </Text>
      )}
    </group>
  );
}
