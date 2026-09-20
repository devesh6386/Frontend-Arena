'use client';

import { QuadraticBezierLine } from '@react-three/drei';
import { SpatialReceipt, SpatialThread } from '@/lib/layout-engine';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface MemoryConnectionsProps {
  threads: SpatialThread[];
  receipts: SpatialReceipt[];
  activeThreadId: string | null;
}

export default function MemoryConnections({ threads, receipts, activeThreadId }: MemoryConnectionsProps) {
  // We want to draw lines between receipts in the same thread.
  // For simplicity, we can draw a line from each receipt to the thread's "center" or to the previous receipt in the thread.
  
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
        // subtle pulse effect for active thread could go here
    }
  });

  return (
    <group>
      {threads.map((thread) => {
        const isFaded = activeThreadId !== null && activeThreadId !== thread.id;
        const isActive = activeThreadId === thread.id;
        
        if (isFaded) return null; // Hide non-active thread connections for clarity

        const threadReceipts = thread.receipts.map(r => receipts.find(sr => sr.id === r.id)).filter(Boolean) as SpatialReceipt[];

        return (
          <group key={thread.id}>
            {threadReceipts.map((sr, index) => {
              if (index === 0) return null; // Need at least two to draw a line
              const prevSr = threadReceipts[index - 1];
              
              // Calculate a mid point with an offset to make a nice bezier curve
              const start = new THREE.Vector3(...prevSr.position);
              const end = new THREE.Vector3(...sr.position);
              const mid = start.clone().lerp(end, 0.5);
              mid.y += Math.min(start.distanceTo(end) * 0.2, 5); // curve it upwards

              return (
                <QuadraticBezierLine
                  key={`${prevSr.id}-${sr.id}`}
                  start={start}
                  end={end}
                  mid={mid}
                  color={isActive ? '#e86c45' : '#81796b'}
                  lineWidth={isActive ? 2 : 0.5}
                  dashed={false}
                  opacity={isActive ? 0.8 : 0.2}
                  transparent
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
