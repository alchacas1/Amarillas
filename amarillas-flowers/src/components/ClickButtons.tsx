'use client';

import { useEffect, useState } from 'react';

interface ClickButtonsProps {
  onButtonClick: () => void;
}

const ClickButtons: React.FC<ClickButtonsProps> = ({ onButtonClick }) => {
  const [showButton, setShowButton] = useState(false);

  const handleButtonClick = () => {
    // Ocultar el botón
    setShowButton(false);
    
    // Notificar al componente padre para iniciar la lluvia de flores
    onButtonClick();
  };

  useEffect(() => {
    // Mostrar el botón después de 1 segundo
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {showButton && (
        <button
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto
                     px-8 py-4 bg-yellow-400 hover:bg-yellow-500 
                     text-yellow-900 font-bold text-xl rounded-full 
                     shadow-xl hover:shadow-2xl transition-all duration-300
                     border-4 border-yellow-600 hover:border-yellow-700
                     animate-pulse hover:animate-none hover:scale-110"
          onClick={handleButtonClick}
        >
          🌻 Click aquí 🌻
        </button>
      )}
    </div>
  );
};

export default ClickButtons;