'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ClickButtonsProps {
    onButtonClick: () => void;
    onStepChange?: (index: number) => void; // para paleta dinámica
}

interface FlowerParticle {
    id: number;
    x: number; // porcentaje 0-100
    y: number; // porcentaje 0-100
    vx: number;
    vy: number;
    rotation: number;
    imageIndex: number;
    opacity: number;
}

interface GlitterParticle {
    id: number;
    x: number; // porcentaje
    y: number; // porcentaje
    vx: number;
    vy: number;
    size: number; // px
    opacity: number;
}

const ClickButtons: React.FC<ClickButtonsProps> = ({ onButtonClick, onStepChange }) => {
    const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
    const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
    const [glitters, setGlitters] = useState<GlitterParticle[]>([]);
    const [sequenceComplete, setSequenceComplete] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Array de textos para los botones
    const buttonTexts = [
        "hola",
        "estas", 
        "flores",
        "son para ti",
        "no te puedo dar físicas",
        "pero te puedo dar estas"
    ];

    // Array de imágenes de flores disponibles
    const flowerImages = [
        '/flor1.webp',
        '/flor2.png', 
        '/flor3.png',
        '/flor4.webp',
        '/flor5.webp',
        '/flor6.png'
    ];

    // Función para generar posición aleatoria
    const getRandomPosition = () => {
        const min = 20; // mínimo 20%
        const max = 80; // máximo 80%
        return {
            x: Math.random() * (max - min) + min,
            y: Math.random() * (max - min) + min,
        };
    };

    // Función para crear partículas de flores
    const createFlowerParticles = (buttonX: number, buttonY: number) => {
        const particles: FlowerParticle[] = [];
        const particleCount = 12; // Número de flores que salen

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * 2 * Math.PI; // Distribución circular
            const speed = Math.random() * 3 + 2; // Velocidad aleatoria

            particles.push({
                id: Date.now() + i,
                x: buttonX,
                y: buttonY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: Math.random() * 360,
                imageIndex: Math.floor(Math.random() * flowerImages.length),
                opacity: 1
            });
        }

        return particles;
    };

    // Partículas brillantes tipo "polvo de hadas"
    const createGlitterParticles = (x: number, y: number) => {
        const arr: GlitterParticle[] = [];
        const count = 18;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.5;
            arr.push({
                id: Date.now() + 1000 + i,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                opacity: 1,
            });
        }
        return arr;
    };

    // Función para manejar click del botón
    const handleButtonClick = () => {
        // Crear animación de flores desde la posición del botón
        const newFlowers = createFlowerParticles(buttonPosition.x, buttonPosition.y);
        const newGlitters = createGlitterParticles(buttonPosition.x, buttonPosition.y);
        setFlowers(prev => [...prev, ...newFlowers]);
        setGlitters(prev => [...prev, ...newGlitters]);

        // No reproducir música aún; solo al último botón

        // Ocultar el botón actual
        setShowButton(false);

        // Avanzar al siguiente botón o completar secuencia
        if (currentButtonIndex < buttonTexts.length - 1) {
            setTimeout(() => {
                setCurrentButtonIndex(prev => {
                    const next = prev + 1;
                    onStepChange?.(next);
                    return next;
                });
                setButtonPosition(getRandomPosition());
                setShowButton(true);
            }, 800); // Esperar un poco antes de mostrar el siguiente botón
        } else {
            // Secuencia completada
            setTimeout(() => {
                setSequenceComplete(true);
                // Reproducir música una única vez al finalizar la secuencia
                try {
                    if (!audioRef.current) {
                        const a = new Audio('/flores.mp3');
                        a.volume = 0.25;
                        audioRef.current = a;
                    }
                    // Iniciar desde el segundo 18
                    audioRef.current.currentTime = 18;
                    audioRef.current.play().catch(() => {});
                } catch {}
                onButtonClick(); // Notificar al componente padre
            }, 1500); // Esperar a que termine la animación de flores
        }
    };

    // Animar las partículas de flores
    useEffect(() => {
        if (flowers.length === 0 && glitters.length === 0) return;

        const raf = requestAnimationFrame(() => {
            setFlowers(prev => prev
                .map(flower => ({
                    ...flower,
                    x: flower.x + flower.vx,
                    y: flower.y + flower.vy,
                    vy: flower.vy + 0.12, // Gravedad leve
                    rotation: flower.rotation + 5,
                    opacity: Math.max(0, flower.opacity - 0.02)
                }))
                .filter(flower => flower.opacity > 0 && flower.y < 120)
            );

            setGlitters(prev => prev
                .map(g => ({
                    ...g,
                    x: g.x + g.vx,
                    y: g.y + g.vy,
                    vy: g.vy + 0.05,
                    opacity: Math.max(0, g.opacity - 0.04),
                }))
                .filter(g => g.opacity > 0 && g.y < 120)
            );
        });

        return () => cancelAnimationFrame(raf);
    }, [flowers, glitters]);

    // Inicializar la secuencia después de 1 segundo
    useEffect(() => {
        const timer = setTimeout(() => {
            setButtonPosition(getRandomPosition());
            setShowButton(true);
            onStepChange?.(0);
        }, 1000);

        return () => clearTimeout(timer);
    }, [onStepChange]);

    // Si la secuencia está completa, no renderizar nada
    if (sequenceComplete) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            {/* Botón de la secuencia */}
            {showButton && currentButtonIndex < buttonTexts.length && (
                <button
                    className="absolute pointer-events-auto
                     px-6 py-3 bg-yellow-400 hover:bg-yellow-500 
                     text-yellow-900 font-bold text-lg rounded-full 
                     shadow-xl hover:shadow-2xl transition-all duration-300
                     border-4 border-yellow-600 hover:border-yellow-700
                     animate-pulse hover:animate-none hover:scale-110
                     whitespace-nowrap"
                    style={{
                        left: `${buttonPosition.x}%`,
                        top: `${buttonPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                    onClick={handleButtonClick}
                >
                    {buttonTexts[currentButtonIndex]}
                </button>
            )}

            {/* Partículas de flores */}
            {flowers.map(flower => (
                <div
                    key={flower.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                        transform: `translate(-50%, -50%) rotate(${flower.rotation}deg)`,
                        opacity: flower.opacity,
                        transition: 'none'
                    }}
                >
                    <Image
                        src={flowerImages[flower.imageIndex]}
                        alt="flower"
                        width={30}
                        height={30}
                        className="object-contain"
                    />
                </div>
            ))}

            {/* Partículas brillantes */}
            {glitters.map(g => (
                <div
                    key={g.id}
                    className="absolute pointer-events-none rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(255,215,0,0.8)]"
                    style={{
                        left: `${g.x}%`,
                        top: `${g.y}%`,
                        width: `${g.size}px`,
                        height: `${g.size}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: g.opacity,
                    }}
                />
            ))}
        </div>
    );
};

export default ClickButtons;