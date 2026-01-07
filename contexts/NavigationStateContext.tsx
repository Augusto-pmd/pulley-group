'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationState = 'observacion' | 'navegacion' | 'contexto' | 'accion';

interface NavigationStateContextType {
  state: NavigationState;
  setState: (state: NavigationState) => void;
  // Helpers para transiciones
  enterObservacion: () => void;
  enterNavegacion: () => void;
  enterContexto: () => void;
  enterAccion: () => void;
}

const NavigationStateContext = createContext<NavigationStateContextType | undefined>(undefined);

export function NavigationStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>('observacion');

  const enterObservacion = () => {
    setState('observacion');
  };

  const enterNavegacion = () => {
    setState('navegacion');
  };

  const enterContexto = () => {
    setState('contexto');
  };

  const enterAccion = () => {
    setState('accion');
  };

  return (
    <NavigationStateContext.Provider
      value={{
        state,
        setState,
        enterObservacion,
        enterNavegacion,
        enterContexto,
        enterAccion,
      }}
    >
      {children}
    </NavigationStateContext.Provider>
  );
}

export function useNavigationState() {
  const context = useContext(NavigationStateContext);
  if (context === undefined) {
    throw new Error('useNavigationState must be used within a NavigationStateProvider');
  }
  return context;
}

