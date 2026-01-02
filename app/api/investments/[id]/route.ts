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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, type, targetAmountUSD, startDate } = body;

    // Validar que la inversión existe
    const existingInvestment = await prisma.investment.findUnique({
      where: { id },
    });

    if (!existingInvestment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Validar tipo si se proporciona
    if (type !== undefined && !['financiera', 'inmobiliaria'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "financiera" or "inmobiliaria"' },
        { status: 400 }
      );
    }

    // Actualizar solo los campos proporcionados
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (targetAmountUSD !== undefined) updateData.targetAmountUSD = targetAmountUSD;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);

    const updatedInvestment = await prisma.investment.update({
      where: { id },
      data: updateData,
      include: {
        events: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return NextResponse.json(updatedInvestment, { status: 200 });
  } catch (error: any) {
    console.error('Error updating investment:', error);
    return NextResponse.json(
      { error: 'Failed to update investment', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validar que la inversión existe
    const existingInvestment = await prisma.investment.findUnique({
      where: { id },
      include: {
        events: true,
      },
    });

    if (!existingInvestment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Eliminar todos los eventos asociados primero
    if (existingInvestment.events.length > 0) {
      await prisma.investmentEvent.deleteMany({
        where: { investmentId: id },
      });
    }

    // Finalmente eliminar la inversión
    await prisma.investment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Investment deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting investment:', error);
    return NextResponse.json(
      { error: 'Failed to delete investment', message: error.message },
      { status: 500 }
    );
  }
}

