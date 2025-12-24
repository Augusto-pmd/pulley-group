// Conceptos únicos de egresos personales
// Basados en datos reales del Excel de egresos

export interface Concepto {
  id: string;
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  categoria: 'fijo' | 'variable' | 'extraordinario';
  recurrente: boolean;
  frecuencia?: 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'libre';
  montoEstimado?: number;
  ultimoUso?: string; // YYYY-MM-DD
  nota?: string;
}

// Conceptos únicos extraídos del Excel
// Cada concepto aparece una sola vez, independientemente de cuántas veces se use
export const conceptosMock: Concepto[] = [
  {
    id: 'c-001',
    nombre: 'Alquiler',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 50000,
    ultimoUso: '2024-03-01',
  },
  {
    id: 'c-002',
    nombre: 'Expensas',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 15000,
    ultimoUso: '2024-03-01',
  },
  {
    id: 'c-003',
    nombre: 'Luz',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 8000,
    ultimoUso: '2024-03-10',
  },
  {
    id: 'c-004',
    nombre: 'Gas',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 5000,
    ultimoUso: '2024-03-10',
  },
  {
    id: 'c-005',
    nombre: 'Agua',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'bimestral',
    montoEstimado: 6000,
    ultimoUso: '2024-02-15',
  },
  {
    id: 'c-006',
    nombre: 'Internet',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 12000,
    ultimoUso: '2024-03-05',
  },
  {
    id: 'c-007',
    nombre: 'Teléfono',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 5000,
    ultimoUso: '2024-03-05',
  },
  {
    id: 'c-008',
    nombre: 'Supermercado',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 35000,
    ultimoUso: '2024-03-15',
  },
  {
    id: 'c-009',
    nombre: 'Farmacia',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 8000,
    ultimoUso: '2024-03-20',
  },
  {
    id: 'c-010',
    nombre: 'Transporte',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 15000,
    ultimoUso: '2024-03-25',
  },
  {
    id: 'c-011',
    nombre: 'Gimnasio',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 12000,
    ultimoUso: '2024-03-01',
  },
  {
    id: 'c-012',
    nombre: 'Seguro Auto',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 18000,
    ultimoUso: '2024-03-01',
  },
  {
    id: 'c-013',
    nombre: 'Restaurante',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: false,
    frecuencia: 'libre',
    montoEstimado: 10000,
    ultimoUso: '2024-03-18',
  },
  {
    id: 'c-014',
    nombre: 'Ropa',
    tipo: 'egreso',
    categoria: 'extraordinario',
    recurrente: false,
    frecuencia: 'libre',
    montoEstimado: 25000,
    ultimoUso: '2024-02-10',
  },
  {
    id: 'c-015',
    nombre: 'Mantenimiento Auto',
    tipo: 'egreso',
    categoria: 'extraordinario',
    recurrente: false,
    frecuencia: 'libre',
    montoEstimado: 30000,
    ultimoUso: '2024-01-15',
  },
  {
    id: 'c-016',
    nombre: 'Impuestos',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'anual',
    montoEstimado: 120000,
    ultimoUso: '2023-12-15',
  },
  {
    id: 'c-017',
    nombre: 'Servicio Streaming',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 5000,
    ultimoUso: '2024-03-01',
  },
  {
    id: 'c-018',
    nombre: 'Medicamentos',
    tipo: 'egreso',
    categoria: 'variable',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 6000,
    ultimoUso: '2024-03-20',
  },
  {
    id: 'c-019',
    nombre: 'Cuota Auto',
    tipo: 'egreso',
    categoria: 'fijo',
    recurrente: true,
    frecuencia: 'mensual',
    montoEstimado: 500, // USD aproximado
    ultimoUso: '2024-03-01',
  },
];

// Función helper para obtener concepto por ID
export function getConceptoById(id: string): Concepto | undefined {
  return conceptosMock.find((c) => c.id === id);
}

// Función helper para obtener conceptos por categoría
export function getConceptosByCategoria(categoria: Concepto['categoria']): Concepto[] {
  return conceptosMock.filter((c) => c.categoria === categoria);
}

// Función helper para obtener conceptos recurrentes
export function getConceptosRecurrentes(): Concepto[] {
  return conceptosMock.filter((c) => c.recurrente);
}

