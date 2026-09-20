import { Receipt, Thread } from '@/types';
import * as THREE from 'three';

export type SpatialReceipt = Receipt & {
  position: [number, number, number];
};

export type SpatialThread = Thread & {
  center: [number, number, number];
  radius: number;
};

// Generates 3D layout coordinates for receipts.
// Clusters them by thread to show connections.
export function generateLayout(receipts: Receipt[], threads: Thread[]): { spatialReceipts: SpatialReceipt[], spatialThreads: SpatialThread[] } {
  const spatialReceiptsMap = new Map<string, SpatialReceipt>();
  const spatialThreads: SpatialThread[] = [];

  // 1. Position threaded receipts in clusters
  threads.forEach((thread, threadIndex) => {
    // Determine a center for the thread cluster
    // Spread them out in a spiral or a large sphere
    const phi = Math.acos(-1 + (2 * threadIndex) / threads.length);
    const theta = Math.sqrt(threads.length * Math.PI) * phi;
    const distance = 40 + (threadIndex * 2);

    const cx = distance * Math.cos(theta) * Math.sin(phi);
    const cy = distance * Math.sin(theta) * Math.sin(phi);
    const cz = distance * Math.cos(phi);

    const center: [number, number, number] = [cx, cy, cz];
    const radius = 5 + (thread.receipts.length * 0.5);

    spatialThreads.push({ ...thread, center, radius });

    // Position receipts within the cluster
    thread.receipts.forEach((receipt, i) => {
      if (!spatialReceiptsMap.has(receipt.id)) {
        // Orbit around the center
        const angle = (i / thread.receipts.length) * Math.PI * 2;
        const r = Math.random() * radius;
        const h = (Math.random() - 0.5) * radius;

        const x = cx + Math.cos(angle) * r;
        const z = cz + Math.sin(angle) * r;
        const y = cy + h;

        spatialReceiptsMap.set(receipt.id, {
          ...receipt,
          position: [x, y, z],
        });
      }
    });
  });

  // 2. Position remaining (unthreaded) receipts in the background or periphery
  const unthreadedRadius = 100;
  let unthreadedCount = 0;
  
  receipts.forEach(receipt => {
    if (!spatialReceiptsMap.has(receipt.id)) {
      unthreadedCount++;
      const phi = Math.acos(-1 + (2 * unthreadedCount) / receipts.length);
      const theta = Math.sqrt(receipts.length * Math.PI) * phi;
      
      const x = unthreadedRadius * Math.cos(theta) * Math.sin(phi) + (Math.random() - 0.5) * 20;
      const y = unthreadedRadius * Math.sin(theta) * Math.sin(phi) + (Math.random() - 0.5) * 20;
      const z = unthreadedRadius * Math.cos(phi) + (Math.random() - 0.5) * 20;

      spatialReceiptsMap.set(receipt.id, {
        ...receipt,
        position: [x, y, z],
      });
    }
  });

  return {
    spatialReceipts: Array.from(spatialReceiptsMap.values()),
    spatialThreads
  };
}
