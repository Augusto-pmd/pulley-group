'use client';

import Card from '@/components/Card';
import { formatCurrency } from '@/mock/data';
import type { MonthlySummary } from '@/mock/data';

interface MonthlySummaryProps {
  summary: MonthlySummary;
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  return (
    <Card padding="large">
      <div className="grid grid-cols-2 gap-8">
        {/* Resultado Neto */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            RESULTADO NETO
          </div>
          <div
            className={`number-display ${
              summary.netResult >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {summary.netResult >= 0 ? '+' : ''}
            {formatCurrency(summary.netResult)}
          </div>
        </div>

        {/* Promedio Mensual */}
        <div className="text-right">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            PROMEDIO MENSUAL
          </div>
          <div className="number-large text-gray-text-tertiary">
            {formatCurrency(summary.averageMonthly)}
          </div>
        </div>

        {/* Gasto Mínimo */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            GASTO MÍNIMO
          </div>
          <div className="number-large text-gray-text-primary">
            {formatCurrency(summary.minimumExpense)}
          </div>
          <div className="text-body-small text-gray-text-tertiary mt-1">
            Conceptos esenciales (fijos + variables básicos)
          </div>
        </div>

        {/* Variación */}
        <div className="text-right">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VARIACIÓN
          </div>
          <div className="number-medium text-gray-text-tertiary">
            {summary.variation >= 0 ? '+' : ''}
            {summary.variation.toFixed(1)}%
          </div>
          <div className="text-body-small text-gray-text-tertiary mt-1">
            vs promedio
          </div>
        </div>
      </div>
    </Card>
  );
}

