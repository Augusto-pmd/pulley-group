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

  const getCategoriaColor = () => {
    return 'text-text-secondary';
  };

  return (
    <Card padding="normal">
      {/* Header de tabla */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_120px_100px] gap-4 pb-3 border-b mb-2" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
        <div className="text-caption text-text-secondary uppercase tracking-wider">Concepto</div>
        <div className="text-caption text-text-secondary uppercase tracking-wider text-right">USD</div>
        <div className="text-caption text-text-secondary uppercase tracking-wider text-right">ARS + TC</div>
        <div className="text-caption text-text-secondary uppercase tracking-wider text-center">Estado</div>
        <div className="text-caption text-text-secondary uppercase tracking-wider text-center">Tipo</div>
      </div>

      {/* Filas */}
      <div className="space-y-1">
        {sortedEventos.map((evento) => (
          <button
            key={evento.id}
            onClick={() => onSelectEvent(evento)}
            className="w-full grid grid-cols-[2fr_1fr_1.5fr_120px_100px] gap-4 py-2.5 px-2 rounded-lg transition-all duration-fast text-left"
            style={{ 
              // Materialidad con luz cálida en selección
              backgroundColor: selectedEventId === evento.id 
                ? 'rgba(181, 154, 106, 0.1)' 
                : 'transparent',
              backgroundImage: selectedEventId === evento.id
                ? 'radial-gradient(circle at left, rgba(181, 154, 106, 0.12) 0%, transparent 50%)'
                : 'none',
              border: selectedEventId === evento.id
                ? '1px solid rgba(181, 154, 106, 0.2)'
                : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (selectedEventId !== evento.id) {
                e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.05)';
                e.currentTarget.style.backgroundImage = 'radial-gradient(circle at left, rgba(181, 154, 106, 0.06) 0%, transparent 50%)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedEventId !== evento.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.backgroundImage = 'none';
              }
            }}
          >
            {/* Concepto con indicador de tipo */}
            <div className="flex items-center gap-2">
              <div className="text-body text-text-primary font-medium">
                {evento.conceptoNombre}
              </div>
            </div>

            {/* USD (principal) */}
            <div className="flex items-center justify-end">
              <CurrencyDisplay value={evento.montoUsd} size="regular" showSecondary={false} />
            </div>

            {/* ARS + TC (secundario) */}
            <div className="flex items-center justify-end">
              <div className="text-right">
                <div className="text-body-small text-text-secondary">
                  {formatCurrency(evento.monto)}
                </div>
                {evento.tipoCambioAplicado && (
                  <div className="text-caption text-text-secondary" style={{ opacity: 0.6 }}>
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
                  className="px-2 py-1 rounded-button text-caption font-medium transition-colors duration-fast"
                  style={{
                    backgroundColor: evento.estado === 'pagado' ? 'rgba(31, 42, 51, 0.2)' : 'rgba(31, 42, 51, 0.15)',
                    color: '#F5F2EC',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = evento.estado === 'pagado' ? 'rgba(31, 42, 51, 0.3)' : 'rgba(31, 42, 51, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = evento.estado === 'pagado' ? 'rgba(31, 42, 51, 0.2)' : 'rgba(31, 42, 51, 0.15)';
                  }}
                >
                  {evento.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                </button>
              ) : (
                <span className="text-caption text-text-secondary" style={{ opacity: 0.5 }}>—</span>
              )}
            </div>

            {/* Categoría */}
            <div className="flex items-center justify-center">
              <span className="text-caption uppercase tracking-wider text-text-secondary">
                {evento.categoria.charAt(0)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {sortedEventos.length === 0 && (
        <div className="text-center py-8 text-body text-text-secondary">
          No hay eventos cargados para este mes
        </div>
      )}
    </Card>
  );
}

