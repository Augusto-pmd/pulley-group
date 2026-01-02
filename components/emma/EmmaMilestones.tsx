import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/utils/number-format';
import { mockEmmaMilestones } from '@/mock/data';

export default function EmmaMilestones() {
  // Si no hay datos reales, mostrar estado vacío
  if (!mockEmmaMilestones || mockEmmaMilestones.length === 0) {
    return (
      <Card padding="large">
        <div className="pb-6 border-b border-gray-divider mb-0">
          <h3 className="text-heading-3 font-semibold text-black mb-1">PROYECCIÓN POR HITOS</h3>
          <p className="text-body text-gray-text-tertiary">
            Capital proyectado según interés compuesto
          </p>
        </div>
        <div className="pt-6 text-center text-body text-gray-text-tertiary">
          No hay datos de proyección disponibles
        </div>
      </Card>
    );
  }

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">PROYECCIÓN POR HITOS</h3>
        <p className="text-body text-gray-text-tertiary">
          Capital proyectado según interés compuesto
        </p>
      </div>

      {/* Grid 3 Columnas */}
      <div className="pt-6 grid grid-cols-3 gap-12">
        {mockEmmaMilestones.map((milestone) => (
          <div key={milestone.years} className="text-center">
            {/* Header de Hito */}
            <div className="text-body-large font-semibold text-black mb-4">
              {milestone.years} AÑOS
            </div>

            {/* Capital Proyectado */}
            <div className="mb-6">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                CAPITAL PROYECTADO
              </div>
              <CurrencyDisplay 
                value={milestone.capital} 
                size="large" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>

            {/* Porcentaje del Objetivo */}
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                PROGRESO
              </div>
              <div className="text-[18px] font-semibold font-mono-numbers text-black leading-[1.2]">
                {formatPercentage(milestone.progress)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

