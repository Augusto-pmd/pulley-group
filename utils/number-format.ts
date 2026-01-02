// Utilidades para formateo de números en inputs

/**
 * Formatea un número con separadores de miles usando estándar argentino (es-AR)
 * Para números completos usa Intl.NumberFormat, para strings parciales (input) formatea manualmente
 * Ejemplo: 1111111 → "1.111.111", "1234" → "1.234"
 */
export function formatNumberWithSeparators(value: string | number): string {
  if (value === '' || value === null || value === undefined) return '';
  
  // Si es un número, usar Intl.NumberFormat directamente
  if (typeof value === 'number') {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 20, // Permitir muchos decimales para inputs
    }).format(value);
  }
  
  // Para strings (input del usuario), formatear manualmente según estándar argentino
  const stringValue = String(value);
  const cleaned = stringValue.replace(/[^\d.,]/g, '');
  
  // Si está vacío, retornar vacío
  if (cleaned === '') return '';
  
  // Separar parte entera y decimal (en AR usa coma como decimal)
  // Normalizar: convertir cualquier coma decimal a punto para procesamiento interno
  const normalized = cleaned.replace(',', '.');
  const parts = normalized.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts[1];
  
  // Formatear parte entera con separadores de miles (punto en formato argentino)
  // Dividir en grupos de 3 desde el final
  let formattedInteger = '';
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      formattedInteger = '.' + formattedInteger;
    }
    formattedInteger = integerPart[i] + formattedInteger;
    count++;
  }
  
  // Reconstruir con decimal si existe (usar coma como separador decimal en formato argentino)
  return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
}

/**
 * Parsea un número formateado con separadores de miles (formato argentino) a número puro
 * Maneja formato argentino: punto como separador de miles, coma como separador decimal
 * Ejemplo: "1.111.111,50" → 1111111.50
 * @param value - String formateado según estándar argentino
 * @returns Número puro (number)
 */
export function parseFormattedNumber(value: string): number {
  if (!value || value === '') return 0;
  
  // Formato argentino: punto = miles, coma = decimal
  // Remover separadores de miles (puntos) y convertir coma decimal a punto
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Obtiene la posición del cursor después de formatear un número
 * Mantiene la posición relativa del cursor al agregar/quitar separadores
 */
export function getCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPosition: number
): number {
  // Si el valor no cambió, mantener posición
  if (oldValue === newValue) return oldCursorPosition;
  
  // Contar dígitos antes del cursor en el valor anterior
  const digitsBefore = oldValue.substring(0, oldCursorPosition).replace(/[^\d]/g, '').length;
  
  // Encontrar la posición del cursor que tenga la misma cantidad de dígitos antes
  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount === digitsBefore) {
        return i + 1;
      }
    }
  }
  
  // Si no se encuentra, retornar al final
  return newValue.length;
}

/**
 * Formatea un número con separadores de miles usando Intl.NumberFormat
 * Útil para formatear números que no son moneda
 * Ejemplo: 1000000 → "1.000.000"
 */
export function formatNumberWithLocale(value: number, locale: string = 'es-AR'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea un número con separadores de miles y decimales limitados
 * Helper reutilizable para formateo consistente en toda la UI
 * @param value - Número a formatear
 * @param options - Opciones adicionales de Intl.NumberFormat
 * @returns Número formateado (ej: 2123231.3 → "2.123.231,30")
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Helper unificado para formatear moneda en formato argentino
 * FORMATO OBLIGATORIO: puntos para miles, coma para decimales
 * Ejemplo: 1234567.89 → "1.234.567,89"
 * 
 * Este es el ÚNICO helper permitido para formatear valores monetarios en toda la aplicación.
 * Reemplaza formatCurrencyUSD, formatCurrencyARS, formatCurrency de mock/data.ts
 * 
 * @param value - Valor numérico a formatear
 * @param decimals - Cantidad de decimales (default: 0 para montos enteros)
 * @returns String formateado según estándar argentino
 */
export function formatCurrency(
  value: number,
  decimals: number = 0
): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formatea un porcentaje en formato argentino
 * Ejemplo: 15.5 → "15,5%"
 * 
 * @param value - Porcentaje numérico (ej: 15.5 para 15.5%)
 * @param decimals - Cantidad de decimales (default: 1)
 * @returns String formateado con símbolo %
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value) + '%';
}

