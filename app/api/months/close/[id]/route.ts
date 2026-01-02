import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/months/close/[id] - Cerrar mes
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar que el mes existe
    const month = await getPrisma().month.findUnique({
      where: { id },
    });

    if (!month) {
      return NextResponse.json(
        { error: 'Month not found' },
        { status: 404 }
      );
    }

    // Verificar que el mes no esté ya cerrado
    if (month.status === 'cerrado') {
      return NextResponse.json(
        { error: 'Month is already closed' },
        { status: 400 }
      );
    }

    // Cerrar el mes
    const updatedMonth = await getPrisma().month.update({
      where: { id },
      data: {
        status: 'cerrado',
      },
    });

    return NextResponse.json(updatedMonth);
  } catch (error) {
    console.error('Error closing month:', error);
    return NextResponse.json(
      { error: 'Failed to close month' },
      { status: 500 }
    );
  }
}

