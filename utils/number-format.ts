/**
 * SISTEMA ÚNICO DE FORMATO NUMÉRICO - PULLEY
 * 
 * Formato oficial obligatorio:
 * - Punto (.) para miles
 * - Coma (,) para decimales
 * 
 * Ejemplos válidos: 1.234 | 12.500 | 1.234.567 | 1.234.567,89
 * 
 * Este es el ÚNICO archivo permitido para formateo numérico en toda la aplicación.
 */

/**
 * Formatea un número general en formato argentino
 * @param value - Número a formatear
 * @param decimals - Cantidad de decimales (default: 0)
 * @returns String formateado: "1.234.567" o "1.234.567,89"
 */
export function formatNumberAR(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formatea un valor monetario en formato argentino
 * @param value - Valor numérico a formatear
 * @param decimals - Cantidad de decimales (default: 2 para moneda)
 * @returns String formateado: "1.234.567,89"
 */
export function formatCurrencyAR(value: number, decimals: number = 2): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0,00';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formatea un porcentaje en formato argentino
 * @param value - Porcentaje numérico (0-100, no decimal 0-1)
 * @param decimals - Cantidad de decimales (default: 1)
 * @returns String formateado: "15,5%"
 */
export function formatPercentAR(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0,0%';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value) + '%';
}

/**
 * Parsea un string con formato argentino a número
 * Acepta:
 * - Puntos de miles opcionales: "1.234.567"
 * - Coma decimal opcional: "1234,56"
 * - Espacios: "1 234 567"
 * - Símbolo $ opcional: "$1.234,56"
 * 
 * @param input - String formateado según estándar argentino
 * @returns Número puro o null si inválido
 */
export function parseNumberAR(input: string): number | null {
  if (!input || input.trim() === '') {
    return null;
  }

  // Remover símbolo $ y espacios
  let cleaned = input.replace(/\$/g, '').replace(/\s/g, '');

  // Si está vacío después de limpiar, retornar null
  if (cleaned === '') {
    return null;
  }

  // Detectar formato: si tiene coma, es decimal; si solo tiene puntos, son miles
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    // Formato completo: "1.234.567,89"
    // Remover puntos (miles) y convertir coma a punto (decimal)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // Solo coma decimal: "1234,56"
    cleaned = cleaned.replace(',', '.');
  } else if (!hasComma && hasDot) {
    // Solo puntos: "1.234.567" (miles) o "1234.56" (decimal con punto - formato incorrecto pero tolerado)
    // Si tiene más de un punto, son miles; si tiene uno, podría ser decimal
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      // Múltiples puntos = miles, remover todos
      cleaned = cleaned.replace(/\./g, '');
    } else {
      // Un solo punto: asumir decimal (formato incorrecto pero tolerado)
      // No hacer nada, parseFloat lo manejará
    }
  }
  // Si no tiene ni coma ni punto, es un número entero sin formato

  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    return null;
  }

  return parsed;
}

// ============================================================================
// FUNCIONES DE COMPATIBILIDAD (mantener para migración gradual)
// ============================================================================

/**
 * @deprecated Usar formatNumberAR
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const decimals = options?.minimumFractionDigits ?? options?.maximumFractionDigits ?? 0;
  return formatNumberAR(value, decimals);
}

/**
 * @deprecated Usar formatCurrencyAR
 */
export function formatCurrency(
  value: number,
  decimals: number = 0
): string {
  // Si decimals es 0, redondear a entero; si es 2, usar 2 decimales
  return formatCurrencyAR(value, decimals === 0 ? 0 : 2);
}

/**
 * @deprecated Usar formatPercentAR
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  asDecimal: boolean = false
): string {
  const percentageValue = asDecimal ? value * 100 : value;
  return formatPercentAR(percentageValue, decimals);
}

/**
 * @deprecated Usar parseNumberAR
 */
export function parseFormattedNumber(value: string): number {
  const parsed = parseNumberAR(value);
  return parsed ?? 0;
}

// ============================================================================
// FUNCIONES PARA INPUTS (mantener para compatibilidad con componentes existentes)
// ============================================================================

/**
 * Formatea un valor para input (permite escritura fluida)
 * @deprecated Considerar usar directamente formatNumberAR en inputs
 */
export function formatNumberWithSeparators(value: string | number): string {
  if (value === '' || value === null || value === undefined) return '';
  
  if (typeof value === 'number') {
    return formatNumberAR(value, 0);
  }
  
  // Para strings (input del usuario), formatear manualmente
  const stringValue = String(value);
  const cleaned = stringValue.replace(/[^\d.,]/g, '');
  
  if (cleaned === '') return '';
  
  // Normalizar: convertir coma decimal a punto para procesamiento
  const normalized = cleaned.replace(',', '.');
  const parts = normalized.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts[1];
  
  // Formatear parte entera con separadores de miles (punto)
  let formattedInteger = '';
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      formattedInteger = '.' + formattedInteger;
    }
    formattedInteger = integerPart[i] + formattedInteger;
    count++;
  }
  
  // Reconstruir con decimal si existe (usar coma como separador decimal)
  return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
}

/**
 * Obtiene la posición del cursor después de formatear un número
 * @deprecated Mantener para compatibilidad
 */
export function getCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPosition: number
): number {
  if (oldValue === newValue) return oldCursorPosition;
  
  const digitsBefore = oldValue.substring(0, oldCursorPosition).replace(/[^\d]/g, '').length;
  
  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount === digitsBefore) {
        return i + 1;
      }
    }
  }
  
  return newValue.length;
}

/**
 * @deprecated Usar formatNumberAR
 */
export function formatNumberWithLocale(value: number, locale: string = 'es-AR'): string {
  return formatNumberAR(value, 0);
}
