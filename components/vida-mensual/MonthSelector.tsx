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
  
  const getStatusColor = () => {
    return 'text-text-primary';
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
            className="px-3 py-1.5 rounded-input text-body transition-colors duration-fast"
            style={{ 
              color: hasPrev ? '#F5F2EC' : '#8E8E8A',
              cursor: hasPrev ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => hasPrev && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)')}
            onMouseLeave={(e) => hasPrev && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="px-3 py-1.5 rounded-input text-body transition-colors duration-fast"
            style={{ 
              color: hasNext ? '#F5F2EC' : '#8E8E8A',
              cursor: hasNext ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => hasNext && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)')}
            onMouseLeave={(e) => hasNext && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            →
          </button>
        </div>
        
        {/* Selector de Mes */}
        <div className="flex items-center gap-3 flex-1">
          <label className="text-body text-text-secondary whitespace-nowrap">
            Mes:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-4 py-2 rounded-input text-body transition-colors duration-fast min-w-[200px]"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#B59A6A';
              e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
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
            <span className="text-body-small text-text-secondary uppercase tracking-wider">
              Mes actual
            </span>
          )}
          <div className="text-body-small font-medium uppercase tracking-wider text-text-primary">
            {getStatusLabel(monthState)}
          </div>
        </div>
      </div>
    </Card>
  );
}

