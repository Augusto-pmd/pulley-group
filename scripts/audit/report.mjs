#!/usr/bin/env node

/**
 * Generador de Reporte Final
 * Consolida todos los resultados de la auditoría en un único reporte JSON
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Leer estados de GitHub Actions (si están disponibles)
const getStepStatus = (stepId) => {
  const status = process.env[`${stepId.toUpperCase().replace(/-/g, '_')}_STATUS`] || 'unknown';
  return status === 'ok' ? 'PASS' : 'FAIL';
};

// Construir reporte
const report = {
  timestamp: new Date().toISOString(),
  project: 'Pulley Group',
  version: '1.0.0',
  checks: {
    install: {
      name: 'Instalación de dependencias',
      status: getStepStatus('install'),
      command: 'npm ci',
    },
    build: {
      name: 'Build del proyecto',
      status: getStepStatus('build'),
      command: 'npm run build',
    },
    lint: {
      name: 'Lint del código',
      status: getStepStatus('lint'),
      command: 'npm run lint',
    },
    typecheck: {
      name: 'TypeCheck (TypeScript)',
      status: getStepStatus('typecheck'),
      command: 'npm run typecheck',
    },
    smoke_render: {
      name: 'Smoke Tests - Render de páginas',
      status: getStepStatus('smoke_render'),
      command: 'npm run audit:smoke-render',
    },
    arch_validation: {
      name: 'Validación Arquitectura (No Auth)',
      status: getStepStatus('arch_validation'),
      command: 'npm run audit:architecture',
    },
    imports_validation: {
      name: 'Validación de Imports',
      status: getStepStatus('imports_validation'),
      command: 'npm run audit:imports',
    },
  },
  summary: {
    total: 7,
    passed: 0,
    failed: 0,
  },
  errors: [],
};

// Calcular summary
for (const [key, check] of Object.entries(report.checks)) {
  if (check.status === 'PASS') {
    report.summary.passed++;
  } else {
    report.summary.failed++;
    report.errors.push({
      check: key,
      name: check.name,
      command: check.command,
    });
  }
}

// Determinar estado final
report.final_status = report.summary.failed === 0 ? 'OK' : 'FAIL';

// Escribir reporte
const reportPath = join(projectRoot, 'audit-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

// Mostrar resumen en consola
console.log('\n📊 REPORTE DE AUDITORÍA\n');
console.log('═══════════════════════════════════════\n');

for (const [key, check] of Object.entries(report.checks)) {
  const icon = check.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${check.name}: ${check.status}`);
}

console.log('\n═══════════════════════════════════════\n');
console.log(`Total: ${report.summary.total}`);
console.log(`✅ Pasados: ${report.summary.passed}`);
console.log(`❌ Fallidos: ${report.summary.failed}`);
console.log(`\n🎯 Estado Final: ${report.final_status === 'OK' ? '✅ OK' : '❌ FAIL'}\n`);

if (report.errors.length > 0) {
  console.log('Errores encontrados:');
  report.errors.forEach(err => {
    console.log(`  ❌ ${err.name} (${err.check})`);
  });
  console.log('');
}

console.log(`📄 Reporte completo guardado en: audit-report.json\n`);

