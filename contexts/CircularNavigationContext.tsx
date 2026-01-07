'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DomainContent {
  domainId: string;
  content: ReactNode;
}

interface CircularNavigationContextType {
  activeDomain: string | null;
  domainContent: Map<string, ReactNode>;
  setDomainContent: (domainId: string, content: ReactNode) => void;
  clearDomainContent: (domainId: string) => void;
  setActiveDomain: (domainId: string | null) => void;
}

const CircularNavigationContext = createContext<CircularNavigationContextType | undefined>(undefined);

export function CircularNavigationProvider({ children }: { children: ReactNode }) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [domainContent, setDomainContentState] = useState<Map<string, ReactNode>>(new Map());

  const setDomainContent = (domainId: string, content: ReactNode) => {
    setDomainContentState((prev) => {
      const newMap = new Map(prev);
      newMap.set(domainId, content);
      return newMap;
    });
  };

  const clearDomainContent = (domainId: string) => {
    setDomainContentState((prev) => {
      const newMap = new Map(prev);
      newMap.delete(domainId);
      return newMap;
    });
  };

  return (
    <CircularNavigationContext.Provider
      value={{
        activeDomain,
        domainContent,
        setDomainContent,
        clearDomainContent,
        setActiveDomain,
      }}
    >
      {children}
    </CircularNavigationContext.Provider>
  );
}

export function useCircularNavigation() {
  const context = useContext(CircularNavigationContext);
  if (context === undefined) {
    throw new Error('useCircularNavigation must be used within a CircularNavigationProvider');
  }
  return context;
}

