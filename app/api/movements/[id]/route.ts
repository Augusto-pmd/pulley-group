import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Función helper para normalizar números de forma segura
function normalizeNumber(value: any): number {
  if (typeof value === 'number') {
    if (isNaN(value)) {
      throw new Error(`Invalid number: NaN`);
    }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`PUT /api/movements/${id} - Payload recibido:`, JSON.stringify(body, null, 2));
    
    const {
      amountUSD,
      exchangeRate,
      status,
      date,
      conceptId,
    } = body;

    const updateData: any = {};
    
    if (amountUSD !== undefined) {
      const normalizedAmountUSD = normalizeNumber(amountUSD);
      
      // Validar que amountUSD sea positivo
      if (normalizedAmountUSD < 0) {
        return NextResponse.json(
          { error: 'amountUSD must be positive. Use type "ingreso" or "egreso" to indicate direction.' },
          { status: 400 }
        );
      }
      
      updateData.amountUSD = normalizedAmountUSD;
      console.log(`PUT /api/movements/${id} - amountUSD normalizado:`, normalizedAmountUSD);
    }
    
    if (exchangeRate !== undefined) {
      updateData.exchangeRate = exchangeRate !== null && exchangeRate !== undefined
        ? normalizeNumber(exchangeRate)
        : null;
    }
    
    if (status !== undefined) {
      updateData.status = status || null;
    }
    
    if (date !== undefined) {
      updateData.date = new Date(date);
    }
    
    if (conceptId !== undefined) {
      updateData.conceptId = conceptId;
    }

    console.log(`PUT /api/movements/${id} - Datos a actualizar:`, updateData);

    const movement = await prisma.movement.update({
      where: { id },
      data: updateData,
      include: {
        concept: true,
        month: true,
      },
    });

    console.log(`PUT /api/movements/${id} - Movimiento actualizado exitosamente`);
    return NextResponse.json(movement);
  } catch (error: any) {
    console.error('Error updating movement:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Movement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update movement', message: error.message },
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

    await prisma.movement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting movement:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Movement not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete movement', message: error.message },
      { status: 500 }
    );
  }
}

