'use client';

import { useState } from 'react';
import QuickAddForm from './QuickAddForm';
import MonthTable from './MonthTable';
import EventEditPanel from './EventEditPanel';
import MonthSummary from './MonthSummary';
import FadeIn from '../animations/FadeIn';
import { conceptosMock } from '@/mock/conceptos';
import type { EventoMensual } from '@/mock/eventos';

interface MonthOpenViewProps {
  mes: string;
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
  onUpdateEvent: (evento: EventoMensual) => void;
  onAddEvent: (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado?: 'pagado' | 'pendiente',
    monedaOriginal?: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd?: number
  ) => void;
  promedioMensual: number;
}

export default function MonthOpenView({
  mes,
  eventos,
  onToggleEstado,
  onEditMonto,
  onUpdateEvent,
  onAddEvent,
  promedioMensual,
}: MonthOpenViewProps) {
  // Filtrar eventos del mes
  const eventosMes = eventos.filter((e) => e.mes === mes);

  // Estado para panel de edición
  const [selectedEvent, setSelectedEvent] = useState<EventoMensual | null>(null);

  const handleQuickAdd = (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado: 'pagado' | 'pendiente',
    monedaOriginal: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd: number
  ) => {
    onAddEvent(conceptoId, conceptoNombre, tipo, monto, categoria, estado, monedaOriginal, tipoCambioAplicado, montoUsd);
  };

  const handleSelectEvent = (evento: EventoMensual) => {
    setSelectedEvent(evento);
  };

  const handleClosePanel = () => {
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventoActualizado: EventoMensual) => {
    onUpdateEvent(eventoActualizado);
    setSelectedEvent(null);
  };

  const conceptosList = conceptosMock.map((c) => ({ 
    id: c.id, 
    nombre: c.nombre,
    categoria: c.categoria 
  }));

  // Handler para actualizar naturaleza del concepto
  const handleUpdateConcepto = (conceptoId: string, categoria: 'fijo' | 'variable' | 'extraordinario') => {
    // Mock: actualizar concepto en conceptosMock
    // En producción, esto actualizaría la base de datos y solo afectaría eventos futuros
    const conceptoIndex = conceptosMock.findIndex((c) => c.id === conceptoId);
    if (conceptoIndex !== -1) {
      conceptosMock[conceptoIndex].categoria = categoria;
    }
  };

  return (
    <div className="space-y-6">
      {/* Zona de carga rápida */}
      <FadeIn delay={0} duration={300}>
        <QuickAddForm onAdd={handleQuickAdd} />
      </FadeIn>

      {/* Planilla viva del mes (protagonista) */}
      <FadeIn delay={100} duration={300}>
        <MonthTable
          eventos={eventosMes}
          onSelectEvent={handleSelectEvent}
          onToggleEstado={onToggleEstado}
          selectedEventId={selectedEvent?.id}
        />
      </FadeIn>

      {/* Resúmenes con porcentajes */}
      {eventosMes.length > 0 && (
        <FadeIn delay={200} duration={300}>
          <MonthSummary eventos={eventosMes} />
        </FadeIn>
      )}

      {/* Panel lateral de edición */}
      <EventEditPanel
        evento={selectedEvent}
        onClose={handleClosePanel}
        onSave={handleSaveEvent}
        onUpdateConcepto={handleUpdateConcepto}
        conceptos={conceptosList}
      />
    </div>
  );
}

