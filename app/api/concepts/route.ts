import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Consultar conceptos existentes
    let concepts = await prisma.concept.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Bootstrap automático: crear conceptos base si la tabla está vacía
    if (concepts.length === 0) {
      try {
        console.log('[GET /api/concepts] Bootstrap: creando conceptos base...');
        await prisma.concept.createMany({
          data: [
            // Ingresos
            { name: 'Honorarios', type: 'ingreso', nature: 'variable' },
            { name: 'Alquiler cobrado', type: 'ingreso', nature: 'fijo' },
            { name: 'Otros ingresos', type: 'ingreso', nature: 'variable' },
            // Egresos
            { name: 'Alquiler', type: 'egreso', nature: 'fijo' },
            { name: 'Servicios', type: 'egreso', nature: 'fijo' },
            { name: 'Supermercado', type: 'egreso', nature: 'variable' },
            { name: 'Expensas', type: 'egreso', nature: 'fijo' },
            { name: 'Otros gastos', type: 'egreso', nature: 'variable' },
          ],
          skipDuplicates: true, // Evitar duplicados si ya existen
        });

        console.log('[GET /api/concepts] Bootstrap: conceptos creados exitosamente');

        // Recargar conceptos después del bootstrap
        concepts = await prisma.concept.findMany({
          orderBy: {
            name: 'asc',
          },
        });
        
        console.log(`[GET /api/concepts] Bootstrap: ${concepts.length} conceptos disponibles`);
      } catch (bootstrapError: any) {
        // Si falla el bootstrap, loguear el error completo
        console.error('[GET /api/concepts] Error en bootstrap de conceptos:', {
          message: bootstrapError.message,
          code: bootstrapError.code,
          meta: bootstrapError.meta,
        });
        // Continuar con array vacío en lugar de fallar
        // El bootstrap puede fallar si hay problemas de DB, pero no debe romper el endpoint
      }
    }

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    // DB vacía NO es error - retornar 200 con array vacío
    return NextResponse.json(concepts || [], { status: 200 });
  } catch (error: any) {
    console.error('Error fetching concepts:', error);
    // En caso de error inesperado, retornar array vacío en lugar de 500
    // Esto permite que el frontend funcione aunque haya problemas con la DB
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

