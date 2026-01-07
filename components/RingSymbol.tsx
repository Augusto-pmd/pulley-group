'use client';

import { useRouter } from 'next/navigation';
import { useNavigationState } from '@/contexts/NavigationStateContext';
import { useState, useRef, useEffect } from 'react';

/**
 * RingSymbol - Símbolo mínimo del anillo en módulos
 * Permite volver al home o abrir navegación radial
 */
export default function RingSymbol() {
  const router = useRouter();
  const { enterObservacion, enterNavegacion } = useNavigationState();
  const [showRadial, setShowRadial] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    enterObservacion();
    router.push('/');
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      enterNavegacion();
      setShowRadial(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed top-4 left-4 z-[100]"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={handleClick}
        onMouseEnter={(e) => {
          handleMouseEnter();
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.5)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 20px rgba(181, 154, 106, 0.2),
            0 0 40px rgba(181, 154, 106, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          handleMouseLeave();
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 10px rgba(0, 0, 0, 0.2),
            0 2px 12px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(181, 154, 106, 0.1)
          `;
        }}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: 'rgba(31, 42, 51, 0.7)',
          backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)',
          border: '2px solid rgba(181, 154, 106, 0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: `
            inset 0 0 10px rgba(0, 0, 0, 0.2),
            0 2px 12px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(181, 154, 106, 0.1)
          `,
        }}
        title="Volver al centro"
      >
        <span className="text-xl" style={{ opacity: 0.8 }}>○</span>
      </button>
    </div>
  );
}

