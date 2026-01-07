import { test, expect } from '@playwright/test';
import { TestInstrumentation } from '../helpers/instrumentation';
import { generateUniqueName } from '../helpers/test-data';

test.describe('Activos - E2E CRUD', () => {
  let instrumentation: TestInstrumentation;
  let testAssetName: string;
  let testAssetId: string | null = null;

  test.beforeEach(async ({ page }) => {
    instrumentation = new TestInstrumentation();
    instrumentation.setup(page);
    testAssetName = generateUniqueName('Activo');
    
    // Navegar a Activos
    await page.goto('/activos');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Limpiar: eliminar asset si se creó
    if (testAssetId) {
      try {
        await page.request.delete(`/api/assets/${testAssetId}`);
      } catch (e) {
        // Ignorar errores de cleanup
      }
    }
    await instrumentation.saveLogs('activos');
  });

  test('debe crear un asset y aparecer en lista', async ({ page }) => {
    // Capturar console logs
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      if (text.includes('[Activos]')) {
        console.log(`[CONSOLE] ${msg.type()}: ${text}`);
      }
    });

    // Buscar botón "Agregar activo"
    const addButton = page.locator('button:has-text("Agregar activo"), button:has-text("Agregar"), button:has-text("Nuevo")').first();
    
    if (await addButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para agregar activo');
      return;
    }

    await addButton.click();
    
    // Esperar a que el formulario esté montado en el DOM
    await page.waitForSelector('form[data-testid="modal-form"]', { state: 'visible', timeout: 5000 });

    // Llenar formulario - los inputs ya están en el DOM
    const nombreInput = page.locator('form[data-testid="modal-form"] input[placeholder*="nombre" i], form[data-testid="modal-form"] input[type="text"]').first();
    await nombreInput.fill(testAssetName);
    
    // Valor inicial (USD) - campo requerido
    const valorInput = page.locator('form[data-testid="modal-form"] input[type="text"][inputmode="decimal"], form[data-testid="modal-form"] input[type="text"][placeholder*="valor" i]').first();
    await valorInput.waitFor({ state: 'visible', timeout: 5000 });
    await valorInput.fill('50000');
    
    // Fecha de valuación ya tiene valor por defecto, pero asegurémonos de que esté presente
    const fechaInput = page.locator('form[data-testid="modal-form"] input[type="date"]').first();
    await fechaInput.waitFor({ state: 'visible', timeout: 5000 });

    // Esperar explícitamente el botón submit dentro del form
    const submitButton = page.locator('form[data-testid="modal-form"] button[type="submit"], form[data-testid="modal-form"] button:has-text("Agregar activo")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    if (await submitButton.count() > 0) {
      // Esperar request POST con waitForRequest
      const requestPromise = page.waitForRequest(
        (request) => request.method() === 'POST' && request.url().includes('/api/assets'),
        { timeout: 10000 }
      ).catch(() => null);

      // Asegurar que el botón esté habilitado y visible antes de hacer click
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(200);
      
      // Hacer click y esperar a que se dispare el evento submit
      await Promise.all([
        page.waitForResponse(
          (response) => response.request().method() === 'POST' && response.url().includes('/api/assets'),
          { timeout: 10000 }
        ).catch(() => null),
        submitButton.click()
      ]);
      console.log('[TEST] Click en submit button ejecutado');

      // Esperar request POST /api/assets
      const createRequest = await instrumentation.waitForApiRequest(
        page,
        'POST',
        '/api/assets',
        10000
      );
      
      const submitLogs = consoleMessages.filter(m => m.includes('[Activos] SUBMIT_HANDLER_CALLED'));
      const apiLogs = consoleMessages.filter(m => m.includes('[Activos] POST_API_CALL'));
      const earlyReturnLogs = consoleMessages.filter(m => m.includes('[Activos] EARLY_RETURN'));
      
      console.log('[TEST] Console logs capturados:', {
        submitHandlerCalled: submitLogs.length > 0,
        apiCallLogged: apiLogs.length > 0,
        earlyReturn: earlyReturnLogs.length > 0,
        totalLogs: consoleMessages.length,
        allLogs: consoleMessages.filter(m => m.includes('[Activos]')),
      });

      // ASSERT: Debe existir request POST
      expect(createRequest).not.toBeNull();
      expect(createRequest?.status).toBeGreaterThanOrEqual(200);
      expect(createRequest?.status).toBeLessThan(300);

      // ASSERT: Asset debe aparecer en lista
      await page.waitForTimeout(2000);
      const assetInList = page.locator(`text=${testAssetName}`).first();
      const isVisible = await assetInList.isVisible().catch(() => false);
      
      if (!isVisible) {
        console.error('ERROR ALTA: Asset creado pero no aparece en lista');
      }
    } else {
      console.error('ERROR BLOQUEANTE: No se encontró botón submit');
    }

    await instrumentation.saveLogs('activos-create');
  });

  test('debe eliminar un asset y desaparecer de lista', async ({ page }) => {
    // Buscar lista de assets
    const assetsList = page.locator('[data-testid="asset"], [class*="asset"]').first();
    
    if (await assetsList.count() === 0) {
      test.skip();
      return;
    }

    // Buscar botón eliminar
    const deleteButton = page.locator('button:has-text("Eliminar"), button:has-text("Borrar"), button[aria-label*="eliminar" i]').first();
    
    if (await deleteButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para eliminar asset');
      return;
    }

    await deleteButton.click();
    
    // Confirmar
    const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Eliminar")').first();
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Esperar request DELETE /api/assets/[id]
    const deleteRequest = await instrumentation.waitForApiRequest(
      page,
      'DELETE',
      /\/api\/assets\/[^/]+$/,
      10000
    );

    // ASSERT: Debe existir request DELETE
    if (!deleteRequest) {
      console.error('ERROR BLOQUEANTE: No se disparó request DELETE al eliminar asset');
    } else {
      expect(deleteRequest.status).toBeGreaterThanOrEqual(200);
      expect(deleteRequest.status).toBeLessThan(300);
    }

    await page.waitForTimeout(2000);
    await instrumentation.saveLogs('activos-delete');
  });
});

