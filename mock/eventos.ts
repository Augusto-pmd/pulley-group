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

// Eventos mensuales extraídos del Excel
// Cada mes es un evento independiente, no se sobrescriben valores
// TC aplicado: Enero-Marzo 2024 = 800, Abril 2024 = 1000
export const eventosMock: EventoMensual[] = [
  // Enero 2024 (TC: 800)
  createEvento('e-001', 'c-001', 'Alquiler', 'egreso', '2024-01-01', '2024-01', 50000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-002', 'c-002', 'Expensas', 'egreso', '2024-01-01', '2024-01', 15000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-003', 'c-003', 'Luz', 'egreso', '2024-01-10', '2024-01', 8500, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-004', 'c-004', 'Gas', 'egreso', '2024-01-10', '2024-01', 5200, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-005', 'c-006', 'Internet', 'egreso', '2024-01-05', '2024-01', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-006', 'c-007', 'Teléfono', 'egreso', '2024-01-05', '2024-01', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-007', 'c-008', 'Supermercado', 'egreso', '2024-01-15', '2024-01', 32000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-008', 'c-009', 'Farmacia', 'egreso', '2024-01-20', '2024-01', 7500, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-009', 'c-010', 'Transporte', 'egreso', '2024-01-25', '2024-01', 14000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-010', 'c-011', 'Gimnasio', 'egreso', '2024-01-01', '2024-01', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-011', 'c-012', 'Seguro Auto', 'egreso', '2024-01-01', '2024-01', 18000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-012', 'c-017', 'Servicio Streaming', 'egreso', '2024-01-01', '2024-01', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-013', 'c-015', 'Mantenimiento Auto', 'egreso', '2024-01-15', '2024-01', 30000, 'ARS', 800, 'pagado', 'extraordinario', 'Cambio de aceite y revisión'),
  
  // Febrero 2024 (TC: 800)
  createEvento('e-014', 'c-001', 'Alquiler', 'egreso', '2024-02-01', '2024-02', 50000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-015', 'c-002', 'Expensas', '2024-02-01', '2024-02', 15000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-016', 'c-003', 'Luz', '2024-02-10', '2024-02', 7800, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-017', 'c-004', 'Gas', '2024-02-10', '2024-02', 4800, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-018', 'c-005', 'Agua', '2024-02-15', '2024-02', 6000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-019', 'c-006', 'Internet', '2024-02-05', '2024-02', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-020', 'c-007', 'Teléfono', '2024-02-05', '2024-02', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-021', 'c-008', 'Supermercado', '2024-02-15', '2024-02', 38000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-022', 'c-009', 'Farmacia', '2024-02-20', '2024-02', 8200, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-023', 'c-010', 'Transporte', '2024-02-25', '2024-02', 16000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-024', 'c-011', 'Gimnasio', '2024-02-01', '2024-02', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-025', 'c-012', 'Seguro Auto', '2024-02-01', '2024-02', 18000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-026', 'c-014', 'Ropa', '2024-02-10', '2024-02', 25000, 'ARS', 800, 'pagado', 'extraordinario'),
  createEvento('e-027', 'c-017', 'Servicio Streaming', '2024-02-01', '2024-02', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-028', 'c-018', 'Medicamentos', '2024-02-20', '2024-02', 5500, 'ARS', 800, 'pagado', 'variable'),
  
  // Marzo 2024 (TC: 800)
  createEvento('e-029', 'c-001', 'Alquiler', 'egreso', '2024-03-01', '2024-03', 50000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-030', 'c-002', 'Expensas', 'egreso', '2024-03-01', '2024-03', 15000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-031', 'c-003', 'Luz', 'egreso', '2024-03-10', '2024-03', 8200, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-032', 'c-004', 'Gas', 'egreso', '2024-03-10', '2024-03', 5100, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-033', 'c-006', 'Internet', 'egreso', '2024-03-05', '2024-03', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-034', 'c-007', 'Teléfono', 'egreso', '2024-03-05', '2024-03', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-035', 'c-008', 'Supermercado', 'egreso', '2024-03-15', '2024-03', 35000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-036', 'c-009', 'Farmacia', 'egreso', '2024-03-20', '2024-03', 8000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-037', 'c-010', 'Transporte', 'egreso', '2024-03-25', '2024-03', 15000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-038', 'c-011', 'Gimnasio', 'egreso', '2024-03-01', '2024-03', 12000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-039', 'c-012', 'Seguro Auto', 'egreso', '2024-03-01', '2024-03', 18000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-040', 'c-013', 'Restaurante', 'egreso', '2024-03-18', '2024-03', 10000, 'ARS', 800, 'pagado', 'variable'),
  createEvento('e-041', 'c-017', 'Servicio Streaming', 'egreso', '2024-03-01', '2024-03', 5000, 'ARS', 800, 'pagado', 'fijo'),
  createEvento('e-042', 'c-018', 'Medicamentos', 'egreso', '2024-03-20', '2024-03', 6000, 'ARS', 800, 'pagado', 'variable'),
  
  // Abril 2024 (TC: 1000)
  createEvento('e-043', 'c-001', 'Alquiler', 'egreso', '2024-04-01', '2024-04', 50000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-044', 'c-002', 'Expensas', 'egreso', '2024-04-01', '2024-04', 15000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-045', 'c-003', 'Luz', 'egreso', '2024-04-10', '2024-04', 7900, 'ARS', 1000, 'pendiente', 'variable'),
  createEvento('e-046', 'c-004', 'Gas', 'egreso', '2024-04-10', '2024-04', 4900, 'ARS', 1000, 'pendiente', 'variable'),
  createEvento('e-047', 'c-006', 'Internet', 'egreso', '2024-04-05', '2024-04', 12000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-048', 'c-007', 'Teléfono', 'egreso', '2024-04-05', '2024-04', 5000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-049', 'c-008', 'Supermercado', 'egreso', '2024-04-15', '2024-04', 36000, 'ARS', 1000, 'pendiente', 'variable'),
  createEvento('e-050', 'c-011', 'Gimnasio', 'egreso', '2024-04-01', '2024-04', 12000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-051', 'c-012', 'Seguro Auto', 'egreso', '2024-04-01', '2024-04', 18000, 'ARS', 1000, 'pagado', 'fijo'),
  createEvento('e-052', 'c-017', 'Servicio Streaming', 'egreso', '2024-04-01', '2024-04', 5000, 'ARS', 1000, 'pagado', 'fijo'),
];

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
