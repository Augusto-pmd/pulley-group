import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      });

      // Recargar conceptos después del bootstrap
      concepts = await prisma.concept.findMany({
        orderBy: {
          name: 'asc',
        },
      });
    }

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(concepts || []);
  } catch (error: any) {
    console.error('Error fetching concepts:', error);
    // Asegurar que siempre se devuelve JSON válido
    return NextResponse.json(
      { error: 'Failed to fetch concepts', message: error.message || 'Unknown error' },
      { status: 500 }
    );
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

