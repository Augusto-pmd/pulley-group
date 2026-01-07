'use client';

import { useState } from 'react';
import QuickAddForm from './QuickAddForm';
import MonthTable from './MonthTable';
import EventEditPanel from './EventEditPanel';
import MonthSummary from './MonthSummary';
import MovementEditModal from '../MovementEditModal';
import FadeIn from '../animations/FadeIn';
import { getMovements, type ApiMovement } from '@/lib/api';
import type { EventoMensual } from '@/types/vida-mensual';

interface MonthOpenViewProps {
  mes: string;
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
  onUpdateEvent: (evento: EventoMensual) => void;
  onDeleteEvent?: (id: string) => void;
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
  concepts?: Array<{ id: string; nombre: string; categoria: 'fijo' | 'variable' | 'extraordinario' }>;
}

export default function MonthOpenView({
  mes,
  eventos,
  onToggleEstado,
  onEditMonto,
  onUpdateEvent,
  onDeleteEvent,
  onAddEvent,
  promedioMensual,
  concepts = [],
}: MonthOpenViewProps) {
  // Filtrar eventos del mes
  const eventosMes = eventos.filter((e) => e.mes === mes);

  // Estado para panel de edición
  const [selectedEvent, setSelectedEvent] = useState<EventoMensual | null>(null);
  // Estado para modal de edición universal
  const [editingMovement, setEditingMovement] = useState<ApiMovement | null>(null);

  const handleQuickAdd = (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado: 'pagado' | 'pendiente',
    monedaOriginal: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd?: number
  ) => {
    const montoUsdFinal = montoUsd || monto;
    onAddEvent(conceptoId, conceptoNombre, tipo, monto, categoria, estado, monedaOriginal, montoUsdFinal, tipoCambioAplicado);
  };

  const handleSelectEvent = async (evento: EventoMensual) => {
    // Cargar el movimiento completo desde la API para el modal
    try {
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
          monthId: '', // Se actualizará en el modal si es necesario
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

  const handleClosePanel = () => {
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventoActualizado: EventoMensual) => {
    onUpdateEvent(eventoActualizado);
    setSelectedEvent(null);
  };

  const handleSaveMovement = async (updatedMovement: ApiMovement) => {
    // Convertir ApiMovement a EventoMensual y actualizar
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
    setEditingMovement(null);
  };

  const handleDeleteMovement = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id);
    }
    setEditingMovement(null);
  };

  // Usar conceptos desde props (cargados desde API)
  const conceptosList = concepts;

  // Handler para actualizar naturaleza del concepto
  const handleUpdateConcepto = (conceptoId: string, categoria: 'fijo' | 'variable' | 'extraordinario') => {
    // TODO: Implementar actualización de concepto en API cuando esté disponible
    console.log('Update concepto:', conceptoId, categoria);
  };

  return (
    <div className="space-y-12">
      {/* PLACA CENTRAL DOMINANTE - Resumen del mes */}
      {eventosMes.length > 0 && (
        <FadeIn delay={0} duration={300}>
          <MonthSummary eventos={eventosMes} />
        </FadeIn>
      )}

      {/* Movimientos - Secundario discreto, no planilla */}
      {eventosMes.length > 0 && (
        <FadeIn delay={100} duration={300}>
          <MonthTable
            eventos={eventosMes}
            onSelectEvent={handleSelectEvent}
            onToggleEstado={onToggleEstado}
            selectedEventId={selectedEvent?.id}
          />
        </FadeIn>
      )}

      {/* Zona de carga rápida - Discreta */}
      <FadeIn delay={200} duration={300}>
        <QuickAddForm onAdd={handleQuickAdd} />
      </FadeIn>

      {/* Panel lateral de edición */}
      <EventEditPanel
        evento={selectedEvent}
        onClose={handleClosePanel}
        onSave={handleSaveEvent}
        onDelete={onDeleteEvent}
        onUpdateConcepto={handleUpdateConcepto}
        conceptos={conceptosList}
      />

      {/* Modal universal de edición */}
      <MovementEditModal
        movement={editingMovement}
        onClose={() => setEditingMovement(null)}
        onSave={handleSaveMovement}
        onDelete={handleDeleteMovement}
      />
    </div>
  );
}

