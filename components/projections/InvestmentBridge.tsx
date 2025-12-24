import Link from 'next/link';
import Card from '../Card';
import { mockInvestments } from '@/mock/data';

interface InvestmentBridgeProps {
  horizon: number;
}

export default function InvestmentBridge({ horizon }: InvestmentBridgeProps) {
  // Mock: tipos de inversión y su impacto relativo
  const investmentTypes = [
    { type: 'Fondos', impact: '45%' },
    { type: 'Bonos', impact: '25%' },
    { type: 'Acciones', impact: '20%' },
    { type: 'Inmuebles', impact: '10%' },
  ];

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">CONTRIBUCIÓN DE INVERSIONES</h3>
        <p className="text-body text-gray-text-tertiary">
          Cómo cada tipo de inversión aporta a la proyección
        </p>
      </div>

      {/* Principio General */}
      <div className="pt-6 mb-8">
        <p className="text-body-large text-black">
          Las proyecciones consideran el capital y rendimiento esperado de cada tipo de inversión en tu cartera.
        </p>
      </div>

      {/* Lista de Tipos de Inversión */}
      <div>
        {investmentTypes.map((item, index) => (
          <div
            key={index}
            className="h-12 flex items-center justify-between px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="flex-1 text-body-large font-medium text-black min-w-[200px]">
              {item.type}
            </div>
            <div className="w-[200px] text-right text-body-large font-normal font-mono-numbers text-gray-text-tertiary">
              {item.impact}
            </div>
          </div>
        ))}
      </div>

      {/* Nota de Navegación */}
      <div className="mt-6 text-right">
        <Link
          href="/investments"
          className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
        >
          Ver detalle de inversiones →
        </Link>
      </div>
    </Card>
  );
}

