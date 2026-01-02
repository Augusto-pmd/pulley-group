#!/usr/bin/env node

/**
 * Script para limpiar todos los datos de la base de datos
 * Mantiene la estructura pero elimina todos los registros
 */

import { PrismaClient } from '@prisma/client';
import { join } from 'path';

// Configurar DATABASE_URL si no está definida
if (!process.env.DATABASE_URL) {
  const dbPath = join(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function clearAllData() {
  console.log('🗑️  Limpiando todos los datos de la base de datos...\n');

  try {
    // Limpiar en orden para respetar foreign keys
    // Primero las tablas con dependencias, luego las independientes

    console.log('  - Eliminando eventos de inversiones...');
    await prisma.investmentEvent.deleteMany({});

    console.log('  - Eliminando inversiones...');
    await prisma.investment.deleteMany({});

    console.log('  - Eliminando valuaciones de activos...');
    await prisma.assetValuation.deleteMany({});

    console.log('  - Eliminando pasivos...');
    await prisma.liability.deleteMany({});

    console.log('  - Eliminando activos...');
    await prisma.asset.deleteMany({});

    console.log('  - Eliminando movimientos...');
    await prisma.movement.deleteMany({});

    console.log('  - Eliminando meses...');
    await prisma.month.deleteMany({});

    console.log('  - Eliminando conceptos...');
    await prisma.concept.deleteMany({});

    console.log('\n✅ Todos los datos han sido eliminados correctamente');
    console.log('   La estructura de la base de datos se mantiene intacta');
    console.log('   Los conceptos base se crearán automáticamente en la próxima llamada a /api/concepts\n');

  } catch (error) {
    console.error('❌ Error al limpiar datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllData();

