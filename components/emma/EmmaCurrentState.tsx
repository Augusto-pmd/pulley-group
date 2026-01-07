'use client';

import { useState, useEffect } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { getEmmaState, type EmmaState } from '@/lib/api';

export default function EmmaCurrentState() {
  const [state, setState] = useState<EmmaState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      try {
        setLoading(true);
        const emmaState = await getEmmaState();
        setState(emmaState);
      } catch (error) {
        console.error('Error loading Emma state:', error);
        setState(null);
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, []);

  if (loading) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-text-secondary">
          Cargando...
        </div>
      </Card>
    );
  }

  // Si no hay datos reales, mostrar estado vacío
  if (!state || (state.currentCapital === 0 && state.initialContribution === 0)) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-text-secondary">
          No hay datos del Fondo Emma disponibles
        </div>
      </Card>
    );
  }

  const formatTimeElapsed = () => {
    const { elapsedYears, elapsedMonths } = state;
    if (elapsedYears === 0) {
      return `${elapsedMonths} meses`;
    }
    if (elapsedMonths === 0) {
      return `${elapsedYears} años`;
    }
    return `${elapsedYears} años ${elapsedMonths} meses`;
  };

  return (
    <div className="relative">
      {/* CENTRO ABSOLUTO: Capital acumulado como núcleo del anillo */}
      <div className="flex flex-col items-center justify-center">
        {/* Núcleo: Capital acumulado */}
        <div className="mb-8">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
            CAPITAL ACUMULADO
          </div>
          <div className="text-center">
            <CurrencyDisplay 
              value={state.currentCapital} 
              size="display" 
              showSecondary={false}
              originalCurrency="USD"
            />
          </div>
        </div>

        {/* Primera órbita: Aporte mensual y tiempo - Simétricos alrededor del centro */}
        <div className="flex items-center justify-center gap-20" style={{ opacity: 0.6 }}>
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              APORTE MENSUAL
            </div>
            <CurrencyDisplay 
              value={state.monthlyContribution} 
              size="regular" 
              showSecondary={false}
              originalCurrency="USD"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              TIEMPO TRANSCURRIDO
            </div>
            <div className="text-heading-3 font-medium text-text-primary">
              {formatTimeElapsed()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
