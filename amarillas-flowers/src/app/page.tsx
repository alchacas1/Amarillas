'use client';

import YellowFlowers from "@/components/YellowFlowers";
import ClickButtons from "@/components/ClickButtons";
import PlantGrowthAnimation from "@/components/PlantGrowthAnimation";
import FallingPetalsBackground from "@/components/FallingPetalsBackground";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [startFlowerRain, setStartFlowerRain] = useState(false);
  const [rainComplete, setRainComplete] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const handleButtonClick = () => {
    setStartFlowerRain(true);
  };

  const palette = useMemo(() => {
    // Paleta de fondo dinámica basada en paso
    const gradients = [
      "from-[#fff8d6] to-[#ffeb99]",
      "from-[#fff2cc] to-[#ffe082]",
      "from-[#ffe8a3] to-[#ffd54f]",
      "from-[#ffe082] to-[#ffca28]",
      "from-[#ffd54f] to-[#ffb300]",
      "from-[#ffca28] to-[#ffa000]",
    ];
    return gradients[Math.min(stepIndex, gradients.length - 1)];
  }, [stepIndex]);

  const handleReset = () => {
    setAnimationComplete(false);
    setStartFlowerRain(false);
    // Recargar la página para reiniciar completamente
    window.location.reload();
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${palette} transition-colors duration-700`}>
      {/* Animación inicial - siempre visible */}
      <PlantGrowthAnimation onAnimationComplete={handleAnimationComplete} />

      {/* Contenido que aparece después de la animación */}
      {animationComplete && (
        <>
          {/* Reset Button - Top Right */}
          <button
            onClick={handleReset}
            className="absolute top-8 right-8 z-50 
                       px-4 py-2 bg-red-500 hover:bg-red-600 
                       text-white font-semibold rounded-full 
                       shadow-lg hover:shadow-xl transition-all duration-300
                       border-2 border-red-700 hover:border-red-800
                       hover:scale-105 active:scale-95"
            title="Reiniciar jardín"
          >
            Reiniciar
          </button>

          {/* Yellow Flowers Animation Component */}
          <YellowFlowers startFlowerRain={startFlowerRain} onRainComplete={() => setRainComplete(true)} />

          {/* Click Button Component */}
          {!startFlowerRain && (
            <ClickButtons onButtonClick={handleButtonClick} onStepChange={setStepIndex} />
          )}

          {/* Instructions - Only shown initially */}
          {!startFlowerRain && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">

            </div>
          )}
          {/* Final épico */}
          {rainComplete && (
            <>
              <FallingPetalsBackground />
              <div className="fixed inset-0 z-30 flex items-end justify-center pb-20 pointer-events-none">
                <TypewriterMessage />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// Mensaje con animación de máquina de escribir
function TypewriterMessage() {
  const text = "Espero que estas flores iluminen tu día 🌼💛";
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((s) => Math.min(text.length, s + 1)), 45);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-white/70 text-yellow-900 border border-yellow-400 rounded-xl px-6 py-4 shadow-lg backdrop-blur-sm font-semibold text-lg sm:text-2xl">
      <span>{text.slice(0, shown)}</span>
      <span className="inline-block w-2 bg-yellow-800 ml-1 animate-pulse" />
    </div>
  );
}