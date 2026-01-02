import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/months/[year]/[month] - Obtener estado de un mes específico
export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  try {
    const year = parseInt(params.year);
    const month = parseInt(params.month);

    // Validar que year y month sean números válidos
    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json(
        { error: 'year and month must be valid numbers' },
        { status: 400 }
      );
    }

    // Validar rango de mes (1-12)
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'month must be between 1 and 12' },
        { status: 400 }
      );
    }

    // Validar rango de año (razonable)
    if (year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: 'year must be between 2000 and 2100' },
        { status: 400 }
      );
    }

    // UPSERT: crear si no existe, leer si existe
    const monthRecord = await prisma.month.upsert({
      where: {
        year_month: {
          year,
          month,
        },
      },
      update: {},
      create: {
        year,
        month,
        status: 'abierto',
        openDate: new Date(),
      },
      include: {
        movements: true,
      },
    });

    return NextResponse.json({
      mes: `${year}-${String(month).padStart(2, '0')}`,
      estado: monthRecord.status === 'abierto' ? 'ABIERTO' : 'CERRADO',
      fechaApertura: monthRecord.openDate,
      fechaCierre: monthRecord.closeDate ?? undefined,
      nota: monthRecord.note ?? undefined,
      movimientos: monthRecord.movements,
    });
  } catch (error: any) {
    console.error('Error fetching month:', error);
    
    // Si es error de validación de Prisma, retornar 400
    if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Month already exists with different data' },
        { status: 400 }
      );
    }
    
    // Para otros errores, retornar 500 solo si es realmente inesperado
    return NextResponse.json(
      { error: 'Failed to fetch month', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/months/[year]/[month] - Actualizar estado del mes (cerrar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const year = parseInt(params.year);
    const month = parseInt(params.month);

    if (status === 'cerrado') {
      const closeDate = new Date().toISOString().split('T')[0];
      
      const updated = await prisma.month.update({
        where: {
          year_month: {
            year,
            month,
          },
        },
        data: {
          status: 'cerrado',
          closeDate,
        },
      });

      return NextResponse.json({
        mes: `${year}-${String(month).padStart(2, '0')}`,
        estado: 'CERRADO',
        fechaApertura: updated.openDate,
        fechaCierre: updated.closeDate ?? undefined,
        nota: updated.note ?? undefined,
      });
    }

    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating month:', error);
    return NextResponse.json(
      { error: 'Failed to update month' },
      { status: 500 }
    );
  }
}

