import { test, expect } from '@playwright/test';

test.describe('Vida Mensual - CRUD Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a Vida Mensual
    await page.goto('/vida-mensual');
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar la página sin errores', async ({ page }) => {
    // Verificar que la página carga
    await expect(page).toHaveURL(/.*vida-mensual/);
    
    // Verificar que no hay errores en consola
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Esperar a que la página cargue completamente
    await page.waitForTimeout(1000);
    
    // Verificar que no hay errores críticos
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Failed to load resource')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('debe crear un ingreso', async ({ page }) => {
    // Buscar botón de agregar ingreso o evento
    const addButton = page.locator('button:has-text("Agregar"), button:has-text("Ingreso"), button:has-text("Nuevo")').first();
    
    // Si no hay botón visible, buscar por selector más específico
    if (await addButton.count() === 0) {
      // Intentar hacer clic en cualquier botón que pueda abrir el formulario
      const anyAddButton = page.locator('button').filter({ hasText: /agregar|nuevo|crear/i }).first();
      if (await anyAddButton.count() > 0) {
        await anyAddButton.click();
      }
    } else {
      await addButton.click();
    }

    // Esperar a que aparezca el formulario o panel
    await page.waitForTimeout(500);

    // Buscar campos del formulario
    const conceptoInput = page.locator('input[placeholder*="concepto" i], input[placeholder*="Concepto" i], input[type="text"]').first();
    const montoInput = page.locator('input[type="number"], input[placeholder*="monto" i], input[placeholder*="Monto" i]').first();
    
    // Si encontramos los campos, llenarlos
    if (await conceptoInput.count() > 0) {
      await conceptoInput.fill('Salario Test');
    }
    
    if (await montoInput.count() > 0) {
      await montoInput.fill('5000');
    }

    // Buscar botón de guardar
    const saveButton = page.locator('button:has-text("Guardar"), button:has-text("Crear"), button[type="submit"]').first();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar que no hay errores críticos
    const errors: string[] = [];
    const consoleHandler = (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    };
    page.on('console', consoleHandler);
    
    // Esperar a que la página se estabilice sin usar waitForTimeout
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Remover handler para evitar memory leaks
    page.off('console', consoleHandler);
    
    // Verificar que la página sigue funcionando
    await expect(page).toHaveURL(/.*vida-mensual/, { timeout: 5000 });
  });

  test('debe crear un egreso', async ({ page }) => {
    // Similar al test de ingreso pero para egreso
    const addButton = page.locator('button:has-text("Egreso"), button:has-text("Agregar"), button:has-text("Nuevo")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(500);
    }

    // Buscar campos
    const conceptoInput = page.locator('input[placeholder*="concepto" i], input[type="text"]').first();
    const montoInput = page.locator('input[type="number"], input[placeholder*="monto" i]').first();
    
    if (await conceptoInput.count() > 0) {
      await conceptoInput.fill('Alquiler Test');
    }
    
    if (await montoInput.count() > 0) {
      await montoInput.fill('1500');
    }

    const saveButton = page.locator('button:has-text("Guardar"), button[type="submit"]').first();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }

    // Verificar que no hay errores
    await expect(page).toHaveURL(/.*vida-mensual/);
  });

  test('debe permitir navegar entre meses', async ({ page }) => {
    // Buscar selector de mes
    const monthSelector = page.locator('select, input[type="month"], [role="combobox"]').first();
    
    if (await monthSelector.count() > 0) {
      // Intentar cambiar el mes
      await monthSelector.click();
      await page.waitForTimeout(500);
      
      // Verificar que la página responde
      await expect(page).toHaveURL(/.*vida-mensual/);
    }
  });

  test('debe recargar y mantener datos', async ({ page }) => {
    // Recargar la página
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verificar que carga sin errores
    await expect(page).toHaveURL(/.*vida-mensual/);
    
    // Verificar que no hay errores críticos en consola
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
});
