'use client';

import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number; // %
  y: number; // %
  size: number; // px
  speedY: number;
  sway: number;
  phase: number;
  rotation: number;
}

const FallingPetalsBackground: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // inicializar pétalos
    const initial: Petal[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 10,
      speedY: Math.random() * 0.2 + 0.05,
      sway: Math.random() * 1 + 0.5,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
    }));
    setPetals(initial);

    let raf: number;
    const tick = () => {
      setPetals(prev => prev.map(p => {
        let y = p.y + p.speedY;
        let x = p.x + Math.sin((p.y + p.phase) / 10) * p.sway * 0.1;
        const rotation = (p.rotation + 0.2) % 360;
        if (y > 105) {
          y = -5;
          x = Math.random() * 100;
        }
        return { ...p, x, y, rotation };
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        >
          <div
            className="bg-yellow-200 rounded-full shadow-[0_0_8px_rgba(255,235,59,0.6)]"
            style={{ width: p.size, height: p.size * 0.7 }}
          />
        </div>
      ))}
    </div>
  );
};

export default FallingPetalsBackground;
