'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';

interface ClickButtonsProps {
    onButtonClick: () => void;
    onMusicStart: () => void;
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
}

interface GlitterParticle {
    id: number;
    x: number; // porcentaje
    y: number; // porcentaje
    vx: number;
    vy: number;
    size: number; // px
}

type ParticleStyle = CSSProperties & {
    '--particle-x': string;
    '--particle-y': string;
    '--particle-rotation'?: string;
};

const ClickButtons: React.FC<ClickButtonsProps> = ({ onButtonClick, onMusicStart, onStepChange }) => {
    const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
    const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
    const [glitters, setGlitters] = useState<GlitterParticle[]>([]);
    const [sequenceComplete, setSequenceComplete] = useState(false);

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
                imageIndex: Math.floor(Math.random() * flowerImages.length)
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
            // Debe ejecutarse dentro del click para conservar la activación del usuario en móviles.
            onMusicStart();
            // Secuencia completada
            setTimeout(() => {
                setSequenceComplete(true);
                onButtonClick(); // Notificar al componente padre
            }, 1500); // Esperar a que termine la animación de flores
        }
    };

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
                <>
                    <button
                        aria-describedby={`click-cue-hint-${currentButtonIndex}`}
                        className="click-cue absolute pointer-events-auto
                         px-6 py-3 bg-yellow-400 hover:bg-yellow-500
                         text-yellow-900 font-bold text-lg rounded-full
                         transition-colors duration-300
                         border-4 border-yellow-600 hover:border-yellow-700
                         whitespace-normal text-center"
                        style={{
                            left: `clamp(7.5rem, ${buttonPosition.x}%, calc(100% - 7.5rem))`,
                            top: `${buttonPosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                            maxWidth: 'calc(100vw - 2rem)',
                        }}
                        onClick={handleButtonClick}
                    >
                        <span className="click-cue__label">{buttonTexts[currentButtonIndex]}</span>
                    </button>
                    <span id={`click-cue-hint-${currentButtonIndex}`} className="sr-only">
                        Toca para continuar
                    </span>
                </>
            )}

            {/* Partículas de flores */}
            {flowers.map(flower => (
                <div
                    key={flower.id}
                    className="flower-burst absolute pointer-events-none"
                    style={{
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                        '--particle-x': `${flower.vx * 8}vw`,
                        '--particle-y': `${flower.vy * 6 + 18}vh`,
                        '--particle-rotation': `${flower.rotation + 360}deg`,
                    } as ParticleStyle}
                    onAnimationEnd={() => setFlowers((current) => current.filter((item) => item.id !== flower.id))}
                >
                    <Image
                        src={flowerImages[flower.imageIndex]}
                        alt=""
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
                    className="glitter-burst absolute pointer-events-none rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(255,215,0,0.8)]"
                    style={{
                        left: `${g.x}%`,
                        top: `${g.y}%`,
                        width: `${g.size}px`,
                        height: `${g.size}px`,
                        '--particle-x': `${g.vx * 6}vw`,
                        '--particle-y': `${g.vy * 5 + 8}vh`,
                    } as ParticleStyle}
                    onAnimationEnd={() => setGlitters((current) => current.filter((item) => item.id !== g.id))}
                />
            ))}
        </div>
    );
};

export default ClickButtons;
