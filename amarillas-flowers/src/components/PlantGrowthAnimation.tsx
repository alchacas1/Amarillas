'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface PlantGrowthAnimationProps {
    onAnimationComplete: () => void;
}

interface Star {
    id: number;
    left: number;
    top: number;
    width: number;
    height: number;
    delay: number;
    duration: number;
}

interface Sparkle {
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
}

type PetalStyle = CSSProperties & {
    '--petal-angle': string;
    '--petal-delay': string;
    '--petal-scale': number;
};

const outerPetalScales = [1, 0.94, 1.04, 0.97, 1.02, 0.95, 1.03, 0.96, 1.05, 0.98];
const innerPetalScales = [0.95, 1.03, 0.97, 1.05, 0.96, 1.01, 0.94, 1.02];

const createSeededRandom = (initialSeed: number) => {
    let seed = initialSeed >>> 0;
    return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    };
};

const createStars = (): Star[] => {
    const random = createSeededRandom(20250921);
    return Array.from({ length: 50 }, (_, id) => ({
        id,
        left: random() * 100,
        top: random() * 100,
        width: random() * 3 + 1,
        height: random() * 3 + 1,
        delay: random() * 3,
        duration: random() * 2 + 1,
    }));
};

const createSparkles = (): Sparkle[] => {
    const random = createSeededRandom(20250922);
    return Array.from({ length: 12 }, (_, id) => ({
        id,
        left: random() * 100,
        top: random() * 100,
        delay: random() * 2,
        duration: random() + 0.5,
    }));
};

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({ onAnimationComplete }) => {
    const [stage, setStage] = useState(0);
    const [stars] = useState<Star[]>(createStars);
    const [sparkles] = useState<Sparkle[]>(createSparkles);
    const completionCallbackRef = useRef(onAnimationComplete);
    const completedRef = useRef(false);
    // Stages: 0=soil, 1=sprout, 2=stem, 3=leaves, 4=bud, 5=flower, 6=complete

    const finishAnimation = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        setStage(6);
        completionCallbackRef.current();
    }, []);

    useEffect(() => {
        completionCallbackRef.current = onAnimationComplete;
    }, [onAnimationComplete]);

    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            finishAnimation();
            return;
        }

        const timers: NodeJS.Timeout[] = [];

        // Secuencia de animación
        timers.push(setTimeout(() => setStage(1), 1000));  // Sprout appears
        timers.push(setTimeout(() => setStage(2), 2000));  // Stem grows
        timers.push(setTimeout(() => setStage(3), 3000));  // Leaves appear
        timers.push(setTimeout(() => setStage(4), 4000));  // Bud appears
        timers.push(setTimeout(() => setStage(5), 5000));  // Flower blooms
        timers.push(setTimeout(() => setStage(6), 6500));  // Animation complete
        timers.push(setTimeout(finishAnimation, 7500)); // Notify completion

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [finishAnimation]);

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
            {/* Starry night background */}
            <div className="absolute inset-0">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            width: `${star.width}px`,
                            height: `${star.height}px`,
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${star.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Moon */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-100 rounded-full shadow-lg opacity-80">
                <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-200 rounded-full opacity-60"></div>
                <div className="absolute bottom-4 left-3 w-3 h-3 bg-yellow-200 rounded-full opacity-40"></div>
            </div>

            {/* Plant growth container */}
            <div className="relative h-[min(24rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex items-end justify-center">

                {/* Soil */}
                <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-amber-900 to-amber-800 rounded-lg"></div>

                {/* Sprout */}
                {stage >= 1 && (
                    <div className="absolute bottom-16 w-2 h-8 bg-green-400 rounded-t-full transition-all duration-1000 transform origin-bottom animate-grow-up">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-green-300 rounded-full"></div>
                    </div>
                )}

                {/* Stem */}
                {stage >= 2 && (
                    <div className="absolute bottom-16 w-3 bg-green-500 rounded-t-lg transition-all duration-1000 animate-grow-stem"
                        style={{ height: stage >= 2 ? '120px' : '32px' }}>
                    </div>
                )}

                {/* Leaves */}
                {stage >= 3 && (
                    <>
                        <div className="absolute bottom-32 left-1/2 transform -translate-x-8 w-8 h-4 bg-green-400 rounded-full rotate-45 transition-all duration-800 animate-grow-leaf"></div>
                        <div className="absolute bottom-32 left-1/2 transform translate-x-2 w-8 h-4 bg-green-400 rounded-full -rotate-45 transition-all duration-800 animate-grow-leaf-delayed"></div>
                        <div className="absolute bottom-40 left-1/2 transform -translate-x-6 w-6 h-3 bg-green-300 rounded-full rotate-45 transition-all duration-800 animate-grow-leaf-small"></div>
                        <div className="absolute bottom-40 left-1/2 transform translate-x-1 w-6 h-3 bg-green-300 rounded-full -rotate-45 transition-all duration-800 animate-grow-leaf-small-delayed"></div>
                    </>
                )}

                {/* Bud */}
                {stage >= 4 && stage < 5 && (
                    <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-green-600 rounded-full transition-all duration-1000 animate-grow-bud">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-yellow-300 rounded-full opacity-60"></div>
                    </div>
                )}

                {/* Flower */}
                {stage >= 5 && (
                    <div
                        role="img"
                        aria-label={stage === 5 ? 'Flor amarilla abriéndose' : 'Flor amarilla abierta'}
                        className={`natural-flower ${stage === 5 ? 'natural-flower--blooming' : 'natural-flower--open'}`}
                    >
                        <div className="natural-flower__head" aria-hidden="true">
                            <div className="natural-flower__sepal natural-flower__sepal--left" />
                            <div className="natural-flower__sepal natural-flower__sepal--right" />

                            {outerPetalScales.map((scale, index) => (
                                <span
                                    key={`outer-${index}`}
                                    className="natural-petal-shell"
                                    style={{
                                        '--petal-angle': `${index * 36}deg`,
                                        '--petal-delay': `${index * 55}ms`,
                                        '--petal-scale': scale,
                                    } as PetalStyle}
                                >
                                    <span className="natural-petal natural-petal--outer" />
                                </span>
                            ))}

                            {innerPetalScales.map((scale, index) => (
                                <span
                                    key={`inner-${index}`}
                                    className="natural-petal-shell"
                                    style={{
                                        '--petal-angle': `${index * 45 + 22.5}deg`,
                                        '--petal-delay': `${220 + index * 42}ms`,
                                        '--petal-scale': scale,
                                    } as PetalStyle}
                                >
                                    <span className="natural-petal natural-petal--inner" />
                                </span>
                            ))}

                            <div className="natural-flower__center">
                                {Array.from({ length: 9 }, (_, index) => (
                                    <span key={index} />
                                ))}
                            </div>
                        </div>

                        {/* Magical sparkles around flower */}
                        {stage === 6 && (
                            <div className="absolute inset-0">
                                {sparkles.map((sparkle) => (
                                    <div
                                        key={sparkle.id}
                                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                                        style={{
                                            left: `${sparkle.left}%`,
                                            top: `${sparkle.top}%`,
                                            animationDelay: `${sparkle.delay}s`,
                                            animationDuration: `${sparkle.duration}s`
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={finishAnimation}
                className="absolute bottom-6 right-6 z-20 rounded-full border border-white/60 bg-black/35 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
                Saltar animación
            </button>
        </div>
    );
};

export default PlantGrowthAnimation;
