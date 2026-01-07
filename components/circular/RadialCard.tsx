'use client';

import { ReactNode } from 'react';

interface RadialCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'normal' | 'large' | 'compact';
  onClick?: () => void;
  radius?: number; // Radio del círculo
  angle?: number; // Ángulo en grados (para posicionamiento orbital)
}

/**
 * RadialCard - Card circular que respeta el lenguaje geométrico radial
 * Nunca es rectangular, siempre circular o arco de círculo
 */
export default function RadialCard({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'normal', 
  onClick,
  radius,
  angle,
}: RadialCardProps) {
  const paddingClasses = {
    normal: 'p-6',
    large: 'p-8',
    compact: 'p-4',
  };

  // Si tiene radius y angle, posicionar orbitalmente
  const orbitalStyle = radius !== undefined && angle !== undefined
    ? {
        position: 'absolute' as const,
        left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
        top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
        transform: 'translate(-50%, -50%)',
      }
    : {};

  return (
    <div
      onClick={onClick}
      className={`
        rounded-full
        ${paddingClasses[padding]}
        ${hover || onClick ? 'cursor-pointer transition-all duration-500' : ''}
        ${className}
        relative
      `}
      style={{
        ...orbitalStyle,
        // Material translúcido circular con luz cálida radial
        backgroundColor: 'rgba(31, 42, 51, 0.85)',
        backgroundImage: `
          radial-gradient(circle at center, 
            rgba(181, 154, 106, 0.15) 0%,
            rgba(181, 154, 106, 0.08) 40%,
            transparent 80%
          )
        `,
        // Borde circular con reflejo
        border: '2px solid rgba(181, 154, 106, 0.2)',
        // Sombra radial que simula profundidad
        boxShadow: hover 
          ? `
            inset 0 0 30px rgba(181, 154, 106, 0.2),
            0 0 60px rgba(181, 154, 106, 0.25),
            0 0 100px rgba(181, 154, 106, 0.15),
            0 8px 32px rgba(0, 0, 0, 0.3)
          `
          : `
            inset 0 0 20px rgba(181, 154, 106, 0.1),
            0 0 40px rgba(181, 154, 106, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.25)
          `,
        backdropFilter: 'blur(20px)',
        minWidth: radius !== undefined ? 'auto' : '200px',
        minHeight: radius !== undefined ? 'auto' : '200px',
        width: radius !== undefined ? 'auto' : undefined,
        height: radius !== undefined ? 'auto' : undefined,
      }}
      onMouseEnter={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.4)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 40px rgba(181, 154, 106, 0.25),
            0 0 80px rgba(181, 154, 106, 0.3),
            0 0 120px rgba(181, 154, 106, 0.2),
            0 12px 40px rgba(0, 0, 0, 0.35)
          `;
          e.currentTarget.style.transform = radius !== undefined 
            ? 'translate(-50%, -50%) scale(1.1)' 
            : 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.85)';
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 20px rgba(181, 154, 106, 0.1),
            0 0 40px rgba(181, 154, 106, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.25)
          `;
          e.currentTarget.style.transform = radius !== undefined 
            ? 'translate(-50%, -50%) scale(1)' 
            : 'scale(1)';
        }
      }}
    >
      {children}
    </div>
  );
}

