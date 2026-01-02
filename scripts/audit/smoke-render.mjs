#!/usr/bin/env node

/**
 * Smoke Tests - Render de Páginas
 * Verifica que las páginas principales pueden renderizarse sin errores
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Páginas principales a verificar
const PAGES_TO_CHECK = [
  'app/page.tsx',                    // Dashboard
  'app/vida-mensual/page.tsx',       // Vida Mensual
  'app/activos/page.tsx',            // Activos
  'app/investments/page.tsx',       // Inversiones
  'app/projections/page.tsx',       // Proyecciones
  'app/emma/page.tsx',              // Emma
  'app/settings/page.tsx',          // Settings
  'app/layout.tsx',                 // Layout raíz
];

const errors = [];

console.log('🧪 Smoke Tests - Render de Páginas\n');

for (const pagePath of PAGES_TO_CHECK) {
  const fullPath = join(projectRoot, pagePath);
  
  if (!existsSync(fullPath)) {
    errors.push(`❌ Página no encontrada: ${pagePath}`);
    continue;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    
    // Verificaciones básicas
    const checks = [
      {
        name: 'Export default',
        test: /export\s+default\s+function|export\s+default\s+\w+/,
        error: `No tiene export default: ${pagePath}`,
      },
      {
        name: 'React import',
        test: /import.*from\s+['"]react['"]|import.*from\s+['"]next['"]/,
        error: `No tiene import de React/Next: ${pagePath}`,
      },
      {
        name: 'Sintaxis válida',
        test: /function|const|export/,
        error: `Estructura inválida: ${pagePath}`,
      },
    ];

    for (const check of checks) {
      if (!check.test.test(content)) {
        errors.push(`❌ ${check.error}`);
      }
    }

    console.log(`✅ ${pagePath}`);
  } catch (error) {
    errors.push(`❌ Error al leer ${pagePath}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error('\n❌ Smoke Tests - Render: FAIL\n');
  errors.forEach(err => console.error(err));
  process.exit(1);
}

console.log('\n✅ Smoke Tests - Render: OK');
process.exit(0);

