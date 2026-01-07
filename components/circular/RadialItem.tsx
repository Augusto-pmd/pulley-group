'use client';

import { ReactNode } from 'react';

interface RadialItemProps {
  children: ReactNode;
  angle: number; // Ángulo en grados desde el centro
  radius: number; // Distancia desde el centro
  size?: number; // Tamaño del círculo en px
  onClick?: () => void;
  isActive?: boolean;
  label?: string;
  icon?: string;
}

/**
 * RadialItem - Item circular que orbita alrededor de un punto central
 * Usado para listas radiales donde cada item es un círculo en órbita
 */
export default function RadialItem({
  children,
  angle,
  radius,
  size = 120,
  onClick,
  isActive = false,
  label,
  icon,
}: RadialItemProps) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        onClick={onClick}
        className={`
          rounded-full
          w-full h-full
          flex flex-col items-center justify-center
          transition-all duration-500
          ${onClick ? 'cursor-pointer' : ''}
        `}
        style={{
          // Material translúcido circular
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
          transform: isActive ? 'scale(1.15)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!isActive && onClick) {
            e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.25) 0%, rgba(181, 154, 106, 0.1) 50%, transparent 100%)';
            e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.4)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.7)';
            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)';
            e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {icon && (
          <div className="text-3xl mb-2" style={{ opacity: 0.95 }}>
            {icon}
          </div>
        )}
        {children}
        {label && (
          <div 
            className="text-xs mt-2 text-center px-2"
            style={{ 
              opacity: 0.8,
              fontSize: '11px',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

