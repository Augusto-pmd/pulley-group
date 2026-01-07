'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Mode = 'estado' | 'mes' | 'fondo' | 'detalle';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  detailTarget?: string; // Para modo detalle: 'activos' | 'inversiones' | etc.
  setDetailTarget: (target?: string) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('estado');
  const [detailTarget, setDetailTarget] = useState<string | undefined>();

  return (
    <ModeContext.Provider value={{ mode, setMode, detailTarget, setDetailTarget }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}

