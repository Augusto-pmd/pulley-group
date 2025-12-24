import Card from '../Card';
import { formatCurrency } from '@/mock/data';
import type { Investment } from '@/mock/data';

interface InvestmentProjectionProps {
  investment: Investment;
}

export default function InvestmentProjection({ investment }: InvestmentProjectionProps) {
  // Mock: proyecciones por escenario y horizonte
  const projections = {
    conservador: {
      5: { nominal: investment.capital * 1.3, real: investment.capital * 1.1 },
      10: { nominal: investment.capital * 1.6, real: investment.capital * 1.2 },
      20: { nominal: investment.capital * 2.2, real: investment.capital * 1.4 },
    },
    base: {
      5: { nominal: investment.capital * 1.5, real: investment.capital * 1.2 },
      10: { nominal: investment.capital * 2.0, real: investment.capital * 1.4 },
      20: { nominal: investment.capital * 3.0, real: investment.capital * 1.8 },
    },
    optimista: {
      5: { nominal: investment.capital * 1.8, real: investment.capital * 1.4 },
      10: { nominal: investment.capital * 2.5, real: investment.capital * 1.7 },
      20: { nominal: investment.capital * 4.0, real: investment.capital * 2.2 },
    },
  };

  const scenarios = ['conservador', 'base', 'optimista'] as const;
  const horizons = [5, 10, 20] as const;

  return (
    <Card>
      {/* Tabla de Proyecciones */}
      <div>
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[140px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            ESCENARIO
          </div>
          {horizons.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-body font-medium text-gray-text-tertiary uppercase tracking-wider"
            >
              {h} AÑOS
            </div>
          ))}
        </div>

        {/* Filas */}
        {scenarios.map((scenario) => (
          <div
            key={scenario}
            className="h-16 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="w-[140px] text-body-large font-medium text-black capitalize">
              {scenario}
            </div>
            {horizons.map((h) => {
              const proj = projections[scenario][h];
              return (
                <div key={h} className="flex-1 text-center">
                  <div className="text-[18px] font-semibold font-mono-numbers text-black">
                    {formatCurrency(proj.nominal)}
                  </div>
                  <div className="text-body-large font-normal font-mono-numbers text-gray-text-tertiary mt-1">
                    {formatCurrency(proj.real)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Supuestos */}
      <div className="mt-8">
        <h4 className="text-body-large font-medium text-black mb-4">Supuestos</h4>
        <ul className="text-body text-gray-text-tertiary space-y-2">
          <li>• Tasa de rendimiento esperada según escenario</li>
          <li>• IPC proyectado: 3% anual (base)</li>
          <li>• Sin aportes adicionales</li>
          <li>• Sin retiros</li>
        </ul>
      </div>
    </Card>
  );
}

