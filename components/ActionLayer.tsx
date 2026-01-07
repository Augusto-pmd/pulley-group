'use client';

import { useNavigationState } from '@/contexts/NavigationStateContext';

/**
 * ActionLayer - Capa para modales y acciones
 * Solo visible en estado acción
 * Los modales se renderizan aquí cuando están activos
 */
export default function ActionLayer() {
  const { state } = useNavigationState();

  // Solo visible en acción
  if (state !== 'accion') {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Los modales se renderizan aquí cuando están activos */}
      {/* Se inyectan desde las páginas usando el contexto de navegación */}
    </div>
  );
}

