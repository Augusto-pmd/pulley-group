'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'normal' | 'large' | 'compact';
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, padding = 'normal', onClick }: CardProps) {
  const paddingClasses = {
    normal: 'p-5',
    large: 'p-6',
    compact: 'p-3',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-card
        ${paddingClasses[padding]}
        ${hover || onClick ? 'cursor-pointer transition-all duration-300' : ''}
        ${className}
        relative
      `}
      style={{
        // Capa base translúcida - arena cálido con opacidad
        backgroundColor: 'rgba(214, 195, 163, 0.15)',
        // Overlay de luz cálida filtrada
        backgroundImage: `
          radial-gradient(circle at top left, 
            rgba(181, 154, 106, 0.08) 0%,
            transparent 50%
          ),
          linear-gradient(to bottom, 
            rgba(214, 195, 163, 0.2) 0%,
            rgba(214, 195, 163, 0.1) 100%
          )
        `,
        // Borde sutil con reflejo
        border: '1px solid rgba(181, 154, 106, 0.15)',
        // Sombra que simula profundidad
        boxShadow: hover 
          ? `
            inset 0 0 20px rgba(181, 154, 106, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(181, 154, 106, 0.2)
          `
          : `
            inset 0 0 10px rgba(181, 154, 106, 0.05),
            0 4px 16px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(181, 154, 106, 0.1)
          `,
        backdropFilter: 'blur(20px)',
      }}
      onMouseEnter={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(214, 195, 163, 0.2)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 30px rgba(181, 154, 106, 0.15),
            0 12px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(181, 154, 106, 0.3)
          `;
        }
      }}
      onMouseLeave={(e) => {
        if (hover || onClick) {
          e.currentTarget.style.backgroundColor = 'rgba(214, 195, 163, 0.15)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 10px rgba(181, 154, 106, 0.05),
            0 4px 16px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(181, 154, 106, 0.1)
          `;
        }
      }}
    >
      {children}
    </div>
  );
}
