'use client';

import { useState } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatCurrency, formatNumber } from '@/utils/number-format';
import type { EventoMensual } from '@/types/vida-mensual';

interface MonthTableProps {
  eventos: EventoMensual[];
  onSelectEvent: (evento: EventoMensual) => void;
  onToggleEstado: (id: string) => void;
  selectedEventId?: string | null;
}

export default function MonthTable({
  eventos,
  onSelectEvent,
  onToggleEstado,
  selectedEventId,
}: MonthTableProps) {
  const sortedEventos = [...eventos].sort((a, b) => (a.fecha ?? "").localeCompare(b.fecha ?? ""));

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'fijo':
        return 'text-blue-system';
      case 'variable':
        return 'text-gray-text-secondary';
      case 'extraordinario':
        return 'text-orange-warning';
      default:
        return 'text-gray-text-tertiary';
    }
  };

  return (
    <Card padding="normal">
      {/* Header de tabla */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_120px_100px] gap-4 pb-3 border-b border-gray-divider mb-2">
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider">Concepto</div>
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider text-right">USD</div>
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider text-right">ARS + TC</div>
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider text-center">Estado</div>
        <div className="text-caption text-gray-text-disabled uppercase tracking-wider text-center">Tipo</div>
      </div>

      {/* Filas */}
      <div className="space-y-1">
        {sortedEventos.map((evento) => (
          <button
            key={evento.id}
            onClick={() => onSelectEvent(evento)}
            className={`w-full grid grid-cols-[2fr_1fr_1.5fr_120px_100px] gap-4 py-2.5 px-2 rounded-lg transition-all duration-fast text-left ${
              selectedEventId === evento.id
                ? 'bg-blue-50/40 border border-blue-200/30'
                : evento.tipo === 'ingreso'
                ? 'hover:bg-green-success/5 border-l-2 border-green-success/30'
                : 'hover:bg-white/40'
            }`}
          >
            {/* Concepto con indicador de tipo */}
            <div className="flex items-center gap-2">
              <div className="text-body text-gray-text-primary font-medium">
                {evento.conceptoNombre}
              </div>
              {evento.tipo === 'ingreso' && (
                <span className="text-caption text-green-success opacity-70">+</span>
              )}
            </div>

            {/* USD (principal) */}
            <div className="flex items-center justify-end">
              <CurrencyDisplay value={evento.montoUsd} size="regular" showSecondary={false} />
            </div>

            {/* ARS + TC (secundario) */}
            <div className="flex items-center justify-end">
              <div className="text-right">
                <div className="text-body-small text-gray-text-secondary">
                  {formatCurrency(evento.monto)}
                </div>
                {evento.tipoCambioAplicado && (
                  <div className="text-caption text-gray-text-disabled">
                    TC: {formatNumber(evento.tipoCambioAplicado)}
                  </div>
                )}
              </div>
            </div>

            {/* Estado - Solo para egresos */}
            <div className="flex items-center justify-center">
              {evento.tipo === 'egreso' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleEstado(evento.id);
                  }}
                  className={`px-2 py-1 rounded-button text-caption font-medium transition-colors duration-fast ${
                    evento.estado === 'pagado'
                      ? 'bg-green-success/20 text-green-success hover:bg-green-success/30'
                      : 'bg-orange-warning/20 text-orange-warning hover:bg-orange-warning/30'
                  }`}
                >
                  {evento.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                </button>
              ) : (
                <span className="text-caption text-gray-text-disabled">—</span>
              )}
            </div>

            {/* Categoría */}
            <div className="flex items-center justify-center">
              <span className={`text-caption uppercase tracking-wider ${getCategoriaColor(evento.categoria)}`}>
                {evento.categoria.charAt(0)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {sortedEventos.length === 0 && (
        <div className="text-center py-8 text-body text-gray-text-tertiary">
          No hay eventos cargados para este mes
        </div>
      )}
    </Card>
  );
}

