import Card from '../Card';
import { formatCurrency, formatPercentage } from '@/mock/data';
import type { Scenario, Horizon } from '@/mock/data';
import { mockScenarioProjections } from '@/mock/data';

interface ScenarioComparisonProps {
  horizon: Horizon;
}

export default function ScenarioComparison({ horizon }: ScenarioComparisonProps) {
  const scenarios: Scenario[] = ['conservador', 'base', 'optimista'];
  const baseProjection = mockScenarioProjections.base[horizon];

  const formatSignedPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatPercentage(value)}`;
  };

  return (
    <Card padding="large">
      <div className="grid grid-cols-3 gap-12">
        {scenarios.map((scenario) => {
          const projection = mockScenarioProjections[scenario][horizon];
          const difference = scenario !== 'base' 
            ? ((projection.nominal - baseProjection.nominal) / baseProjection.nominal) * 100
            : 0;

          return (
            <div key={scenario} className="text-center">
              {/* Header de Escenario */}
              <div className="text-body font-medium text-gray-text-tertiary uppercase tracking-wider mb-4">
                {scenario.toUpperCase()}
              </div>

              {/* Valor Proyectado Nominal */}
              <div className="mb-4">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  PROYECCIÓN NOMINAL
                </div>
                <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
                  {formatCurrency(projection.nominal)}
                </div>
              </div>

              {/* Valor Proyectado Real */}
              <div className="mb-6">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  PROYECCIÓN REAL
                </div>
                <div className="text-[20px] font-semibold font-mono-numbers text-black leading-[1.2]">
                  {formatCurrency(projection.real)}
                </div>
              </div>

              {/* Diferencia con Base (solo en Conservador y Optimista) */}
              {scenario !== 'base' && (
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    DIFERENCIA CON BASE
                  </div>
                  <div className="text-body-large font-normal font-mono-numbers text-gray-text-tertiary">
                    {formatSignedPercentage(difference)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

