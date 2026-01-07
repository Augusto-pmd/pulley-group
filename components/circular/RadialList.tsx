'use client';

import { ReactNode } from 'react';
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
  return (
    <div className={`relative w-full h-full min-h-[60vh] flex items-center justify-center ${className}`}>
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
      {items.map((item) => (
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

