'use client';

import { useRouter } from 'next/navigation';
import { useNavigationState } from '@/contexts/NavigationStateContext';
import { useEffect } from 'react';

interface RadialOption {
  id: string;
  label: string;
  icon: string;
  path: string | null; // null para acciones especiales
  action?: () => void;
}

const radialOptions: RadialOption[] = [
  { id: 'mes', label: 'Mes', icon: '◐', path: '/vida-mensual' },
  { id: 'activos', label: 'Activos', icon: '◒', path: '/activos' },
  { id: 'inversiones', label: 'Inversiones', icon: '◉', path: '/investments' },
  { id: 'emma', label: 'Emma', icon: '◑', path: '/emma' },
  { id: 'comando', label: 'Buscar', icon: '⌘', path: null, action: () => {
    // Abrir command palette mediante evento personalizado
    const event = new CustomEvent('open-command-palette');
    window.dispatchEvent(event);
  }},
];

/**
 * RadialNavigator - Navegador radial alrededor del anillo
 * Solo visible en estado navegación
 */
export default function RadialNavigator() {
  const router = useRouter();
  const { enterContexto, enterObservacion } = useNavigationState();

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        enterObservacion();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [enterObservacion]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-radial-navigator]') && !target.closest('[data-center-core]')) {
        enterObservacion();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enterObservacion]);

  const handleSelect = (option: RadialOption) => {
    if (option.action) {
      option.action();
      enterObservacion();
    } else if (option.path) {
      router.push(option.path);
      enterContexto();
    }
  };

  return (
    <div
      data-radial-navigator
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[95]"
      style={{
        pointerEvents: 'auto',
        width: '600px',
        height: '600px',
      }}
    >
      {radialOptions.map((option, index) => {
        const angle = (index * 360) / radialOptions.length - 90; // Empezar arriba
        const radius = 240; // Distancia desde el centro
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 group"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(31, 42, 51, 0.85)',
              backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.15) 0%, transparent 70%)',
              border: '2px solid rgba(181, 154, 106, 0.2)',
              backdropFilter: 'blur(12px)',
              boxShadow: `
                inset 0 0 20px rgba(181, 154, 106, 0.1),
                0 2px 12px rgba(0, 0, 0, 0.25),
                0 0 30px rgba(181, 154, 106, 0.1)
              `,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.95)';
              e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.5)';
              e.currentTarget.style.boxShadow = `
                inset 0 0 30px rgba(181, 154, 106, 0.2),
                0 0 50px rgba(181, 154, 106, 0.3),
                0 4px 16px rgba(0, 0, 0, 0.3)
              `;
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.85)';
              e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
              e.currentTarget.style.boxShadow = `
                inset 0 0 20px rgba(181, 154, 106, 0.1),
                0 2px 12px rgba(0, 0, 0, 0.25),
                0 0 30px rgba(181, 154, 106, 0.1)
              `;
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          >
            <span className="text-3xl mb-1" style={{ opacity: 0.95 }}>{option.icon}</span>
            <span className="text-xs" style={{ opacity: 0.8, fontSize: '10px' }}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

