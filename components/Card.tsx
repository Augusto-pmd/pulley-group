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
        rounded-card backdrop-blur-card border border-white/20
        ${paddingClasses[padding]}
        ${hover || onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:backdrop-blur-[50px]' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        // Gradiente interno muy sutil para espesor del material + tinte azul apenas perceptible
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(252, 253, 255, 0.45) 100%)',
        // Ambient shadow grande y difusa con color suave + borde luminoso azul muy sutil
        boxShadow: hover ? `
          0px 12px 64px rgba(0, 0, 0, 0.05),
          0px 4px 16px rgba(0, 0, 0, 0.02),
          0px 0px 0px 1px rgba(255, 255, 255, 0.3),
          0px 0px 0px 0.5px rgba(100, 150, 200, 0.08),
          inset 0px 1px 0px rgba(255, 255, 255, 0.5),
          inset 0px -1px 0px rgba(255, 255, 255, 0.3)
        ` : `
          0px 8px 48px rgba(0, 0, 0, 0.04),
          0px 2px 12px rgba(0, 0, 0, 0.015),
          0px 0px 0px 1px rgba(255, 255, 255, 0.25),
          0px 0px 0px 0.5px rgba(100, 150, 200, 0.05),
          inset 0px 1px 0px rgba(255, 255, 255, 0.4),
          inset 0px -1px 0px rgba(255, 255, 255, 0.2)
        `,
      }}
    >
      {children}
    </div>
  );
}
