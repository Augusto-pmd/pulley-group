// Utilidades para formateo de números en inputs

/**
 * Formatea un número con separadores de miles (formato argentino: punto como separador)
 * Ejemplo: 1000000 → "1.000.000"
 */
export function formatNumberWithSeparators(value: string | number): string {
  if (value === '' || value === null || value === undefined) return '';
  
  // Convertir a string y remover todo excepto dígitos y punto decimal
  const stringValue = String(value);
  const cleaned = stringValue.replace(/[^\d.,]/g, '');
  
  // Si está vacío, retornar vacío
  if (cleaned === '') return '';
  
  // Separar parte entera y decimal
  const parts = cleaned.replace(',', '.').split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts[1];
  
  // Formatear parte entera con separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Reconstruir con decimal si existe
  return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
}

/**
 * Parsea un número formateado con separadores de miles a número puro
 * Ejemplo: "1.000.000" → 1000000
 */
export function parseFormattedNumber(value: string): number {
  if (!value || value === '') return 0;
  
  // Remover separadores de miles y convertir coma decimal a punto
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

