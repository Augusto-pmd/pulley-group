'use client';

import { useState, useEffect } from 'react';
import Card from '../Card';
import { formatCurrencyAR } from '@/utils/number-format';
import { getInvestmentEvents, deleteInvestmentEvent, type ApiInvestmentEvent } from '@/lib/api';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import MovementEditModal from '../MovementEditModal';

interface InvestmentFlowsProps {
  investmentId: string;
}

export default function InvestmentFlows({ investmentId }: InvestmentFlowsProps) {
  const [events, setEvents] = useState<ApiInvestmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<ApiInvestmentEvent | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const investmentEvents = await getInvestmentEvents(investmentId);
        // Ordenar por fecha descendente
        setEvents(investmentEvents.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (error) {
        console.error('Error loading investment events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [investmentId]);

  // Calcular balance acumulado
  const calculateBalance = (events: ApiInvestmentEvent[], index: number): number => {
    let balance = 0;
    for (let i = events.length - 1; i >= index; i--) {
      const event = events[i];
      if (event.type === 'aporte') {
        balance += event.amountUSD;
      } else if (event.type === 'retiro') {
        balance -= event.amountUSD;
      } else if (event.type === 'ajuste') {
        balance += event.amountUSD;
      }
    }
    return balance;
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteInvestmentEvent(investmentId, eventId);
      setEvents(events.filter(e => e.id !== eventId));
      setDeletingEventId(null);
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('investment-changed'));
    } catch (error) {
      console.error('Error deleting investment event:', error);
      alert('Error al eliminar el evento. Por favor, intenta nuevamente.');
    }
  };

  const handleSaveEvent = async () => {
    // Recargar eventos
    const investmentEvents = await getInvestmentEvents(investmentId);
    setEvents(investmentEvents.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setEditingEvent(null);
    // Notificar cambio para actualizar dashboard
    window.dispatchEvent(new CustomEvent('investment-changed'));
  };

  // Calcular totales desde eventos reales
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalContributions = events
    .filter((e) => e.type === 'aporte')
    .reduce((sum, e) => sum + e.amountUSD, 0);
  const totalWithdrawals = events
    .filter((e) => e.type === 'retiro')
    .reduce((sum, e) => sum + Math.abs(e.amountUSD), 0);
  const totalIncome = events
    .filter((e) => e.type === 'ajuste' && e.amountUSD > 0)
    .reduce((sum, e) => sum + e.amountUSD, 0);
  const currentBalance = sortedEvents.length > 0 
    ? calculateBalance(sortedEvents, 0)
    : 0;

  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrencyAR(value, 2)}`;
  };

  return (
    <Card>
      {/* Resumen de Flujos */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL APORTES
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrencyAR(totalContributions, 2)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL RETIROS
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrencyAR(totalWithdrawals, 2)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL INGRESOS
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrencyAR(totalIncome, 2)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            SALDO ACTUAL
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrencyAR(currentBalance, 2)}
          </div>
        </div>
      </div>

      {/* Tabla de Flujos */}
      <div>
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[120px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            FECHA
          </div>
          <div className="w-[140px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            TIPO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            MONTO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            SALDO
          </div>
          <div className="flex-1 text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            DESCRIPCIÓN
          </div>
        </div>

        {/* Filas */}
        {loading ? (
          <div className="h-12 flex items-center justify-center px-4">
            <div className="text-body text-text-secondary">Cargando eventos...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="h-12 flex items-center justify-center px-4">
            <div className="text-body text-text-secondary">No hay eventos registrados</div>
          </div>
        ) : (
          sortedEvents.map((event, index) => {
            const balance = calculateBalance(sortedEvents, index);
            const eventTypeLabel = event.type === 'aporte' ? 'Aporte' : event.type === 'retiro' ? 'Retiro' : 'Ajuste';
            
            return (
              <div
                key={event.id}
                className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast group"
              >
                <div className="w-[120px] text-body text-text-primary">
                  {new Date(event.date).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
                <div className="w-[140px] text-body text-text-primary">{eventTypeLabel}</div>
                <div className="w-[160px] text-right text-body font-mono-numbers text-text-primary">
                  {formatSignedValue(event.amountUSD)}
                </div>
                <div className="w-[160px] text-right text-body font-mono-numbers text-text-primary">
                  {formatCurrencyAR(balance, 2)}
                </div>
                <div className="flex-1 text-body text-text-secondary">
                  {event.note || '-'}
                </div>
                <div className="w-[100px] flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="px-2 py-1 text-body-small text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setDeletingEventId(event.id)}
                    className="px-2 py-1 text-body-small text-red-600 hover:text-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de edición - TODO: Crear componente específico para InvestmentEvent */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-heading-3 mb-4">Editar evento</h3>
            <p className="text-body text-text-secondary mb-4">
              La edición de eventos de inversión estará disponible próximamente.
            </p>
            <button
              onClick={() => setEditingEvent(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-button"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={deletingEventId !== null}
        title="Eliminar evento"
        message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        itemName="este evento"
        onConfirm={() => deletingEventId && handleDeleteEvent(deletingEventId)}
        onCancel={() => setDeletingEventId(null)}
      />
    </Card>
  );
}

