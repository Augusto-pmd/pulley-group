import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const monthRecord = await prisma.month.findFirst({
      where: {
        year: parseInt(year),
        month: parseInt(month),
      },
    });

    if (!monthRecord) {
      return NextResponse.json(
        { error: 'Month not found' },
        { status: 404 }
      );
    }

    const updatedMonth = await prisma.month.update({
      where: {
        id: monthRecord.id,
      },
      data: {
        status: 'cerrado',
      },
    });

    return NextResponse.json(updatedMonth);
  } catch (error: any) {
    console.error('Error closing month:', error);
    return NextResponse.json(
      { error: 'Failed to close month', message: error.message },
      { status: 500 }
    );
  }
}

