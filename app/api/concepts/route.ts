import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Ejecutar prisma.concept.findMany() sin filtros
    let concepts = await prisma.concept.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // 2. Si el resultado tiene length === 0, ejecutar bootstrap
    if (concepts.length === 0) {
      console.log('[GET /api/concepts] Bootstrap: tabla vacía, creando conceptos base...');
      
      try {
        // Crear conceptos base con valores válidos del schema
        await prisma.concept.createMany({
          data: [
            { name: 'Ingreso', type: 'ingreso', nature: 'variable' },
            { name: 'Gasto', type: 'egreso', nature: 'variable' },
            { name: 'Ahorro', type: 'ingreso', nature: 'variable' },
          ],
          skipDuplicates: true, // La DB decide duplicados
        });

        console.log('[GET /api/concepts] Bootstrap: conceptos base creados');

        // 3. Volver a ejecutar prisma.concept.findMany()
        concepts = await prisma.concept.findMany({
          orderBy: {
            name: 'asc',
          },
        });
        
        console.log(`[GET /api/concepts] Bootstrap: ${concepts.length} conceptos disponibles después del bootstrap`);
      } catch (bootstrapError: any) {
        // Si falla el bootstrap, loguear el error completo para diagnóstico
        console.error('[GET /api/concepts] Error en bootstrap de conceptos:', {
          message: bootstrapError.message,
          code: bootstrapError.code,
          meta: bootstrapError.meta,
          stack: bootstrapError.stack,
        });
        // Reintentar findMany para ver si hay conceptos después del error
        concepts = await prisma.concept.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      }
    }

    // 4. Retornar siempre 200 con el array de conceptos
    // NO retornar [] si la DB está vacía - el bootstrap debe haber creado conceptos
    return NextResponse.json(concepts || [], { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/concepts] Error inesperado:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    // En caso de error inesperado, retornar array vacío en lugar de 500
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, type, nature } = body;

    // Verificar si el concepto ya existe
    const existing = await prisma.concept.findFirst({
      where: {
        name: name,
        type: type,
      },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    // Crear nuevo concepto
    const concept = await prisma.concept.create({
      data: {
        name,
        type,
        nature: nature || 'variable',
      },
    });

    return NextResponse.json(concept, { status: 201 });
  } catch (error: any) {
    console.error('Error creating concept:', error);
    return NextResponse.json(
      { error: 'Failed to create concept', message: error.message },
      { status: 500 }
    );
  }
}

