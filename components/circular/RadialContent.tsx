'use client';

import { ReactNode } from 'react';

interface RadialContentProps {
  children: ReactNode;
  centerContent?: ReactNode; // Contenido central (núcleo)
  orbitItems?: Array<{
    id: string;
    content: ReactNode;
    angle: number; // Ángulo en grados
    radius: number; // Distancia desde el centro
  }>;
}

/**
 * RadialContent - Contenedor que organiza contenido en forma radial
 * El contenido central es el núcleo, los items orbitan alrededor
 */
export default function RadialContent({
  children,
  centerContent,
  orbitItems = [],
}: RadialContentProps) {
  return (
    <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center">
      {/* Contenido central - núcleo */}
      {centerContent && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          {centerContent}
        </div>
      )}

      {/* Items que orbitan alrededor del centro */}
      {orbitItems.length > 0 && (
        <div className="absolute inset-0">
          {orbitItems.map((item) => {
            const x = Math.cos((item.angle * Math.PI) / 180) * item.radius;
            const y = Math.sin((item.angle * Math.PI) / 180) * item.radius;

            return (
              <div
                key={item.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      )}

      {/* Contenido adicional (puede ser cualquier cosa) */}
      {children && (
        <div className="relative z-20 w-full">
          {children}
        </div>
      )}
    </div>
  );
}

