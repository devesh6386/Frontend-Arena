'use client';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Sparkles, Environment } from '@react-three/drei';
import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import MemoryObject from './MemoryObject';
import MemoryConnections from './MemoryConnections';
import { generateLayout } from '@/lib/layout-engine';
import { Receipt, Thread } from '@/types';

interface MemoryMuseumProps {
  receipts: Receipt[];
  threads: Thread[];
  selectedReceiptId: string | null;
  activeThreadId: string | null;
  onSelectReceipt: (id: string) => void;
  mode: 'hero' | 'explorer' | 'thread-focus';
}

export default function MemoryMuseum({ 
  receipts, 
  threads, 
  selectedReceiptId, 
  activeThreadId, 
  onSelectReceipt, 
  mode 
}: MemoryMuseumProps) {
  
  const { spatialReceipts, spatialThreads } = useMemo(() => {
    return generateLayout(receipts, threads);
  }, [receipts, threads]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#11100e]">
      <Canvas camera={{ position: [0, 20, 150], fov: 45 }}>
        <color attach="background" args={['#11100e']} />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[50, 50, 50]} angle={0.15} penumbra={1} intensity={1} color="#e8c7b8" />
        
        {/* Subtle environment particles */}
        <Sparkles count={2000} scale={200} size={1} speed={0.2} opacity={0.1} color="#e5a083" />
        
        <CameraController 
          mode={mode} 
          spatialReceipts={spatialReceipts} 
          spatialThreads={spatialThreads}
          selectedReceiptId={selectedReceiptId}
          activeThreadId={activeThreadId}
        />

        <group>
          {spatialReceipts.map(sr => {
            let isFaded = false;
            if (activeThreadId) {
              // Fade out if not in active thread
              const thread = spatialThreads.find(t => t.id === activeThreadId);
              if (thread && !thread.receipts.some(tr => tr.id === sr.id)) {
                isFaded = true;
              }
            } else if (selectedReceiptId) {
               // Fade if another receipt is selected and no active thread
               isFaded = sr.id !== selectedReceiptId;
            }

            return (
              <MemoryObject 
                key={sr.id} 
                receipt={sr} 
                isSelected={sr.id === selectedReceiptId}
                isFaded={isFaded}
                onClick={(r) => onSelectReceipt(r.id)}
              />
            );
          })}

          <MemoryConnections 
            threads={spatialThreads} 
            receipts={spatialReceipts} 
            activeThreadId={activeThreadId} 
          />
        </group>
      </Canvas>
    </div>
  );
}

// Separate component for camera logic so we can access useThree
function CameraController({ 
  mode, 
  spatialReceipts, 
  spatialThreads, 
  selectedReceiptId, 
  activeThreadId 
}: any) {
  const controlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    if (mode === 'hero') {
      controlsRef.current.setLookAt(0, 50, 250, 0, 0, 0, true);
    } else if (mode === 'explorer' && !selectedReceiptId && !activeThreadId) {
      controlsRef.current.setLookAt(0, 30, 150, 0, 0, 0, true);
    } else if (activeThreadId) {
      const thread = spatialThreads.find((t: any) => t.id === activeThreadId);
      if (thread) {
        controlsRef.current.setLookAt(
          thread.center[0] + 20, 
          thread.center[1] + 20, 
          thread.center[2] + 40,
          thread.center[0], 
          thread.center[1], 
          thread.center[2],
          true
        );
      }
    } else if (selectedReceiptId) {
      const receipt = spatialReceipts.find((r: any) => r.id === selectedReceiptId);
      if (receipt) {
        controlsRef.current.setLookAt(
          receipt.position[0] + 5, 
          receipt.position[1] + 5, 
          receipt.position[2] + 15,
          receipt.position[0], 
          receipt.position[1], 
          receipt.position[2],
          true
        );
      }
    }
  }, [mode, selectedReceiptId, activeThreadId, spatialReceipts, spatialThreads]);

  return <CameraControls ref={controlsRef} makeDefault minDistance={5} maxDistance={400} />;
}
