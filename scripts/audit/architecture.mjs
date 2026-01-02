#!/usr/bin/env node

/**
 * Validación Arquitectura
 * Verifica que NO se use autenticación, tokens, o endpoints inexistentes
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Patrones prohibidos (no deben existir en el código)
const FORBIDDEN_PATTERNS = [
  {
    name: 'Autenticación',
    patterns: [
      /\/api\/auth/,
      /\/api\/login/,
      /\/api\/logout/,
      /\/api\/session/,
      /\/api\/user/,
      /login|Login|LOGIN/,
      /signin|signIn|sign-in/,
      /signout|signOut|sign-out/,
      /authenticate|authentication/,
    ],
    message: 'No debe existir código de autenticación',
  },
  {
    name: 'Tokens',
    patterns: [
      /authToken|auth_token/,
      /accessToken|access_token/,
      /refreshToken|refresh_token/,
      /jwt|JWT/,
      /bearer\s+token/i,
      /localStorage\.getItem\(['"]token['"]/,
      /sessionStorage\.getItem\(['"]token['"]/,
    ],
    message: 'No debe existir manejo de tokens',
  },
  {
    name: 'Endpoints inexistentes',
    patterns: [
      /\/api\/auth/,
      /\/api\/login/,
      /\/api\/users/,
      /\/api\/profile/,
    ],
    message: 'No debe llamar a endpoints que no existen',
  },
];

// Endpoints válidos (los que SÍ existen)
const VALID_ENDPOINTS = [
  '/api/months',
  '/api/movements',
  '/api/assets',
  '/api/investments',
  '/api/concepts',
];

const errors = [];
const warnings = [];

/**
 * Recursivamente leer archivos .ts, .tsx, .js, .jsx
 */
function getAllCodeFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorar node_modules, .next, etc.
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        getAllCodeFiles(filePath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

console.log('🔐 Validación Arquitectura (No Auth)\n');

const codeFiles = getAllCodeFiles(join(projectRoot, 'app'));
codeFiles.push(...getAllCodeFiles(join(projectRoot, 'lib')));
codeFiles.push(...getAllCodeFiles(join(projectRoot, 'components')));

for (const filePath of codeFiles) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = filePath.replace(projectRoot + '/', '');
    
    // Verificar patrones prohibidos
    for (const rule of FORBIDDEN_PATTERNS) {
      for (const pattern of rule.patterns) {
        if (pattern.test(content)) {
          // Buscar línea específica
          const lines = content.split('\n');
          const lineNumber = lines.findIndex(line => pattern.test(line)) + 1;
          
          errors.push({
            file: relativePath,
            rule: rule.name,
            message: rule.message,
            line: lineNumber,
          });
        }
      }
    }
    
    // Verificar endpoints inválidos en fetch/API calls
    const fetchPattern = /fetch\(['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = fetchPattern.exec(content)) !== null) {
      const endpoint = match[1];
      if (endpoint.startsWith('/api/')) {
        const isValid = VALID_ENDPOINTS.some(valid => 
          endpoint.startsWith(valid) || endpoint === valid
        );
        if (!isValid && !endpoint.includes('[')) { // Ignorar rutas dinámicas [id]
          warnings.push({
            file: relativePath,
            endpoint: endpoint,
            message: 'Endpoint no verificado en lista de válidos',
          });
        }
      }
    }
  } catch (error) {
    // Ignorar errores de lectura (archivos binarios, etc.)
  }
}

// Reportar resultados
if (errors.length > 0) {
  console.error('❌ Validación Arquitectura: FAIL\n');
  errors.forEach(err => {
    console.error(`  ❌ ${err.file}:${err.line || ''}`);
    console.error(`     Regla: ${err.rule}`);
    console.error(`     ${err.message}\n`);
  });
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('⚠️  Advertencias (no bloquean):\n');
  warnings.forEach(warn => {
    console.warn(`  ⚠️  ${warn.file}`);
    console.warn(`     Endpoint: ${warn.endpoint}`);
    console.warn(`     ${warn.message}\n`);
  });
}

console.log('✅ Validación Arquitectura: OK');
console.log(`   Archivos verificados: ${codeFiles.length}`);
process.exit(0);

