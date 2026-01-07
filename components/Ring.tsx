'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRingData } from '@/contexts/RingDataContext';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import { useRouter, usePathname } from 'next/navigation';
import CurrencyDisplay from './CurrencyDisplay';
import CircularDomain from './circular/CircularDomain';

// Dominios del sistema - cada uno es un subcírculo que orbita el núcleo
const systemDomains = [
  { id: 'estado', label: 'Estado', icon: '○', path: '/' },
  { id: 'mes', label: 'Mes', icon: '◐', path: '/vida-mensual' },
  { id: 'fondo', label: 'Fondo', icon: '◑', path: '/emma' },
  { id: 'activos', label: 'Activos', icon: '◒', path: '/activos' },
  { id: 'inversiones', label: 'Inversiones', icon: '◉', path: '/investments' },
  { id: 'comando', label: 'Comando', icon: '⌘', path: null }, // Abre command palette
];

export default function Ring() {
  const { mode, setMode } = useMode();
  const { ringData } = useRingData();
  const { activeDomain, setActiveDomain, domainContent } = useCircularNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const [isPulsing, setIsPulsing] = useState(false);
  const [showDomains, setShowDomains] = useState(false);
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

  // Manejar activación de dominios
  const handleRingClick = () => {
    if (activeDomain) {
      // Si hay contenido activo, cerrarlo primero
      setActiveDomain(null);
      setShowDomains(false);
    } else {
      // Si no hay contenido, toggle de dominios
      setShowDomains(!showDomains);
    }
  };

  // Hover prolongado para activar dominios
  const handleRingMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowDomains(true);
    }, 500); // 500ms de hover para activar
  };

  const handleRingMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // No cerrar inmediatamente, solo si no hay hover sobre dominios
  };

  // Seleccionar dominio
  const handleSelectDomain = (domain: typeof systemDomains[0]) => {
    if (domain.id === 'comando') {
      // Abrir command palette mediante evento personalizado
      const event = new CustomEvent('open-command-palette');
      window.dispatchEvent(event);
      setShowDomains(false);
    } else {
      // Activar dominio - el contenido emerge desde el círculo
      setActiveDomain(domain.id);
      setMode(domain.id as 'estado' | 'mes' | 'fondo' | 'detalle');
      // PROHIBIDO navegar a otra pantalla - el contenido SIEMPRE emerge desde el núcleo
      // El contenido se inyecta desde las páginas usando el contexto
      // NO usar router.push() - el sistema es circular, no lineal
    }
  };

  // Cerrar contenido de dominio
  const handleCloseDomainContent = () => {
    setActiveDomain(null);
    setShowDomains(false);
  };

  // Cerrar dominios al hacer click fuera
  useEffect(() => {
    if (showDomains && !activeDomain) {
      const handleClickOutside = (e: MouseEvent) => {
        if (ringRef.current && !ringRef.current.contains(e.target as Node)) {
          setShowDomains(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDomains, activeDomain]);

  // Determinar si el Ring debe interceptar eventos
  // Siempre clickeable cuando está visible, especialmente en modo estado
  const shouldInterceptEvents = true; // El Ring siempre debe ser interactivo

  // Ajustar z-index: solo alto cuando está en modo estado o mostrando dominios
  // En otros modos, debe estar por debajo del contenido
  const ringZIndex = mode === 'estado' || showDomains || activeDomain !== null ? 100 : 10;

  return (
    <div
      ref={ringRef}
      className={`${getRingPosition()}`}
      style={{
        pointerEvents: 'auto',
        zIndex: ringZIndex,
      }}
      onMouseEnter={handleRingMouseEnter}
      onMouseLeave={handleRingMouseLeave}
    >
      {/* Halo exterior - luz cálida filtrada - DECORATIVO, no intercepta */}
      <div
        className={`${getRingSize()} rounded-full absolute inset-0 transition-all duration-1000`}
        style={{
          background: `radial-gradient(circle, rgba(181, 154, 106, ${isPulsing ? '0.15' : '0.08'}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
          animation: isPulsing ? 'pulse-slow 4s ease-in-out infinite' : 'none',
          pointerEvents: 'none', // Halo decorativo nunca intercepta
        }}
      />
      
      {/* Anillo principal - translúcido, iluminado desde dentro */}
      <div
        className={`${getRingSize()} rounded-full flex items-center justify-center transition-all duration-1000 group relative`}
        onClick={handleRingClick}
        style={{
          cursor: 'pointer',
          pointerEvents: 'auto',
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

      {/* Dominios del sistema - subcírculos que orbitan el núcleo */}
      {showDomains && (
        <>
          {systemDomains.map((domain, index) => {
            const angle = (index * 360) / systemDomains.length - 90; // Empezar arriba
            const radius = 180; // Distancia desde el centro del anillo
            const isActive = activeDomain === domain.id;

            return (
              <CircularDomain
                key={domain.id}
                id={domain.id}
                label={domain.label}
                icon={domain.icon}
                angle={angle}
                radius={radius}
                isActive={isActive}
                onClick={() => handleSelectDomain(domain)}
                onContentClose={handleCloseDomainContent}
              >
                {/* El contenido emerge desde el dominio - se inyecta desde el contexto */}
                {isActive && domainContent.get(domain.id)}
              </CircularDomain>
            );
          })}
        </>
      )}
    </div>
  );
}

