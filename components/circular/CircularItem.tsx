'use client';

import { ReactNode, useState } from 'react';

interface CircularItemProps {
  id: string;
  label?: string;
  value?: string | number;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  isActive?: boolean;
}

/**
 * CircularItem - Elemento circular individual
 * Reemplaza las cards cuadradas con geometría circular
 */
export default function CircularItem({
  id,
  label,
  value,
  children,
  size = 'medium',
  onClick,
  isActive = false,
}: CircularItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${sizeClasses[size]}
        rounded-full flex flex-col items-center justify-center
        transition-all duration-300 cursor-pointer relative
      `}
      style={{
        // Material translúcido circular
        backgroundColor: isActive
          ? 'rgba(181, 154, 106, 0.25)'
          : isHovered
          ? 'rgba(181, 154, 106, 0.15)'
          : 'rgba(31, 42, 51, 0.6)',
        backgroundImage: isActive || isHovered
          ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.1) 50%, transparent 100%)'
          : 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)',
        border: `2px solid ${isActive ? 'rgba(181, 154, 106, 0.5)' : isHovered ? 'rgba(181, 154, 106, 0.3)' : 'rgba(181, 154, 106, 0.15)'}`,
        color: '#F5F2EC',
        backdropFilter: 'blur(12px)',
        boxShadow: isActive || isHovered
          ? `
            inset 0 0 20px rgba(181, 154, 106, 0.15),
            0 0 40px rgba(181, 154, 106, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.3)
          `
          : `
            inset 0 0 10px rgba(0, 0, 0, 0.2),
            0 2px 12px rgba(0, 0, 0, 0.25)
          `,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {/* Contenido interno */}
      <div className="text-center relative z-10">
        {children ? (
          children
        ) : (
          <>
            {value && (
              <div className={`font-semibold ${textSizes[size]}`} style={{ opacity: 0.95 }}>
                {value}
              </div>
            )}
            {label && (
              <div className="text-xs mt-1" style={{ opacity: 0.7 }}>
                {label}
              </div>
            )}
          </>
        )}
      </div>

      {/* Halo exterior - efecto de luz */}
      {(isActive || isHovered) && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(181, 154, 106, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
}

