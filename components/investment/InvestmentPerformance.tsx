import Card from '../Card';
import { formatPercentage } from '@/mock/data';
import type { Investment } from '@/mock/data';

interface InvestmentPerformanceProps {
  investment: Investment;
}

export default function InvestmentPerformance({ investment }: InvestmentPerformanceProps) {
  // Mock: métricas de rendimiento
  const annualizedNominal = investment.roiNominal * 0.8; // Mock
  const annualizedReal = investment.roiReal * 0.8; // Mock
  const monthlyVariation = 2.5; // Mock
  const annualVariation = investment.roiNominal; // Mock
  const bestMonth = { date: '03/2023', roi: 5.2 };
  const worstMonth = { date: '09/2022', roi: -1.8 };

  return (
    <Card>
      {/* Métricas Principales - Grid 2x3 */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        {/* Fila 1 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ACUMULADO NOM
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiNominal)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ACUMULADO REAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiReal)}
          </div>
        </div>

        {/* Fila 2 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ANUALIZADO NOM
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualizedNominal)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ANUALIZADO REAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualizedReal)}
          </div>
        </div>

        {/* Fila 3 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VARIACIÓN MENSUAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(monthlyVariation)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VARIACIÓN ANUAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualVariation)}
          </div>
        </div>
      </div>

      {/* Mejor y Peor Mes */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-body text-gray-text-tertiary mb-1">Mejor mes</div>
          <div className="text-body text-gray-text-tertiary">
            {bestMonth.date}: {formatPercentage(bestMonth.roi)}
          </div>
        </div>
        <div>
          <div className="text-body text-gray-text-tertiary mb-1">Peor mes</div>
          <div className="text-body text-gray-text-tertiary">
            {worstMonth.date}: {formatPercentage(worstMonth.roi)}
          </div>
        </div>
      </div>
    </Card>
  );
}

