'use client';

import { ReactNode } from 'react';
import { useNavigationState } from '@/contexts/NavigationStateContext';
import CenterCore from './CenterCore';
import ContextSurface from './ContextSurface';
import ActionLayer from './ActionLayer';
import RadialNavigator from './RadialNavigator';
import RingSymbol from './RingSymbol';
import ViewportOverlay from './ViewportOverlay';

interface ShellProps {
  children: ReactNode;
}

/**
 * Shell - Contenedor único del sistema
 * Maneja todos los estados y capas de la interfaz
 */
export default function Shell({ children }: ShellProps) {
  const { state } = useNavigationState();

  return (
    <div
      className="relative"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Fondo */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1F2A33' }} />

      {/* Overlay solo en navegación */}
      <ViewportOverlay />

      {/* Núcleo central - siempre presente pero cambia según estado */}
      <CenterCore />

      {/* Navegador radial - solo en estado navegación */}
      {state === 'navegacion' && <RadialNavigator />}

      {/* Símbolo de anillo en módulos - solo en estado contexto */}
      {state === 'contexto' && <RingSymbol />}

      {/* Superficie de contexto - contenido de módulos */}
      <ContextSurface>
        {children}
      </ContextSurface>

      {/* Capa de acción - modales */}
      <ActionLayer />

      {/* Command Palette siempre disponible */}
      {/* Se renderiza desde layout */}
    </div>
  );
}

