/**
 * Test Data Helpers
 * Genera datos únicos para tests E2E
 */

export function generateUniqueName(prefix: string = 'Test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}

export function generateUniqueNumber(min: number = 1000, max: number = 9999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUniqueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días
  return date.toISOString().split('T')[0];
}

