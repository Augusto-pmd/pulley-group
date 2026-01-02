import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const months = await prisma.month.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    });

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(months || []);
  } catch (error: any) {
    console.error('Error fetching months:', error);
    // Asegurar que siempre se devuelve JSON válido
    return NextResponse.json(
      { error: 'Failed to fetch months', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: 'year and month are required' },
        { status: 400 }
      );
    }

    // Buscar si ya existe
    const existing = await prisma.month.findFirst({
      where: {
        year: parseInt(year),
        month: parseInt(month),
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Crear nuevo mes
    const newMonth = await prisma.month.create({
      data: {
        year: parseInt(year),
        month: parseInt(month),
        status: 'abierto',
      },
    });

    return NextResponse.json(newMonth, { status: 201 });
  } catch (error: any) {
    console.error('Error creating month:', error);
    return NextResponse.json(
      { error: 'Failed to create month', message: error.message },
      { status: 500 }
    );
  }
}

