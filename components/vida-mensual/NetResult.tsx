'use client';

import Card from '@/components/Card';
import { formatCurrency } from '@/utils/number-format';

interface NetResultProps {
  netResult: number;
  totalIncome: number;
  totalExpenses: number;
}

export default function NetResult({ netResult, totalIncome, totalExpenses }: NetResultProps) {
  return (
    <Card padding="large">
      <div className="text-center">
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
          RESULTADO NETO DEL MES
        </div>
        <div
          className={`number-display mb-8 ${
            netResult >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {netResult >= 0 ? '+' : ''}
          {formatCurrency(netResult)}
        </div>

        <div className="flex items-center justify-center gap-8">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              INGRESOS
            </div>
            <div className="number-large text-gray-text-tertiary">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="text-heading-3 text-gray-border">—</div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              EGRESOS
            </div>
            <div className="number-large text-gray-text-tertiary">
              {formatCurrency(totalExpenses)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

