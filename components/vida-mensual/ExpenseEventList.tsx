'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import FadeIn from '@/components/animations/FadeIn';
import SlideTransition from '@/components/animations/SlideTransition';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatCurrency } from '@/mock/data';
import { formatCurrencyUSD, formatCurrencyARS } from '@/mock/exchange-rates';
import { formatNumberWithLocale } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface ExpenseEventListProps {
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
}

export default function ExpenseEventList({
  eventos,
  onToggleEstado,
  onEditMonto,
}: ExpenseEventListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMonto, setEditMonto] = useState<string>('');
  const [justToggled, setJustToggled] = useState<string | null>(null);

  // Todos los totales en USD
  const total = eventos.reduce((sum, e) => sum + e.montoUsd, 0);
  const totalPagado = eventos.filter((e) => e.estado === 'pagado').reduce((sum, e) => sum + e.montoUsd, 0);
  const totalPendiente = eventos.filter((e) => e.estado === 'pendiente').reduce((sum, e) => sum + e.montoUsd, 0);

  const handleStartEdit = (evento: EventoMensual) => {
    setEditingId(evento.id);
    setEditMonto(evento.monto.toString());
  };

  const handleSaveEdit = (id: string) => {
    const nuevoMonto = parseFloat(editMonto);
    if (!isNaN(nuevoMonto) && nuevoMonto > 0) {
      onEditMonto(id, nuevoMonto);
    }
    setEditingId(null);
    setEditMonto('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditMonto('');
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-divider">
        <div>
          <h2 className="text-heading-2 text-gray-text-primary mb-2">EGRESOS</h2>
          <div className="flex items-center gap-6 text-body-small text-gray-text-tertiary">
            <span>Total: {formatCurrencyUSD(total)}</span>
            <span className="text-green-600">Pagado: {formatCurrencyUSD(totalPagado)}</span>
            {totalPendiente > 0 && (
              <span className="text-orange-warning">Pendiente: {formatCurrencyUSD(totalPendiente)}</span>
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
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-fast ${
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
                {editingId === evento.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editMonto}
                      onChange={(e) => setEditMonto(e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600"
                      min="0"
                      step="0.01"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(evento.id)}
                      className="text-body text-blue-600 hover:text-blue-700 transition-colors duration-fast"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    {/* Monto original */}
                    <div className="number-medium text-gray-text-primary">
                      {evento.monedaOriginal === 'ARS' 
                        ? formatCurrencyARS(evento.monto)
                        : formatCurrencyUSD(evento.monto)
                      }
                    </div>
                    {/* Información de conversión */}
                    {evento.monedaOriginal === 'ARS' && evento.tipoCambioAplicado && (
                      <div className="text-body-small text-gray-text-tertiary mt-0.5">
                        TC: {formatNumberWithLocale(evento.tipoCambioAplicado)}
                      </div>
                    )}
                    {/* Monto en USD */}
                    <div className="text-body-small text-gray-text-tertiary mt-0.5">
                      = {formatCurrencyUSD(evento.montoUsd)}
                    </div>
                  </div>
                )}
              </div>
              {editingId !== evento.id && (
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => handleStartEdit(evento)}
                    className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                  >
                    Editar monto
                  </button>
                </div>
              )}
                </div>
              </SlideTransition>
            </FadeIn>
          ))}
        </div>
      )}
    </Card>
  );
}

