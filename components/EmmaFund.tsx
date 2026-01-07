import Card from './Card';
import CurrencyDisplay from './CurrencyDisplay';
import { formatPercentage } from '@/utils/number-format';
import type { EmmaFund } from '@/mock/data';

interface EmmaFundProps {
  data: EmmaFund;
}

export default function EmmaFund({ data }: EmmaFundProps) {
  // Si no hay datos reales, mostrar estado vacío
  if (data.currentCapital === 0 && data.monthlyContribution === 0) {
    return (
      <Card>
        <div className="pb-6 border-b mb-0" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
          <h3 className="text-heading-3 font-semibold text-text-primary">FONDO EMMA</h3>
          <p className="text-body text-text-secondary mt-1">Objetivo a 18/25 años</p>
        </div>
        <div className="pt-6 text-center text-body text-text-secondary">
          No hay datos del Fondo Emma disponibles
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header */}
      <div className="pb-6 border-b mb-0" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
        <h3 className="text-heading-3 font-semibold text-text-primary">FONDO EMMA</h3>
        <p className="text-body text-text-secondary mt-1">Objetivo a 18/25 años</p>
      </div>

      {/* Contenido */}
      <div className="pt-6">
        {/* 1. Capital Actual - Dato Principal */}
        <div className="mb-6">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-1.5">
            CAPITAL ACTUAL
          </div>
          <CurrencyDisplay 
            value={data.currentCapital} 
            size="display" 
            showSecondary={false}
          />
        </div>

        {/* 2. % de Progreso - Barra gris */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-caption text-text-secondary uppercase tracking-wider">
              PROGRESO
            </div>
            <div className="text-body text-text-secondary">
              {formatPercentage(data.progress)}
            </div>
          </div>
          <div className="h-1 w-full" style={{ backgroundColor: 'rgba(142, 142, 138, 0.2)' }}>
            <div
              className="h-full"
              style={{ 
                width: `${data.progress}%`,
                backgroundColor: '#1F2A33',
              }}
            />
          </div>
        </div>

        {/* 3. Proyección - Secundario */}
        <div className="mb-6">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-1.5">
            PROYECCIÓN
          </div>
          <CurrencyDisplay 
            value={data.projection25} 
            size="medium" 
            showSecondary={false}
          />
        </div>

        {/* 4. Aporte Mensual - Secundario */}
        <div>
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-1.5">
            APORTE MENSUAL
          </div>
          <CurrencyDisplay 
            value={data.monthlyContribution} 
            size="medium" 
            showSecondary={false}
          />
        </div>
      </div>
    </Card>
  );
}

