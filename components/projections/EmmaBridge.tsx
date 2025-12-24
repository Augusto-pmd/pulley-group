import Link from 'next/link';
import Card from '../Card';
import { formatCurrency, formatPercentage } from '@/mock/data';
import { mockEmmaFund } from '@/mock/data';
import type { Horizon } from '@/mock/data';

interface EmmaBridgeProps {
  horizon: Horizon;
}

export default function EmmaBridge({ horizon }: EmmaBridgeProps) {
  // Mock: calcular contribución y proyección según horizonte
  const getEmmaProjection = (h: Horizon) => {
    if (h === 5) return mockEmmaFund.projection18 * 0.3;
    if (h === 10) return mockEmmaFund.projection18 * 0.6;
    return mockEmmaFund.projection25;
  };

  const contribution = getEmmaProjection(horizon);
  const projection = getEmmaProjection(horizon);

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">FONDO EMMA</h3>
        <p className="text-body text-gray-text-tertiary">
          Contribución a las proyecciones de largo plazo
        </p>
      </div>

      {/* Grid 2x2 */}
      <div className="pt-6 grid grid-cols-2 gap-12">
        {/* Elemento 1: Progreso Actual */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            PROGRESO ACTUAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(mockEmmaFund.progress)}
          </div>
        </div>

        {/* Elemento 2: Objetivo */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            OBJETIVO
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(mockEmmaFund.projection25)}
          </div>
        </div>

        {/* Elemento 3: Contribución a Proyección */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            CONTRIBUCIÓN
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black leading-[1.2] mb-1">
            {formatCurrency(contribution)}
          </div>
          <div className="text-body text-gray-text-tertiary">
            A las proyecciones de {horizon} años
          </div>
        </div>

        {/* Elemento 4: Proyección Emma */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            PROYECCIÓN EMMA
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black leading-[1.2] mb-1">
            {formatCurrency(projection)}
          </div>
          <div className="text-body text-gray-text-tertiary">
            Valor esperado a {horizon} años
          </div>
        </div>
      </div>

      {/* Link a Detalle */}
      <div className="mt-8 text-right">
        <Link
          href="/emma"
          className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
        >
          Ver detalle de Fondo Emma →
        </Link>
      </div>
    </Card>
  );
}

