// Sistema de estados del mes para Vida Mensual
// Estados: ABIERTO, EN_CIERRE, CERRADO
// REGLA: Los meses se abren automáticamente el día 1 de cada mes

export type MonthStatus = 'ABIERTO' | 'EN_CIERRE' | 'CERRADO';

export interface MonthState {
  mes: string; // YYYY-MM
  estado: MonthStatus;
  fechaApertura: string; // YYYY-MM-DD (siempre presente, día 1 del mes)
  fechaCierre?: string; // YYYY-MM-DD (solo si está cerrado)
  nota?: string;
}

// Datos mock eliminados - usar API real
// Los estados de mes se cargan desde /api/months
export const monthStatesMock: MonthState[] = [];

// Helper: obtener el primer día del mes en formato YYYY-MM-DD
function getFirstDayOfMonth(mes: string): string {
  const [year, month] = mes.split('-');
  return `${year}-${month}-01`;
}

// Helper: obtener estado del mes actual (con apertura automática)
export function getCurrentMonthState(): MonthState {
  const hoy = new Date();
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  const primerDiaDelMes = getFirstDayOfMonth(mesActual);
  
  // Buscar estado existente
  let state = monthStatesMock.find((s) => s.mes === mesActual);
  
  if (state) {
    return state;
  }
  
  // Si no existe, crear automáticamente como ABIERTO (apertura automática)
  // La fecha de apertura es siempre el día 1 del mes
  return {
    mes: mesActual,
    estado: 'ABIERTO',
    fechaApertura: primerDiaDelMes,
  };
}

// Helper: obtener estado de un mes específico
export function getMonthState(mes: string): MonthState | undefined {
  const state = monthStatesMock.find((s) => s.mes === mes);
  
  // Si no existe, crear automáticamente como ABIERTO si es un mes válido
  if (!state) {
    const primerDiaDelMes = getFirstDayOfMonth(mes);
    return {
      mes,
      estado: 'ABIERTO',
      fechaApertura: primerDiaDelMes,
    };
  }
  
  return state;
}

// Helper: obtener mes actual en formato YYYY-MM
export function getCurrentMonth(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

// Helper: obtener meses anteriores sin cerrar
export function getUnclosedPreviousMonths(): MonthState[] {
  const hoy = new Date();
  const mesActual = getCurrentMonth();
  const [currentYear, currentMonth] = mesActual.split('-').map(Number);
  
  const mesesAtrasados: MonthState[] = [];
  
  // Revisar últimos 12 meses
  for (let i = 1; i <= 12; i++) {
    let year = currentYear;
    let month = currentMonth - i;
    
    while (month <= 0) {
      month += 12;
      year -= 1;
    }
    
    const mesStr = `${year}-${String(month).padStart(2, '0')}`;
    const state = getMonthState(mesStr);
    
    if (state && state.estado === 'ABIERTO') {
      mesesAtrasados.push(state);
    }
  }
  
  return mesesAtrasados;
}

// Helper: cerrar un mes (guardar fecha de cierre)
export function closeMonth(mes: string, fechaCierre: string = new Date().toISOString().split('T')[0]): void {
  const index = monthStatesMock.findIndex((s) => s.mes === mes);
  if (index !== -1) {
    monthStatesMock[index].estado = 'CERRADO';
    monthStatesMock[index].fechaCierre = fechaCierre;
  }
}

