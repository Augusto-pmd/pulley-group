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
  } catch (error) {
    console.error('Error fetching month:', error);
    return NextResponse.json(
      { error: 'Failed to fetch month' },
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

