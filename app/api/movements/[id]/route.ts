import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseNumberAR } from '@/utils/number-format';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Función helper para normalizar números de forma segura (acepta formato argentino)
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

  // Usar parseNumberAR que acepta formato argentino (punto para miles, coma para decimales)
  const parsed = parseNumberAR(value);
  
  if (parsed === null) {
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
      
      // Si cambió la fecha, actualizar el monthId también
      const fechaDate = new Date(date);
      const year = fechaDate.getFullYear();
      const month = fechaDate.getMonth() + 1;
      
      // Buscar o crear el mes correspondiente
      let monthRecord = await prisma.month.findFirst({
        where: {
          year,
          month,
        },
      });
      
      if (!monthRecord) {
        // Crear el mes si no existe
        monthRecord = await prisma.month.create({
          data: {
            year,
            month,
            status: 'abierto',
            openDate: new Date(),
          },
        });
      }
      
      updateData.monthId = monthRecord.id;
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

