#!/usr/bin/env node

/**
 * Helper para resetear la base de datos antes de los tests
 * Borra dev.db y re-aplica migraciones para estado limpio
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'prisma', 'dev.db');

console.log('🔄 Reseteando base de datos...');

try {
  // Borrar dev.db si existe
  if (existsSync(dbPath)) {
    console.log('  - Eliminando dev.db existente...');
    unlinkSync(dbPath);
  }

  // Re-aplicar migraciones
  console.log('  - Aplicando migraciones...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Generar Prisma Client
  console.log('  - Generando Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Base de datos reseteada correctamente');
} catch (error) {
  console.error('❌ Error al resetear base de datos:', error.message);
  process.exit(1);
}
