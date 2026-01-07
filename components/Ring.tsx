'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRingData } from '@/contexts/RingDataContext';
import { useRouter, usePathname } from 'next/navigation';
import CurrencyDisplay from './CurrencyDisplay';

// Opciones de navegación radial (fijas)
const radialOptions = [
  { id: 'estado', label: 'Estado', icon: '○', path: '/' },
  { id: 'mes', label: 'Mes', icon: '◐', path: '/vida-mensual' },
  { id: 'fondo', label: 'Fondo', icon: '◑', path: '/emma' },
  { id: 'detalle', label: 'Detalle', icon: '◒', path: '/activos' },
  { id: 'comando', label: 'Comando', icon: '⌘', path: null }, // Abre command palette
];

export default function Ring() {
  const { mode, setMode } = useMode();
  const { ringData } = useRingData();
  const router = useRouter();
  const pathname = usePathname();
  const [isPulsing, setIsPulsing] = useState(false);
  const [showRadialNav, setShowRadialNav] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);

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
        return 'w-96 h-96'; // MUY GRANDE, dominante, protagonista
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

  // Manejar activación de navegación radial
  const handleRingClick = () => {
    setShowRadialNav(!showRadialNav);
  };

  // Hover prolongado para activar navegación
  const handleRingMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowRadialNav(true);
    }, 500); // 500ms de hover para activar
  };

  const handleRingMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // No cerrar inmediatamente, solo si no hay hover sobre opciones radiales
  };

  // Seleccionar opción radial
  const handleSelectRadialOption = (option: typeof radialOptions[0]) => {
    if (option.id === 'comando') {
      // Abrir command palette mediante evento personalizado
      const event = new CustomEvent('open-command-palette');
      window.dispatchEvent(event);
    } else if (option.path) {
      setMode(option.id as 'estado' | 'mes' | 'fondo' | 'detalle');
      router.push(option.path);
    }
    setShowRadialNav(false);
  };

  // Cerrar navegación radial al hacer click fuera
  useEffect(() => {
    if (showRadialNav) {
      const handleClickOutside = (e: MouseEvent) => {
        if (ringRef.current && !ringRef.current.contains(e.target as Node)) {
          setShowRadialNav(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRadialNav]);

  return (
    <div
      ref={ringRef}
      className={`${getRingPosition()} z-[100] pointer-events-auto`}
      onMouseEnter={handleRingMouseEnter}
      onMouseLeave={handleRingMouseLeave}
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
        onClick={handleRingClick}
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
              {/* SOLO el patrimonio total - sin labels, sin explicaciones */}
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

      {/* Navegación radial - aparece solo por intención */}
      {showRadialNav && (
        <>
          {/* Opciones radiales alrededor del anillo */}
          {radialOptions.map((option, index) => {
            const angle = (index * 360) / radialOptions.length - 90; // Empezar arriba
            const radius = 140; // Distancia desde el centro del anillo
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isActive = mode === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectRadialOption(option)}
                className="absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 pointer-events-auto"
                style={{
                  left: `calc(50% + ${x}px - 1.5rem)`,
                  top: `calc(50% + ${y}px - 1.5rem)`,
                  // Material translúcido - opacidad baja, sin fondo sólido
                  backgroundColor: isActive 
                    ? 'rgba(181, 154, 106, 0.15)' 
                    : 'rgba(31, 42, 51, 0.6)',
                  backgroundImage: isActive
                    ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.2) 0%, transparent 70%)'
                    : 'none',
                  border: `1px solid ${isActive ? 'rgba(181, 154, 106, 0.4)' : 'rgba(181, 154, 106, 0.15)'}`,
                  color: '#F5F2EC',
                  backdropFilter: 'blur(8px)',
                  boxShadow: isActive
                    ? 'inset 0 0 10px rgba(181, 154, 106, 0.1), 0 0 20px rgba(181, 154, 106, 0.15)'
                    : 'inset 0 0 5px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2)',
                  opacity: showRadialNav ? 1 : 0,
                  transform: showRadialNav ? 'scale(1)' : 'scale(0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
                  e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.25) 0%, transparent 70%)';
                  e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.5)';
                  e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 0 25px rgba(181, 154, 106, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive 
                    ? 'rgba(181, 154, 106, 0.15)' 
                    : 'rgba(31, 42, 51, 0.6)';
                  e.currentTarget.style.backgroundImage = isActive
                    ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.2) 0%, transparent 70%)'
                    : 'none';
                  e.currentTarget.style.borderColor = isActive ? 'rgba(181, 154, 106, 0.4)' : 'rgba(181, 154, 106, 0.15)';
                  e.currentTarget.style.boxShadow = isActive
                    ? 'inset 0 0 10px rgba(181, 154, 106, 0.1), 0 0 20px rgba(181, 154, 106, 0.15)'
                    : 'inset 0 0 5px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className="text-lg" style={{ opacity: 0.9 }}>{option.icon}</div>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

