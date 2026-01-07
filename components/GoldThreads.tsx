'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRouter } from 'next/navigation';

export default function GoldThreads() {
  const { mode } = useMode();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Solo mostrar en modos que no sean 'estado'
  const shouldShow = mode !== 'estado';

  // Detectar movimiento del mouse
  useEffect(() => {
    if (!shouldShow) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = () => {
      // Mostrar hilos al mover el mouse
      setIsVisible(true);
      
      // Ocultar después de 3 segundos sin movimiento
      if (mouseMoveTimerRef.current) {
        clearTimeout(mouseMoveTimerRef.current);
      }
      mouseMoveTimerRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
        }
      }, 3000);
    };

    // Detectar scroll hacia arriba
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        // Cerca del top, mostrar hilos
        setIsVisible(true);
        if (mouseMoveTimerRef.current) {
          clearTimeout(mouseMoveTimerRef.current);
        }
        mouseMoveTimerRef.current = setTimeout(() => {
          if (!isHovered) {
            setIsVisible(false);
          }
        }, 2000);
      }
    };

    // Detectar inactividad (mostrar después de 5 segundos)
    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      if (mouseMoveTimerRef.current) {
        clearTimeout(mouseMoveTimerRef.current);
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [shouldShow, isHovered]);

  // Ocultar al interactuar con contenido
  useEffect(() => {
    if (!shouldShow) return;

    const handleClick = (e: MouseEvent) => {
      // Si se hace click fuera del área de hilos, ocultar
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [shouldShow]);

  // Volver al dashboard al hacer click en los hilos
  const handleThreadClick = () => {
    router.push('/');
  };

  // Obtener dimensiones de la ventana
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calcular posición del anillo reducido (arriba, centrado)
  const ringPos = {
    x: dimensions.width / 2,
    y: 96, // top-24 = 6rem = 96px
  };

  // Calcular punto de destino (centro superior de la pantalla)
  const targetPos = {
    x: dimensions.width / 2,
    y: dimensions.height * 0.2, // 20% desde arriba
  };

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[90]"
      onMouseEnter={() => {
        setIsHovered(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (mouseMoveTimerRef.current) {
          clearTimeout(mouseMoveTimerRef.current);
        }
        mouseMoveTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }}
    >
      {/* Hilos de oro - conexión con el centro */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
          style={{
            opacity: isVisible ? (isHovered ? 0.4 : 0.2) : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          {/* Hilo principal - desde el anillo hacia el centro superior */}
          <line
            x1={ringPos.x}
            y1={ringPos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke="rgba(181, 154, 106, 0.3)"
            strokeWidth="0.5"
            strokeLinecap="round"
            style={{
              filter: 'blur(0.5px)',
              transition: 'stroke-opacity 0.5s ease',
            }}
            onClick={handleThreadClick}
            className="cursor-pointer"
          />
          
          {/* Hilos secundarios - sutiles, sugieren continuidad */}
          <line
            x1={ringPos.x - 20}
            y1={ringPos.y + 10}
            x2={targetPos.x - 15}
            y2={targetPos.y + dimensions.height * 0.05}
            stroke="rgba(181, 154, 106, 0.15)"
            strokeWidth="0.3"
            strokeLinecap="round"
            style={{
              filter: 'blur(1px)',
              transition: 'stroke-opacity 0.5s ease',
            }}
            onClick={handleThreadClick}
            className="cursor-pointer"
          />
          
          <line
            x1={ringPos.x + 20}
            y1={ringPos.y + 10}
            x2={targetPos.x + 15}
            y2={targetPos.y + dimensions.height * 0.05}
            stroke="rgba(181, 154, 106, 0.15)"
            strokeWidth="0.3"
            strokeLinecap="round"
            style={{
              filter: 'blur(1px)',
              transition: 'stroke-opacity 0.5s ease',
            }}
            onClick={handleThreadClick}
            className="cursor-pointer"
          />

          {/* Halo sutil en el punto de origen (anillo reducido) */}
          <circle
            cx={ringPos.x}
            cy={ringPos.y}
            r="3"
            fill="none"
            stroke="rgba(181, 154, 106, 0.2)"
            strokeWidth="0.5"
            style={{
              filter: 'blur(2px)',
              opacity: isVisible ? (isHovered ? 0.6 : 0.3) : 0,
              transition: 'opacity 1s ease',
            }}
            onClick={handleThreadClick}
            className="cursor-pointer"
          />
        </svg>
      )}
    </div>
  );
}

