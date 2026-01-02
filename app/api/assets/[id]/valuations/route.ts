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

    // Verificar que el activo existe
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    const valuations = await prisma.assetValuation.findMany({
      where: { assetId: id },
      orderBy: {
        date: 'desc',
      },
    });

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(valuations || []);
  } catch (error: any) {
    console.error('Error fetching valuations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuations', message: error.message },
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
    console.log(`POST /api/assets/${id}/valuations - Payload recibido:`, JSON.stringify(body, null, 2));
    
    const { valueUSD, date } = body;

    if (!valueUSD || !date) {
      return NextResponse.json(
        { error: 'valueUSD and date are required' },
        { status: 400 }
      );
    }

    // Verificar que el activo existe
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Normalizar valueUSD antes de enviar a Prisma
    const normalizedValueUSD = normalizeNumber(valueUSD);
    console.log(`POST /api/assets/${id}/valuations - valueUSD normalizado:`, normalizedValueUSD, typeof normalizedValueUSD);

    const valuation = await prisma.assetValuation.create({
      data: {
        assetId: id,
        valueUSD: normalizedValueUSD,
        date: new Date(date),
      },
    });

    return NextResponse.json(valuation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating valuation:', error);
    return NextResponse.json(
      { error: 'Failed to create valuation', message: error.message },
      { status: 500 }
    );
  }
}

