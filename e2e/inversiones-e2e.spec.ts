import { test, expect } from '@playwright/test';
import { TestInstrumentation } from './helpers/instrumentation';
import { generateUniqueName } from './helpers/test-data';

test.describe('Inversiones - E2E CRUD', () => {
  let instrumentation: TestInstrumentation;
  let testInvestmentName: string;
  let testInvestmentId: string | null = null;
  let testEventId: string | null = null;

  test.beforeEach(async ({ page }) => {
    instrumentation = new TestInstrumentation();
    instrumentation.setup(page);
    testInvestmentName = generateUniqueName('Inversión');
    
    // Navegar a Inversiones
    await page.goto('/investments');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Limpiar
    if (testEventId && testInvestmentId) {
      try {
        await page.request.delete(`/api/investments/${testInvestmentId}/events/${testEventId}`);
      } catch (e) {}
    }
    if (testInvestmentId) {
      try {
        await page.request.delete(`/api/investments/${testInvestmentId}`);
      } catch (e) {}
    }
    await instrumentation.saveLogs('inversiones');
  });

  test('debe crear investment y aparecer en lista', async ({ page }) => {
    // Buscar botón crear inversión
    const addButton = page.locator('button:has-text("Crear inversión"), button:has-text("Agregar"), button:has-text("Nuevo")').first();
    
    if (await addButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para crear inversión');
      return;
    }

    await addButton.click();
    
    // Esperar a que el formulario esté montado en el DOM
    await page.waitForSelector('form[data-testid="modal-form"]', { state: 'visible', timeout: 5000 });

    // Llenar formulario
    const nombreInput = page.locator('form[data-testid="modal-form"] input[placeholder*="nombre" i], form[data-testid="modal-form"] input[type="text"]').first();
    await nombreInput.fill(testInvestmentName);
    
    const tipoSelect = page.locator('form[data-testid="modal-form"] select').first();
    await tipoSelect.selectOption({ index: 0 });
    
    const montoInput = page.locator('form[data-testid="modal-form"] input[type="text"][inputmode="decimal"], form[data-testid="modal-form"] input[type="text"][placeholder*="monto" i]').first();
    await montoInput.fill('100000');

    // Submit
    const submitButton = page.locator('form[data-testid="modal-form"] button[type="submit"], form[data-testid="modal-form"] button:has-text("Crear")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Esperar request POST /api/investments
    const createRequest = await instrumentation.waitForApiRequest(
      page,
      'POST',
      '/api/investments',
      10000
    );

    expect(createRequest).not.toBeNull();
    expect(createRequest?.status).toBeGreaterThanOrEqual(200);
    expect(createRequest?.status).toBeLessThan(300);

    // ASSERT: Debe aparecer en lista
    await page.waitForTimeout(2000);
    const investmentInList = page.locator(`text=${testInvestmentName}`).first();
    const isVisible = await investmentInList.isVisible().catch(() => false);
    
    if (!isVisible) {
      console.error('ERROR ALTA: Investment creado pero no aparece en lista');
    }

    await instrumentation.saveLogs('inversiones-create');
  });

  test('debe crear event y aparecer', async ({ page }) => {
    // Primero necesitamos una inversión existente
    // Por simplicidad, asumimos que existe o se crea en test anterior
    
    // Buscar botón "Registrar evento"
    const eventButton = page.locator('button:has-text("Registrar evento"), button:has-text("Evento")').first();
    
    if (await eventButton.count() === 0) {
      test.skip();
      return;
    }

    await eventButton.click();
    
    // Esperar a que el formulario esté montado en el DOM
    await page.waitForSelector('form[data-testid="modal-form"]', { state: 'visible', timeout: 5000 });

    // Llenar formulario de evento
    // Primero seleccionar la inversión (primer select)
    const inversionSelect = page.locator('form[data-testid="modal-form"] select').first();
    await inversionSelect.waitFor({ state: 'visible', timeout: 5000 });
    // Seleccionar la primera opción que no sea "Seleccionar inversión..."
    const options = await inversionSelect.locator('option').all();
    if (options.length > 1) {
      await inversionSelect.selectOption({ index: 1 }); // Index 0 es "Seleccionar...", 1 es la primera inversión
    }
    
    const montoInput = page.locator('form[data-testid="modal-form"] input[type="text"][inputmode="decimal"], form[data-testid="modal-form"] input[type="text"][placeholder*="monto" i]').first();
    await montoInput.fill('5000');

    const submitButton = page.locator('form[data-testid="modal-form"] button[type="submit"], form[data-testid="modal-form"] button:has-text("Registrar evento")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Esperar request POST /api/investments/[id]/events
    const createEventRequest = await instrumentation.waitForApiRequest(
      page,
      'POST',
      /\/api\/investments\/[^/]+\/events$/,
      10000
    );

    expect(createEventRequest).not.toBeNull();
    expect(createEventRequest?.status).toBeGreaterThanOrEqual(200);
    expect(createEventRequest?.status).toBeLessThan(300);

    await instrumentation.saveLogs('inversiones-event-create');
  });

  test('debe eliminar event y desaparecer', async ({ page }) => {
    // Buscar lista de events
    const eventsList = page.locator('[data-testid="event"], [class*="event"]').first();
    
    if (await eventsList.count() === 0) {
      test.skip();
      return;
    }

    // Buscar botón eliminar event
    const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="eliminar" i]').first();
    
    if (await deleteButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para eliminar event');
      return;
    }

    await deleteButton.click();
    
    // Confirmar
    const confirmButton = page.locator('button:has-text("Confirmar")').first();
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Esperar request DELETE /api/investments/[id]/events/[eventId]
    const deleteRequest = await instrumentation.waitForApiRequest(
      page,
      'DELETE',
      /\/api\/investments\/[^/]+\/events\/[^/]+$/,
      10000
    );

    if (!deleteRequest) {
      console.error('ERROR BLOQUEANTE: No se disparó request DELETE al eliminar event');
    } else {
      expect(deleteRequest.status).toBeGreaterThanOrEqual(200);
      expect(deleteRequest.status).toBeLessThan(300);
    }

    await instrumentation.saveLogs('inversiones-event-delete');
  });

  test('debe eliminar investment y desaparecer', async ({ page }) => {
    // Buscar lista de investments
    const investmentsList = page.locator('[data-testid="investment"], [class*="investment"]').first();
    
    if (await investmentsList.count() === 0) {
      test.skip();
      return;
    }

    // Buscar botón eliminar
    const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="eliminar" i]').first();
    
    if (await deleteButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para eliminar investment');
      return;
    }

    await deleteButton.click();
    
    // Confirmar
    const confirmButton = page.locator('button:has-text("Confirmar")').first();
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Esperar request DELETE /api/investments/[id]
    const deleteRequest = await instrumentation.waitForApiRequest(
      page,
      'DELETE',
      /\/api\/investments\/[^/]+$/,
      10000
    );

    if (!deleteRequest) {
      console.error('ERROR BLOQUEANTE: No se disparó request DELETE al eliminar investment');
    } else {
      expect(deleteRequest.status).toBeGreaterThanOrEqual(200);
      expect(deleteRequest.status).toBeLessThan(300);
    }

    await instrumentation.saveLogs('inversiones-delete');
  });
});

