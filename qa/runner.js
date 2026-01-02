#!/usr/bin/env node

/**
 * QA E2E Runner para Pulley
 * Valida endpoints críticos en producción
 */

const BASE_URL = "https://pulley-group.vercel.app";

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Estado global de tests
const testResults = [];
const report = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
  },
};

// Utilidades
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTable(data) {
  const rows = data.map(row => {
    const status = row.status === 'PASS' 
      ? `${colors.green}✓ PASS${colors.reset}` 
      : `${colors.red}✗ FAIL${colors.reset}`;
    return `  ${row.test.padEnd(50)} ${status}`;
  });
  console.log('\n' + rows.join('\n') + '\n');
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json().catch(() => ({}));
    
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error.message,
      data: {},
      error: error.message,
    };
  }
}

function recordTest(name, passed, details = {}) {
  const result = {
    name,
    status: passed ? 'PASS' : 'FAIL',
    timestamp: new Date().toISOString(),
    ...details,
  };
  
  testResults.push({
    test: name,
    status: result.status,
  });
  
  report.tests.push(result);
  report.summary.total++;
  if (passed) {
    report.summary.passed++;
  } else {
    report.summary.failed++;
  }
  
  return result;
}

// Tests
async function testConcepts() {
  log('\n[TEST] /api/concepts (bootstrap)', 'cyan');
  
  try {
    const response = await fetchAPI('/api/concepts');
    
    const passed = response.ok && response.status === 200;
    const details = {
      endpoint: '/api/concepts',
      method: 'GET',
      statusCode: response.status,
      responseSize: JSON.stringify(response.data).length,
      hasData: Array.isArray(response.data) || typeof response.data === 'object',
    };
    
    recordTest('GET /api/concepts', passed, details);
    
    if (!passed) {
      log(`  ✗ Failed: ${response.status} ${response.statusText}`, 'red');
      if (response.error) {
        log(`  Error: ${response.error}`, 'red');
      }
    } else {
      log(`  ✓ Passed: ${response.status}`, 'green');
    }
    
    return passed;
  } catch (error) {
    recordTest('GET /api/concepts', false, {
      endpoint: '/api/concepts',
      method: 'GET',
      error: error.message,
    });
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testMonths() {
  log('\n[TEST] /api/months', 'cyan');
  
  try {
    // Test GET /api/months
    const response = await fetchAPI('/api/months');
    const passed1 = response.ok && response.status === 200;
    
    recordTest('GET /api/months', passed1, {
      endpoint: '/api/months',
      method: 'GET',
      statusCode: response.status,
      responseSize: JSON.stringify(response.data).length,
    });
    
    if (!passed1) {
      log(`  ✗ GET /api/months Failed: ${response.status}`, 'red');
    } else {
      log(`  ✓ GET /api/months Passed: ${response.status}`, 'green');
    }
    
    // Test GET /api/months/{year}/{month}
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    const response2 = await fetchAPI(`/api/months/${year}/${month}`);
    const passed2 = response2.ok && response2.status === 200;
    
    recordTest(`GET /api/months/${year}/${month}`, passed2, {
      endpoint: `/api/months/${year}/${month}`,
      method: 'GET',
      statusCode: response2.status,
      year,
      month,
      responseSize: JSON.stringify(response2.data).length,
    });
    
    if (!passed2) {
      log(`  ✗ GET /api/months/${year}/${month} Failed: ${response2.status}`, 'red');
    } else {
      log(`  ✓ GET /api/months/${year}/${month} Passed: ${response2.status}`, 'green');
    }
    
    return passed1 && passed2;
  } catch (error) {
    recordTest('GET /api/months', false, {
      endpoint: '/api/months',
      method: 'GET',
      error: error.message,
    });
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testMovements() {
  log('\n[TEST] /api/movements', 'cyan');
  
  try {
    // Primero obtener un conceptId válido
    const conceptsResponse = await fetchAPI('/api/concepts');
    if (!conceptsResponse.ok || !Array.isArray(conceptsResponse.data) || conceptsResponse.data.length === 0) {
      log(`  ✗ No se pueden obtener conceptos para crear movimiento`, 'red');
      recordTest('POST /api/movements', false, {
        endpoint: '/api/movements',
        method: 'POST',
        error: 'No concepts available',
      });
      return false;
    }
    const conceptId = conceptsResponse.data[0].id;
    
    // Obtener monthId (crear mes actual si no existe)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthNum = currentDate.getMonth() + 1;
    const month = String(monthNum).padStart(2, '0');
    
    // Primero crear/obtener el mes para asegurar que existe
    const monthResponse = await fetchAPI(`/api/months/${year}/${month}`);
    if (!monthResponse.ok) {
      log(`  ✗ No se puede obtener/crear mes para crear movimiento`, 'red');
      recordTest('POST /api/movements', false, {
        endpoint: '/api/movements',
        method: 'POST',
        error: 'Month not available',
      });
      return false;
    }
    
    // Buscar el mes en GET /api/months para obtener su id
    const allMonthsResponse = await fetchAPI('/api/months');
    if (!allMonthsResponse.ok || !Array.isArray(allMonthsResponse.data)) {
      log(`  ✗ No se pueden obtener meses para crear movimiento`, 'red');
      recordTest('POST /api/movements', false, {
        endpoint: '/api/movements',
        method: 'POST',
        error: 'Cannot fetch months',
      });
      return false;
    }
    
    const monthRecord = allMonthsResponse.data.find(m => m.year === year && m.month === monthNum);
    if (!monthRecord || !monthRecord.id) {
      log(`  ✗ No se encuentra el mes ${year}-${month} en la lista`, 'red');
      recordTest('POST /api/movements', false, {
        endpoint: '/api/movements',
        method: 'POST',
        error: 'Month not found in list',
      });
      return false;
    }
    const monthId = monthRecord.id;
    
    // Test POST /api/movements
    const movementData = {
      type: 'ingreso',
      amountUSD: 1000,
      currencyOriginal: 'USD',
      conceptId: conceptId,
      date: new Date().toISOString().split('T')[0],
      monthId: monthId,
    };
    
    const postResponse = await fetchAPI('/api/movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
    
    const passedPost = postResponse.ok && (postResponse.status === 200 || postResponse.status === 201);
    
    recordTest('POST /api/movements', passedPost, {
      endpoint: '/api/movements',
      method: 'POST',
      statusCode: postResponse.status,
      requestData: movementData,
      responseSize: JSON.stringify(postResponse.data).length,
    });
    
    if (!passedPost) {
      log(`  ✗ POST /api/movements Failed: ${postResponse.status}`, 'red');
      if (postResponse.data.error) {
        log(`  Error: ${postResponse.data.error}`, 'red');
      }
    } else {
      log(`  ✓ POST /api/movements Passed: ${postResponse.status}`, 'green');
    }
    
    // Test GET /api/movements
    const getResponse = await fetchAPI('/api/movements');
    const passedGet = getResponse.ok && getResponse.status === 200;
    
    recordTest('GET /api/movements', passedGet, {
      endpoint: '/api/movements',
      method: 'GET',
      statusCode: getResponse.status,
      responseSize: JSON.stringify(getResponse.data).length,
      isArray: Array.isArray(getResponse.data),
    });
    
    if (!passedGet) {
      log(`  ✗ GET /api/movements Failed: ${getResponse.status}`, 'red');
    } else {
      log(`  ✓ GET /api/movements Passed: ${getResponse.status}`, 'green');
    }
    
    return passedPost && passedGet;
  } catch (error) {
    recordTest('POST /api/movements', false, {
      endpoint: '/api/movements',
      method: 'POST',
      error: error.message,
    });
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testInvestments() {
  log('\n[TEST] /api/investments', 'cyan');
  
  try {
    // Test POST /api/investments
    const investmentData = {
      name: 'QA Test Investment',
      type: 'financiera',
      targetAmountUSD: 10000,
      startDate: new Date().toISOString().split('T')[0],
    };
    
    const postResponse = await fetchAPI('/api/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
    
    const passedPost = postResponse.ok && (postResponse.status === 200 || postResponse.status === 201);
    
    recordTest('POST /api/investments', passedPost, {
      endpoint: '/api/investments',
      method: 'POST',
      statusCode: postResponse.status,
      requestData: investmentData,
      responseSize: JSON.stringify(postResponse.data).length,
    });
    
    if (!passedPost) {
      log(`  ✗ POST /api/investments Failed: ${postResponse.status}`, 'red');
      if (postResponse.data.error) {
        log(`  Error: ${postResponse.data.error}`, 'red');
      }
    } else {
      log(`  ✓ POST /api/investments Passed: ${postResponse.status}`, 'green');
    }
    
    // Test GET /api/investments
    const getResponse = await fetchAPI('/api/investments');
    const passedGet = getResponse.ok && getResponse.status === 200;
    
    recordTest('GET /api/investments', passedGet, {
      endpoint: '/api/investments',
      method: 'GET',
      statusCode: getResponse.status,
      responseSize: JSON.stringify(getResponse.data).length,
      isArray: Array.isArray(getResponse.data),
    });
    
    if (!passedGet) {
      log(`  ✗ GET /api/investments Failed: ${getResponse.status}`, 'red');
    } else {
      log(`  ✓ GET /api/investments Passed: ${getResponse.status}`, 'green');
    }
    
    return passedPost && passedGet;
  } catch (error) {
    recordTest('POST /api/investments', false, {
      endpoint: '/api/investments',
      method: 'POST',
      error: error.message,
    });
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function testAssets() {
  log('\n[TEST] /api/assets', 'cyan');
  
  try {
    // Test POST /api/assets
    const assetData = {
      name: 'QA Test Asset',
      type: 'inmueble',
      valueUSD: 50000,
    };
    
    const postResponse = await fetchAPI('/api/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
    
    const passedPost = postResponse.ok && (postResponse.status === 200 || postResponse.status === 201);
    
    recordTest('POST /api/assets', passedPost, {
      endpoint: '/api/assets',
      method: 'POST',
      statusCode: postResponse.status,
      requestData: assetData,
      responseSize: JSON.stringify(postResponse.data).length,
    });
    
    if (!passedPost) {
      log(`  ✗ POST /api/assets Failed: ${postResponse.status}`, 'red');
      if (postResponse.data.error) {
        log(`  Error: ${postResponse.data.error}`, 'red');
      }
    } else {
      log(`  ✓ POST /api/assets Passed: ${postResponse.status}`, 'green');
    }
    
    // Test GET /api/assets
    const getResponse = await fetchAPI('/api/assets');
    const passedGet = getResponse.ok && getResponse.status === 200;
    
    recordTest('GET /api/assets', passedGet, {
      endpoint: '/api/assets',
      method: 'GET',
      statusCode: getResponse.status,
      responseSize: JSON.stringify(getResponse.data).length,
      isArray: Array.isArray(getResponse.data),
    });
    
    if (!passedGet) {
      log(`  ✗ GET /api/assets Failed: ${getResponse.status}`, 'red');
    } else {
      log(`  ✓ GET /api/assets Passed: ${getResponse.status}`, 'green');
    }
    
    return passedPost && passedGet;
  } catch (error) {
    recordTest('POST /api/assets', false, {
      endpoint: '/api/assets',
      method: 'POST',
      error: error.message,
    });
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Función principal
async function runTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('QA E2E RUNNER - PULLEY PRODUCTION', 'blue');
  log('='.repeat(60), 'blue');
  log(`Base URL: ${BASE_URL}`, 'cyan');
  log(`Timestamp: ${report.timestamp}`, 'cyan');
  log('='.repeat(60) + '\n', 'blue');
  
  try {
    // Ejecutar todos los tests
    await testConcepts();
    await testMonths();
    await testMovements();
    await testInvestments();
    await testAssets();
    
    // Mostrar tabla de resultados
    log('\n' + '='.repeat(60), 'blue');
    log('RESULTADOS', 'blue');
    log('='.repeat(60), 'blue');
    logTable(testResults);
    
    // Mostrar resumen
    log('='.repeat(60), 'blue');
    log(`Total: ${report.summary.total}`, 'cyan');
    log(`Passed: ${report.summary.passed}`, 'green');
    log(`Failed: ${report.summary.failed}`, 'red');
    log('='.repeat(60), 'blue');
    
    // Mensaje final
    const allPassed = report.summary.failed === 0;
    
    if (allPassed) {
      log('\n' + '='.repeat(60), 'green');
      log('QA PASSED — SISTEMA OPERATIVO', 'green');
      log('='.repeat(60) + '\n', 'green');
    } else {
      log('\n' + '='.repeat(60), 'red');
      log('QA FAILED', 'red');
      log('='.repeat(60) + '\n', 'red');
    }
    
    // Generar report.json
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'qa', 'report.json');
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    log(`Reporte guardado en: ${reportPath}`, 'cyan');
    
    // Exit code
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log(`\n✗ Error fatal: ${error.message}`, 'red');
    log(error.stack, 'red');
    
    report.error = {
      message: error.message,
      stack: error.stack,
    };
    
    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.join(process.cwd(), 'qa', 'report.json');
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    process.exit(1);
  }
}

// Ejecutar
runTests();

