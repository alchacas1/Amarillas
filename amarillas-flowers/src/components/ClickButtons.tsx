'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ClickButtonsProps {
    onButtonClick: () => void;
}

interface FlowerParticle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    imageIndex: number;
    opacity: number;
}

const ClickButtons: React.FC<ClickButtonsProps> = ({ onButtonClick }) => {
    const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 });
    const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
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
        const padding = 20; // Porcentaje de padding desde los bordes
        return {
            x: Math.random() * (80 - padding) + padding, // Entre 20% y 80%
            y: Math.random() * (80 - padding) + padding  // Entre 20% y 80%
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

    // Función para manejar click del botón
    const handleButtonClick = () => {
        // Crear animación de flores desde la posición del botón
        const newFlowers = createFlowerParticles(buttonPosition.x, buttonPosition.y);
        setFlowers(prev => [...prev, ...newFlowers]);

        // Ocultar el botón actual
        setShowButton(false);

        // Avanzar al siguiente botón o completar secuencia
        if (currentButtonIndex < buttonTexts.length - 1) {
            setTimeout(() => {
                setCurrentButtonIndex(prev => prev + 1);
                setButtonPosition(getRandomPosition());
                setShowButton(true);
            }, 800); // Esperar un poco antes de mostrar el siguiente botón
        } else {
            // Secuencia completada
            setTimeout(() => {
                setSequenceComplete(true);
                onButtonClick(); // Notificar al componente padre
            }, 1500); // Esperar a que termine la animación de flores
        }
    };

    // Animar las partículas de flores
    useEffect(() => {
        if (flowers.length === 0) return;

        const animationFrame = requestAnimationFrame(() => {
            setFlowers(prev => 
                prev.map(flower => ({
                    ...flower,
                    x: flower.x + flower.vx,
                    y: flower.y + flower.vy,
                    vy: flower.vy + 0.1, // Gravedad
                    rotation: flower.rotation + 5,
                    opacity: Math.max(0, flower.opacity - 0.02)
                })).filter(flower => flower.opacity > 0 && flower.y < 110) // Remover flores que salen de pantalla
            );
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [flowers]);

    // Inicializar la secuencia después de 1 segundo
    useEffect(() => {
        const timer = setTimeout(() => {
            setButtonPosition(getRandomPosition());
            setShowButton(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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
        </div>
    );
};

export default ClickButtons;