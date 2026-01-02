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

// Datos mock eliminados - usar API real
// Los conceptos se cargan desde /api/concepts
export const conceptosMock: Concepto[] = [];

