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

// Datos mock eliminados - usar API real
export const emmaEstadoActual: EmmaEstadoActual = {
  capitalAcumulado: 0,
  fechaCorte: new Date().toISOString().split('T')[0],
  aportesAcumulados: 0,
  rendimientoHistoricoPromedio: 0,
};

export const emmaTramosMock: EmmaTramo[] = [];

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

  // Si no hay tramos, retornar array vacío
  if (!emmaTramosMock || emmaTramosMock.length === 0) {
    return evolution;
  }

  // Año 0: usar capital inicial del primer tramo (debe ser dato real)
  const firstTramo = emmaTramosMock[0];
  if (!firstTramo || firstTramo.capitalInicial === 0) {
    return evolution; // Si no hay capital inicial real, no hay evolución
  }

  evolution.push({
    year: 0,
    capital: firstTramo.capitalInicial,
    variation: 0,
    tramoId: firstTramo?.id,
  });

  let currentCapital = firstTramo.capitalInicial;

  // Procesar cada tramo
  for (const tramo of emmaTramosMock) {
    const startDate = new Date(tramo.fechaInicio);
    const endDate = tramo.fechaFin ? new Date(tramo.fechaFin) : new Date('2054-12-31'); // 30 años desde inicio
    
    // Calcular años del tramo desde la fecha de inicio del primer tramo (dato real)
    const firstTramoStartDate = new Date(emmaTramosMock[0].fechaInicio);
    const startYear = Math.floor((startDate.getTime() - firstTramoStartDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const endYear = Math.min(
      Math.floor((endDate.getTime() - firstTramoStartDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
      30
    );

    // Si es el primer tramo, ajustar capital inicial
    if (firstTramo && tramo.id === firstTramo.id) {
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

