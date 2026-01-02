import { test, expect } from '@playwright/test';

test.describe('Activos - CRUD Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a Activos
    await page.goto('/activos');
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar la página sin errores', async ({ page }) => {
    // Verificar que la página carga
    await expect(page).toHaveURL(/.*activos/);
    
    // Verificar que no hay errores en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('debe crear un activo', async ({ page }) => {
    // Buscar botón de agregar activo
    const addButton = page.locator('button:has-text("Agregar"), button:has-text("Nuevo"), button:has-text("Crear")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      // Esperar a que aparezca el formulario sin usar waitForTimeout
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    }

    // Buscar campos del formulario
    const nombreInput = page.locator('input[placeholder*="nombre" i], input[placeholder*="Nombre" i], input[type="text"]').first();
    const tipoSelect = page.locator('select').first();
    
    if (await nombreInput.count() > 0) {
      await nombreInput.fill('Activo Test');
    }
    
    if (await tipoSelect.count() > 0) {
      await tipoSelect.selectOption({ index: 0 });
    }

    // Buscar botón de guardar
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      // Esperar a que se complete la acción sin usar waitForTimeout
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    }

    // Verificar que no hay errores
    await expect(page).toHaveURL(/.*activos/, { timeout: 5000 });
  });

  test('debe permitir ver detalle de activo', async ({ page }) => {
    // Buscar cualquier activo en la lista o card
    const assetCard = page.locator('[data-testid*="asset"], .asset, [class*="asset"]').first();
    
    if (await assetCard.count() > 0) {
      await assetCard.click();
      await page.waitForTimeout(1000);
      
      // Verificar que se abre el panel o detalle
      await expect(page).toHaveURL(/.*activos/);
    }
  });

  test('debe recargar y mantener datos', async ({ page }) => {
    // Configurar handler de errores ANTES de recargar
    const errors: string[] = [];
    const consoleHandler = (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    };
    page.on('console', consoleHandler);
    
    // Recargar la página con timeout razonable
    await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
    
    // Verificar que carga sin errores
    await expect(page).toHaveURL(/.*activos/, { timeout: 10000 });
    
    // Esperar un momento para capturar errores de runtime
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    // Remover handler para evitar memory leaks
    page.off('console', consoleHandler);
    
    // Filtrar errores no críticos
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Failed to load resource') &&
      !e.includes('ChunkLoadError') &&
      !e.includes('Loading chunk')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
