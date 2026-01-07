'use client';

import { ReactNode, useState, useEffect } from 'react';

interface CircularDomainProps {
  id: string;
  label: string;
  icon: string;
  angle: number; // Ángulo en grados desde el centro
  radius: number; // Distancia desde el centro
  isActive: boolean;
  onClick: () => void;
  children?: ReactNode; // Contenido que emerge del dominio
  onContentClose?: () => void;
}

export default function CircularDomain({
  id,
  label,
  icon,
  angle,
  radius,
  isActive,
  onClick,
  children,
  onContentClose,
}: CircularDomainProps) {
  const [showContent, setShowContent] = useState(false);
  const [contentScale, setContentScale] = useState(0);

  // Calcular posición basada en ángulo y radio
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  // Cuando se activa, mostrar contenido con animación
  useEffect(() => {
    if (isActive) {
      setShowContent(true);
      // Animación de expansión radial
      setTimeout(() => setContentScale(1), 50);
    } else {
      setContentScale(0);
      setTimeout(() => setShowContent(false), 300);
    }
  }, [isActive]);

  const handleClick = () => {
    onClick();
  };

  return (
    <>
      {/* Círculo del dominio - orbita alrededor del núcleo */}
      <button
        onClick={handleClick}
        className="absolute rounded-full flex items-center justify-center transition-all duration-500 pointer-events-auto group"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: '64px',
          height: '64px',
          transform: `translate(-50%, -50%) scale(${isActive ? 1.15 : 1})`,
          // Material translúcido con luz cálida
          backgroundColor: isActive
            ? 'rgba(181, 154, 106, 0.25)'
            : 'rgba(31, 42, 51, 0.7)',
          backgroundImage: isActive
            ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)'
            : 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)',
          border: `2px solid ${isActive ? 'rgba(181, 154, 106, 0.5)' : 'rgba(181, 154, 106, 0.2)'}`,
          color: '#F5F2EC',
          backdropFilter: 'blur(12px)',
          boxShadow: isActive
            ? `
              inset 0 0 20px rgba(181, 154, 106, 0.2),
              0 0 40px rgba(181, 154, 106, 0.3),
              0 0 80px rgba(181, 154, 106, 0.15),
              0 4px 16px rgba(0, 0, 0, 0.3)
            `
            : `
              inset 0 0 10px rgba(0, 0, 0, 0.2),
              0 2px 12px rgba(0, 0, 0, 0.25),
              0 0 30px rgba(181, 154, 106, 0.1)
            `,
          opacity: showContent ? 0.3 : 1,
          zIndex: isActive ? 200 : 150,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.25) 0%, rgba(181, 154, 106, 0.1) 50%, transparent 100%)';
            e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.4)';
            e.currentTarget.style.boxShadow = `
              inset 0 0 15px rgba(181, 154, 106, 0.15),
              0 0 35px rgba(181, 154, 106, 0.25),
              0 0 60px rgba(181, 154, 106, 0.12),
              0 4px 16px rgba(0, 0, 0, 0.3)
            `;
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.7)';
            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)';
            e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
            e.currentTarget.style.boxShadow = `
              inset 0 0 10px rgba(0, 0, 0, 0.2),
              0 2px 12px rgba(0, 0, 0, 0.25),
              0 0 30px rgba(181, 154, 106, 0.1)
            `;
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        }}
      >
        <div className="text-2xl" style={{ opacity: 0.95 }}>{icon}</div>
        
        {/* Label que aparece en hover */}
        <div
          className="absolute whitespace-nowrap pointer-events-none transition-opacity duration-300"
          style={{
            left: '50%',
            top: 'calc(100% + 12px)',
            transform: 'translateX(-50%)',
            opacity: 0,
            fontSize: '12px',
            color: '#F5F2EC',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          {label}
        </div>
      </button>

      {/* Contenido que emerge radialmente desde el dominio */}
      {showContent && children && (
        <div
          className="fixed inset-0 z-[180] pointer-events-none"
          style={{
            opacity: contentScale,
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Overlay de fondo - se oscurece cuando hay contenido */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'auto',
            }}
            onClick={() => {
              if (onContentClose) {
                onContentClose();
              }
            }}
          />

          {/* Contenedor del contenido - emerge desde el punto del dominio */}
          <div
            className="absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) scale(${contentScale})`,
              transformOrigin: 'center center',
              pointerEvents: 'auto',
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              width: 'min(90vw, 1200px)',
              maxWidth: 'calc(100vw - 32px)', // Asegurar padding de 16px a cada lado
              maxHeight: 'calc(100vh - 32px)', // Asegurar padding de 16px arriba y abajo
            }}
          >
            {/* Círculo de expansión - efecto visual */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(181, 154, 106, 0.1) 0%, transparent 70%)',
                transform: `scale(${contentScale * 3})`,
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
              }}
            />

            {/* Contenido real */}
            <div
              className="relative rounded-[32px] overflow-hidden"
              style={{
                backgroundColor: 'rgba(31, 42, 51, 0.95)',
                backgroundImage: `
                  radial-gradient(circle at 30% 30%, 
                    rgba(181, 154, 106, 0.15) 0%,
                    rgba(214, 195, 163, 0.08) 40%,
                    transparent 70%
                  )
                `,
                border: '1px solid rgba(181, 154, 106, 0.2)',
                backdropFilter: 'blur(40px)',
                boxShadow: `
                  inset 0 0 40px rgba(181, 154, 106, 0.1),
                  0 0 80px rgba(181, 154, 106, 0.2),
                  0 20px 60px rgba(0, 0, 0, 0.4)
                `,
                padding: '48px',
              }}
            >
              {/* Botón de cierre */}
              <button
                onClick={() => {
                  if (onContentClose) {
                    onContentClose();
                  }
                }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(181, 154, 106, 0.15)',
                  border: '1px solid rgba(181, 154, 106, 0.3)',
                  color: '#F5F2EC',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.3)';
                }}
              >
                <span className="text-lg">✕</span>
              </button>

              {/* Contenido */}
              <div className="relative z-10" style={{ pointerEvents: 'auto' }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

