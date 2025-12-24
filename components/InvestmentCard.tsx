import Link from 'next/link';
import Card from './Card';
import CurrencyDisplay, { CurrencyDisplaySigned } from './CurrencyDisplay';
import type { Investment } from '@/mock/data';

interface InvestmentCardProps {
  investment: Investment;
}

// Mock: calcular indicador visual basado en ROI
const getIndicator = (roi: number): string => {
  if (roi > 5) return '↑';
  if (roi < -2) return '↓';
  return '=';
};

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const indicator = getIndicator(investment.roiNominal);

  return (
    <Link href={`/investments/${investment.id}`} className="block">
      <Card className="hover:shadow-card-hover transition-shadow duration-fast cursor-pointer">
        <div className="grid grid-cols-2 gap-6">
          {/* Columna Izquierda: Nombre y Clasificación */}
          <div>
            {/* Nombre de Inversión - 20px, peso 600 */}
            <h3 className="text-[20px] font-semibold text-gray-text-primary mb-2">
              {investment.name}
            </h3>
            {/* Tipo y Estado - 13px, peso 400, gris */}
            <div className="text-body text-gray-text-tertiary">
              {investment.type} · Activa
            </div>
          </div>

          {/* Columna Derecha: Métricas y Rendimiento */}
          <div className="text-right">
            {/* Resultado Acumulado - 24px, peso 600 */}
            <div className="mb-2">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                RESULTADO
              </div>
              <CurrencyDisplaySigned 
                value={investment.result} 
                size="large" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>

            {/* Indicador Visual Simple - 20px */}
            <div className="text-[20px] font-normal text-gray-text-primary mb-2">
              {indicator}
            </div>

            {/* Capital Invertido - 15px, peso 400 */}
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                CAPITAL
              </div>
              <CurrencyDisplay 
                value={investment.capital} 
                size="medium" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

