'use client';

import { useState, useEffect } from 'react';
import MonthSelector from '@/components/vida-mensual/MonthSelector';
import MonthStatus from '@/components/vida-mensual/MonthStatus';
import MonthOpenView from '@/components/vida-mensual/MonthOpenView';
import MonthClosingView from '@/components/vida-mensual/MonthClosingView';
import MonthClosedView from '@/components/vida-mensual/MonthClosedView';
import UnclosedMonthsAlert from '@/components/vida-mensual/UnclosedMonthsAlert';
import { eventosMock, type EventoMensual, getMesesDisponibles } from '@/mock/eventos';
import { 
  getCurrentMonthState, 
  getCurrentMonth, 
  getUnclosedPreviousMonths,
  getMonthState,
  closeMonth,
  type MonthStatus as MonthStatusType,
  type MonthState as MonthStateType
} from '@/mock/month-status';
import { conceptosMock } from '@/mock/conceptos';
import { procesarPagoCuota } from '@/mock/activos';

export default function VidaMensualPage() {
  const [eventos, setEventos] = useState<EventoMensual[]>(eventosMock);
  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [monthStateData, setMonthStateData] = useState<MonthStateType | undefined>(getMonthState(selectedMonth));
  const [isClosing, setIsClosing] = useState(false);
  
  // Detectar meses atrasados sin cerrar
  const mesesAtrasados = getUnclosedPreviousMonths();
  
  // Obtener meses disponibles
  const availableMonths = getMesesDisponibles(eventos);
  
  // Actualizar estado del mes cuando cambia el mes seleccionado
  useEffect(() => {
    const state = getMonthState(selectedMonth);
    setMonthStateData(state);
    setIsClosing(false); // Resetear estado de cierre al cambiar de mes
  }, [selectedMonth]);

  // Handler para cambiar estado de evento (pagado/pendiente)
  const handleToggleEstado = (id: string) => {
    const evento = eventos.find((e) => e.id === id);
    if (!evento) return;

    // Los ingresos no tienen estado editable (siempre son "percibidos")
    if (evento.tipo === 'ingreso') return;

    const nuevoEstado = evento.estado === 'pagado' ? 'pendiente' : 'pagado';
    
    // Si se marca como pagado, verificar si es una cuota de pasivo
    if (nuevoEstado === 'pagado' && evento.estado === 'pendiente') {
      // Procesar pago de cuota si corresponde
      procesarPagoCuota(
        evento.id,
        evento.conceptoId,
        evento.montoUsd,
        evento.fecha
      );
    }

    setEventos(
      eventos.map((e) =>
        e.id === id
          ? {
              ...e,
              estado: nuevoEstado,
              fechaModificacion: new Date().toISOString().split('T')[0],
            }
          : e
      )
    );
  };

  // Handler para editar monto de evento
  const handleEditMonto = (id: string, nuevoMonto: number) => {
    setEventos(
      eventos.map((e) =>
        e.id === id
          ? {
              ...e,
              monto: nuevoMonto,
              fechaModificacion: new Date().toISOString().split('T')[0],
            }
          : e
      )
    );
  };

  // Handler para actualizar evento completo
  const handleUpdateEvent = (eventoActualizado: EventoMensual) => {
    setEventos(
      eventos.map((e) => (e.id === eventoActualizado.id ? eventoActualizado : e))
    );
  };

  // Handler para agregar evento
  const handleAddEvent = (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado: 'pagado' | 'pendiente' = 'pagado',
    monedaOriginal: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd: number
  ) => {
    const hoy = new Date().toISOString().split('T')[0];
    const nuevoEvento: EventoMensual = {
      id: `e-${Date.now()}`,
      conceptoId,
      conceptoNombre,
      tipo,
      fecha: hoy,
      mes: selectedMonth, // Usar mes seleccionado, no siempre el actual
      monto,
      monedaOriginal,
      tipoCambioAplicado,
      montoUsd,
      estado,
      categoria,
      fechaCreacion: hoy,
    };
    setEventos([...eventos, nuevoEvento]);
  };

  // Handler para iniciar cierre
  const handleStartClosing = () => {
    setIsClosing(true);
    // El estado se actualiza automáticamente en el componente MonthStatus
  };

  // Handler para confirmar cierre
  const handleConfirmClose = () => {
    const fechaCierre = new Date().toISOString().split('T')[0];
    closeMonth(selectedMonth, fechaCierre); // Cerrar el mes seleccionado
    const updatedState = getMonthState(selectedMonth);
    setMonthStateData(updatedState);
    setIsClosing(false);
  };

  // Handler para cancelar cierre
  const handleCancelClosing = () => {
    setIsClosing(false);
    const updatedState = getMonthState(selectedMonth);
    setMonthStateData(updatedState);
  };

  // Handler para agregar corrección en mes cerrado
  const handleAddCorrection = () => {
    // Mock: abrir modal para agregar corrección
    alert('Agregar corrección como evento nuevo (mock)');
  };

  // Calcular promedio mensual en USD (mock)
  const eventosMes = eventos.filter((e) => e.mes === selectedMonth);
  const todosLosMeses = Array.from(new Set(eventos.map((e) => e.mes)));
  // Promedio mensual solo de egresos (para comparación)
  const promedioMensual = todosLosMeses.length > 0
    ? todosLosMeses.reduce((sum, mes) => {
        const egresosMes = eventos.filter((e) => e.mes === mes && e.tipo === 'egreso');
        return sum + egresosMes.reduce((s, e) => s + e.montoUsd, 0);
      }, 0) / todosLosMeses.length
    : 0;
  
  // Estado del mes seleccionado
  const monthState = monthStateData?.estado || 'ABIERTO';
  const fechaApertura = monthStateData?.fechaApertura;

  return (
    <>
      {/* CAPA 1: NAVEGACIÓN - Selector de mes siempre visible */}
      <div className="mb-6">
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
        />
      </div>

      {/* Alerta de meses atrasados (solo si no estamos viendo uno de ellos) */}
      {mesesAtrasados.length > 0 && !mesesAtrasados.some(m => m.mes === selectedMonth) && (
        <div className="mb-6">
          <UnclosedMonthsAlert 
            mesesAtrasados={mesesAtrasados}
            onSelectMonth={(mes) => setSelectedMonth(mes)}
          />
        </div>
      )}

      {/* CAPA 2: ACCIÓN - Estado del mes seleccionado */}
      <div className="mb-6">
        <MonthStatus
          mes={selectedMonth}
          estado={monthState}
          fechaApertura={fechaApertura}
          onStartClosing={handleStartClosing}
          onCloseMonth={handleConfirmClose}
        />
      </div>

      {/* CAPA 3: CONTENIDO - Vista según estado del mes seleccionado */}
      {monthState === 'ABIERTO' && !isClosing && (
        <MonthOpenView
          mes={selectedMonth}
          eventos={eventos}
          onToggleEstado={handleToggleEstado}
          onEditMonto={handleEditMonto}
          onUpdateEvent={handleUpdateEvent}
          onAddEvent={handleAddEvent}
          promedioMensual={promedioMensual}
        />
      )}

      {isClosing && monthState === 'EN_CIERRE' && (
        <MonthClosingView
          mes={selectedMonth}
          eventos={eventosMes}
          promedioMensual={promedioMensual}
          onConfirmClose={handleConfirmClose}
          onCancel={handleCancelClosing}
        />
      )}

      {monthState === 'CERRADO' && (
        <MonthClosedView
          mes={selectedMonth}
          eventos={eventosMes}
          promedioMensual={promedioMensual}
          onAddCorrection={handleAddCorrection}
        />
      )}
    </>
  );
}
