import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const events = await prisma.investmentEvent.findMany({
      where: { investmentId: id },
      orderBy: {
        date: 'desc',
      },
    });

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(events || []);
  } catch (error: any) {
    console.error('Error fetching investment events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investment events', message: error.message },
      { status: 500 }
    );
  }
}

// Función helper para normalizar números de forma segura
function normalizeNumber(value: any): number {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value !== 'string') {
    throw new Error(`Invalid number format: expected string or number, got ${typeof value}`);
  }

  // Rechazar valores con coma como separador decimal (ej: "123,45")
  if (value.includes(',') && !value.match(/^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/)) {
    throw new Error(`Invalid number format: comma used as decimal separator. Use dot instead (e.g., "123.45" instead of "123,45")`);
  }

  // Remover separadores de miles (comas) si existen
  const cleaned = value.replace(/,/g, '');
  
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) {
    throw new Error(`Invalid number format: "${value}" cannot be parsed as a number`);
  }
  
  return parsed;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`POST /api/investments/${id}/events - Payload recibido:`, JSON.stringify(body, null, 2));
    
    const { type, amountUSD, date, note } = body;

    if (!type || amountUSD === undefined || !date) {
      return NextResponse.json(
        { error: 'type, amountUSD, and date are required' },
        { status: 400 }
      );
    }

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

    // Normalizar amountUSD antes de enviar a Prisma
    const normalizedAmountUSD = normalizeNumber(amountUSD);
    console.log(`POST /api/investments/${id}/events - amountUSD normalizado:`, normalizedAmountUSD, typeof normalizedAmountUSD);

    const event = await prisma.investmentEvent.create({
      data: {
        investmentId: id,
        type,
        amountUSD: normalizedAmountUSD,
        date: new Date(date),
        note: note || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Error creating investment event:', error);
    return NextResponse.json(
      { error: 'Failed to create investment event', message: error.message },
      { status: 500 }
    );
  }
}

