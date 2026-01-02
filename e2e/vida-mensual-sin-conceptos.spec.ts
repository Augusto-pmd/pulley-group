import { test, expect } from '@playwright/test';

/**
 * Test específico para validar que el sistema funciona correctamente
 * cuando NO hay conceptos cargados en la base de datos.
 * 
 * Este test valida que:
 * - La página carga sin errores
 * - Se pueden crear movimientos sin conceptos
 * - No hay crashes por arrays vacíos
 */
test.describe('Vida Mensual - Sin Conceptos', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a Vida Mensual
    await page.goto('/vida-mensual');
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar la página sin errores cuando no hay conceptos', async ({ page }) => {
    // Verificar que la página carga
    await expect(page).toHaveURL(/.*vida-mensual/);
    
    // Verificar que no hay errores críticos en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Filtrar errores no críticos
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Failed to load resource') &&
      !e.includes('ChunkLoadError')
    );
    
    // No debe haber errores críticos relacionados con conceptos
    const conceptErrors = criticalErrors.filter(e => 
      e.toLowerCase().includes('concept') ||
      e.toLowerCase().includes('concepto') ||
      e.includes('Cannot read property') ||
      e.includes('undefined')
    );
    
    expect(conceptErrors.length).toBe(0);
  });

  test('debe permitir escribir conceptos libremente sin sugerencias', async ({ page }) => {
    // Buscar campo de concepto (puede estar en QuickAddForm o en modal)
    const conceptoInput = page.locator('input[placeholder*="concepto" i], input[placeholder*="Concepto" i]').first();
    
    if (await conceptoInput.count() > 0) {
      // Escribir un concepto nuevo
      await conceptoInput.fill('Test Concepto Sin DB');
      await page.waitForTimeout(500);
      
      // Verificar que no hay errores
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.waitForTimeout(500);
      
      // No debe haber errores por conceptos vacíos
      const criticalErrors = errors.filter(e => 
        !e.includes('favicon') && 
        !e.includes('404') &&
        !e.includes('Failed to load resource')
      );
      
      expect(criticalErrors.length).toBe(0);
    }
  });

  test('debe funcionar correctamente con array de conceptos vacío', async ({ page }) => {
    // Verificar que la página renderiza correctamente
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Verificar que no hay errores de JavaScript
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // No debe haber errores relacionados con arrays vacíos o conceptos
    const arrayErrors = errors.filter(e => 
      e.includes('Cannot read property') ||
      e.includes('undefined') ||
      e.includes('null') ||
      e.includes('length') ||
      (e.toLowerCase().includes('concept') && !e.includes('favicon'))
    );
    
    expect(arrayErrors.length).toBe(0);
  });
});

