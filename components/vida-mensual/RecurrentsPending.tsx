'use client';

import Card from '@/components/Card';
import { formatCurrency } from '@/utils/number-format';
import type { Concept } from '@/mock/data';

interface RecurrentsPendingProps {
  recurrents: Concept[];
  onConfirm: (concept: Concept) => void;
}

export default function RecurrentsPending({ recurrents, onConfirm }: RecurrentsPendingProps) {
  return (
    <Card padding="large">
      <div className="mb-6">
        <h2 className="text-heading-2 text-gray-text-primary mb-1">RECURRENTES PENDIENTES</h2>
        <p className="text-body text-gray-text-tertiary">
          Conceptos que suelen repetirse cada mes
        </p>
      </div>

      {recurrents.length === 0 ? (
        <div className="text-body text-gray-text-tertiary text-center py-8">
          No hay recurrentes pendientes para este mes
        </div>
      ) : (
        <div className="space-y-1">
          {recurrents.map((recurrent) => (
            <div
              key={recurrent.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/30 hover:bg-white/50 transition-colors duration-fast"
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300"
                  onChange={() => onConfirm(recurrent)}
                />
                <div className="flex-1">
                  <div className="text-body-large text-gray-text-primary font-medium">
                    {recurrent.name}
                  </div>
                  <div className="text-body-small text-gray-text-tertiary">
                    {recurrent.frequency === 'mensual' ? 'Mensual' : recurrent.frequency}
                    {recurrent.lastUsed && ` · Último: ${formatCurrency(recurrent.estimatedAmount || 0)}`}
                  </div>
                </div>
                <div className="number-medium text-gray-text-primary">
                  {formatCurrency(recurrent.estimatedAmount || 0)}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onConfirm(recurrent)}
                  className="text-body text-blue-600 hover:text-blue-700 transition-colors duration-fast"
                >
                  Confirmar
                </button>
                <button
                  className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  Ajustar
                </button>
                <button
                  className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  Omitir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

