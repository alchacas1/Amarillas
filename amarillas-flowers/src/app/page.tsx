'use client';

import YellowFlowers from "@/components/YellowFlowers";
import ClickButtons from "@/components/ClickButtons";
import PlantGrowthAnimation from "@/components/PlantGrowthAnimation";
import { useState } from "react";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [startFlowerRain, setStartFlowerRain] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const handleButtonClick = () => {
    setStartFlowerRain(true);
  };

  const handleReset = () => {
    setAnimationComplete(false);
    setStartFlowerRain(false);
    // Recargar la página para reiniciar completamente
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen">
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
          <YellowFlowers startFlowerRain={startFlowerRain} />

          {/* Click Button Component */}
          <ClickButtons onButtonClick={handleButtonClick} />

          {/* Instructions - Only shown initially */}
          {!startFlowerRain && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">

            </div>
          )}
        </>
      )}
    </div>
  );
}