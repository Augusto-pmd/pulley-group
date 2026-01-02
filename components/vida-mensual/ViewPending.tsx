'use client';

import Card from '@/components/Card';
import ExpenseEventList from './ExpenseEventList';
import { formatCurrency } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface ViewPendingProps {
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
}

export default function ViewPending({ eventos, onToggleEstado, onEditMonto }: ViewPendingProps) {
  const eventosPendientes = eventos.filter((e) => e.estado === 'pendiente');
  const totalPendiente = eventosPendientes.reduce((sum, e) => sum + e.monto, 0);

  // Agrupar por mes
  const eventosPorMes = eventosPendientes.reduce((acc, evento) => {
    if (!acc[evento.mes]) {
      acc[evento.mes] = [];
    }
    acc[evento.mes].push(evento);
    return acc;
  }, {} as Record<string, EventoMensual[]>);

  const meses = Object.keys(eventosPorMes).sort();

  return (
    <div>
      {/* Resumen de Pendientes */}
      <div className="mb-8">
        <Card padding="large">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-heading-2 text-gray-text-primary mb-2">PENDIENTES</h2>
              <p className="text-body text-gray-text-tertiary">
                {eventosPendientes.length} eventos pendientes de pago
              </p>
            </div>
            <div className="text-right">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                TOTAL PENDIENTE
              </div>
              <div className="number-display text-orange-warning">
                {formatCurrency(totalPendiente)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pendientes por Mes */}
      {meses.length === 0 ? (
        <Card padding="large">
          <div className="text-body text-gray-text-tertiary text-center py-8">
            No hay eventos pendientes
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {meses.map((mes) => {
            const eventos = eventosPorMes[mes];
            const totalMes = eventos.reduce((sum, e) => sum + e.monto, 0);

            return (
              <div key={mes}>
                <Card padding="large">
                  <div className="mb-6 pb-4 border-b border-gray-divider">
                    <div className="flex items-center justify-between">
                      <h3 className="text-heading-3 text-gray-text-primary">
                        {new Date(mes + '-01').toLocaleDateString('es-AR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h3>
                      <div className="number-medium text-orange-warning">
                        {formatCurrency(totalMes)}
                      </div>
                    </div>
                    <p className="text-body-small text-gray-text-tertiary mt-1">
                      {eventos.length} eventos pendientes
                    </p>
                  </div>
                  <ExpenseEventList
                    eventos={eventos}
                    onToggleEstado={onToggleEstado}
                    onEditMonto={onEditMonto}
                  />
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

