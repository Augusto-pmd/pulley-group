'use client';

import { useState, useMemo } from 'react';
import { mockProjections } from '@/mock/data';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import Card from './Card';
import { getPatrimonioNetoActivosUsd } from '@/mock/activos';
import type { Scenario, Horizon } from '@/mock/data';

export default function ProjectionsBar() {
  const [scenario, setScenario] = useState<Scenario>('base');
  const [horizon, setHorizon] = useState<Horizon>(10);
  const [showDetails, setShowDetails] = useState(false);

  const scenarios: Scenario[] = ['conservador', 'base', 'optimista'];
  const horizons: Horizon[] = [5, 10, 20];

  // Calcular patrimonio neto de activos (valor - pasivos, no se proyectan con rendimiento)
  // En producción, este valor debería venir de la API, no del mock
  const activos = useMemo(() => {
    try {
      return getPatrimonioNetoActivosUsd();
    } catch (error) {
      console.error('Error calculating activos:', error);
      return 0;
    }
  }, []);

  // Proyecciones - solo desde datos reales
  // Si no hay datos reales, mostrar cero
  const getProjectionValues = (scenario: Scenario, horizon: Horizon) => {
    // Sin backend de proyecciones real, retornar cero
    // Las proyecciones requieren datos reales de patrimonio, inversiones y supuestos configurados
    return {
      nominal: 0,
      real: 0,
    };
  };

  const values = useMemo(() => getProjectionValues(scenario, horizon), [scenario, horizon, activos]);
  const difference = values.nominal - values.real;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 z-[99]">
        <div 
          className="h-full flex items-center px-8 max-w-[1920px] mx-4 mt-2 rounded-capsule"
          style={{
            // Capa translúcida - plano base oscuro
            backgroundColor: 'rgba(31, 42, 51, 0.85)',
            backgroundImage: `
              linear-gradient(to bottom, 
                rgba(31, 42, 51, 0.9) 0%,
                rgba(31, 42, 51, 0.8) 100%
              )
            `,
            border: '1px solid rgba(181, 154, 106, 0.1)',
            backdropFilter: 'blur(12px)',
            boxShadow: `
              inset 0 0 10px rgba(0, 0, 0, 0.3),
              0 2px 8px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(181, 154, 106, 0.05)
            `,
          }}
        >
          {/* Selector de Escenario */}
          <div className="flex items-center h-full py-3 px-3">
            {scenarios.map((s, index) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => setScenario(s)}
                  className={`text-body transition-all duration-fast ${
                    scenario === s
                      ? 'text-text-primary font-semibold relative'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
                {index < scenarios.length - 1 && (
                  <span className="text-body text-gray-border px-2">|</span>
                )}
              </div>
            ))}
          </div>

          {/* Separador vertical */}
          <div className="h-8 w-px my-3" style={{ backgroundColor: 'rgba(142, 142, 138, 0.2)' }} />

          {/* Selector de Horizonte */}
          <div className="flex items-center h-full py-3 px-3">
            {horizons.map((h, index) => (
              <div key={h} className="flex items-center">
                <button
                  onClick={() => setHorizon(h)}
                  className={`text-body transition-all duration-fast ${
                    horizon === h
                      ? 'text-text-primary font-semibold relative'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {h} años
                </button>
                {index < horizons.length - 1 && (
                  <span className="text-body text-gray-border px-2">|</span>
                )}
              </div>
            ))}
          </div>

          {/* Separador vertical */}
          <div className="h-8 w-px my-3" style={{ backgroundColor: 'rgba(142, 142, 138, 0.2)' }} />

          {/* Valor Principal: Patrimonio Neto Total Proyectado */}
          <div 
            className="flex items-center gap-6 px-6 flex-1 cursor-pointer group min-w-0"
            onClick={() => setShowDetails(!showDetails)}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-1">
                Patrimonio neto total
              </div>
              <div className="flex items-baseline gap-2">
                <div className="flex-shrink-0">
                  <CurrencyDisplay 
                    value={values.nominal} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                    className="whitespace-nowrap"
                  />
                </div>
                <button
                  className="text-body-small text-text-secondary hover:text-text-primary transition-all duration-fast opacity-0 group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                >
                  {showDetails ? '▼' : '▶'}
                </button>
              </div>
              <div className="text-body-small text-text-secondary mt-1 opacity-70 line-clamp-1">
                Valor total estimado de tu patrimonio, sumando todas las posiciones y proyecciones.
              </div>
            </div>
          </div>

          {/* Espacio vacío */}
          <div className="w-4" />
        </div>
      </div>

      {/* Panel de Detalles (hover/click) */}
      {showDetails && (
        <div 
          className="fixed top-[56px] left-0 right-0 z-[98] px-4"
          onMouseEnter={() => setShowDetails(true)}
          onMouseLeave={() => setShowDetails(false)}
        >
          <div className="max-w-[1920px] mx-auto">
            <Card padding="normal" className="mt-2">
              <div className="grid grid-cols-4 gap-6">
                {/* USD Nominal */}
                <div>
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-2">
                    USD Nominal
                  </div>
                  <CurrencyDisplay 
                    value={values.nominal} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-text-secondary mt-1">
                    Sin ajuste por inflación
                  </div>
                </div>

                {/* USD Real */}
                <div>
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-2">
                    USD Real
                  </div>
                  <CurrencyDisplay 
                    value={values.real} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-text-secondary mt-1">
                    Ajustado por inflación (IPC)
                  </div>
                </div>

                {/* Diferencia */}
                <div>
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-2">
                    Diferencia
                  </div>
                  <CurrencyDisplay 
                    value={difference} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-text-secondary mt-1">
                    Erosión por inflación
                  </div>
                </div>

                {/* Supuestos */}
                <div>
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-2">
                    Supuestos
                  </div>
                  <div className="text-body text-text-primary mb-1">
                    Escenario: {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                  </div>
                  <div className="text-body text-text-primary mb-1">
                    Horizonte: {horizon} años
                  </div>
                  <div className="text-body-small text-text-secondary mt-1">
                    Basado en estado actual
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
