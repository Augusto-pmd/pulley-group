'use client';

import { ReactNode } from 'react';
import { useNavigationState } from '@/contexts/NavigationStateContext';

export default function MainContent({ children }: { children: ReactNode }) {
  const { state } = useNavigationState();

  // Controlar overflow según estado
  const getOverflowStyle = () => {
    switch (state) {
      case 'observacion':
        return { overflow: 'hidden' }; // Sin scroll en observación
      case 'navegacion':
        return { overflow: 'hidden' }; // Sin scroll en navegación
      case 'contexto':
        return { overflow: 'auto' }; // Scroll permitido en contexto
      case 'accion':
        return { overflow: 'hidden' }; // Sin scroll durante acciones
      default:
        return { overflow: 'auto' };
    }
  };

  return (
    <main 
      className="relative z-10"
      style={{
        width: '100vw',
        height: '100vh',
        ...getOverflowStyle(),
      }}
    >
      {children}
    </main>
  );
}

