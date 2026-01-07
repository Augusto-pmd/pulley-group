'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRingData } from '@/contexts/RingDataContext';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import { useNavigationState } from '@/contexts/NavigationStateContext';
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
  const { state: navState, enterObservacion, enterNavegacion, enterContexto } = useNavigationState();
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

  // Determinar tamaño según estado de navegación
  const getRingSize = () => {
    switch (navState) {
      case 'observacion':
        return 'w-96 h-96'; // MUY GRANDE, dominante
      case 'navegacion':
        return 'w-96 h-96'; // GRANDE, con menú radial
      case 'contexto':
        return 'w-16 h-16'; // MÍNIMO, solo símbolo
      case 'accion':
        return 'w-0 h-0'; // OCULTO durante acciones
      default:
        return 'w-96 h-96';
    }
  };

  // Determinar posición según estado de navegación
  const getRingPosition = () => {
    switch (navState) {
      case 'observacion':
      case 'navegacion':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'contexto':
        return 'fixed top-4 right-4'; // Esquina superior derecha
      case 'accion':
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  // Determinar si el anillo debe ser visible
  const isRingVisible = navState !== 'accion';
  
  // Determinar si los dominios deben mostrarse (solo en estado navegacion)
  const shouldShowDomains = navState === 'navegacion' && showDomains;

  // Manejar activación de dominios según estado
  const handleRingClick = () => {
    if (navState === 'observacion') {
      // Observación → Navegación
      enterNavegacion();
      setShowDomains(true);
    } else if (navState === 'navegacion') {
      // Navegación → Observación
      enterObservacion();
      setShowDomains(false);
      setActiveDomain(null);
    } else if (navState === 'contexto') {
      // Contexto → Observación
      enterObservacion();
      setActiveDomain(null);
      router.push('/');
    }
  };

  // Hover solo funciona en estado observación
  const handleRingMouseEnter = () => {
    if (navState === 'observacion') {
      hoverTimeoutRef.current = setTimeout(() => {
        enterNavegacion();
        setShowDomains(true);
      }, 500);
    }
  };

  const handleRingMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Seleccionar dominio - Navegación → Contexto
  const handleSelectDomain = (domain: typeof systemDomains[0]) => {
    if (domain.id === 'comando') {
      const event = new CustomEvent('open-command-palette');
      window.dispatchEvent(event);
      enterObservacion();
      setShowDomains(false);
    } else {
      // Navegación → Contexto: navegar a la página
      enterContexto();
      setShowDomains(false);
      setActiveDomain(null);
      if (domain.path) {
        router.push(domain.path);
      }
    }
  };

  // Cerrar contenido de dominio - Contexto → Observación
  const handleCloseDomainContent = () => {
    enterObservacion();
    setActiveDomain(null);
    setShowDomains(false);
    router.push('/');
  };

  // Cerrar dominios al hacer click fuera - Navegación → Observación
  useEffect(() => {
    if (navState === 'navegacion' && showDomains) {
      const handleClickOutside = (e: MouseEvent) => {
        if (ringRef.current && !ringRef.current.contains(e.target as Node)) {
          enterObservacion();
          setShowDomains(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [navState, showDomains, enterObservacion]);

  // Determinar si el Ring debe interceptar eventos
  // Siempre clickeable cuando está visible, especialmente en modo estado
  const shouldInterceptEvents = true; // El Ring siempre debe ser interactivo

  // Ajustar z-index según estado
  const ringZIndex = navState === 'observacion' || navState === 'navegacion' ? 100 : navState === 'contexto' ? 50 : 0;

  // No renderizar en estado acción
  if (!isRingVisible) {
    return null;
  }

  return (
    <div
      ref={ringRef}
      className={`${getRingPosition()}`}
      style={{
        pointerEvents: 'auto',
        zIndex: ringZIndex,
        opacity: navState === 'contexto' ? 0.6 : 1,
        transition: 'opacity 300ms ease-in-out',
      }}
      onMouseEnter={navState === 'observacion' ? handleRingMouseEnter : undefined}
      onMouseLeave={navState === 'observacion' ? handleRingMouseLeave : undefined}
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
        {/* Contenido del anillo - según estado */}
        <div className="text-center relative z-10">
          {navState === 'observacion' || navState === 'navegacion' ? (
            <>
              {/* SOLO el patrimonio total - sin labels, sin explicaciones */}
              <CurrencyDisplay value={displayValue} size="display" showSecondary={false} />
            </>
          ) : navState === 'contexto' ? (
            <>
              {/* Símbolo mínimo en contexto */}
              <div className="text-2xl" style={{ opacity: 0.7 }}>○</div>
            </>
          ) : null}
        </div>
      </div>

      {/* Dominios del sistema - SOLO en estado navegacion */}
      {shouldShowDomains && (
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

