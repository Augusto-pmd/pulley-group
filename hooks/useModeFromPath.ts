'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMode } from '@/contexts/ModeContext';

export function useModeFromPath() {
  const pathname = usePathname();
  const { setMode, setDetailTarget } = useMode();

  useEffect(() => {
    // Determinar modo según ruta
    if (pathname === '/') {
      setMode('estado');
      setDetailTarget(undefined);
    } else if (pathname.startsWith('/vida-mensual')) {
      setMode('mes');
      setDetailTarget(undefined);
    } else if (pathname.startsWith('/emma')) {
      setMode('fondo');
      setDetailTarget(undefined);
    } else if (pathname.startsWith('/activos') || pathname.startsWith('/investments')) {
      setMode('detalle');
      if (pathname.startsWith('/activos')) {
        setDetailTarget('activos');
      } else if (pathname.startsWith('/investments')) {
        setDetailTarget('inversiones');
      }
    } else {
      // Para otras rutas, mantener modo detalle
      setMode('detalle');
      setDetailTarget(undefined);
    }
  }, [pathname, setMode, setDetailTarget]);
}

