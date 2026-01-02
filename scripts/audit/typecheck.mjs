#!/usr/bin/env node

/**
 * TypeCheck Script
 * Ejecuta verificación de tipos TypeScript sin emitir archivos
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

process.chdir(projectRoot);

console.log('🔍 Ejecutando TypeCheck...\n');

try {
  // Ejecutar tsc con --noEmit para solo verificar tipos
  execSync('npx tsc --noEmit', {
    stdio: 'inherit',
    cwd: projectRoot,
  });
  
  console.log('\n✅ TypeCheck: OK');
  process.exit(0);
} catch (error) {
  console.error('\n❌ TypeCheck: FAIL');
  console.error('Errores de tipos encontrados');
  process.exit(1);
}

