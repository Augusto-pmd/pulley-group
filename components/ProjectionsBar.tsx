'use client';

import { useState, useMemo } from 'react';
import { mockProjections } from '@/mock/data';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import Card from './Card';
import { getPatrimonioNetoActivosUsd } from '@/mock/activos';
import type { Scenario, Horizon } from '@/mock/data';

export default function ProjectionsBar() {
  const [scenario, setScenario] = useState<Scenario>(mockProjections.scenario);
  const [horizon, setHorizon] = useState<Horizon>(mockProjections.horizon);
  const [showDetails, setShowDetails] = useState(false);

  const scenarios: Scenario[] = ['conservador', 'base', 'optimista'];
  const horizons: Horizon[] = [5, 10, 20];

  // Calcular patrimonio neto de activos (valor - pasivos, no se proyectan con rendimiento)
  const activos = useMemo(() => getPatrimonioNetoActivosUsd(), []);

  // Mock: valores según escenario y horizonte
  // Los activos se suman al patrimonio base pero no se proyectan con rendimiento
  const getProjectionValues = (scenario: Scenario, horizon: Horizon) => {
    // Base de inversiones (mockProjections ya incluye solo inversiones, no activos)
    const baseInversiones = mockProjections.nominal;
    const baseInversionesReal = mockProjections.real;
    
    // Ajustes simples según escenario
    const multiplier = scenario === 'conservador' ? 0.85 : scenario === 'optimista' ? 1.15 : 1.0;
    const horizonMultiplier = horizon === 5 ? 0.6 : horizon === 20 ? 1.4 : 1.0;
    
    // Proyectar inversiones (con rendimiento)
    const inversionesProyectadas = baseInversiones * multiplier * horizonMultiplier;
    const inversionesProyectadasReal = baseInversionesReal * multiplier * horizonMultiplier;
    
    // Los activos se mantienen en su valor actual (no crecen, no se proyectan)
    return {
      nominal: Math.round(inversionesProyectadas + activos),
      real: Math.round(inversionesProyectadasReal + activos),
    };
  };

  const values = useMemo(() => getProjectionValues(scenario, horizon), [scenario, horizon, activos]);
  const difference = values.nominal - values.real;

  return (
    <>
      <div className="fixed top-16 left-0 right-0 h-14 z-[99]">
        <div 
          className="h-full flex items-center px-8 max-w-[1920px] mx-4 mt-2 rounded-capsule backdrop-blur-bar border border-white/30"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(252, 253, 255, 0.55) 100%)',
            boxShadow: `
              0px 8px 40px rgba(0, 0, 0, 0.03),
              0px 2px 12px rgba(0, 0, 0, 0.015),
              0px 0px 0px 1px rgba(255, 255, 255, 0.3),
              0px 0px 0px 0.5px rgba(100, 150, 200, 0.07),
              inset 0px 1px 0px rgba(255, 255, 255, 0.5),
              inset 0px -1px 0px rgba(255, 255, 255, 0.3)
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
                      ? 'text-gray-text-primary font-semibold relative'
                      : 'text-gray-text-tertiary hover:text-gray-text-primary'
                  }`}
                  style={scenario === s ? {
                    textShadow: '0px 0px 6px rgba(100, 150, 200, 0.12)',
                  } : {}}
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
          <div className="h-8 w-px bg-gray-divider my-3" />

          {/* Selector de Horizonte */}
          <div className="flex items-center h-full py-3 px-3">
            {horizons.map((h, index) => (
              <div key={h} className="flex items-center">
                <button
                  onClick={() => setHorizon(h)}
                  className={`text-body transition-all duration-fast ${
                    horizon === h
                      ? 'text-gray-text-primary font-semibold relative'
                      : 'text-gray-text-tertiary hover:text-gray-text-primary'
                  }`}
                  style={horizon === h ? {
                    textShadow: '0px 0px 6px rgba(100, 150, 200, 0.12)',
                  } : {}}
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
          <div className="h-8 w-px bg-gray-divider my-3" />

          {/* Valor Principal: Patrimonio Neto Total Proyectado */}
          <div 
            className="flex items-center gap-6 px-6 flex-1 cursor-pointer group min-w-0"
            onClick={() => setShowDetails(!showDetails)}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
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
                  className="text-body-small text-gray-text-disabled hover:text-gray-text-tertiary transition-all duration-fast opacity-0 group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                >
                  {showDetails ? '▼' : '▶'}
                </button>
              </div>
              <div className="text-body-small text-gray-text-tertiary mt-1 opacity-70 line-clamp-1">
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
          className="fixed top-[72px] left-0 right-0 z-[98] px-4"
          onMouseEnter={() => setShowDetails(true)}
          onMouseLeave={() => setShowDetails(false)}
        >
          <div className="max-w-[1920px] mx-auto">
            <Card padding="normal" className="mt-2">
              <div className="grid grid-cols-4 gap-6">
                {/* USD Nominal */}
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    USD Nominal
                  </div>
                  <CurrencyDisplay 
                    value={values.nominal} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Sin ajuste por inflación
                  </div>
                </div>

                {/* USD Real */}
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    USD Real
                  </div>
                  <CurrencyDisplay 
                    value={values.real} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Ajustado por inflación (IPC)
                  </div>
                </div>

                {/* Diferencia */}
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    Diferencia
                  </div>
                  <CurrencyDisplay 
                    value={difference} 
                    size="regular" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Erosión por inflación
                  </div>
                </div>

                {/* Supuestos */}
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    Supuestos
                  </div>
                  <div className="text-body text-gray-text-primary mb-1">
                    Escenario: {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                  </div>
                  <div className="text-body text-gray-text-primary mb-1">
                    Horizonte: {horizon} años
                  </div>
                  <div className="text-body-small text-gray-text-tertiary mt-1">
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
