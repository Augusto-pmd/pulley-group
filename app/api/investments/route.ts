import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const investments = await prisma.investment.findMany({
      include: {
        events: {
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(investments || []);
  } catch (error: any) {
    console.error('Error fetching investments:', error);
    // Asegurar que siempre se devuelve JSON válido
    return NextResponse.json(
      { error: 'Failed to fetch investments', message: error.message || 'Unknown error' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/investments - Payload recibido:', JSON.stringify(body, null, 2));
    
    const { name, type, startDate, targetAmountUSD } = body;

    if (!name || !type || !startDate || targetAmountUSD === undefined) {
      return NextResponse.json(
        { error: 'name, type, startDate, and targetAmountUSD are required' },
        { status: 400 }
      );
    }

    // Normalizar targetAmountUSD antes de enviar a Prisma
    const normalizedTargetAmountUSD = normalizeNumber(targetAmountUSD);
    console.log('POST /api/investments - targetAmountUSD normalizado:', normalizedTargetAmountUSD, typeof normalizedTargetAmountUSD);

    const investment = await prisma.investment.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        targetAmountUSD: normalizedTargetAmountUSD,
      },
    });

    return NextResponse.json(investment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'Failed to create investment', message: error.message },
      { status: 500 }
    );
  }
}

