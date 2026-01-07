'use client';

import { ReactNode } from 'react';
import { useNavigationState } from '@/contexts/NavigationStateContext';

interface ContextSurfaceProps {
  children: ReactNode;
}

/**
 * ContextSurface - Superficie de contenido de módulos
 * Solo visible y scrollable en estado contexto
 */
export default function ContextSurface({ children }: ContextSurfaceProps) {
  const { state } = useNavigationState();

  // Solo visible en contexto
  if (state !== 'contexto') {
    return null;
  }

  return (
    <div
      className="relative z-10"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        pointerEvents: 'auto',
      }}
    >
      {children}
    </div>
  );
}

