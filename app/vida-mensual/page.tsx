'use client';

import { useState, useEffect } from 'react';
import { useModeFromPath } from '@/hooks/useModeFromPath';
import { useRingData } from '@/contexts/RingDataContext';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import RadialCard from '@/components/circular/RadialCard';
import MonthSelector from '@/components/vida-mensual/MonthSelector';
import MonthOpenView from '@/components/vida-mensual/MonthOpenView';
import MonthClosingView from '@/components/vida-mensual/MonthClosingView';
import MonthClosedView from '@/components/vida-mensual/MonthClosedView';
import UnclosedMonthsAlert from '@/components/vida-mensual/UnclosedMonthsAlert';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { getMonths, getMovements, createMovement, getOrCreateMonth, closeMonth as closeMonthAPI, updateMovement, deleteMovement, getConcepts, createConcept, type ApiMonth, type ApiMovement, type ApiConcept } from '@/lib/api';
import type { EventoMensual, MonthStateType, MonthStatusType } from '@/types/vida-mensual';

// Helper: obtener mes actual en formato YYYY-MM
function getCurrentMonth(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

// Helper: obtener meses disponibles desde eventos
function getMesesDisponibles(eventos: EventoMensual[]): string[] {
  const meses = Array.from(new Set(eventos.map(e => e.mes).filter(mes => mes)));
  return meses.sort((a, b) => b.localeCompare(a));
}

// Helper: convertir ApiMovement a EventoMensual
function apiMovementToEvento(apiMovement: ApiMovement): EventoMensual {
  const [year, month] = apiMovement.date.split('T')[0].split('-');
  const mes = `${year}-${month}`;
  
  return {
    id: apiMovement.id,
    conceptoId: apiMovement.conceptId,
    conceptoNombre: apiMovement.concept?.name || 'Concepto desconocido',
    tipo: apiMovement.type,
    fecha: apiMovement.date.split('T')[0],
    mes,
    monto: apiMovement.currencyOriginal === 'ARS' 
      ? apiMovement.amountUSD * (apiMovement.exchangeRate || 1)
      : apiMovement.amountUSD,
    monedaOriginal: apiMovement.currencyOriginal as 'ARS' | 'USD',
    tipoCambioAplicado: apiMovement.exchangeRate || undefined,
    montoUsd: apiMovement.amountUSD,
    estado: (apiMovement.status || 'pagado') as 'pagado' | 'pendiente',
    categoria: apiMovement.concept?.nature || 'variable',
    fechaCreacion: apiMovement.date.split('T')[0],
  };
}

// Helper: convertir ApiMonth a MonthState
function apiMonthToMonthState(apiMonth: ApiMonth): MonthStateType {
  const mes = `${apiMonth.year}-${String(apiMonth.month).padStart(2, '0')}`;
  const estado: MonthStatusType = apiMonth.status === 'cerrado' ? 'CERRADO' : 'ABIERTO';
  
  return {
    mes,
    estado,
    fechaApertura: `${apiMonth.year}-${String(apiMonth.month).padStart(2, '0')}-01`,
  };
}

export default function VidaMensualPage() {
  useModeFromPath();
  const { setRingData } = useRingData();
  const { activeDomain, setDomainContent } = useCircularNavigation();
  const [eventos, setEventos] = useState<EventoMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiMonths, setApiMonths] = useState<ApiMonth[]>([]);
  const [apiConcepts, setApiConcepts] = useState<ApiConcept[]>([]);
  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [monthStateData, setMonthStateData] = useState<MonthStateType | undefined>();
  const [isClosing, setIsClosing] = useState(false);
  
  // Cargar datos desde API al montar
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Cargar meses
        const months = await getMonths();
        // Asegurar que months es un array
        setApiMonths(Array.isArray(months) ? months : []);
        
        // Cargar conceptos
        const concepts = await getConcepts();
        // Asegurar que concepts es un array
        setApiConcepts(Array.isArray(concepts) ? concepts : []);
        
        // Cargar movimientos del mes seleccionado
        const [year, month] = selectedMonth.split('-').map(Number);
        const movements = await getMovements(year, month);
        
        // Convertir a EventoMensual (asegurar que movements es un array)
        const eventosFromAPI = Array.isArray(movements)
          ? movements.map(apiMovementToEvento)
          : [];
        setEventos(eventosFromAPI);
        
        // Actualizar estado del mes desde API
        const monthFromAPI = months.find(m => m.year === year && m.month === month);
        if (monthFromAPI) {
          setMonthStateData(apiMonthToMonthState(monthFromAPI));
        } else {
          // Si no existe, crear estado por defecto (abierto)
          setMonthStateData({
            mes: selectedMonth,
            estado: 'ABIERTO',
            fechaApertura: `${year}-${String(month).padStart(2, '0')}-01`,
          });
        }
      } catch (error) {
        console.error('Error loading data from API:', error);
        // Sin fallback: mostrar error o estado vacío
        setEventos([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []); // Solo al montar
  
  // Cargar movimientos cuando cambia el mes seleccionado
  useEffect(() => {
    async function loadMovementsForMonth() {
      try {
        const [year, month] = selectedMonth.split('-').map(Number);
        const movements = await getMovements(year, month);
        // Asegurar que movements es un array antes de mapear
        const eventosFromAPI = Array.isArray(movements)
          ? movements.map(apiMovementToEvento)
          : [];
        setEventos(eventosFromAPI);
        
        // Actualizar estado del mes desde API
        const monthFromAPI = apiMonths.find(m => m.year === year && m.month === month);
        if (monthFromAPI) {
          setMonthStateData(apiMonthToMonthState(monthFromAPI));
        } else {
          // Si no existe, crear estado por defecto (abierto)
          setMonthStateData({
            mes: selectedMonth,
            estado: 'ABIERTO',
            fechaApertura: `${year}-${String(month).padStart(2, '0')}-01`,
          });
        }
      } catch (error) {
        console.error('Error loading movements for month:', error);
        setEventos([]);
      }
      
      setIsClosing(false);
    }
    
    if (!loading) {
      loadMovementsForMonth();
    }
  }, [selectedMonth, apiMonths, loading]);
  
  // Detectar meses atrasados sin cerrar (desde API)
  const mesesAtrasados: MonthStateType[] = Array.isArray(apiMonths)
    ? apiMonths
        .filter(m => m.status === 'abierto')
        .map(apiMonthToMonthState)
        .filter(m => m.mes < selectedMonth)
    : [];
  
  // Obtener meses disponibles desde eventos y API
  const availableMonths = getMesesDisponibles(eventos);

  // Handler para cambiar estado de evento (pagado/pendiente)
  const handleToggleEstado = async (id: string) => {
    const evento = eventos.find((e) => e.id === id);
    if (!evento) return;

    // Los ingresos no tienen estado editable (siempre son "percibidos")
    if (evento.tipo === 'ingreso') return;

    const nuevoEstado = evento.estado === 'pagado' ? 'pendiente' : 'pagado';
    
    try {
      // Actualizar en API
      const updated = await updateMovement(id, { status: nuevoEstado });
      const eventoActualizado = apiMovementToEvento(updated);
      
      setEventos(
        eventos.map((e) => (e.id === id ? eventoActualizado : e))
      );
    } catch (error) {
      console.error('Error updating movement status:', error);
      // Mantener estado local si falla
    }
  };

  // Handler para editar monto de evento
  const handleEditMonto = async (id: string, nuevoMonto: number) => {
    const evento = eventos.find((e) => e.id === id);
    if (!evento) return;
    
    // Calcular nuevo montoUSD según moneda original
    const nuevoMontoUsd = evento.monedaOriginal === 'ARS'
      ? nuevoMonto / (evento.tipoCambioAplicado || 1)
      : nuevoMonto;
    
    try {
      // Actualizar en API
      const updated = await updateMovement(id, { amountUSD: nuevoMontoUsd });
      const eventoActualizado = apiMovementToEvento(updated);
      
      setEventos(
        eventos.map((e) => (e.id === id ? eventoActualizado : e))
      );
    } catch (error) {
      console.error('Error updating movement amount:', error);
      // Mantener estado local si falla
    }
  };

  // Handler para actualizar evento completo
  const handleUpdateEvent = async (eventoActualizado: EventoMensual) => {
    try {
      // Actualizar en API
      const updated = await updateMovement(eventoActualizado.id, {
        amountUSD: eventoActualizado.montoUsd,
        exchangeRate: eventoActualizado.tipoCambioAplicado || null,
        status: eventoActualizado.estado,
        date: eventoActualizado.fecha,
        conceptId: eventoActualizado.conceptoId,
      });
      
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('movement-changed'));
      
      // Recargar movimientos del mes para reflejar cambios (incluye cambio de mes si cambió la fecha)
      const [year, month] = selectedMonth.split('-').map(Number);
      const movements = await getMovements(year, month);
      const eventosFromAPI = Array.isArray(movements)
        ? movements.map(apiMovementToEvento)
        : [];
      setEventos(eventosFromAPI);
    } catch (error) {
      console.error('Error updating movement:', error);
      // Mantener estado local si falla
    }
  };

  // Handler para agregar evento
  const handleAddEvent = async (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado?: 'pagado' | 'pendiente',
    monedaOriginal?: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd?: number
  ) => {
    const estadoFinal = estado || 'pagado';
    const monedaFinal = monedaOriginal || 'USD';
    const montoUsdFinal = montoUsd || monto;
    const hoy = new Date().toISOString().split('T')[0];
    const [year, month] = selectedMonth.split('-').map(Number);
    
    try {
      // Si el conceptoId es temporal (empieza con "c-temp-"), crear el concepto primero
      let finalConceptId = conceptoId;
      if (conceptoId.startsWith('c-temp-')) {
        const newConcept = await createConcept({
          name: conceptoNombre,
          type: tipo,
          nature: categoria,
        });
        finalConceptId = newConcept.id;
        // Actualizar la lista de conceptos
        const updatedConcepts = await getConcepts();
        setApiConcepts(updatedConcepts);
      }
      
      // Buscar o crear el mes en la API
      let monthRecord = apiMonths.find(m => m.year === year && m.month === month);
      
      if (!monthRecord) {
        // Si no existe el mes, crearlo automáticamente
        monthRecord = await getOrCreateMonth(year, month);
        setApiMonths([...apiMonths, monthRecord]);
      }
      
      // Crear movimiento en la API
      const movementData = {
        type: tipo,
        amountUSD: montoUsdFinal,
        currencyOriginal: monedaFinal,
        exchangeRate: tipoCambioAplicado || null,
        date: hoy,
        status: estadoFinal,
        conceptId: finalConceptId,
        monthId: monthRecord.id,
      };
      console.log('[VidaMensual] POST_API_CALL: createMovement', movementData);
      const newMovement = await createMovement(movementData);
      console.log('[VidaMensual] POST_API_RESPONSE', newMovement);
      
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('movement-changed'));
      
      // Convertir a EventoMensual y agregar a la lista
      const nuevoEvento = apiMovementToEvento(newMovement);
      setEventos([...eventos, nuevoEvento]);
    } catch (error) {
      console.error('Error creating movement:', error);
      // No agregar si falla la API
      throw error;
    }
  };

  // Handler para iniciar cierre
  const handleStartClosing = () => {
    setIsClosing(true);
    // El estado se actualiza automáticamente en el componente MonthStatus
  };

  // Handler para confirmar cierre
  const handleConfirmClose = async () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    
    try {
      // Cerrar mes en la API
      const closedMonth = await closeMonthAPI(year, month);
      setMonthStateData(apiMonthToMonthState(closedMonth));
      
      // Actualizar lista de meses
      const updatedMonths = apiMonths.map(m => 
        m.year === year && m.month === month ? closedMonth : m
      );
      setApiMonths(updatedMonths);
    } catch (error) {
      console.error('Error closing month:', error);
      // No actualizar estado si falla
    }
    
    setIsClosing(false);
  };

  // Handler para cancelar cierre
  const handleCancelClosing = () => {
    setIsClosing(false);
    // El estado se mantiene desde API
  };

  // Handler para eliminar evento
  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteMovement(id);
      setEventos(eventos.filter(e => e.id !== id));
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('movement-changed'));
    } catch (error) {
      console.error('Error deleting movement:', error);
      alert('Error al eliminar el movimiento. Por favor, intenta nuevamente.');
    }
  };

  // Handler para agregar corrección en mes cerrado
  const handleAddCorrection = () => {
    // Agregar corrección como evento nuevo
    alert('Agregar corrección como evento nuevo');
  };

  // Calcular resultado del mes
  const eventosMes = eventos.filter((e) => e.mes === selectedMonth);
  const resultadoMes = eventosMes.reduce((sum, e) => {
    return sum + (e.tipo === 'ingreso' ? e.montoUsd : -e.montoUsd);
  }, 0);

  // Actualizar datos del Ring
  useEffect(() => {
    setRingData({
      mesResultado: resultadoMes,
    });
  }, [resultadoMes, setRingData]);

  // Calcular promedio mensual en USD (mock)
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

  // Inyectar contenido en el contexto circular cuando el dominio está activo
  useEffect(() => {
    if (activeDomain === 'mes') {
      const content = (
        <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>
          <div className="p-8">
            {/* Selector de mes - discreto arriba */}
            <div className="mb-8 flex justify-center">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                availableMonths={availableMonths}
              />
            </div>

            {/* Alerta de meses atrasados - discreto */}
            {mesesAtrasados.length > 0 && !mesesAtrasados.some(m => m.mes === selectedMonth) && (
              <div className="mb-8 flex justify-center">
                <UnclosedMonthsAlert 
                  mesesAtrasados={mesesAtrasados}
                  onSelectMonth={(mes) => setSelectedMonth(mes)}
                />
              </div>
            )}

            {/* ESTRUCTURA RADIAL: Resultado del mes en el centro, eventos orbitan */}
            <div className="relative min-h-[60vh] flex flex-col items-center">
              {/* CENTRO: Resultado del mes - Núcleo circular */}
              <RadialCard className="mb-12" padding="large">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                    RESULTADO DEL MES
                  </div>
                  <CurrencyDisplay 
                    value={resultadoMes} 
                    size="display" 
                    showSecondary={false}
                    originalCurrency="USD"
                  />
                  <div className="text-body text-text-secondary text-center mt-4" style={{ opacity: 0.5 }}>
                    {selectedMonth}
                  </div>
                </div>
              </RadialCard>

              {/* ORBITA: Contenido del mes - Vista según estado */}
              <div className="w-full max-w-4xl">
                {monthState === 'ABIERTO' && !isClosing && (
                  <MonthOpenView
                    mes={selectedMonth}
                    eventos={eventos}
                    onToggleEstado={handleToggleEstado}
                    onEditMonto={handleEditMonto}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onAddEvent={handleAddEvent}
                    promedioMensual={promedioMensual}
                    concepts={apiConcepts.map(c => ({
                      id: c.id,
                      nombre: c.name,
                      categoria: c.nature as 'fijo' | 'variable' | 'extraordinario',
                    }))}
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
              </div>
            </div>
          </div>
        </div>
      );
      
      setDomainContent('mes', content);
    } else {
      setDomainContent('mes', null);
    }
  }, [activeDomain, selectedMonth, eventos, monthState, isClosing, resultadoMes, promedioMensual, apiConcepts, mesesAtrasados, setDomainContent]);

  // Renderizar contenido directamente - el Ring es decorativo pero el contenido debe ser visible
  return (
    <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>
      <div className="p-8">
        <div className="mb-8 flex justify-center">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
        {mesesAtrasados.length > 0 && !mesesAtrasados.some(m => m.mes === selectedMonth) && (
          <div className="mb-8 flex justify-center">
            <UnclosedMonthsAlert 
              mesesAtrasados={mesesAtrasados}
              onSelectMonth={(mes) => setSelectedMonth(mes)}
            />
          </div>
        )}
        <div className="relative min-h-[60vh] flex flex-col items-center">
          <RadialCard className="mb-12" padding="large">
            <div className="flex flex-col items-center justify-center">
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                RESULTADO DEL MES
              </div>
              <CurrencyDisplay 
                value={resultadoMes} 
                size="display" 
                showSecondary={false}
                originalCurrency="USD"
              />
              <div className="text-body text-text-secondary text-center mt-4" style={{ opacity: 0.5 }}>
                {selectedMonth}
              </div>
            </div>
          </RadialCard>
          <div className="w-full max-w-4xl">
            {monthState === 'ABIERTO' && !isClosing && (
              <MonthOpenView
                mes={selectedMonth}
                eventos={eventos}
                onToggleEstado={handleToggleEstado}
                onEditMonto={handleEditMonto}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onAddEvent={handleAddEvent}
                promedioMensual={promedioMensual}
                concepts={apiConcepts.map(c => ({
                  id: c.id,
                  nombre: c.name,
                  categoria: c.nature as 'fijo' | 'variable' | 'extraordinario',
                }))}
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
          </div>
        </div>
      </div>
    </div>
  );
}
