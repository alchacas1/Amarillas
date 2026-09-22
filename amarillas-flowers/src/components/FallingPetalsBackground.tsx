'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

interface Petal {
  id: number;
  x: number; // %
  size: number; // px
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
}

type PetalStyle = CSSProperties & {
  '--petal-drift': string;
  '--petal-rotation': string;
};

const FallingPetalsBackground: React.FC = () => {
  const [petals] = useState<Petal[]>(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      x: Math.random() * 100,
      size: Math.random() * 18 + 10,
      duration: Math.random() * 8 + 8,
      delay: -(Math.random() * 16),
      drift: Math.random() * 160 - 80,
      rotation: Math.random() * 540 + 180,
    })),
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map(p => (
        <div
          key={p.id}
          className="petal-fall absolute"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.7,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--petal-drift': `${p.drift}px`,
            '--petal-rotation': `${p.rotation}deg`,
          } as PetalStyle}
        >
          <div className="h-full w-full rounded-full bg-yellow-200 shadow-[0_0_8px_rgba(255,235,59,0.6)]" />
        </div>
      ))}
    </div>
  );
};

export default FallingPetalsBackground;
