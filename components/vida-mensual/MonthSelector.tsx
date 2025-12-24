'use client';

import Card from '../Card';
import { getMonthState, getCurrentMonth, type MonthState } from '@/mock/month-status';
import { getMesesDisponibles } from '@/mock/eventos';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (mes: string) => void;
  availableMonths?: string[]; // Opcional: si no se pasa, se calculan automáticamente
}

export default function MonthSelector({ selectedMonth, onMonthChange, availableMonths }: MonthSelectorProps) {
  // Obtener todos los meses disponibles (de eventos y estados)
  const mesesFromEventos = availableMonths || getMesesDisponibles();
  const currentMonth = getCurrentMonth();
  
  // Generar lista de meses: últimos 12 meses + meses con eventos
  const allMonths: string[] = [];
  const [currentYear, currentMonthNum] = currentMonth.split('-').map(Number);
  
  // Agregar últimos 12 meses
  for (let i = 0; i < 12; i++) {
    let year = currentYear;
    let month = currentMonthNum - i;
    
    while (month <= 0) {
      month += 12;
      year -= 1;
    }
    
    const mesStr = `${year}-${String(month).padStart(2, '0')}`;
    if (!allMonths.includes(mesStr)) {
      allMonths.push(mesStr);
    }
  }
  
  // Agregar meses con eventos que no estén en la lista
  mesesFromEventos.forEach((mes) => {
    if (!allMonths.includes(mes)) {
      allMonths.push(mes);
    }
  });
  
  // Ordenar: más reciente primero
  allMonths.sort((a, b) => (b ?? "").localeCompare(a ?? ""));
  
  // Obtener estado del mes seleccionado
  const monthState = getMonthState(selectedMonth);
  const isCurrentMonth = selectedMonth === currentMonth;
  
  const formatMonth = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getStatusLabel = (state?: MonthState) => {
    if (!state) return 'ABIERTO';
    return state.estado;
  };
  
  const getStatusColor = (state?: MonthState) => {
    if (!state || state.estado === 'ABIERTO') return 'text-blue-system';
    if (state.estado === 'EN_CIERRE') return 'text-orange-warning';
    return 'text-gray-text-tertiary';
  };
  
  // Navegación prev/next
  const currentIndex = allMonths.indexOf(selectedMonth);
  const hasPrev = currentIndex < allMonths.length - 1;
  const hasNext = currentIndex > 0;
  
  const handlePrev = () => {
    if (hasPrev) {
      onMonthChange(allMonths[currentIndex + 1]);
    }
  };
  
  const handleNext = () => {
    if (hasNext) {
      onMonthChange(allMonths[currentIndex - 1]);
    }
  };
  
  return (
    <Card padding="normal">
      <div className="flex items-center justify-between gap-4">
        {/* Navegación Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`px-3 py-1.5 rounded-input text-body transition-colors duration-fast ${
              hasPrev
                ? 'text-gray-text-primary hover:bg-white/50'
                : 'text-gray-text-disabled cursor-not-allowed'
            }`}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`px-3 py-1.5 rounded-input text-body transition-colors duration-fast ${
              hasNext
                ? 'text-gray-text-primary hover:bg-white/50'
                : 'text-gray-text-disabled cursor-not-allowed'
            }`}
          >
            →
          </button>
        </div>
        
        {/* Selector de Mes */}
        <div className="flex items-center gap-3 flex-1">
          <label className="text-body text-gray-text-tertiary whitespace-nowrap">
            Mes:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast min-w-[200px]"
          >
            {allMonths.map((mes) => {
              const state = getMonthState(mes);
              const label = formatMonth(mes);
              const status = getStatusLabel(state);
              return (
                <option key={mes} value={mes}>
                  {label} {status === 'CERRADO' ? '(Cerrado)' : status === 'ABIERTO' ? '(Abierto)' : ''}
                </option>
              );
            })}
          </select>
        </div>
        
        {/* Estado del Mes */}
        <div className="flex items-center gap-3">
          {isCurrentMonth && (
            <span className="text-body-small text-gray-text-disabled uppercase tracking-wider">
              Mes actual
            </span>
          )}
          <div className={`text-body-small font-medium uppercase tracking-wider ${getStatusColor(monthState)}`}>
            {getStatusLabel(monthState)}
          </div>
        </div>
      </div>
    </Card>
  );
}

