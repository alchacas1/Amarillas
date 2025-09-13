'use client';

import { useEffect, useState } from 'react';

interface PlantGrowthAnimationProps {
    onAnimationComplete: () => void;
}

const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({ onAnimationComplete }) => {
    const [stage, setStage] = useState(0);
    // Stages: 0=soil, 1=sprout, 2=stem, 3=leaves, 4=bud, 5=flower, 6=complete

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        // Secuencia de animación
        timers.push(setTimeout(() => setStage(1), 1000));  // Sprout appears
        timers.push(setTimeout(() => setStage(2), 2000));  // Stem grows
        timers.push(setTimeout(() => setStage(3), 3000));  // Leaves appear
        timers.push(setTimeout(() => setStage(4), 4000));  // Bud appears
        timers.push(setTimeout(() => setStage(5), 5000));  // Flower blooms
        timers.push(setTimeout(() => setStage(6), 6500));  // Animation complete
        timers.push(setTimeout(() => onAnimationComplete(), 7500)); // Notify completion

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [onAnimationComplete]);

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
            {/* Starry night background */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 2 + 1}s`
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
            <div className="relative w-96 h-96 flex items-end justify-center">

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
                    <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 transition-all duration-1500 animate-bloom">
                        {/* Flower petals */}
                        <div className="relative w-16 h-16">
                            {/* Center */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500 z-10"></div>

                            {/* Petals */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-petal-bloom"
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-16px)`,
                                        animationDelay: `${i * 0.1}s`
                                    }}
                                />
                            ))}

                            {/* Secondary petals */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={`secondary-${i}`}
                                    className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-petal-bloom"
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg) translateY(-12px)`,
                                        animationDelay: `${i * 0.1 + 0.5}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Magical sparkles around flower */}
                        {stage === 6 && (
                            <div className="absolute inset-0">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={`sparkle-${i}`}
                                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                            animationDuration: `${Math.random() * 1 + 0.5}s`
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Title appears at the end */}


            {/* Custom animations */}
            <style jsx>{`
        @keyframes grow-up {
          from { height: 0; opacity: 0; }
          to { height: 32px; opacity: 1; }
        }
        
        @keyframes grow-stem {
          from { height: 32px; }
          to { height: 120px; }
        }
        
        @keyframes grow-leaf {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes grow-leaf-delayed {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes grow-leaf-small {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes grow-leaf-small-delayed {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes grow-bud {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes bloom {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes petal-bloom {
          from { scale: 0; opacity: 0; }
          to { scale: 1; opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-grow-up { animation: grow-up 1s ease-out; }
        .animate-grow-stem { animation: grow-stem 1s ease-out; }
        .animate-grow-leaf { animation: grow-leaf 0.8s ease-out; }
        .animate-grow-leaf-delayed { animation: grow-leaf 0.8s ease-out 0.2s both; }
        .animate-grow-leaf-small { animation: grow-leaf-small 0.8s ease-out 0.4s both; }
        .animate-grow-leaf-small-delayed { animation: grow-leaf-small-delayed 0.8s ease-out 0.6s both; }
        .animate-grow-bud { animation: grow-bud 1s ease-out; }
        .animate-bloom { animation: bloom 1.5s ease-out; }
        .animate-petal-bloom { animation: petal-bloom 0.8s ease-out both; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
        </div>
    );
};

export default PlantGrowthAnimation;