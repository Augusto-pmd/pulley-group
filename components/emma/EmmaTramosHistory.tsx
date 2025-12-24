'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import { getTramosHistoricos, type EmmaTramo } from '@/mock/emma-tramos';

interface EmmaTramosHistoryProps {
  tramos: EmmaTramo[];
}

export default function EmmaTramosHistory({ tramos }: EmmaTramosHistoryProps) {
  const tramosHistoricos = tramos.filter((t) => t.fechaFin !== undefined).sort((a, b) => 
    b.fechaInicio.localeCompare(a.fechaInicio)
  );

  if (tramosHistoricos.length === 0) {
    return (
      <Card padding="large">
        <h3 className="text-heading-3 text-gray-text-primary mb-6">HISTORIAL DE TRAMOS</h3>
        <div className="text-body text-gray-text-tertiary text-center py-8">
          No hay tramos históricos
        </div>
      </Card>
    );
  }

  return (
    <Card padding="large">
      <h3 className="text-heading-3 text-gray-text-primary mb-6">HISTORIAL DE TRAMOS</h3>
      
      <div className="space-y-4">
        {tramosHistoricos.map((tramo) => (
          <div
            key={tramo.id}
            className="p-4 rounded-lg bg-white/30 border border-gray-divider"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-body-large text-gray-text-primary font-medium mb-1">
                  {tramo.instrumento}
                </div>
                <div className="text-body-small text-gray-text-tertiary">
                  {new Date(tramo.fechaInicio).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' - '}
                  {tramo.fechaFin && new Date(tramo.fechaFin).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  RENDIMIENTO
                </div>
                <div className="text-body text-gray-text-primary">
                  {formatPercentage(tramo.rendimientoEsperado)}
                </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  APORTE MENSUAL
                </div>
                <CurrencyDisplay 
                  value={tramo.aporteMensual} 
                  size="regular" 
                  showSecondary={true}
                  originalCurrency="USD"
                />
              </div>
            </div>

            {tramo.nota && (
              <div className="mt-3 pt-3 border-t border-gray-divider">
                <div className="text-body-small text-gray-text-tertiary">
                  {tramo.nota}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

