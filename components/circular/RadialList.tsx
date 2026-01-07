'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import RadialItem from './RadialItem';

interface RadialListItem {
  id: string;
  content: ReactNode;
  angle: number; // Ángulo en grados
  radius: number; // Distancia desde el centro
  size?: number;
  onClick?: () => void;
  isActive?: boolean;
  label?: string;
  icon?: string;
}

interface RadialListProps {
  items: RadialListItem[];
  centerContent?: ReactNode; // Contenido central (núcleo)
  centerRadius?: number; // Radio del contenido central
  className?: string;
}

/**
 * RadialList - Lista radial donde los items orbitan alrededor de un centro
 * El contenido central es el núcleo, los items se distribuyen en círculo
 */
export default function RadialList({
  items,
  centerContent,
  centerRadius = 0,
  className = '',
}: RadialListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxRadius, setMaxRadius] = useState(200);

  // Calcular radio máximo basado en viewport disponible
  useEffect(() => {
    const calculateMaxRadius = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Radio máximo = 45% del menor lado, menos el tamaño del item más grande
      const minDimension = Math.min(width, height);
      const maxItemSize = Math.max(...items.map(item => item.size || 120));
      const calculatedMaxRadius = Math.max(100, (minDimension * 0.45) - (maxItemSize / 2));
      
      setMaxRadius(calculatedMaxRadius);
    };

    calculateMaxRadius();
    window.addEventListener('resize', calculateMaxRadius);
    return () => window.removeEventListener('resize', calculateMaxRadius);
  }, [items]);

  // Limitar radios de items al máximo calculado
  const constrainedItems = items.map(item => ({
    ...item,
    radius: Math.min(item.radius, maxRadius),
  }));

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{
        minHeight: '60vh',
        overflow: 'hidden', // Contener items dentro del contenedor
      }}
    >
      {/* Contenido central - núcleo */}
      {centerContent && (
        <div 
          className="relative z-10 flex flex-col items-center justify-center"
          style={{
            width: `${centerRadius * 2}px`,
            height: `${centerRadius * 2}px`,
          }}
        >
          {centerContent}
        </div>
      )}

      {/* Items que orbitan alrededor del centro */}
      {constrainedItems.map((item) => (
        <RadialItem
          key={item.id}
          angle={item.angle}
          radius={item.radius}
          size={item.size}
          onClick={item.onClick}
          isActive={item.isActive}
          label={item.label}
          icon={item.icon}
        >
          {item.content}
        </RadialItem>
      ))}
    </div>
  );
}

