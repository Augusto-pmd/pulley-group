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
  { params }: { params: { id: string; valuationId: string } }
) {
  try {
    const { id, valuationId } = params;
    const body = await request.json();
    
    const { valueUSD, date } = body;

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

    // Verificar que la valuación existe y pertenece al activo
    const existingValuation = await prisma.assetValuation.findFirst({
      where: {
        id: valuationId,
        assetId: id,
      },
    });

    if (!existingValuation) {
      return NextResponse.json(
        { error: 'Asset valuation not found' },
        { status: 404 }
      );
    }

    // Normalizar valueUSD si se proporciona
    const normalizedValueUSD = valueUSD !== undefined ? normalizeNumber(valueUSD) : existingValuation.valueUSD;

    const updatedValuation = await prisma.assetValuation.update({
      where: { id: valuationId },
      data: {
        ...(valueUSD !== undefined && { valueUSD: normalizedValueUSD }),
        ...(date && { date: new Date(date) }),
      },
    });

    return NextResponse.json(updatedValuation, { status: 200 });
  } catch (error: any) {
    console.error('Error updating asset valuation:', error);
    return NextResponse.json(
      { error: 'Failed to update asset valuation', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; valuationId: string } }
) {
  try {
    const { id, valuationId } = params;

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

    // Verificar que la valuación existe y pertenece al activo
    const existingValuation = await prisma.assetValuation.findFirst({
      where: {
        id: valuationId,
        assetId: id,
      },
    });

    if (!existingValuation) {
      return NextResponse.json(
        { error: 'Asset valuation not found' },
        { status: 404 }
      );
    }

    // Eliminar la valuación
    await prisma.assetValuation.delete({
      where: { id: valuationId },
    });

    return NextResponse.json({ success: true, message: 'Asset valuation deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting asset valuation:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset valuation', message: error.message },
      { status: 500 }
    );
  }
}

