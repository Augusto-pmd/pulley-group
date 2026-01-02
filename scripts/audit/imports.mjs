#!/usr/bin/env node

/**
 * Validación de Imports
 * Verifica que todos los imports sean válidos y no apunten a archivos inexistentes
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

const errors = [];
const warnings = [];

/**
 * Resolver import path a archivo real
 */
function resolveImportPath(importPath, fromFile) {
  // Ignorar imports de node_modules
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return null; // Es un módulo npm, no verificamos
  }
  
  const fromDir = dirname(fromFile);
  
  if (importPath.startsWith('@/')) {
    // Alias @/ apunta a la raíz del proyecto
    const relativePath = importPath.replace('@/', '');
    return resolve(projectRoot, relativePath);
  }
  
  // Import relativo
  const resolved = resolve(fromDir, importPath);
  
  // Intentar con extensiones comunes
  const extensions = ['.ts', '.tsx', '.js', '.jsx', ''];
  for (const ext of extensions) {
    const withExt = resolved + ext;
    if (existsSync(withExt)) {
      return withExt;
    }
    // También verificar si es un directorio con index
    if (existsSync(resolved) && statSync(resolved).isDirectory()) {
      const indexFiles = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];
      for (const indexFile of indexFiles) {
        if (existsSync(join(resolved, indexFile))) {
          return join(resolved, indexFile);
        }
      }
    }
  }
  
  return null;
}

/**
 * Recursivamente leer archivos .ts, .tsx
 */
function getAllCodeFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', 'dist', 'build', '.git', 'test-results', 'playwright-report'].includes(file)) {
          getAllCodeFiles(filePath, fileList);
        }
      } else if (/\.(ts|tsx)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    // Ignorar errores de acceso
  }
  
  return fileList;
}

console.log('🔗 Validación de Imports\n');

const codeFiles = getAllCodeFiles(projectRoot);

// Patrón para detectar imports
const importPattern = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;

for (const filePath of codeFiles) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(projectRoot + '/', '');
    
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      const importPath = match[1];
      const resolved = resolveImportPath(importPath, filePath);
      
      if (importPath.startsWith('.') || importPath.startsWith('@/')) {
        if (!resolved || !existsSync(resolved)) {
          errors.push({
            file: relativePath,
            import: importPath,
            message: 'Import no resuelve a archivo existente',
          });
        }
      }
    }
  } catch (error) {
    // Ignorar errores de lectura
  }
}

// Reportar resultados
if (errors.length > 0) {
  console.error('❌ Validación de Imports: FAIL\n');
  errors.forEach(err => {
    console.error(`  ❌ ${err.file}`);
    console.error(`     Import: ${err.import}`);
    console.error(`     ${err.message}\n`);
  });
  process.exit(1);
}

console.log('✅ Validación de Imports: OK');
console.log(`   Archivos verificados: ${codeFiles.length}`);
process.exit(0);

