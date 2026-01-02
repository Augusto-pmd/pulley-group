'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import FadeIn from '@/components/animations/FadeIn';
import SlideTransition from '@/components/animations/SlideTransition';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import MovementEditModal from '@/components/MovementEditModal';
import { formatCurrency, formatNumber } from '@/utils/number-format';
import { getMovements, type ApiMovement } from '@/lib/api';
import type { EventoMensual } from '@/mock/eventos';

interface ExpenseEventListProps {
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
  onUpdateEvent?: (evento: EventoMensual) => void;
  onDeleteEvent?: (id: string) => void;
}

export default function ExpenseEventList({
  eventos,
  onToggleEstado,
  onEditMonto,
  onUpdateEvent,
  onDeleteEvent,
}: ExpenseEventListProps) {
  const [editingMovement, setEditingMovement] = useState<ApiMovement | null>(null);
  const [justToggled, setJustToggled] = useState<string | null>(null);

  // Todos los totales en USD
  const total = eventos.reduce((sum, e) => sum + e.montoUsd, 0);
  const totalPagado = eventos.filter((e) => e.estado === 'pagado').reduce((sum, e) => sum + e.montoUsd, 0);
  const totalPendiente = eventos.filter((e) => e.estado === 'pendiente').reduce((sum, e) => sum + e.montoUsd, 0);

  const handleEditMovement = async (evento: EventoMensual) => {
    // Cargar el movimiento completo desde la API para el modal
    try {
      // Obtener el mes del evento
      const [year, month] = evento.mes.split('-').map(Number);
      const movements = await getMovements(year, month);
      const apiMovement = movements.find(m => m.id === evento.id);
      if (apiMovement) {
        setEditingMovement(apiMovement);
      } else {
        // Fallback: crear ApiMovement desde EventoMensual
        setEditingMovement({
          id: evento.id,
          type: evento.tipo,
          amountUSD: evento.montoUsd,
          currencyOriginal: evento.monedaOriginal,
          exchangeRate: evento.tipoCambioAplicado || null,
          date: evento.fecha,
          status: evento.estado,
          conceptId: evento.conceptoId,
          monthId: '',
          concept: {
            id: evento.conceptoId,
            name: evento.conceptoNombre,
            type: evento.tipo,
            nature: evento.categoria,
          },
        } as ApiMovement);
      }
    } catch (error) {
      console.error('Error loading movement for edit:', error);
      // Fallback: usar datos del evento
      setEditingMovement({
        id: evento.id,
        type: evento.tipo,
        amountUSD: evento.montoUsd,
        currencyOriginal: evento.monedaOriginal,
        exchangeRate: evento.tipoCambioAplicado || null,
        date: evento.fecha,
        status: evento.estado,
        conceptId: evento.conceptoId,
        monthId: '',
        concept: {
          id: evento.conceptoId,
          name: evento.conceptoNombre,
          type: evento.tipo,
          nature: evento.categoria,
        },
      } as ApiMovement);
    }
  };

  const handleSaveMovement = async (updatedMovement: ApiMovement) => {
    if (onUpdateEvent) {
      // Convertir ApiMovement a EventoMensual
      const eventoActualizado: EventoMensual = {
        id: updatedMovement.id,
        conceptoId: updatedMovement.conceptId,
        conceptoNombre: updatedMovement.concept?.name || 'Concepto desconocido',
        tipo: updatedMovement.type,
        fecha: updatedMovement.date.split('T')[0],
        mes: `${updatedMovement.date.split('T')[0].split('-')[0]}-${updatedMovement.date.split('T')[0].split('-')[1]}`,
        monto: updatedMovement.currencyOriginal === 'ARS' 
          ? updatedMovement.amountUSD * (updatedMovement.exchangeRate || 1)
          : updatedMovement.amountUSD,
        monedaOriginal: updatedMovement.currencyOriginal as 'ARS' | 'USD',
        tipoCambioAplicado: updatedMovement.exchangeRate || undefined,
        montoUsd: updatedMovement.amountUSD,
        estado: (updatedMovement.status || 'pagado') as 'pagado' | 'pendiente',
        categoria: updatedMovement.concept?.nature || 'variable',
        fechaCreacion: updatedMovement.date.split('T')[0],
      };
      onUpdateEvent(eventoActualizado);
    }
    setEditingMovement(null);
    // Refrescar página para actualizar todas las vistas
    window.location.reload();
  };

  const handleDeleteMovement = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id);
    }
    setEditingMovement(null);
    // Refrescar página para actualizar todas las vistas
    window.location.reload();
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-divider">
        <div>
          <h2 className="text-heading-2 text-gray-text-primary mb-2">EGRESOS</h2>
          <div className="flex items-center gap-6 text-body-small text-gray-text-tertiary">
            <span>Total: {formatCurrency(total)}</span>
            <span className="text-green-600">Pagado: {formatCurrency(totalPagado)}</span>
            {totalPendiente > 0 && (
              <span className="text-orange-warning">Pendiente: {formatCurrency(totalPendiente)}</span>
            )}
          </div>
        </div>
        <CurrencyDisplay value={total} size="display" showSecondary={false} originalCurrency="USD" />
      </div>

      {eventos.length === 0 ? (
        <div className="text-body text-gray-text-tertiary text-center py-8">
          No hay egresos registrados
        </div>
      ) : (
        <div className="space-y-1">
          {eventos.map((evento, index) => (
            <FadeIn key={evento.id} delay={index * 30} duration={250}>
              <SlideTransition isVisible={true} direction="up" duration={250}>
                <div
                  onClick={() => handleEditMovement(evento)}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-fast cursor-pointer ${
                    evento.estado === 'pendiente'
                      ? 'bg-orange-50/30 hover:bg-orange-50/50 border border-orange-200/20'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  style={{
                    transform: justToggled === evento.id 
                      ? evento.estado === 'pagado' 
                        ? 'scale(0.98) translateY(-2px)' 
                        : 'scale(1.01) translateY(2px)'
                      : 'scale(1)',
                    transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms ease',
                  }}
                >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={evento.estado === 'pagado'}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    onToggleEstado(evento.id);
                    setJustToggled(evento.id);
                    setTimeout(() => setJustToggled(null), 300);
                  }}
                  className="w-5 h-5 rounded border-gray-300 transition-all duration-fast cursor-pointer"
                  style={{
                    transform: justToggled === evento.id ? 'scale(0.9)' : 'scale(1)',
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-body-large text-gray-text-primary font-medium">
                      {evento.conceptoNombre}
                    </div>
                    {evento.estado === 'pendiente' && (
                      <span className="text-caption text-orange-warning uppercase tracking-wider">
                        PENDIENTE
                      </span>
                    )}
                  </div>
                  <div className="text-body-small text-gray-text-tertiary">
                    {new Date(evento.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                    {evento.categoria && (
                      <span className="ml-2 capitalize">· {evento.categoria}</span>
                    )}
                    {evento.nota && (
                      <span className="ml-2">· {evento.nota}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {/* Monto original */}
                  <div className="number-medium text-gray-text-primary">
                    {formatCurrency(evento.monto)}
                  </div>
                  {/* Información de conversión */}
                  {evento.monedaOriginal === 'ARS' && evento.tipoCambioAplicado && (
                    <div className="text-body-small text-gray-text-tertiary mt-0.5">
                      TC: {formatNumber(evento.tipoCambioAplicado)}
                    </div>
                  )}
                  {/* Monto en USD */}
                  <div className="text-body-small text-gray-text-tertiary mt-0.5">
                    = {formatCurrency(evento.montoUsd)}
                  </div>
                </div>
              </div>
                </div>
              </SlideTransition>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Modal universal de edición */}
      <MovementEditModal
        movement={editingMovement}
        onClose={() => setEditingMovement(null)}
        onSave={handleSaveMovement}
        onDelete={handleDeleteMovement}
      />
    </Card>
  );
}

