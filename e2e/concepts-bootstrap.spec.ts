import { test, expect } from '@playwright/test';

/**
 * Test para validar el bootstrap automático de conceptos
 * cuando la tabla está vacía
 */
test.describe('Concepts Bootstrap', () => {
  test('debe crear conceptos base automáticamente cuando la tabla está vacía', async ({ request }) => {
    // Llamar al endpoint de conceptos
    const response = await request.get('/api/concepts');
    
    // Verificar que responde correctamente
    expect(response.ok()).toBeTruthy();
    
    const concepts = await response.json();
    
    // Verificar que es un array
    expect(Array.isArray(concepts)).toBe(true);
    
    // Verificar que hay conceptos (al menos los base)
    expect(concepts.length).toBeGreaterThanOrEqual(8);
    
    // Verificar que existen los conceptos base esperados
    const conceptNames = concepts.map((c: any) => c.name);
    
    // Ingresos
    expect(conceptNames).toContain('Honorarios');
    expect(conceptNames).toContain('Alquiler cobrado');
    expect(conceptNames).toContain('Otros ingresos');
    
    // Egresos
    expect(conceptNames).toContain('Alquiler');
    expect(conceptNames).toContain('Servicios');
    expect(conceptNames).toContain('Supermercado');
    expect(conceptNames).toContain('Expensas');
    expect(conceptNames).toContain('Otros gastos');
  });

  test('no debe crear duplicados en llamadas posteriores', async ({ request }) => {
    // Primera llamada
    const response1 = await request.get('/api/concepts');
    const concepts1 = await response1.json();
    const count1 = concepts1.length;
    
    // Segunda llamada (inmediata)
    const response2 = await request.get('/api/concepts');
    const concepts2 = await response2.json();
    const count2 = concepts2.length;
    
    // El número de conceptos debe ser el mismo
    expect(count2).toBe(count1);
    
    // No debe haber duplicados
    const names1 = concepts1.map((c: any) => c.name);
    const names2 = concepts2.map((c: any) => c.name);
    expect(names1.sort()).toEqual(names2.sort());
  });

  test('debe devolver conceptos ordenados por nombre', async ({ request }) => {
    const response = await request.get('/api/concepts');
    const concepts = await response.json();
    
    // Verificar que están ordenados
    const names = concepts.map((c: any) => c.name);
    const sortedNames = [...names].sort();
    
    expect(names).toEqual(sortedNames);
  });
});

