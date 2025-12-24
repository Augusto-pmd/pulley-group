import Card from '../Card';
import { formatCurrency } from '@/mock/data';
import type { Flow } from '@/mock/data';

interface FlowSummaryProps {
  flows: Flow[];
}

export default function FlowSummary({ flows }: FlowSummaryProps) {
  const totals = {
    ingresos: flows.filter(f => f.type === 'ingreso').reduce((sum, f) => sum + f.amount, 0),
    gastos: flows.filter(f => f.type === 'gasto').reduce((sum, f) => sum + f.amount, 0),
    aportes: flows.filter(f => f.type === 'aporte').reduce((sum, f) => sum + f.amount, 0),
    retiros: flows.filter(f => f.type === 'retiro').reduce((sum, f) => sum + f.amount, 0),
  };

  const netResult = totals.ingresos - totals.gastos - totals.aportes + totals.retiros;

  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  return (
    <Card padding="large">
      <div className="grid grid-cols-2 gap-12">
        {/* Fila 1: Resultado Neto */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            RESULTADO NETO
          </div>
          <div className="text-[36px] font-semibold font-mono-numbers text-black leading-[1.1]">
            {formatSignedValue(netResult)}
          </div>
        </div>
        <div></div>

        {/* Fila 2: Ingresos y Gastos */}
        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            INGRESOS TOTALES
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(totals.ingresos)}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            GASTOS TOTALES
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(totals.gastos)}
          </div>
        </div>

        {/* Fila 3: Aportes y Retiros */}
        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            APORTES
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(totals.aportes)}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            RETIROS
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatCurrency(totals.retiros)}
          </div>
        </div>
      </div>
    </Card>
  );
}

