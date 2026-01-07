'use client';

import { useNavigationState } from '@/contexts/NavigationStateContext';

/**
 * ViewportOverlay - Overlay que atenúa el fondo en estado navegación
 * Solo visible en estado navegación para crear foco en el menú radial
 */
export default function ViewportOverlay() {
  const { state } = useNavigationState();

  // Solo mostrar overlay en estado navegación
  if (state !== 'navegacion') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
        transition: 'opacity 300ms ease-in-out',
      }}
    />
  );
}

