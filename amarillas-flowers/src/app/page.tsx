'use client';

import YellowFlowers from "@/components/YellowFlowers";
import ClickButtons from "@/components/ClickButtons";
import PlantGrowthAnimation from "@/components/PlantGrowthAnimation";
import FallingPetalsBackground from "@/components/FallingPetalsBackground";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [startFlowerRain, setStartFlowerRain] = useState(false);
  const [rainComplete, setRainComplete] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const handleButtonClick = useCallback(() => {
    setStartFlowerRain(true);
  }, []);

  const handleRainComplete = useCallback(() => {
    setRainComplete(true);
  }, []);

  const handleMusicStart = useCallback(() => {
    setMusicBlocked(false);

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/flores.mp3");
        audioRef.current.volume = 0.25;
      }

      audioRef.current.currentTime = 15;
      void audioRef.current.play().catch(() => setMusicBlocked(true));
    } catch {
      setMusicBlocked(true);
    }
  }, []);

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
      {/* La introducción se retira para revelar el jardín dinámico. */}
      {!animationComplete && (
        <PlantGrowthAnimation onAnimationComplete={handleAnimationComplete} />
      )}

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
          <YellowFlowers startFlowerRain={startFlowerRain} onRainComplete={handleRainComplete} />

          {/* Click Button Component */}
          {!startFlowerRain && (
            <ClickButtons
              onButtonClick={handleButtonClick}
              onMusicStart={handleMusicStart}
              onStepChange={setStepIndex}
            />
          )}

          {musicBlocked && (
            <button
              type="button"
              onClick={handleMusicStart}
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-yellow-700 bg-yellow-300 px-5 py-3 font-semibold text-yellow-950 shadow-xl hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-950"
            >
              Reproducir música
            </button>
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

const FINAL_MESSAGE = "Espero que estas flores iluminen tu día 🌼💛";

// Mensaje con animación de máquina de escribir
export function TypewriterMessage() {
  const characters = Array.from(FINAL_MESSAGE);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setShown((current) => {
        const next = Math.min(characters.length, current + 1);
        if (next === characters.length) {
          window.clearInterval(timer);
        }
        return next;
      });
    }, 45);

    return () => window.clearInterval(timer);
  }, [characters.length]);
  return (
    <div className="bg-white/70 text-yellow-900 border border-yellow-400 rounded-xl px-6 py-4 shadow-lg backdrop-blur-sm font-semibold text-lg sm:text-2xl">
      <span role="status" className="sr-only">{FINAL_MESSAGE}</span>
      <span aria-hidden="true">{characters.slice(0, shown).join("")}</span>
      <span aria-hidden="true" className="inline-block h-[1em] w-2 bg-yellow-800 ml-1 animate-pulse" />
    </div>
  );
}
