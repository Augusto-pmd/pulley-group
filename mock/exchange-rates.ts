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

// Mock: tabla de tipos de cambio históricos
export const exchangeRatesMock: ExchangeRate[] = [
  { fecha: '2022-01-01', usdToArs: 200, fechaCreacion: '2022-01-01' },
  { fecha: '2022-06-01', usdToArs: 250, fechaCreacion: '2022-06-01' },
  { fecha: '2023-01-01', usdToArs: 350, fechaCreacion: '2023-01-01' },
  { fecha: '2023-06-01', usdToArs: 500, fechaCreacion: '2023-06-01' },
  { fecha: '2024-01-01', usdToArs: 800, fechaCreacion: '2024-01-01' },
  { fecha: '2024-03-15', usdToArs: 1000, fechaCreacion: '2024-03-15' },
];

// Helper: obtener tipo de cambio para una fecha específica
export function getExchangeRateForDate(fecha: string): number {
  // Ordenar por fecha descendente
  const sortedRates = [...exchangeRatesMock].sort((a, b) => 
    b.fecha.localeCompare(a.fecha)
  );
  
  // Encontrar el tipo de cambio más reciente anterior o igual a la fecha
  const rate = sortedRates.find((r) => r.fecha <= fecha);
  
  // Si no hay tasa para esa fecha, usar la más antigua disponible
  // Si no hay ninguna tasa, usar la tasa actual como fallback
  return rate?.usdToArs || sortedRates[sortedRates.length - 1]?.usdToArs || getCurrentExchangeRate();
}

// Helper: obtener tipo de cambio actual (más reciente)
export function getCurrentExchangeRate(): number {
  const sortedRates = [...exchangeRatesMock].sort((a, b) => 
    b.fecha.localeCompare(a.fecha)
  );
  // Si no hay tasas, retornar la última tasa disponible o un valor por defecto razonable
  return sortedRates[0]?.usdToArs || (sortedRates.length > 0 ? sortedRates[sortedRates.length - 1]?.usdToArs : 1000);
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

// Helper: formatear moneda USD
export function formatCurrencyUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper: formatear moneda ARS
export function formatCurrencyARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
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

