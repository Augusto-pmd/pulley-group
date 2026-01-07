'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRingData } from '@/contexts/RingDataContext';
import { useRouter, usePathname } from 'next/navigation';
import CurrencyDisplay from './CurrencyDisplay';

export default function Ring() {
  const { mode } = useMode();
  const { ringData } = useRingData();
  const router = useRouter();
  const pathname = usePathname();
  const [isPulsing, setIsPulsing] = useState(false);

  const { patrimonioTotal = 0, mesResultado, emmaCapital } = ringData;

  // Determinar valor a mostrar según modo
  const getDisplayValue = () => {
    switch (mode) {
      case 'estado':
        return patrimonioTotal;
      case 'mes':
        return mesResultado ?? 0;
      case 'fondo':
        return emmaCapital ?? 0;
      default:
        return patrimonioTotal;
    }
  };

  const displayValue = getDisplayValue();

  // Pulso lento para modo fondo (Emma)
  useEffect(() => {
    if (mode === 'fondo' && emmaCapital && emmaCapital > 0) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [mode, emmaCapital]);

  // Determinar tamaño según modo
  const getRingSize = () => {
    switch (mode) {
      case 'estado':
        return 'w-64 h-64'; // Grande, centrado
      case 'mes':
        return 'w-32 h-32'; // Reducido, arriba
      case 'fondo':
        return 'w-40 h-40'; // Mediano
      default:
        return 'w-40 h-40';
    }
  };

  // Determinar posición según modo
  const getRingPosition = () => {
    switch (mode) {
      case 'estado':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'mes':
        return 'fixed top-24 left-1/2 -translate-x-1/2';
      case 'fondo':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  const handleRingClick = () => {
    // Abrir selector radial de modos
    const event = new CustomEvent('open-mode-selector');
    window.dispatchEvent(event);
  };

  return (
    <div
      className={`${getRingPosition()} z-[100] pointer-events-auto`}
      onClick={handleRingClick}
    >
      {/* Halo exterior - luz cálida filtrada */}
      <div
        className={`${getRingSize()} rounded-full absolute inset-0 transition-all duration-1000`}
        style={{
          background: `radial-gradient(circle, rgba(181, 154, 106, ${isPulsing ? '0.15' : '0.08'}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
          animation: isPulsing ? 'pulse-slow 4s ease-in-out infinite' : 'none',
        }}
      />
      
      {/* Anillo principal - translúcido, iluminado desde dentro */}
      <div
        className={`${getRingSize()} rounded-full flex items-center justify-center transition-all duration-1000 cursor-pointer group relative`}
        style={{
          // Borde con reflejo de oro
          border: `2px solid rgba(181, 154, 106, ${mode === 'fondo' && emmaCapital && emmaCapital > 0 ? '0.5' : '0.3'})`,
          // Fondo translúcido con luz interna
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(181, 154, 106, ${isPulsing ? '0.12' : '0.06'}) 0%,
              rgba(214, 195, 163, 0.04) 40%,
              transparent 70%
            )
          `,
          // Sombra que simula profundidad y halo
          boxShadow: `
            inset 0 0 30px rgba(181, 154, 106, ${isPulsing ? '0.2' : '0.1'}),
            0 0 40px rgba(181, 154, 106, ${isPulsing ? '0.25' : '0.12'}),
            0 0 80px rgba(181, 154, 106, ${isPulsing ? '0.15' : '0.08'}),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `,
          backdropFilter: 'blur(10px)',
          animation: isPulsing ? 'pulse-slow 4s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.7)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 40px rgba(181, 154, 106, 0.25),
            0 0 60px rgba(181, 154, 106, 0.3),
            0 0 100px rgba(181, 154, 106, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = mode === 'fondo' && emmaCapital && emmaCapital > 0 
            ? 'rgba(181, 154, 106, 0.5)' 
            : 'rgba(181, 154, 106, 0.3)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 30px rgba(181, 154, 106, ${isPulsing ? '0.2' : '0.1'}),
            0 0 40px rgba(181, 154, 106, ${isPulsing ? '0.25' : '0.12'}),
            0 0 80px rgba(181, 154, 106, ${isPulsing ? '0.15' : '0.08'}),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `;
        }}
      >
        {/* Contenido del anillo - Plano focal con luz */}
        <div className="text-center relative z-10">
          {mode === 'estado' && (
            <>
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
                PATRIMONIO
              </div>
              <CurrencyDisplay value={displayValue} size="display" showSecondary={false} />
            </>
          )}
          {mode === 'mes' && (
            <>
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-1 text-xs" style={{ opacity: 0.5 }}>
                MES
              </div>
              <CurrencyDisplay value={displayValue} size="large" showSecondary={false} />
            </>
          )}
          {mode === 'fondo' && (
            <>
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-1 text-xs" style={{ opacity: 0.5 }}>
                EMMA
              </div>
              <CurrencyDisplay value={displayValue} size="large" showSecondary={false} />
            </>
          )}
          {mode === 'detalle' && (
            <div className="text-caption text-text-secondary" style={{ opacity: 0.5 }}>
              DETALLE
            </div>
          )}
        </div>
      </div>

      {/* Indicador de click */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-caption text-text-secondary opacity-60">
          Click para cambiar modo
        </div>
      </div>
    </div>
  );
}

