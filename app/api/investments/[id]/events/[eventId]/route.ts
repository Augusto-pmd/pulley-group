import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Función helper para normalizar números de forma segura
function normalizeNumber(value: any): number {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value !== 'string') {
    throw new Error(`Invalid number format: expected string or number, got ${typeof value}`);
  }

  if (value.includes(',') && !value.match(/^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/)) {
    throw new Error(`Invalid number format: comma used as decimal separator. Use dot instead (e.g., "123.45" instead of "123,45")`);
  }

  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    throw new Error(`Invalid number format: "${value}" cannot be parsed as a number`);
  }
  
  return parsed;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const { id, eventId } = params;
    const body = await request.json();
    
    const { type, amountUSD, date, note } = body;

    // Verificar que la inversión existe
    const investment = await prisma.investment.findUnique({
      where: { id },
    });

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Verificar que el evento existe y pertenece a la inversión
    const existingEvent = await prisma.investmentEvent.findFirst({
      where: {
        id: eventId,
        investmentId: id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Investment event not found' },
        { status: 404 }
      );
    }

    // Normalizar amountUSD si se proporciona
    const normalizedAmountUSD = amountUSD !== undefined ? normalizeNumber(amountUSD) : existingEvent.amountUSD;

    const updatedEvent = await prisma.investmentEvent.update({
      where: { id: eventId },
      data: {
        ...(type && { type }),
        ...(amountUSD !== undefined && { amountUSD: normalizedAmountUSD }),
        ...(date && { date: new Date(date) }),
        ...(note !== undefined && { note: note || null }),
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: any) {
    console.error('Error updating investment event:', error);
    return NextResponse.json(
      { error: 'Failed to update investment event', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const { id, eventId } = params;

    // Verificar que la inversión existe
    const investment = await prisma.investment.findUnique({
      where: { id },
    });

    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Verificar que el evento existe y pertenece a la inversión
    const existingEvent = await prisma.investmentEvent.findFirst({
      where: {
        id: eventId,
        investmentId: id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Investment event not found' },
        { status: 404 }
      );
    }

    // Eliminar el evento
    await prisma.investmentEvent.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true, message: 'Investment event deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting investment event:', error);
    return NextResponse.json(
      { error: 'Failed to delete investment event', message: error.message },
      { status: 500 }
    );
  }
}

