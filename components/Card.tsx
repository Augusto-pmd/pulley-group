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
        ${hover || onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-card-hover' : ''}
        ${className}
      `}
      style={{
        backgroundColor: '#D6C3A3', // Arena cálido mate - fondo cards protagonistas
        boxShadow: hover ? '0px 4px 12px rgba(0, 0, 0, 0.2)' : '0px 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
    </div>
  );
}
