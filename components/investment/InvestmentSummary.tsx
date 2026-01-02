import Card from '../Card';
import { formatCurrency, formatPercentage } from '@/utils/number-format';
import type { Investment } from '@/mock/data';

interface InvestmentSummaryProps {
  investment: Investment;
}

export default function InvestmentSummary({ investment }: InvestmentSummaryProps) {
  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  // Calcular valor actual desde datos reales
  const currentValue = investment.capital + investment.result;
  
  // Si no hay capital real, mostrar estado vacío
  if (investment.capital === 0) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay eventos registrados para esta inversión. Registra aportes o retiros para ver el resumen.
        </div>
      </Card>
    );
  }
  
  const status = 'Activa';
  // Fecha de inicio debe venir de la API (startDate del investment)
  // Por ahora, mostrar mensaje hasta que haya backend real
  const startDate = 'No disponible';
  const horizon = 'No definido';

  return (
    <Card padding="large">
      {/* Grid 2x3 */}
      <div className="grid grid-cols-2 gap-12">
        {/* Fila 1 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            CAPITAL INVERTIDO
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(investment.capital)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VALOR ACTUAL
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(currentValue)}
          </div>
        </div>

        {/* Fila 2 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            RESULTADO
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatSignedValue(investment.result)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI NOMINAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiNominal)}
          </div>
        </div>

        {/* Fila 3 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI REAL
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiReal)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ESTADO
          </div>
          <div className="text-[18px] font-medium text-black leading-[1.2]">
            {status}
          </div>
        </div>
      </div>

      {/* Información de Contexto */}
      <div className="mt-8 text-body text-gray-text-tertiary space-y-1">
        <div>Fecha de inicio: {startDate}</div>
        <div>Tipo: {investment.type}</div>
        <div>Horizonte: {horizon}</div>
      </div>
    </Card>
  );
}

