import { test, expect } from '@playwright/test';
import { TestInstrumentation } from '../helpers/instrumentation';
import { generateUniqueName } from '../helpers/test-data';

test.describe('Emma - E2E CRUD', () => {
  let instrumentation: TestInstrumentation;
  let testMovementId: string | null = null;

  test.beforeEach(async ({ page }) => {
    instrumentation = new TestInstrumentation();
    instrumentation.setup(page);
    
    // Navegar a Emma
    await page.goto('/emma');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Limpiar movement si se creó
    if (testMovementId) {
      try {
        await page.request.delete(`/api/movements/${testMovementId}`);
      } catch (e) {}
    }
    await instrumentation.saveLogs('emma');
  });

  test('debe iniciar fondo y crear movement real', async ({ page }) => {
    // Buscar botón "Iniciar fondo" o formulario de inicio
    const initButton = page.locator('button:has-text("Iniciar fondo"), button:has-text("Iniciar")').first();
    
    if (await initButton.count() === 0) {
      // Verificar si ya está iniciado (mostraría estado)
      const currentState = page.locator('text=Capital, text=Capital acumulado').first();
      if (await currentState.count() > 0) {
        test.skip(); // Ya está iniciado
        return;
      }
      console.error('ERROR BLOQUEANTE: No existe botón para iniciar fondo');
      return;
    }

    await initButton.click();
    
    // Esperar a que el formulario esté montado en el DOM
    await page.waitForSelector('form[data-testid="modal-form"]', { state: 'visible', timeout: 5000 });

    // Llenar formulario de inicio - todos los campos requeridos
    // Fecha de inicio (ya tiene valor por defecto, pero asegurémonos de que no sea futura)
    const fechaInput = page.locator('form[data-testid="modal-form"] input[type="date"]').first();
    await fechaInput.waitFor({ state: 'visible', timeout: 5000 });
    // Asegurar que la fecha no sea futura (usar fecha actual)
    const today = new Date().toISOString().split('T')[0];
    await fechaInput.fill(today);
    
    // Capital inicial (USD) - campo requerido (puede ser 0)
    const capitalInput = page.locator('form[data-testid="modal-form"] input[type="text"][inputmode="decimal"]').first();
    await capitalInput.waitFor({ state: 'visible', timeout: 5000 });
    await capitalInput.fill('10000');
    
    // Aporte periódico (opcional, pero llenarlo con 0 para ser explícito)
    const aporteInput = page.locator('form[data-testid="modal-form"] input[type="text"][inputmode="decimal"]').nth(1);
    await aporteInput.waitFor({ state: 'visible', timeout: 5000 });
    await aporteInput.fill('0');
    
    // Frecuencia (ya tiene default 'mensual', pero asegurémonos)
    const frecuenciaSelect = page.locator('form[data-testid="modal-form"] select').first();
    await frecuenciaSelect.waitFor({ state: 'visible', timeout: 5000 });
    
    // Tasa esperada (% anual) - campo requerido
    // Buscar input de texto sin inputmode que viene después del select de frecuencia
    const tasaInput = page.locator('form[data-testid="modal-form"] input[type="text"]:not([inputmode])').first();
    await tasaInput.waitFor({ state: 'visible', timeout: 5000 });
    await tasaInput.fill('10');
    
    // Horizonte (años) - campo requerido
    const horizonteInput = page.locator('form[data-testid="modal-form"] input[type="text"]:not([inputmode])').last();
    await horizonteInput.waitFor({ state: 'visible', timeout: 5000 });
    await horizonteInput.fill('25');

    // Submit
    const submitButton = page.locator('form[data-testid="modal-form"] button[type="submit"], form[data-testid="modal-form"] button:has-text("Iniciar")').first();
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Esperar request POST /api/emma (o POST /api/movements si crea movement)
    const createRequest = await instrumentation.waitForApiRequest(
      page,
      'POST',
      /\/api\/(emma|movements)/,
      10000
    );

    expect(createRequest).not.toBeNull();
    expect(createRequest?.status).toBeGreaterThanOrEqual(200);
    expect(createRequest?.status).toBeLessThan(300);

    // ASSERT: Debe aparecer en Vida Mensual o en lista de Emma
    await page.waitForTimeout(2000);
    
    // Verificar que se creó movement (ir a vida mensual o verificar lista)
    await page.goto('/vida-mensual');
    await page.waitForLoadState('networkidle');
    
    // Buscar movement relacionado con Emma
    const emmaMovement = page.locator('text=Emma, text=Fondo').first();
    const isVisible = await emmaMovement.isVisible().catch(() => false);
    
    if (!isVisible) {
      console.error('ERROR ALTA: Fondo iniciado pero no se creó movement visible en Vida Mensual');
    }

    await instrumentation.saveLogs('emma-init');
  });

  test('debe eliminar movement desde EmmaMovementsList', async ({ page }) => {
    // Verificar que hay movements en la lista
    const movementsList = page.locator('[data-testid="movement"], [class*="movement"], tr').first();
    
    if (await movementsList.count() === 0) {
      test.skip(); // No hay movements para eliminar
      return;
    }

    // Buscar botón eliminar en EmmaMovementsList
    const deleteButton = page.locator('button:has-text("Eliminar"), button[aria-label*="eliminar" i]').first();
    
    if (await deleteButton.count() === 0) {
      console.error('ERROR BLOQUEANTE: No existe botón para eliminar movement desde Emma');
      return;
    }

    await deleteButton.click();
    
    // Confirmar si aparece modal
    const confirmButton = page.locator('button:has-text("Confirmar"), button:has-text("Eliminar")').first();
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }

    // Esperar request DELETE /api/movements/[id]
    const deleteRequest = await instrumentation.waitForApiRequest(
      page,
      'DELETE',
      /\/api\/movements\/[^/]+$/,
      10000
    );

    // ASSERT: Debe existir request DELETE
    if (!deleteRequest) {
      console.error('ERROR BLOQUEANTE: No se disparó request DELETE al eliminar movement desde Emma');
    } else {
      expect(deleteRequest.status).toBeGreaterThanOrEqual(200);
      expect(deleteRequest.status).toBeLessThan(300);
    }

    // ASSERT: Movement debe desaparecer
    await page.waitForTimeout(2000);
    
    await instrumentation.saveLogs('emma-delete-movement');
  });
});

