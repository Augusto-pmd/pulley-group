import Link from 'next/link';
import Card from '../Card';
import { mockInvestments } from '@/mock/data';

interface InvestmentBridgeProps {
  horizon: number;
}

export default function InvestmentBridge({ horizon }: InvestmentBridgeProps) {
  // Tipos de inversión y su impacto - solo desde datos reales
  // Si no hay inversiones reales, mostrar estado vacío
  if (!mockInvestments || mockInvestments.length === 0) {
    return (
      <Card padding="large">
        <div className="pb-6 border-b border-gray-divider mb-0">
          <h3 className="text-heading-3 font-semibold text-black mb-1">CONTRIBUCIÓN DE INVERSIONES</h3>
          <p className="text-body text-gray-text-tertiary">
            Cómo cada tipo de inversión aporta a la proyección
          </p>
        </div>
        <div className="pt-6 text-center text-body text-gray-text-tertiary">
          No hay inversiones registradas. Crea inversiones para ver su contribución a las proyecciones.
        </div>
      </Card>
    );
  }
  
  // Calcular tipos de inversión desde datos reales (requiere backend real)
  // Por ahora, mostrar vacío hasta que haya backend de análisis
  const investmentTypes: Array<{ type: string; impact: string }> = [];

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
      {investmentTypes.length > 0 ? (
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
      ) : (
        <div className="pt-6 text-center text-body text-gray-text-tertiary">
          No hay datos suficientes para calcular la contribución por tipo de inversión.
        </div>
      )}

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

