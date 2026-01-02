#!/usr/bin/env node

/**
 * Smoke tests de API - Validación básica de endpoints
 * Verifica que todos los endpoints responden correctamente
 */

// Configurar DATABASE_URL si no está definida
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const endpoints = [
  { method: 'GET', path: '/api/months', name: 'GET /api/months' },
  { method: 'GET', path: '/api/movements?year=2024&month=12', name: 'GET /api/movements' },
  { method: 'GET', path: '/api/assets', name: 'GET /api/assets' },
  { method: 'GET', path: '/api/investments', name: 'GET /api/investments' },
  { method: 'GET', path: '/api/concepts', name: 'GET /api/concepts' },
];

let failed = false;
const errors = [];

async function testEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Validar status 200
    if (response.status !== 200) {
      const text = await response.text().catch(() => '');
      throw new Error(`Status ${response.status}: ${text}`);
    }

    // Validar content-type JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Content-Type no es JSON: ${contentType}`);
    }

    // Validar que el body es parseable JSON
    const body = await response.json();
    
    // Validar que arrays devuelven [] si vacío (o array válido)
    if (Array.isArray(body)) {
      // OK - es un array válido
    } else if (typeof body === 'object' && body !== null) {
      // OK - es un objeto JSON válido
    } else {
      throw new Error(`Body no es array ni objeto: ${typeof body}`);
    }

    console.log(`✅ ${endpoint.name} - OK`);
    return true;
  } catch (error) {
    console.error(`❌ ${endpoint.name} - ERROR: ${error.message}`);
    errors.push({ endpoint: endpoint.name, error: error.message });
    return false;
  }
}

async function runSmokeTests() {
  console.log('🔥 Ejecutando smoke tests de API...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Verificar que el servidor está disponible
  try {
    const healthCheck = await fetch(`${BASE_URL}/`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    if (!healthCheck.ok && healthCheck.status !== 404) {
      throw new Error(`Servidor no disponible: ${healthCheck.status}`);
    }
  } catch (error) {
    console.error(`❌ Servidor no disponible en ${BASE_URL}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Asegúrate de que 'npm run dev' esté corriendo`);
    process.exit(1);
  }

  // Ejecutar tests de cada endpoint
  for (const endpoint of endpoints) {
    const passed = await testEndpoint(endpoint);
    if (!passed) {
      failed = true;
    }
  }

  console.log('\n' + '='.repeat(50));
  
  if (failed) {
    console.log('❌ SMOKE TESTS FALLARON\n');
    console.log('Errores encontrados:');
    errors.forEach(({ endpoint, error }) => {
      console.log(`  - ${endpoint}: ${error}`);
    });
    process.exit(1);
  } else {
    console.log('✅ TODOS LOS SMOKE TESTS PASARON');
    process.exit(0);
  }
}

runSmokeTests().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
