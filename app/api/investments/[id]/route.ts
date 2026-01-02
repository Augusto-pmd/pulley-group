import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(investment);
  } catch (error: any) {
    console.error('Error fetching investment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investment', message: error.message },
      { status: 500 }
    );
  }
}

