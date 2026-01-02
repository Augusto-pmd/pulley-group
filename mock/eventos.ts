// Eventos mensuales de egresos
// Cada celda con valor del Excel se convierte en un evento independiente
// Basados en datos reales del Excel de egresos

export type EstadoEvento = 'pagado' | 'pendiente';

export interface EventoMensual {
  id: string;
  conceptoId: string;
  conceptoNombre: string; // Denormalizado para facilitar visualización
  tipo: 'ingreso' | 'egreso'; // Tipo de movimiento
  fecha: string; // YYYY-MM-DD
  mes: string; // YYYY-MM para agrupación
  monto: number; // Monto original (ARS o USD según monedaOriginal)
  monedaOriginal: 'ARS' | 'USD'; // Moneda en la que se cargó el evento
  tipoCambioAplicado?: number; // TC aplicado al momento de crear el evento (solo si monedaOriginal = ARS)
  montoUsd: number; // Monto convertido a USD (siempre presente)
  estado: EstadoEvento;
  categoria: 'fijo' | 'variable' | 'extraordinario';
  nota?: string;
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

// Helper para crear evento con conversión automática
function createEvento(
  id: string,
  conceptoId: string,
  conceptoNombre: string,
  tipo: 'ingreso' | 'egreso',
  fecha: string,
  mes: string,
  monto: number,
  monedaOriginal: 'ARS' | 'USD',
  tipoCambioAplicado: number,
  estado: EstadoEvento,
  categoria: 'fijo' | 'variable' | 'extraordinario',
  nota?: string
): EventoMensual {
  const montoUsd = monedaOriginal === 'ARS' ? monto / tipoCambioAplicado : monto;
  return {
    id,
    conceptoId,
    conceptoNombre,
    tipo,
    fecha,
    mes,
    monto,
    monedaOriginal,
    tipoCambioAplicado: monedaOriginal === 'ARS' ? tipoCambioAplicado : undefined,
    montoUsd,
    estado,
    categoria,
    nota,
    fechaCreacion: fecha,
  };
}

// Datos mock eliminados - usar API real
// Los eventos se cargan desde /api/movements
export const eventosMock: EventoMensual[] = [];

// --- Funciones de ayuda para acceder a los eventos ---

export function getEventosByMes(mes: string, eventos: EventoMensual[] = eventosMock): EventoMensual[] {
  return eventos.filter(evento => evento.mes === mes).sort((a, b) => (a.fecha ?? "").localeCompare(b.fecha ?? ""));
}

export function getTotalByMes(mes: string, eventos: EventoMensual[] = eventosMock): number {
  return getEventosByMes(mes, eventos).reduce((sum, evento) => sum + evento.montoUsd, 0); // Total en USD
}

export function getMesesDisponibles(eventos: EventoMensual[] = eventosMock): string[] {
  const meses = Array.from(new Set(eventos.map(evento => evento.mes).filter((mes): mes is string => typeof mes === 'string' && mes.length > 0)));
  return meses.sort((a, b) => (b ?? "").localeCompare(a ?? "")); // Más reciente primero
}

export function getEventosByConcepto(conceptoId: string, eventos: EventoMensual[] = eventosMock): EventoMensual[] {
  return eventos.filter(evento => evento.conceptoId === conceptoId).sort((a, b) => (a.fecha ?? "").localeCompare(b.fecha ?? ""));
}

export function getTotalByConcepto(conceptoId: string, eventos: EventoMensual[] = eventosMock): number {
  return getEventosByConcepto(conceptoId, eventos).reduce((sum, evento) => sum + evento.montoUsd, 0); // Total en USD
}

export function getEventosPendientes(eventos: EventoMensual[] = eventosMock): EventoMensual[] {
  return eventos.filter(evento => evento.estado === 'pendiente').sort((a, b) => (a.fecha ?? "").localeCompare(b.fecha ?? ""));
}
