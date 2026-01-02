// Sistema de Activos Patrimoniales
// Activos = bienes con valor económico, independiente de si generan flujo o no
// Todos los valores se expresan en USD

export type TipoActivo = 'inmueble' | 'vehiculo' | 'otro';

export interface ValuacionActivo {
  id: string;
  activoId: string;
  fecha: string; // YYYY-MM-DD
  valorUsd: number; // Valor en USD
  nota?: string;
  fechaCreacion: string; // YYYY-MM-DD
}

export interface Pasivo {
  id: string;
  activoId: string;
  montoFinanciadoUsd: number; // Monto total financiado en USD
  cuotasTotales: number; // Total de cuotas
  cuotasRestantes: number; // Cuotas que faltan pagar
  valorCuotaUsd: number; // Valor de cada cuota en USD
  saldoPendienteUsd: number; // Saldo pendiente en USD
  conceptoId?: string; // ID del concepto de Vida Mensual asociado (opcional)
  conceptoNombre?: string; // Nombre del concepto (denormalizado)
  fechaInicio: string; // YYYY-MM-DD
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

export interface PagoPasivo {
  id: string;
  pasivoId: string;
  activoId: string;
  eventoMensualId: string; // ID del evento de Vida Mensual que generó este pago
  fecha: string; // YYYY-MM-DD
  montoUsd: number; // Monto pagado en USD
  saldoAnteriorUsd: number; // Saldo antes del pago
  saldoNuevoUsd: number; // Saldo después del pago
  cuotasRestantesAnterior: number; // Cuotas restantes antes del pago
  cuotasRestantesNuevo: number; // Cuotas restantes después del pago
  fechaCreacion: string; // YYYY-MM-DD
}

export type EstadoFiscalActivo = 'declarado' | 'no_declarado';

export interface Activo {
  id: string;
  nombre: string;
  tipo: TipoActivo;
  valorActualUsd: number; // Valor de la última valuación
  fechaUltimaValuacion: string; // YYYY-MM-DD
  estadoFiscal: EstadoFiscalActivo; // Estado fiscal obligatorio
  observaciones?: string;
  pasivo?: Pasivo; // Pasivo asociado (opcional)
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

// Datos mock eliminados - usar API real
export const pasivosMock: Pasivo[] = [];
export const pagosPasivosMock: PagoPasivo[] = [];
export const activosMock: Activo[] = [];
export const valuacionesMock: ValuacionActivo[] = [];

// Helper: obtener valuaciones de un activo (ordenadas por fecha descendente)
export function getValuacionesByActivo(activoId: string): ValuacionActivo[] {
  return valuacionesMock
    .filter((v) => v.activoId === activoId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Helper: obtener valuación más reciente de un activo
export function getUltimaValuacion(activoId: string): ValuacionActivo | undefined {
  const valuaciones = getValuacionesByActivo(activoId);
  return valuaciones[0];
}

// Helper: calcular patrimonio neto de un activo (valor - saldo pendiente)
export function getPatrimonioNetoActivo(activo: Activo): number {
  const saldoPendiente = activo.pasivo?.saldoPendienteUsd || 0;
  return activo.valorActualUsd - saldoPendiente;
}

// Helper: calcular total de activos en USD (valor bruto)
export function getTotalActivosUsd(): number {
  return activosMock.reduce((sum, activo) => sum + activo.valorActualUsd, 0);
}

// Helper: calcular total de pasivos en USD
export function getTotalPasivosUsd(): number {
  return pasivosMock.reduce((sum, pasivo) => sum + pasivo.saldoPendienteUsd, 0);
}

// Helper: calcular patrimonio neto total de activos (valor - pasivos) - TODOS los activos
export function getPatrimonioNetoActivosUsd(): number {
  return activosMock.reduce((sum, activo) => sum + getPatrimonioNetoActivo(activo), 0);
}

// Helper: calcular patrimonio neto de activos DECLARADOS (solo para cálculos fiscales)
export function getPatrimonioNetoActivosDeclaradosUsd(): number {
  return activosMock
    .filter((activo) => activo.estadoFiscal === 'declarado')
    .reduce((sum, activo) => sum + getPatrimonioNetoActivo(activo), 0);
}

// Helper: calcular patrimonio neto de activos NO DECLARADOS
export function getPatrimonioNetoActivosNoDeclaradosUsd(): number {
  return activosMock
    .filter((activo) => activo.estadoFiscal === 'no_declarado')
    .reduce((sum, activo) => sum + getPatrimonioNetoActivo(activo), 0);
}

// Helper: agregar nueva valuación
export function addValuacion(
  activoId: string,
  fecha: string,
  valorUsd: number,
  nota?: string
): ValuacionActivo {
  const nuevaValuacion: ValuacionActivo = {
    id: `v-${Date.now()}`,
    activoId,
    fecha,
    valorUsd,
    nota,
    fechaCreacion: new Date().toISOString().split('T')[0],
  };
  
  valuacionesMock.push(nuevaValuacion);
  
  // Actualizar valor actual del activo
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.valorActualUsd = valorUsd;
    activo.fechaUltimaValuacion = fecha;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }
  
  return nuevaValuacion;
}

// Helper: crear nuevo activo
export function addActivo(
  nombre: string,
  tipo: TipoActivo,
  valorInicialUsd: number,
  fechaValuacion: string,
  observaciones?: string
): Activo {
  const nuevoActivo: Activo = {
    id: `a-${Date.now()}`,
    nombre,
    tipo,
    valorActualUsd: valorInicialUsd,
    fechaUltimaValuacion: fechaValuacion,
    estadoFiscal: 'no_declarado',
    observaciones,
    fechaCreacion: new Date().toISOString().split('T')[0],
  };
  
  activosMock.push(nuevoActivo);
  
  // Crear valuación inicial
  addValuacion(nuevoActivo.id, fechaValuacion, valorInicialUsd, 'Valuación inicial');
  
  return nuevoActivo;
}

// Helper: actualizar nombre de un activo
export function updateActivoNombre(activoId: string, nombre: string): void {
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.nombre = nombre;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }
}

// Helper: actualizar tipo de un activo
export function updateActivoTipo(activoId: string, tipo: TipoActivo): void {
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.tipo = tipo;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }
}

// Helper: actualizar observaciones de un activo
export function updateActivoObservaciones(activoId: string, observaciones: string): void {
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.observaciones = observaciones;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }
}

// Helper: actualizar estado fiscal de un activo
export function updateActivoEstadoFiscal(activoId: string, estadoFiscal: EstadoFiscalActivo): void {
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.estadoFiscal = estadoFiscal;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }
}

// Helper: obtener pasivo por activo
export function getPasivoByActivo(activoId: string): Pasivo | undefined {
  return pasivosMock.find((p) => p.activoId === activoId);
}

// Helper: obtener pagos de un pasivo
export function getPagosByPasivo(pasivoId: string): PagoPasivo[] {
  return pagosPasivosMock
    .filter((pp) => pp.pasivoId === pasivoId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Helper: procesar pago de cuota (llamado desde Vida Mensual)
export function procesarPagoCuota(
  eventoMensualId: string,
  conceptoId: string,
  montoUsd: number,
  fecha: string
): PagoPasivo | null {
  // Buscar pasivo asociado al concepto
  const pasivo = pasivosMock.find((p) => p.conceptoId === conceptoId);
  if (!pasivo) return null;

  // Verificar que el monto coincida (aproximadamente) con el valor de la cuota
  const diferencia = Math.abs(montoUsd - pasivo.valorCuotaUsd);
  if (diferencia > pasivo.valorCuotaUsd * 0.1) {
    // Si la diferencia es mayor al 10%, no procesar automáticamente
    return null;
  }

  // Calcular nuevo saldo y cuotas restantes
  const saldoAnterior = pasivo.saldoPendienteUsd;
  const cuotasRestantesAnterior = pasivo.cuotasRestantes;
  const saldoNuevo = Math.max(0, saldoAnterior - montoUsd);
  const cuotasRestantesNuevo = Math.max(0, cuotasRestantesAnterior - 1);

  // Crear evento de pago
  const pago: PagoPasivo = {
    id: `pp-${Date.now()}`,
    pasivoId: pasivo.id,
    activoId: pasivo.activoId,
    eventoMensualId,
    fecha,
    montoUsd,
    saldoAnteriorUsd: saldoAnterior,
    saldoNuevoUsd: saldoNuevo,
    cuotasRestantesAnterior,
    cuotasRestantesNuevo,
    fechaCreacion: new Date().toISOString().split('T')[0],
  };

  pagosPasivosMock.push(pago);

  // Actualizar pasivo
  pasivo.saldoPendienteUsd = saldoNuevo;
  pasivo.cuotasRestantes = cuotasRestantesNuevo;
  pasivo.fechaModificacion = new Date().toISOString().split('T')[0];

  return pago;
}

// Helper: agregar pasivo a un activo
export function addPasivoToActivo(
  activoId: string,
  montoFinanciadoUsd: number,
  cuotasTotales: number,
  valorCuotaUsd: number,
  conceptoId: string,
  conceptoNombre: string,
  fechaInicio: string
): Pasivo {
  const nuevoPasivo: Pasivo = {
    id: `p-${Date.now()}`,
    activoId,
    montoFinanciadoUsd,
    cuotasTotales,
    cuotasRestantes: cuotasTotales,
    valorCuotaUsd,
    saldoPendienteUsd: montoFinanciadoUsd,
    conceptoId,
    conceptoNombre,
    fechaInicio,
    fechaCreacion: new Date().toISOString().split('T')[0],
  };

  pasivosMock.push(nuevoPasivo);

  // Asociar pasivo al activo
  const activo = activosMock.find((a) => a.id === activoId);
  if (activo) {
    activo.pasivo = nuevoPasivo;
    activo.fechaModificacion = new Date().toISOString().split('T')[0];
  }

  return nuevoPasivo;
}

