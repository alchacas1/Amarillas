'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FlowerPosition {
  id: number;
  x: number;
  y: number;
  show: boolean;
  size: 'small' | 'medium' | 'large';
  imageIndex: number;
}

interface DragState {
  isDragging: boolean;
  dragId: number | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface YellowFlowersProps {
  startFlowerRain: boolean;
  onRainComplete?: () => void; // notifica al finalizar
}

// Array de imágenes de flores disponibles
const flowerImages = [
  '/flor1.webp',
  '/flor2.png', 
  '/flor3.png',
  '/flor4.webp',
  '/flor5.webp',
  '/flor6.png'
];

const getRandomSize = (): 'small' | 'medium' | 'large' => {
  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const getRandomFlowerImage = (): number => {
  return Math.floor(Math.random() * flowerImages.length);
};

const YellowFlowers: React.FC<YellowFlowersProps> = ({ startFlowerRain, onRainComplete }) => {
  const [flowers, setFlowers] = useState<FlowerPosition[]>([]);
  const [spawnedCount, setSpawnedCount] = useState(0);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  });

  const generateRandomPosition = (): { x: number; y: number } => {
    // Generar posiciones aleatorias en toda la pantalla
    const margin = 80; // Margen desde los bordes
    const x = Math.random() * (window.innerWidth - 2 * margin) + margin;
    const y = Math.random() * (window.innerHeight - 2 * margin) + margin;
    return { x, y };
  };

  // Funciones para manejar el arrastre
  const handleMouseDown = (e: React.MouseEvent, flowerId: number) => {
    e.preventDefault();
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

    const offsetX = e.clientX - flower.x;
    const offsetY = e.clientY - flower.y;

    setDragState({
      isDragging: true,
      dragId: flowerId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX,
      offsetY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || dragState.dragId === null) return;

    const newX = e.clientX - dragState.offsetX;
    const newY = e.clientY - dragState.offsetY;

    setFlowers(prev => 
      prev.map(flower => 
        flower.id === dragState.dragId 
          ? { ...flower, x: newX, y: newY }
          : flower
      )
    );
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      dragId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0
    });
  };

  // Agregar event listeners globales para el arrastre
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || dragState.dragId === null) return;

      const newX = e.clientX - dragState.offsetX;
      const newY = e.clientY - dragState.offsetY;

      setFlowers(prev => 
        prev.map(flower => 
          flower.id === dragState.dragId 
            ? { ...flower, x: newX, y: newY }
            : flower
        )
      );
    };

    const handleGlobalMouseUp = () => {
      setDragState({
        isDragging: false,
        dragId: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
      });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragState]);

  useEffect(() => {
    if (startFlowerRain) {
      // Generar muchas más flores (entre 40 y 60)
      const numFlowers = Math.floor(Math.random() * 21) + 40; // 40-60 flores
      const newFlowers: FlowerPosition[] = [];

      for (let i = 0; i < numFlowers; i++) {
        const position = generateRandomPosition();
        const flower: FlowerPosition = {
          id: i + 1,
          x: position.x,
          y: position.y,
          show: false,
          size: getRandomSize(),
          imageIndex: getRandomFlowerImage()
        };
        newFlowers.push(flower);
      }

      // Agregar todas las flores al estado
      setFlowers(newFlowers);

      setSpawnedCount(0);

      // Mostrar cada flor con un delay aleatorio entre 0 y 6 segundos
      newFlowers.forEach((flower) => {
        const randomDelay = Math.random() * 6000; // 0-6 segundos
        
        setTimeout(() => {
          setFlowers(prev => {
            const updated = prev.map(f => f.id === flower.id ? { ...f, show: true } : f);
            return updated;
          });
          setSpawnedCount(prev => prev + 1);
        }, randomDelay);
      });
    }
  }, [startFlowerRain]);

  // Notifica cuando todas las flores se han mostrado
  useEffect(() => {
    if (!startFlowerRain) return;
    const total = flowers.length;
    if (total > 0 && spawnedCount >= total) {
      // pequeño delay para dejar ver el final
      const t = setTimeout(() => onRainComplete?.(), 1200);
      return () => clearTimeout(t);
    }
  }, [spawnedCount, flowers.length, startFlowerRain, onRainComplete]);

  const renderFlower = (flower: FlowerPosition, index: number) => {
    const sizeMap = {
      small: 60,
      medium: 80, 
      large: 100
    };

    const isDragging = dragState.isDragging && dragState.dragId === flower.id;

    return (
      <div 
        key={flower.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out cursor-grab active:cursor-grabbing ${
          flower.show 
            ? 'translate-y-0 opacity-100 rotate-0 scale-100' 
            : 'translate-y-10 opacity-0 rotate-45 scale-50'
        } ${isDragging ? 'z-50 scale-110' : ''}`}
        style={{
          left: `${flower.x}px`,
          top: `${flower.y}px`,
          transition: isDragging ? 'none' : 'all 1000ms ease-out'
        }}
        onMouseDown={(e) => handleMouseDown(e, flower.id)}
      >
        <div className={`relative ${isDragging ? '' : 'animate-float'}`} 
             style={{ animationDelay: `${index * 0.1}s` }}>
          <Image
            src={flowerImages[flower.imageIndex]}
            alt="Flor amarilla"
            width={sizeMap[flower.size]}
            height={sizeMap[flower.size]}
            className={`drop-shadow-lg hover:scale-110 transition-transform duration-300 pointer-events-none select-none ${
              isDragging ? 'scale-110 rotate-3' : ''
            }`}
            style={{
              filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.3)) ${isDragging ? 'drop-shadow(0 8px 16px rgba(255,215,0,0.5))' : ''}`,
            }}
            draggable={false}
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-20"
      style={{ pointerEvents: flowers.some(f => f.show) ? 'auto' : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        // Easter egg: click en fondo agrega una flor que brota
        if ((e.target as HTMLElement).closest('img,button,div[role="flower"]')) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newFlower: FlowerPosition = {
          id: Date.now(),
          x,
          y,
          show: false,
          size: getRandomSize(),
          imageIndex: getRandomFlowerImage(),
        };
        setFlowers(prev => [...prev, newFlower]);
        setTimeout(() => {
          setFlowers(prev => prev.map(f => f.id === newFlower.id ? { ...f, show: true } : f));
        }, 20);
      }}
    >
      {flowers.map((flower, index) => renderFlower(flower, index))}
      
      {/* Floating animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(2px); }
          50% { transform: translateY(-10px) translateX(0px); }
          75% { transform: translateY(-5px) translateX(-2px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default YellowFlowers;