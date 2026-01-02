import Card from '../Card';
import { formatCurrency, formatPercentage } from '@/utils/number-format';
import type { Scenario, Horizon } from '@/mock/data';
import { getTemporalEvolution } from '@/mock/data';

interface TemporalEvolutionProps {
  scenario: Scenario;
  horizon: Horizon;
}

export default function TemporalEvolution({ scenario, horizon }: TemporalEvolutionProps) {
  const evolution = getTemporalEvolution(scenario, horizon);
  const scenarioLabel = scenario.charAt(0).toUpperCase() + scenario.slice(1);
  
  // Si no hay datos reales, mostrar estado vacío
  if (!evolution || evolution.length === 0) {
    return (
      <Card padding="large">
        <div className="pb-6 border-b border-gray-divider mb-0">
          <h3 className="text-heading-3 font-semibold text-black mb-1">EVOLUCIÓN TEMPORAL</h3>
          <p className="text-body text-gray-text-tertiary">
            Escenario {scenarioLabel} - Horizonte {horizon} años
          </p>
        </div>
        <div className="pt-6 text-center text-body text-gray-text-tertiary">
          No hay datos suficientes para generar proyecciones temporales. Configure los supuestos en Settings.
        </div>
      </Card>
    );
  }

  const formatSignedPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatPercentage(value)}`;
  };

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">EVOLUCIÓN TEMPORAL</h3>
        <p className="text-body text-gray-text-tertiary">
          Escenario {scenarioLabel} - Horizonte {horizon} años
        </p>
      </div>

      {/* Tabla de Evolución */}
      <div className="pt-6">
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[80px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            AÑO
          </div>
          <div className="w-[200px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            CAPITAL NOMINAL
          </div>
          <div className="w-[200px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            CAPITAL REAL
          </div>
          <div className="w-[140px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            VARIACIÓN
          </div>
        </div>

        {/* Filas */}
        {evolution.map((item, index) => (
          <div
            key={item.year}
            className={`h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast ${
              index === 0 ? 'bg-gray-bg' : ''
            }`}
          >
            <div className="w-[80px] text-body-large text-black">
              Año {item.year}
            </div>
            <div className="w-[200px] text-right text-body-large font-semibold font-mono-numbers text-black">
              {formatCurrency(item.nominal)}
            </div>
            <div className="w-[200px] text-right text-body-large font-normal font-mono-numbers text-gray-text-tertiary">
              {formatCurrency(item.real)}
            </div>
            <div className="w-[140px] text-right text-body-large font-normal font-mono-numbers text-gray-text-tertiary">
              {index > 0 ? formatSignedPercentage(item.variation) : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Nota Conceptual */}
      <div className="mt-6 text-caption text-gray-text-disabled">
        Estos valores son proyecciones basadas en supuestos. La realidad puede variar según múltiples factores.
      </div>
    </Card>
  );
}

