import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import { getEmmaEvolutionWithTramos } from '@/mock/emma-tramos';

export default function EmmaEvolution() {
  const evolution = getEmmaEvolutionWithTramos();
  // Mostrar solo hitos: año 0, 18, 25, 30
  const milestones = [0, 18, 25, 30];
  const filteredEvolution = evolution.filter((item) => milestones.includes(item.year));

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
          Crecimiento año a año del fondo
        </p>
      </div>

      {/* Tabla de Evolución */}
      <div className="pt-6">
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[80px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            AÑO
          </div>
          <div className="w-[300px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            CAPITAL PROYECTADO (USD)
          </div>
          <div className="w-[140px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            VARIACIÓN
          </div>
        </div>

        {/* Filas */}
        {filteredEvolution.map((item, index) => {
          const isMilestone = [18, 25, 30].includes(item.year);
          return (
            <div
              key={item.year}
              className={`h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast ${
                index === 0 || isMilestone ? 'bg-gray-bg' : ''
              }`}
            >
              <div className={`w-[80px] text-body-large ${isMilestone ? 'font-semibold' : 'font-normal'} text-black`}>
                {item.year === 0 ? 'Año 0' : `${item.year} años`}
              </div>
              <div className="w-[300px] text-right">
                <CurrencyDisplay 
                  value={item.capital} 
                  size="regular" 
                  showSecondary={false}
                  originalCurrency="USD"
                />
              </div>
              <div className="w-[140px] text-right text-body-large font-normal font-mono-numbers text-gray-text-tertiary">
                {index > 0 ? formatSignedPercentage(item.variation) : '-'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota Conceptual */}
      <div className="mt-6 text-caption text-gray-text-disabled">
        Estos valores son proyecciones basadas en interés compuesto. La realidad puede variar según múltiples factores.
      </div>
    </Card>
  );
}

