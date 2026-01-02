// Sistema de tipos de cambio para Pulley Group
// USD es la moneda base del sistema
// ARS es moneda operativa contextual

export interface ExchangeRate {
  fecha: string; // YYYY-MM-DD
  usdToArs: number; // 1 USD = X ARS
  nota?: string;
  fechaCreacion: string; // YYYY-MM-DD
  fechaModificacion?: string; // YYYY-MM-DD
}

// Datos mock eliminados - usar API real para tipos de cambio
export const exchangeRatesMock: ExchangeRate[] = [];

// Helper: obtener tipo de cambio para una fecha específica
// TODO: Implementar con API real de tipos de cambio
export function getExchangeRateForDate(fecha: string): number {
  // Por ahora retornar un valor por defecto
  // TODO: Consultar API de tipos de cambio
  return getCurrentExchangeRate();
}

// Helper: obtener tipo de cambio actual (más reciente)
// TODO: Implementar con API real de tipos de cambio
export function getCurrentExchangeRate(): number {
  // Valor por defecto razonable hasta que se implemente API real
  return 1000;
}

// Helper: convertir ARS a USD usando tipo de cambio de una fecha
export function convertArsToUsd(arsAmount: number, fecha: string): number {
  const rate = getExchangeRateForDate(fecha);
  return arsAmount / rate;
}

// Helper: convertir USD a ARS usando tipo de cambio de una fecha
export function convertUsdToArs(usdAmount: number, fecha: string): number {
  const rate = getExchangeRateForDate(fecha);
  return usdAmount * rate;
}

// Helper: convertir ARS a USD usando tipo de cambio actual
export function convertArsToUsdCurrent(arsAmount: number): number {
  const rate = getCurrentExchangeRate();
  return arsAmount / rate;
}

// Helper: convertir USD a ARS usando tipo de cambio actual
export function convertUsdToArsCurrent(usdAmount: number): number {
  const rate = getCurrentExchangeRate();
  return usdAmount * rate;
}

// Helper: formatear moneda USD (formato argentino unificado)
// DEPRECATED: Usar formatCurrency de @/utils/number-format
// Mantenido para compatibilidad temporal
export function formatCurrencyUSD(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper: formatear moneda ARS (formato argentino unificado)
// DEPRECATED: Usar formatCurrency de @/utils/number-format
// Mantenido para compatibilidad temporal
export function formatCurrencyARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper: formatear valor dual (USD principal, ARS secundario)
export function formatCurrencyDual(usdValue: number, arsValue?: number): string {
  const usdFormatted = formatCurrencyUSD(usdValue);
  if (arsValue !== undefined) {
    const arsFormatted = formatCurrencyARS(arsValue);
    return `${usdFormatted} (${arsFormatted})`;
  }
  return usdFormatted;
}

// Estado global para el tipo de cambio sugerido del día
let _suggestedExchangeRate: number = getCurrentExchangeRate();

// Helper: obtener tipo de cambio sugerido del día
export function getSuggestedExchangeRate(): number {
  return _suggestedExchangeRate;
}

// Helper: establecer tipo de cambio sugerido del día
export function setSuggestedExchangeRate(newRate: number): void {
  _suggestedExchangeRate = newRate;
}

// Helper: obtener último TC usado por el usuario (desde localStorage)
export function getLastUsedExchangeRate(): number | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const lastRate = localStorage.getItem('pulley_last_tc_used');
    if (lastRate) {
      const parsed = parseFloat(lastRate);
      return isNaN(parsed) ? null : parsed;
    }
  } catch (e) {
    // Si localStorage no está disponible, retornar null
  }
  
  return null;
}

// Helper: guardar último TC usado por el usuario (en localStorage)
export function setLastUsedExchangeRate(rate: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('pulley_last_tc_used', String(rate));
  } catch (e) {
    // Si localStorage no está disponible, ignorar
  }
}

// Helper: obtener TC inicial (último usado o sugerido)
export function getInitialExchangeRate(): number {
  const lastUsed = getLastUsedExchangeRate();
  return lastUsed ?? getSuggestedExchangeRate();
}

