import Card from './Card';
import CurrencyDisplay from './CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import type { EmmaFund } from '@/mock/data';

interface EmmaFundProps {
  data: EmmaFund;
}

export default function EmmaFund({ data }: EmmaFundProps) {
  return (
    <Card>
      {/* Header */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black">FONDO EMMA</h3>
        <p className="text-body text-gray-text-tertiary mt-1">Objetivo a 18/25 años</p>
      </div>

      {/* Contenido */}
      <div className="pt-6">
        {/* 1. Capital Actual - Dato Principal */}
        <div className="mb-6">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
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
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider">
              PROGRESO
            </div>
            <div className="text-body text-gray-text-tertiary">
              {formatPercentage(data.progress)}
            </div>
          </div>
          <div className="h-1 w-full bg-gray-divider">
            <div
              className="h-full bg-gray-border"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>

        {/* 3. Proyección - Secundario */}
        <div className="mb-6">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
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
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
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

