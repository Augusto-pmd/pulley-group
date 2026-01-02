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
        <div className="text-center text-body text-gray-text-tertiary">
          Cargando...
        </div>
      </Card>
    );
  }

  // Si no hay datos reales, mostrar estado vacío
  if (!state || (state.currentCapital === 0 && state.initialContribution === 0)) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-gray-text-tertiary">
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
    <Card padding="large">
      <div className="grid grid-cols-2 gap-12">
        {/* Fila 1: Capital Acumulado y Aporte Mensual */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            CAPITAL ACUMULADO
          </div>
          <CurrencyDisplay 
            value={state.currentCapital} 
            size="large" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            APORTE MENSUAL PROMEDIO
          </div>
          <CurrencyDisplay 
            value={state.monthlyContribution} 
            size="medium" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        {/* Fila 2: Aporte Inicial y Tiempo Transcurrido */}
        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            APORTE INICIAL
          </div>
          <CurrencyDisplay 
            value={state.initialContribution} 
            size="regular" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TIEMPO TRANSCURRIDO
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatTimeElapsed()}
          </div>
        </div>
      </div>
    </Card>
  );
}
