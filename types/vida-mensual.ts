// Tipos compartidos para Vida Mensual
// Sin dependencia de mocks

export type EstadoEvento = 'pagado' | 'pendiente';
export type MonthStatusType = 'ABIERTO' | 'EN_CIERRE' | 'CERRADO';

export interface EventoMensual {
  id: string;
  conceptoId: string;
  conceptoNombre: string;
  tipo: 'ingreso' | 'egreso';
  fecha: string;
  mes: string;
  monto: number;
  monedaOriginal: 'ARS' | 'USD';
  tipoCambioAplicado?: number;
  montoUsd: number;
  estado: EstadoEvento;
  categoria: 'fijo' | 'variable' | 'extraordinario';
  nota?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
}

export interface MonthStateType {
  mes: string;
  estado: MonthStatusType;
  fechaApertura: string;
  fechaCierre?: string;
  nota?: string;
}

