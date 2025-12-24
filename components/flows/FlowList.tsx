import Link from 'next/link';
import Card from '../Card';
import { formatCurrency } from '@/mock/data';
import type { Flow } from '@/mock/data';

interface FlowListProps {
  title: string;
  flows: Flow[];
  showInvestment?: boolean;
}

export default function FlowList({ title, flows, showInvestment = false }: FlowListProps) {
  const total = flows.reduce((sum, f) => sum + f.amount, 0);

  return (
    <Card>
      {/* Header de Sección */}
      <div className="pb-6 border-b border-gray-divider flex items-center justify-between">
        <h3 className="text-heading-3 font-semibold text-black">{title}</h3>
        <div className="text-[24px] font-semibold font-mono-numbers text-black">
          {formatCurrency(total)}
        </div>
      </div>

      {/* Lista de Flujos */}
      <div>
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            {/* Fecha - 100px */}
            <div className="w-[100px] text-body text-gray-text-tertiary">
              {flow.date}
            </div>

            {/* Descripción - flexible */}
            <div className="flex-1 text-body-large text-black min-w-[200px]">
              {flow.description}
            </div>

            {/* Inversión Asociada - 180px (opcional) */}
            {showInvestment && (
              <div className="w-[180px]">
                {flow.investmentId && flow.investmentName ? (
                  <Link
                    href={`/investments/${flow.investmentId}`}
                    className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
                  >
                    {flow.investmentName}
                  </Link>
                ) : (
                  <span className="text-body text-gray-text-tertiary">-</span>
                )}
              </div>
            )}

            {/* Monto - 140px */}
            <div className="w-[140px] text-right text-body-large font-semibold font-mono-numbers text-black">
              {formatCurrency(flow.amount)}
            </div>
          </div>
        ))}

        {/* Total de Sección */}
        {flows.length > 0 && (
          <div className="h-12 flex items-center justify-between px-4 border-t border-gray-divider">
            <div className="text-body font-medium text-gray-text-tertiary">Total</div>
            <div className="text-[18px] font-semibold font-mono-numbers text-black">
              {formatCurrency(total)}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

