// Sistema de Inversiones para Pulley Group
// Inversiones = proyectos de colocación de capital con objetivo, plazo y criterio de evaluación

export type TipoInversion = 'financiera' | 'inmobiliaria';
export type TipoRetorno = 'renta' | 'capitalizacion' | 'mixta';
export type EstadoFiscalInversion = 'declarado' | 'no_declarado';

export interface Inversion {
  id: string;
  nombre: string;
  tipo: TipoInversion;
  fechaInicio: string; // YYYY-MM-DD
  montoObjetivo: number; // USD
  plazoEstimado: number; // meses
  tipoRetorno: TipoRetorno;
  estadoFiscal: EstadoFiscalInversion; // Obligatorio
  observaciones?: string;
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

// Mock: inversiones existentes
export const inversionesMock: Inversion[] = [
  {
    id: 'inv-001',
    nombre: 'Fondo Renta Variable',
    tipo: 'financiera',
    fechaInicio: '2022-03-15',
    montoObjetivo: 2500000,
    plazoEstimado: 60, // 5 años
    tipoRetorno: 'mixta',
    estadoFiscal: 'declarado',
    observaciones: 'Fondo diversificado de renta variable',
    fechaCreacion: '2022-03-15',
  },
  {
    id: 'inv-002',
    nombre: 'Bonos Gobierno',
    tipo: 'financiera',
    fechaInicio: '2022-01-10',
    montoObjetivo: 1800000,
    plazoEstimado: 36, // 3 años
    tipoRetorno: 'renta',
    estadoFiscal: 'declarado',
    observaciones: 'Bonos soberanos en USD',
    fechaCreacion: '2022-01-10',
  },
  {
    id: 'inv-003',
    nombre: 'Acciones Tech',
    tipo: 'financiera',
    fechaInicio: '2021-06-01',
    montoObjetivo: 1200000,
    plazoEstimado: 120, // 10 años
    tipoRetorno: 'capitalizacion',
    estadoFiscal: 'no_declarado',
    observaciones: 'Portfolio de acciones tecnológicas',
    fechaCreacion: '2021-06-01',
  },
  {
    id: 'inv-004',
    nombre: 'Proyecto Inmobiliario Nordelta',
    tipo: 'inmobiliaria',
    fechaInicio: '2023-01-01',
    montoObjetivo: 700000,
    plazoEstimado: 240, // 20 años
    tipoRetorno: 'capitalizacion',
    estadoFiscal: 'declarado',
    observaciones: 'Desarrollo inmobiliario, aportes escalonados',
    fechaCreacion: '2023-01-01',
  },
];

// Helper: obtener inversión por ID
export function getInversionById(id: string): Inversion | undefined {
  return inversionesMock.find((inv) => inv.id === id);
}

// Helper: obtener todas las inversiones activas
export function getInversionesActivas(): Inversion[] {
  // Por ahora todas están activas (en el futuro podría tener campo "estado" o "fechaFin")
  return inversionesMock;
}

// Helper: obtener inversiones declaradas
export function getInversionesDeclaradas(): Inversion[] {
  return inversionesMock.filter((inv) => inv.estadoFiscal === 'declarado');
}

// Helper: obtener inversiones no declaradas
export function getInversionesNoDeclaradas(): Inversion[] {
  return inversionesMock.filter((inv) => inv.estadoFiscal === 'no_declarado');
}

// Helper: agregar nueva inversión
export function addInversion(inversion: Omit<Inversion, 'id' | 'fechaCreacion'>): Inversion {
  const nuevaInversion: Inversion = {
    ...inversion,
    id: `inv-${String(inversionesMock.length + 1).padStart(3, '0')}`,
    fechaCreacion: new Date().toISOString().split('T')[0],
  };
  inversionesMock.push(nuevaInversion);
  return nuevaInversion;
}

// Helper: actualizar inversión
export function updateInversion(id: string, cambios: Partial<Omit<Inversion, 'id' | 'fechaCreacion'>>): Inversion | null {
  const index = inversionesMock.findIndex((inv) => inv.id === id);
  if (index === -1) return null;
  
  inversionesMock[index] = {
    ...inversionesMock[index],
    ...cambios,
    fechaModificacion: new Date().toISOString().split('T')[0],
  };
  
  return inversionesMock[index];
}

// Helper: obtener patrimonio total de inversiones (USD)
// Mock: por ahora usa montoObjetivo como proxy del capital actual
export function getPatrimonioTotalInversionesUsd(): number {
  return inversionesMock.reduce((sum, inv) => sum + inv.montoObjetivo, 0);
}

// Helper: obtener patrimonio de inversiones declaradas (USD)
export function getPatrimonioInversionesDeclaradasUsd(): number {
  return inversionesMock
    .filter((inv) => inv.estadoFiscal === 'declarado')
    .reduce((sum, inv) => sum + inv.montoObjetivo, 0);
}

// Helper: obtener patrimonio de inversiones no declaradas (USD)
export function getPatrimonioInversionesNoDeclaradasUsd(): number {
  return inversionesMock
    .filter((inv) => inv.estadoFiscal === 'no_declarado')
    .reduce((sum, inv) => sum + inv.montoObjetivo, 0);
}

