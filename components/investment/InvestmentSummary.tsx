import Card from '../Card';
import { formatCurrency, formatPercentage } from '@/mock/data';
import type { Investment } from '@/mock/data';

interface InvestmentSummaryProps {
  investment: Investment;
}

export default function InvestmentSummary({ investment }: InvestmentSummaryProps) {
  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  // Mock: calcular valor actual
  const currentValue = investment.capital + investment.result;
  const status = 'Activa';
  const startDate = '15/03/2022';
  const horizon = 'Mediano';

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

