// Sistema Fiscal Argentino - Vista Contador
// Capa interpretativa: traduce datos reales a obligaciones fiscales
// No duplica carga, solo interpreta

import { eventosMock, type EventoMensual, getEventosByMes } from './eventos';
import { conceptosMock, type Concepto } from './conceptos';
import { activosMock, getPatrimonioNetoActivo, getPatrimonioNetoActivosDeclaradosUsd } from './activos';
import { getPatrimonioInversionesDeclaradasUsd } from './inversiones';
import { getCurrentExchangeRate, convertUsdToArsCurrent } from './exchange-rates';

// ============================================================================
// ETIQUETAS FISCALES POR CONCEPTO
// ============================================================================

export type EtiquetaFiscal = 
  | 'ingreso_facturado_afip'
  | 'gasto_deducible'
  | 'gasto_no_deducible'
  | 'pago_pasivo'
  | 'neutro_fiscal';

export interface ConceptoFiscal {
  conceptoId: string;
  etiquetaFiscal: EtiquetaFiscal;
  fechaDefinicion: string; // YYYY-MM-DD
}

// Datos mock eliminados - usar API real
// Las etiquetas fiscales deben almacenarse en la base de datos
export const conceptosFiscalesMock: ConceptoFiscal[] = [];

// Helper: obtener etiqueta fiscal de un concepto
export function getEtiquetaFiscal(conceptoId: string): EtiquetaFiscal {
  const conceptoFiscal = conceptosFiscalesMock.find((cf) => cf.conceptoId === conceptoId);
  return conceptoFiscal?.etiquetaFiscal || 'neutro_fiscal';
}

// Helper: actualizar etiqueta fiscal de un concepto
export function setEtiquetaFiscal(conceptoId: string, etiqueta: EtiquetaFiscal): void {
  const index = conceptosFiscalesMock.findIndex((cf) => cf.conceptoId === conceptoId);
  if (index >= 0) {
    conceptosFiscalesMock[index].etiquetaFiscal = etiqueta;
    conceptosFiscalesMock[index].fechaDefinicion = new Date().toISOString().split('T')[0];
  } else {
    conceptosFiscalesMock.push({
      conceptoId,
      etiquetaFiscal: etiqueta,
      fechaDefinicion: new Date().toISOString().split('T')[0],
    });
  }
}

// ============================================================================
// MONOTRIBUTO
// ============================================================================

export interface EstadoMonotributo {
  categoria: string; // 'A', 'B', 'C', etc.
  topeIngresosAnuales: number; // ARS
  ingresosAcumulados12Meses: number; // ARS (últimos 12 meses)
  porcentajeTope: number; // % del tope
  riesgoRecategorizacion: 'bajo' | 'medio' | 'alto';
  proximaRecategorizacion?: string; // Fecha estimada
}

// Topes Monotributo 2024 (ARS) - Mock
const TOPES_MONOTRIBUTO: Record<string, number> = {
  'A': 1_900_000,
  'B': 2_800_000,
  'C': 4_000_000,
  'D': 5_700_000,
  'E': 7_800_000,
  'F': 10_000_000,
  'G': 13_500_000,
  'H': 18_000_000,
};

// Helper: calcular ingresos facturados últimos 12 meses (en ARS)
export function getIngresosFacturados12Meses(): number {
  const hoy = new Date();
  const doceMesesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 12, 1);
  
  const eventosIngresos = eventosMock.filter((e) => {
    const fechaEvento = new Date(e.fecha);
    if (fechaEvento < doceMesesAtras) return false;
    
    const etiqueta = getEtiquetaFiscal(e.conceptoId);
    return etiqueta === 'ingreso_facturado_afip';
  });

  // Convertir a ARS usando TC actual
  const tcActual = getCurrentExchangeRate();
  const totalUsd = eventosIngresos.reduce((sum, e) => sum + e.montoUsd, 0);
  return convertUsdToArsCurrent(totalUsd);
}

// Helper: calcular estado de Monotributo
export function getEstadoMonotributo(categoriaActual: string = 'C'): EstadoMonotributo {
  const ingresos = getIngresosFacturados12Meses();
  const tope = TOPES_MONOTRIBUTO[categoriaActual] || TOPES_MONOTRIBUTO['C'];
  const porcentaje = (ingresos / tope) * 100;
  
  let riesgo: 'bajo' | 'medio' | 'alto' = 'bajo';
  if (porcentaje >= 90) riesgo = 'alto';
  else if (porcentaje >= 75) riesgo = 'medio';
  
  // Calcular próxima recategorización (si supera 80% del tope)
  let proximaRecategorizacion: string | undefined;
  if (porcentaje >= 80) {
    const mesesRestantes = Math.ceil((tope * 0.95 - ingresos) / (ingresos / 12));
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + mesesRestantes);
    proximaRecategorizacion = fecha.toISOString().split('T')[0];
  }

  return {
    categoria: categoriaActual,
    topeIngresosAnuales: tope,
    ingresosAcumulados12Meses: ingresos,
    porcentajeTope: porcentaje,
    riesgoRecategorizacion: riesgo,
    proximaRecategorizacion,
  };
}

// ============================================================================
// IIBB (INGRESOS BRUTOS - AGIP)
// ============================================================================

export interface EstadoIIBB {
  inscripto: boolean;
  categoria?: string; // 'Local', 'Convenio Multilateral', etc.
  ultimaPresentacion?: string; // YYYY-MM-DD
  proximaPresentacion?: string; // YYYY-MM-DD
  estado: 'al_dia' | 'pendiente' | 'vencido';
}

// Helper: calcular estado de IIBB (mock)
export function getEstadoIIBB(): EstadoIIBB {
  // Mock: asumir inscripto, presentación mensual
  const hoy = new Date();
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const proximaPresentacion = new Date(ultimoDiaMes);
  proximaPresentacion.setDate(proximaPresentacion.getDate() + 10); // 10 días después del cierre

  return {
    inscripto: true,
    categoria: 'Local',
    ultimaPresentacion: '2024-03-15',
    proximaPresentacion: proximaPresentacion.toISOString().split('T')[0],
    estado: 'al_dia',
  };
}

// ============================================================================
// OBLIGACIONES FISCALES
// ============================================================================

export type FrecuenciaObligacion = 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';

export interface ObligacionFiscal {
  id: string;
  nombre: string;
  tipo: 'monotributo' | 'iibb' | 'bienes_personales' | 'ganancias' | 'otro';
  frecuencia: FrecuenciaObligacion;
  fechaVencimiento: string; // YYYY-MM-DD
  estado: 'pendiente' | 'presentado' | 'vencido';
  montoEstimado?: number; // ARS
  nota?: string;
}

// Helper: generar obligaciones automáticas
export function getObligacionesFiscales(): ObligacionFiscal[] {
  const hoy = new Date();
  const obligaciones: ObligacionFiscal[] = [];

  // Monotributo - Mensual
  const vencimientoMonotributo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 20);
  obligaciones.push({
    id: 'ob-001',
    nombre: 'Monotributo - Cuota Mensual',
    tipo: 'monotributo',
    frecuencia: 'mensual',
    fechaVencimiento: vencimientoMonotributo.toISOString().split('T')[0],
    estado: hoy > vencimientoMonotributo ? 'vencido' : 'pendiente',
    montoEstimado: 50000, // Mock
  });

  // IIBB - Mensual
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const vencimientoIIBB = new Date(ultimoDiaMes);
  vencimientoIIBB.setDate(vencimientoIIBB.getDate() + 10);
  obligaciones.push({
    id: 'ob-002',
    nombre: 'IIBB - Declaración Mensual',
    tipo: 'iibb',
    frecuencia: 'mensual',
    fechaVencimiento: vencimientoIIBB.toISOString().split('T')[0],
    estado: hoy > vencimientoIIBB ? 'vencido' : 'pendiente',
  });

  // Bienes Personales - Anual (si aplica)
  const vencimientoBP = new Date(hoy.getFullYear(), 4, 20); // 20 de mayo
  if (hoy < vencimientoBP) {
    obligaciones.push({
      id: 'ob-003',
      nombre: 'Bienes Personales - Declaración Anual',
      tipo: 'bienes_personales',
      frecuencia: 'anual',
      fechaVencimiento: vencimientoBP.toISOString().split('T')[0],
      estado: hoy > vencimientoBP ? 'vencido' : 'pendiente',
    });
  }

  return obligaciones.sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));
}

// ============================================================================
// BIENES PERSONALES
// ============================================================================

export interface EstadoBienesPersonales {
  baseImponible: number; // ARS (valor de activos)
  minimoNoImponible: number; // ARS (2024: ~$18.000.000)
  debePresentar: boolean;
  montoEstimado: number; // ARS (si debe presentar)
  riesgo: 'bajo' | 'medio' | 'alto';
}

// Helper: calcular estado de Bienes Personales
export function getEstadoBienesPersonales(): EstadoBienesPersonales {
  const MINIMO_NO_IMPONIBLE = 18_000_000; // ARS 2024 (mock)
  const ALICUOTA = 0.01; // 1% sobre excedente (simplificado)

  // Calcular base imponible: patrimonio neto de activos DECLARADOS + inversiones DECLARADAS (en ARS)
  const patrimonioActivosDeclaradosUsd = getPatrimonioNetoActivosDeclaradosUsd();
  const patrimonioInversionesDeclaradasUsd = getPatrimonioInversionesDeclaradasUsd();
  const patrimonioTotalDeclaradoUsd = patrimonioActivosDeclaradosUsd + patrimonioInversionesDeclaradasUsd;
  const baseImponible = convertUsdToArsCurrent(patrimonioTotalDeclaradoUsd);

  const debePresentar = baseImponible > MINIMO_NO_IMPONIBLE;
  const excedente = Math.max(0, baseImponible - MINIMO_NO_IMPONIBLE);
  const montoEstimado = excedente * ALICUOTA;

  let riesgo: 'bajo' | 'medio' | 'alto' = 'bajo';
  if (baseImponible > MINIMO_NO_IMPONIBLE * 1.5) riesgo = 'alto';
  else if (baseImponible > MINIMO_NO_IMPONIBLE * 1.2) riesgo = 'medio';

  return {
    baseImponible,
    minimoNoImponible: MINIMO_NO_IMPONIBLE,
    debePresentar,
    montoEstimado,
    riesgo,
  };
}

// ============================================================================
// EXPORT CONTADOR
// ============================================================================

export interface ExportContador {
  periodo: string; // YYYY-MM
  ingresos: {
    facturados: number; // ARS
    noFacturados: number; // ARS
  };
  gastos: {
    deducibles: number; // ARS
    noDeducibles: number; // ARS
  };
  activos: Array<{
    nombre: string;
    valorUsd: number;
    valorArs: number;
    pasivo?: {
      saldoPendienteUsd: number;
      saldoPendienteArs: number;
    };
    patrimonioNetoArs: number;
  }>;
  movimientos: Array<{
    fecha: string;
    concepto: string;
    montoArs: number;
    etiquetaFiscal: EtiquetaFiscal;
  }>;
}

// Helper: generar export para contador
export function generarExportContador(mes: string): ExportContador {
  const eventosMes = getEventosByMes(mes, eventosMock);
  const tcActual = getCurrentExchangeRate();

  // Ingresos
  const ingresosFacturados = eventosMes
    .filter((e) => getEtiquetaFiscal(e.conceptoId) === 'ingreso_facturado_afip')
    .reduce((sum, e) => sum + convertUsdToArsCurrent(e.montoUsd), 0);
  
  const ingresosNoFacturados = eventosMes
    .filter((e) => {
      // Asumir que si no tiene etiqueta de ingreso facturado, es no facturado
      const concepto = conceptosMock.find((c) => c.id === e.conceptoId);
      return concepto?.tipo === 'egreso' ? false : true; // Simplificado
    })
    .reduce((sum, e) => sum + convertUsdToArsCurrent(e.montoUsd), 0);

  // Gastos
  const gastosDeducibles = eventosMes
    .filter((e) => getEtiquetaFiscal(e.conceptoId) === 'gasto_deducible')
    .reduce((sum, e) => sum + convertUsdToArsCurrent(e.montoUsd), 0);
  
  const gastosNoDeducibles = eventosMes
    .filter((e) => getEtiquetaFiscal(e.conceptoId) === 'gasto_no_deducible')
    .reduce((sum, e) => sum + convertUsdToArsCurrent(e.montoUsd), 0);

  // Activos (solo los declarados para export fiscal)
  const activos = activosMock
    .filter((activo) => activo.estadoFiscal === 'declarado')
    .map((activo) => ({
      nombre: activo.nombre,
      valorUsd: activo.valorActualUsd,
      valorArs: convertUsdToArsCurrent(activo.valorActualUsd),
      pasivo: activo.pasivo ? {
        saldoPendienteUsd: activo.pasivo.saldoPendienteUsd,
        saldoPendienteArs: convertUsdToArsCurrent(activo.pasivo.saldoPendienteUsd),
      } : undefined,
      patrimonioNetoArs: convertUsdToArsCurrent(getPatrimonioNetoActivo(activo)),
    }));

  // Movimientos
  const movimientos = eventosMes.map((e) => ({
    fecha: e.fecha,
    concepto: e.conceptoNombre,
    montoArs: convertUsdToArsCurrent(e.montoUsd),
    etiquetaFiscal: getEtiquetaFiscal(e.conceptoId),
  }));

  return {
    periodo: mes,
    ingresos: {
      facturados: ingresosFacturados,
      noFacturados: ingresosNoFacturados,
    },
    gastos: {
      deducibles: gastosDeducibles,
      noDeducibles: gastosNoDeducibles,
    },
    activos,
    movimientos,
  };
}

