import Card from '../Card';
import { formatCurrency } from '@/utils/number-format';
import type { Investment } from '@/mock/data';

interface InvestmentProjectionProps {
  investment: Investment;
}

export default function InvestmentProjection({ investment }: InvestmentProjectionProps) {
  // Si no hay capital real, mostrar estado vacío
  if (investment.capital === 0) {
    return (
      <Card>
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay capital real para proyectar. Registra aportes para generar proyecciones.
        </div>
      </Card>
    );
  }
  
  // Proyecciones - solo desde datos reales y supuestos configurados
  // Sin backend de proyecciones real, mostrar vacío
  const projections = {
    conservador: {
      5: { nominal: 0, real: 0 },
      10: { nominal: 0, real: 0 },
      20: { nominal: 0, real: 0 },
    },
    base: {
      5: { nominal: 0, real: 0 },
      10: { nominal: 0, real: 0 },
      20: { nominal: 0, real: 0 },
    },
    optimista: {
      5: { nominal: 0, real: 0 },
      10: { nominal: 0, real: 0 },
      20: { nominal: 0, real: 0 },
    },
  };

  const scenarios = ['conservador', 'base', 'optimista'] as const;
  const horizons = [5, 10, 20] as const;
  
  // Si todas las proyecciones son 0, mostrar mensaje
  const hasAnyProjection = Object.values(projections).some(scenario =>
    Object.values(scenario).some(h => h.nominal > 0 || h.real > 0)
  );
  
  if (!hasAnyProjection) {
    return (
      <Card>
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay proyecciones disponibles. Configure los supuestos en Settings para generar proyecciones.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Tabla de Proyecciones */}
      <div>
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[140px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            ESCENARIO
          </div>
          {horizons.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-body font-medium text-gray-text-tertiary uppercase tracking-wider"
            >
              {h} AÑOS
            </div>
          ))}
        </div>

        {/* Filas */}
        {scenarios.map((scenario) => (
          <div
            key={scenario}
            className="h-16 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="w-[140px] text-body-large font-medium text-black capitalize">
              {scenario}
            </div>
            {horizons.map((h) => {
              const proj = projections[scenario][h];
              return (
                <div key={h} className="flex-1 text-center">
                  <div className="text-[18px] font-semibold font-mono-numbers text-black">
                    {formatCurrency(proj.nominal)}
                  </div>
                  <div className="text-body-large font-normal font-mono-numbers text-gray-text-tertiary mt-1">
                    {formatCurrency(proj.real)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Supuestos - Solo mostrar si hay proyecciones reales */}
      {hasAnyProjection && (
        <div className="mt-8">
          <h4 className="text-body-large font-medium text-black mb-4">Supuestos</h4>
          <div className="text-body text-gray-text-tertiary">
            Los supuestos se configuran en Settings. Sin supuestos configurados, no se pueden generar proyecciones.
          </div>
        </div>
      )}
    </Card>
  );
}

