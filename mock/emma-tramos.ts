// Sistema de tramos de proyección para Fondo Emma
// Cada tramo tiene sus propias variables y aplica solo hacia adelante

export interface EmmaTramo {
  id: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin?: string; // YYYY-MM-DD (undefined si es el tramo actual)
  instrumento: string;
  rendimientoEsperado: number; // % anual (nominal)
  inflacionAsumida: number; // % anual (supuesto de inflación para este tramo)
  aporteMensual: number; // USD
  capitalInicial: number; // Capital al inicio de este tramo (USD)
  nota?: string;
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

export interface EmmaEstadoActual {
  capitalAcumulado: number;
  fechaCorte: string; // YYYY-MM-DD
  aportesAcumulados: number;
  rendimientoHistoricoPromedio: number; // % anual (mock)
}

// Mock: estado actual del Fondo Emma (solo lectura)
export const emmaEstadoActual: EmmaEstadoActual = {
  capitalAcumulado: 3200000,
  fechaCorte: '2024-03-15',
  aportesAcumulados: 2800000, // Aportes totales realizados
  rendimientoHistoricoPromedio: 12.5, // Mock: promedio histórico
};

// Mock: tramos históricos y actual
export const emmaTramosMock: EmmaTramo[] = [
  // Tramo 1: Inicial (cerrado)
  {
    id: 't-001',
    fechaInicio: '2022-01-15',
    fechaFin: '2023-06-30',
    instrumento: 'Fondo Renta Fija',
    rendimientoEsperado: 8.5,
    inflacionAsumida: 25.0,
    aporteMensual: 100000,
    capitalInicial: 1000000,
    nota: 'Tramo inicial del fondo',
    fechaCreacion: '2022-01-15',
  },
  // Tramo 2: Intermedio (cerrado)
  {
    id: 't-002',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-02-28',
    instrumento: 'Fondo Mixto',
    rendimientoEsperado: 10.0,
    inflacionAsumida: 25.0,
    aporteMensual: 120000,
    capitalInicial: 2200000, // Capital al inicio de este tramo
    nota: 'Cambio a fondo mixto para mayor crecimiento',
    fechaCreacion: '2023-07-01',
  },
  // Tramo 3: Actual (sin fechaFin)
  {
    id: 't-003',
    fechaInicio: '2024-03-01',
    fechaFin: undefined, // Tramo actual
    instrumento: 'Fondo Renta Variable',
    rendimientoEsperado: 12.0,
    inflacionAsumida: 25.0,
    aporteMensual: 150000,
    capitalInicial: 3000000, // Capital al inicio de este tramo
    nota: 'Mayor exposición a renta variable',
    fechaCreacion: '2024-03-01',
  },
];

// Helper: obtener tramo actual
export function getTramoActual(): EmmaTramo | undefined {
  return emmaTramosMock.find((t) => !t.fechaFin);
}

// Helper: obtener tramos históricos (cerrados)
export function getTramosHistoricos(): EmmaTramo[] {
  return emmaTramosMock.filter((t) => t.fechaFin !== undefined).sort((a, b) => 
    b.fechaInicio.localeCompare(a.fechaInicio)
  );
}

// Helper: calcular evolución con tramos (solo capital proyectado, no nominal/real)
export function getEmmaEvolutionWithTramos(): Array<{
  year: number;
  capital: number; // Capital proyectado en USD
  variation: number;
  tramoId?: string;
}> {
  const evolution: Array<{
    year: number;
    capital: number;
    variation: number;
    tramoId?: string;
  }> = [];

  // Año 0: aporte inicial
  const initialContribution = 1000000;
  evolution.push({
    year: 0,
    capital: initialContribution,
    variation: 0,
    tramoId: emmaTramosMock[0].id,
  });

  let currentCapital = initialContribution;

  // Procesar cada tramo
  for (const tramo of emmaTramosMock) {
    const startDate = new Date(tramo.fechaInicio);
    const endDate = tramo.fechaFin ? new Date(tramo.fechaFin) : new Date('2054-12-31'); // 30 años desde inicio
    
    // Calcular años del tramo
    const startYear = Math.floor((startDate.getTime() - new Date('2022-01-15').getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const endYear = Math.min(
      Math.floor((endDate.getTime() - new Date('2022-01-15').getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
      30
    );

    // Si es el primer tramo, ajustar capital inicial
    if (tramo.id === emmaTramosMock[0].id) {
      currentCapital = tramo.capitalInicial;
    }

    // Calcular evolución año a año para este tramo
    const monthlyContribution = tramo.aporteMensual;
    const annualContribution = monthlyContribution * 12;
    const interestRate = tramo.rendimientoEsperado / 100;

    for (let year = Math.max(1, startYear + 1); year <= endYear; year++) {
      const prevCapital = evolution[evolution.length - 1]?.capital || currentCapital;
      const capital = Math.round(prevCapital * (1 + interestRate) + annualContribution);
      const variation = prevCapital > 0 ? ((capital - prevCapital) / prevCapital) * 100 : 0;

      evolution.push({
        year,
        capital,
        variation,
        tramoId: tramo.id,
      });
    }

    // Actualizar capital para el siguiente tramo
    if (tramo.fechaFin) {
      currentCapital = evolution[evolution.length - 1]?.capital || currentCapital;
    }
  }

  return evolution;
}

