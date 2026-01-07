'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useRouter } from 'next/navigation';

const modes = [
  { id: 'estado' as const, label: 'Estado', icon: '○', path: '/' },
  { id: 'mes' as const, label: 'Mes', icon: '◐', path: '/vida-mensual' },
  { id: 'fondo' as const, label: 'Fondo', icon: '◑', path: '/emma' },
  { id: 'detalle' as const, label: 'Detalle', icon: '◒', path: '/activos' },
];

export default function ModeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode } = useMode();
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mode-selector', handleOpen);
    return () => window.removeEventListener('open-mode-selector', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-mode-selector]')) {
          setIsOpen(false);
        }
      };
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectMode = (selectedMode: typeof modes[0]) => {
    setMode(selectedMode.id);
    router.push(selectedMode.path);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - capa base oscura */}
      <div 
        className="fixed inset-0 z-[199] backdrop-blur-md transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Selector radial */}
      <div 
        data-mode-selector
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]"
      >
        <div className="relative w-80 h-80">
          {modes.map((m, index) => {
            const angle = (index * 360) / modes.length - 90; // Empezar arriba
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isActive = mode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => handleSelectMode(m)}
                className="absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  left: `calc(50% + ${x}px - 2rem)`,
                  top: `calc(50% + ${y}px - 2rem)`,
                  // Material translúcido con luz cálida en foco
                  backgroundColor: isActive 
                    ? 'rgba(181, 154, 106, 0.2)' 
                    : 'rgba(31, 42, 51, 0.85)',
                  backgroundImage: isActive
                    ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.25) 0%, rgba(181, 154, 106, 0.1) 50%, transparent 100%)'
                    : 'none',
                  border: `1px solid ${isActive ? 'rgba(181, 154, 106, 0.5)' : 'rgba(181, 154, 106, 0.25)'}`,
                  color: '#F5F2EC',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isActive
                    ? `
                      inset 0 0 20px rgba(181, 154, 106, 0.15),
                      0 0 30px rgba(181, 154, 106, 0.2),
                      0 4px 12px rgba(0, 0, 0, 0.3)
                    `
                    : `
                      inset 0 0 10px rgba(0, 0, 0, 0.2),
                      0 2px 8px rgba(0, 0, 0, 0.25)
                    `,
                  transform: isOpen ? 'scale(1)' : 'scale(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                  e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)';
                  e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.6)';
                  e.currentTarget.style.boxShadow = `
                    inset 0 0 25px rgba(181, 154, 106, 0.2),
                    0 0 40px rgba(181, 154, 106, 0.25),
                    0 4px 12px rgba(0, 0, 0, 0.3)
                  `;
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive 
                    ? 'rgba(181, 154, 106, 0.2)' 
                    : 'rgba(31, 42, 51, 0.85)';
                  e.currentTarget.style.backgroundImage = isActive
                    ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.25) 0%, rgba(181, 154, 106, 0.1) 50%, transparent 100%)'
                    : 'none';
                  e.currentTarget.style.borderColor = isActive ? 'rgba(181, 154, 106, 0.5)' : 'rgba(181, 154, 106, 0.25)';
                  e.currentTarget.style.boxShadow = isActive
                    ? `
                      inset 0 0 20px rgba(181, 154, 106, 0.15),
                      0 0 30px rgba(181, 154, 106, 0.2),
                      0 4px 12px rgba(0, 0, 0, 0.3)
                    `
                    : `
                      inset 0 0 10px rgba(0, 0, 0, 0.2),
                      0 2px 8px rgba(0, 0, 0, 0.25)
                    `;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className="text-2xl">{m.icon}</div>
              </button>
            );
          })}

          {/* Centro */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(31, 42, 51, 0.95)',
              border: '1px solid rgba(181, 154, 106, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-caption text-text-secondary opacity-60 text-center">
              MODOS
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

