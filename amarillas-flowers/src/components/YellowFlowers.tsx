'use client';

import { useEffect, useRef, useState } from 'react';
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
  pointerId: number | null;
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

const sizeMap = {
  small: 60,
  medium: 80,
  large: 100
} as const;

const MAX_VISITOR_FLOWERS = 20;

const constrainCoordinate = (value: number, itemSize: number, viewportSize: number) => {
  const radius = Math.min(itemSize / 2, viewportSize / 2);
  return Math.min(Math.max(value, radius), Math.max(radius, viewportSize - radius));
};

const constrainPosition = (x: number, y: number, itemSize: number) => ({
  x: constrainCoordinate(x, itemSize, window.innerWidth),
  y: constrainCoordinate(y, itemSize, window.innerHeight),
});

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
  const [rainFlowerCount, setRainFlowerCount] = useState(0);
  const revealTimersRef = useRef<number[]>([]);
  const visitorFlowerIdsRef = useRef<number[]>([]);
  const nextVisitorFlowerIdRef = useRef(1000);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragId: null,
    pointerId: null,
    offsetX: 0,
    offsetY: 0
  });

  const generateRandomPosition = (itemSize: number): { x: number; y: number } => {
    const radius = Math.min(itemSize / 2, window.innerWidth / 2, window.innerHeight / 2);
    const x = radius + Math.random() * Math.max(0, window.innerWidth - radius * 2);
    const y = radius + Math.random() * Math.max(0, window.innerHeight - radius * 2);
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, flowerId: number) => {
    e.preventDefault();
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

    const offsetX = e.clientX - flower.x;
    const offsetY = e.clientY - flower.y;
    e.currentTarget.setPointerCapture?.(e.pointerId);

    setDragState({
      isDragging: true,
      dragId: flowerId,
      pointerId: e.pointerId,
      offsetX,
      offsetY
    });
  };

  const stopDragging = () => {
    setDragState({
      isDragging: false,
      dragId: null,
      pointerId: null,
      offsetX: 0,
      offsetY: 0
    });
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!dragState.isDragging || dragState.dragId === null || e.pointerId !== dragState.pointerId) return;

      const newX = e.clientX - dragState.offsetX;
      const newY = e.clientY - dragState.offsetY;

      setFlowers(prev => 
        prev.map(flower => 
          flower.id === dragState.dragId
            ? { ...flower, ...constrainPosition(newX, newY, sizeMap[flower.size]) }
            : flower
        )
      );
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (e.pointerId === dragState.pointerId) stopDragging();
    };

    if (dragState.isDragging) {
      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointercancel', handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [dragState]);

  useEffect(() => {
    const keepFlowersInViewport = () => {
      setFlowers((current) => current.map((flower) => ({
        ...flower,
        ...constrainPosition(flower.x, flower.y, sizeMap[flower.size]),
      })));
    };

    window.addEventListener('resize', keepFlowersInViewport);
    return () => window.removeEventListener('resize', keepFlowersInViewport);
  }, []);

  useEffect(() => {
    if (!startFlowerRain) return;

    const initializeTimer = window.setTimeout(() => {
      // Generar muchas más flores (entre 40 y 60)
      const numFlowers = Math.floor(Math.random() * 21) + 40; // 40-60 flores
      const newFlowers: FlowerPosition[] = [];

      for (let i = 0; i < numFlowers; i++) {
        const size = getRandomSize();
        const position = generateRandomPosition(sizeMap[size]);
        const flower: FlowerPosition = {
          id: i + 1,
          x: position.x,
          y: position.y,
          show: false,
          size,
          imageIndex: getRandomFlowerImage()
        };
        newFlowers.push(flower);
      }

      // Agregar todas las flores al estado
      setFlowers(newFlowers);
      setSpawnedCount(0);
      setRainFlowerCount(newFlowers.length);
      visitorFlowerIdsRef.current = [];
      nextVisitorFlowerIdRef.current = 1000;

      // Mostrar cada flor con un delay aleatorio entre 0 y 6 segundos
      newFlowers.forEach((flower) => {
        const randomDelay = Math.random() * 6000; // 0-6 segundos
        
        const timer = window.setTimeout(() => {
          setFlowers(prev => {
            const updated = prev.map(f => f.id === flower.id ? { ...f, show: true } : f);
            return updated;
          });
          setSpawnedCount(prev => prev + 1);
        }, randomDelay);
        revealTimersRef.current.push(timer);
      });
    }, 0);
    revealTimersRef.current.push(initializeTimer);

    return () => {
      revealTimersRef.current.forEach(window.clearTimeout);
      revealTimersRef.current = [];
    };
  }, [startFlowerRain]);

  // Notifica cuando todas las flores se han mostrado
  useEffect(() => {
    if (!startFlowerRain) return;
    if (rainFlowerCount > 0 && spawnedCount >= rainFlowerCount) {
      // pequeño delay para dejar ver el final
      const t = setTimeout(() => onRainComplete?.(), 1200);
      return () => clearTimeout(t);
    }
  }, [spawnedCount, rainFlowerCount, startFlowerRain, onRainComplete]);

  const renderFlower = (flower: FlowerPosition, index: number) => {
    const isDragging = dragState.isDragging && dragState.dragId === flower.id;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const delta = event.shiftKey ? 20 : 10;
      const movement = {
        ArrowLeft: { x: -delta, y: 0 },
        ArrowRight: { x: delta, y: 0 },
        ArrowUp: { x: 0, y: -delta },
        ArrowDown: { x: 0, y: delta },
      }[event.key];

      if (!movement) return;
      event.preventDefault();
      setFlowers((current) => current.map((item) => item.id === flower.id
        ? {
            ...item,
            ...constrainPosition(
              item.x + movement.x,
              item.y + movement.y,
              sizeMap[item.size],
            ),
          }
        : item));
    };

    return (
      <button
        type="button"
        aria-label="Mover flor amarilla"
        aria-hidden={!flower.show}
        tabIndex={flower.show ? 0 : -1}
        key={flower.id}
        className={`absolute touch-none border-0 bg-transparent p-0 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-900 ${
          flower.show 
            ? 'translate-y-0 opacity-100 rotate-0 scale-100' 
            : 'translate-y-10 opacity-0 rotate-45 scale-50'
        } ${isDragging ? 'z-50 scale-110' : ''}`}
        style={{
          left: `${flower.x}px`,
          top: `${flower.y}px`,
          transition: isDragging ? 'none' : 'all 1000ms ease-out'
        }}
        onPointerDown={(e) => handlePointerDown(e, flower.id)}
        onKeyDown={handleKeyDown}
      >
        <div className={`relative ${isDragging ? '' : 'animate-float'}`} 
             style={{ animationDelay: `${index * 0.1}s` }}>
          <Image
            src={flowerImages[flower.imageIndex]}
            alt=""
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
      </button>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-20"
      style={{ pointerEvents: flowers.some(f => f.show) ? 'auto' : 'none' }}
      onClick={(e) => {
        // Easter egg: click en fondo agrega una flor que brota
        if ((e.target as HTMLElement).closest('button')) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = getRandomSize();
        const position = constrainPosition(x, y, sizeMap[size]);
        const newFlower: FlowerPosition = {
          id: nextVisitorFlowerIdRef.current,
          ...position,
          show: false,
          size,
          imageIndex: getRandomFlowerImage(),
        };
        nextVisitorFlowerIdRef.current += 1;

        const oldestVisitorId = visitorFlowerIdsRef.current.length >= MAX_VISITOR_FLOWERS
          ? visitorFlowerIdsRef.current.shift()
          : undefined;
        visitorFlowerIdsRef.current.push(newFlower.id);

        setFlowers(prev => [
          ...prev.filter((flower) => flower.id !== oldestVisitorId),
          newFlower,
        ]);
        const timer = window.setTimeout(() => {
          setFlowers(prev => prev.map(f => f.id === newFlower.id ? { ...f, show: true } : f));
        }, 20);
        revealTimersRef.current.push(timer);
      }}
    >
      {flowers.map((flower, index) => renderFlower(flower, index))}
    </div>
  );
};

export default YellowFlowers;
