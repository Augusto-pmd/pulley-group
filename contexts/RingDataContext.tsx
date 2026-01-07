'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RingData {
  patrimonioTotal?: number;
  mesResultado?: number;
  emmaCapital?: number;
}

interface RingDataContextType {
  ringData: RingData;
  setRingData: (data: RingData) => void;
}

const RingDataContext = createContext<RingDataContextType | undefined>(undefined);

export function RingDataProvider({ children }: { children: ReactNode }) {
  const [ringData, setRingData] = useState<RingData>({});

  return (
    <RingDataContext.Provider value={{ ringData, setRingData }}>
      {children}
    </RingDataContext.Provider>
  );
}

export function useRingData() {
  const context = useContext(RingDataContext);
  if (!context) {
    throw new Error('useRingData must be used within RingDataProvider');
  }
  return context;
}

