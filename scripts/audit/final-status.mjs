#!/usr/bin/env node

/**
 * Determina el estado final de la auditoría
 * Lee audit-report.json y determina si el pipeline debe pasar o fallar
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

const reportPath = join(projectRoot, 'audit-report.json');

if (!existsSync(reportPath)) {
  console.error('❌ No se encontró audit-report.json');
  console.error('   Ejecutar primero: npm run audit:report');
  process.exit(1);
}

try {
  const report = JSON.parse(readFileSync(reportPath, 'utf-8'));
  
  if (report.final_status === 'OK') {
    console.log('\n✅ AUDITORÍA COMPLETA: TODOS LOS CHECKS PASARON\n');
    process.exit(0);
  } else {
    console.error('\n❌ AUDITORÍA FALLIDA: HAY CHECKS QUE FALLARON\n');
    console.error('Checks fallidos:');
    report.errors.forEach(err => {
      console.error(`  ❌ ${err.name}`);
    });
    console.error('');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error al leer reporte:', error.message);
  process.exit(1);
}

