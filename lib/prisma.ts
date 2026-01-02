import { PrismaClient } from '@prisma/client';

// Función para validar DATABASE_URL (solo se ejecuta en runtime, no durante build)
function validateDatabaseUrl() {
  // Skip validación durante build time
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.NEXT_PHASE === 'phase-development-build') {
    return;
  }

  // Skip validación en cliente (window existe)
  if (typeof window !== 'undefined') {
    return;
  }

  // Validar que DATABASE_URL esté configurada en producción
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required in production');
  }

  // Validar que DATABASE_URL sea PostgreSQL (no SQLite)
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL must be a PostgreSQL connection string in production');
    }
    // En desarrollo, solo advertir si no es PostgreSQL
    console.warn('⚠️  DATABASE_URL does not appear to be a PostgreSQL connection string');
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Validar DATABASE_URL solo cuando se instancia PrismaClient (runtime, no build)
if (!globalForPrisma.prisma) {
  validateDatabaseUrl();
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

