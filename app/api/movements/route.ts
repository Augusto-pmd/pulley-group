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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/movements - Payload recibido:', JSON.stringify(body, null, 2));
    
    const {
      type,
      amountUSD,
      currencyOriginal,
      exchangeRate,
      date,
      status,
      conceptId,
      monthId,
    } = body;

    // Validar campos requeridos
    if (!type || amountUSD === undefined || !currencyOriginal || !date || !conceptId || !monthId) {
      return NextResponse.json(
        { error: 'type, amountUSD, currencyOriginal, date, conceptId, and monthId are required' },
        { status: 400 }
      );
    }

    // Validar tipo
    if (type !== 'ingreso' && type !== 'egreso') {
      return NextResponse.json(
        { error: 'type must be either "ingreso" or "egreso"' },
        { status: 400 }
      );
    }

    // Normalizar amountUSD - debe ser siempre positivo (el tipo determina el signo)
    const normalizedAmountUSD = normalizeNumber(amountUSD);
    
    // Validar que amountUSD sea positivo
    if (normalizedAmountUSD < 0) {
      return NextResponse.json(
        { error: 'amountUSD must be positive. Use type "ingreso" or "egreso" to indicate direction.' },
        { status: 400 }
      );
    }

    // Normalizar exchangeRate si está presente
    const normalizedExchangeRate = exchangeRate !== undefined && exchangeRate !== null 
      ? normalizeNumber(exchangeRate) 
      : null;

    // Validar que conceptId existe
    const concept = await prisma.concept.findUnique({
      where: { id: conceptId },
    });

    if (!concept) {
      return NextResponse.json(
        { error: `Concept with id "${conceptId}" does not exist. Please create the concept first.` },
        { status: 400 }
      );
    }

    // Validar que monthId existe
    const month = await prisma.month.findUnique({
      where: { id: monthId },
    });

    if (!month) {
      return NextResponse.json(
        { error: `Month with id "${monthId}" does not exist. Please create the month first.` },
        { status: 400 }
      );
    }

    console.log('POST /api/movements - Valores normalizados:', {
      type,
      amountUSD: normalizedAmountUSD,
      currencyOriginal,
      exchangeRate: normalizedExchangeRate,
      date,
      status,
      conceptId,
      monthId,
    });

    const movement = await prisma.movement.create({
      data: {
        type,
        amountUSD: normalizedAmountUSD,
        currencyOriginal,
        exchangeRate: normalizedExchangeRate,
        date: new Date(date),
        status: status || null,
        conceptId,
        monthId,
      },
    });

    console.log('POST /api/movements - Movimiento creado exitosamente:', movement.id);
    return NextResponse.json(movement, { status: 201 });
  } catch (error: any) {
    console.error('Error creating movement:', error);
    
    // Detectar errores de foreign key constraint
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Invalid conceptId or monthId. Please ensure both exist before creating a movement.' },
        { status: 400 }
      );
    }
    
    // Para otros errores inesperados, retornar 500
    return NextResponse.json(
      { error: 'Failed to create movement', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    console.log(`GET /api/movements - Parámetros: year=${year}, month=${month}`);

    const where: any = {};
    
    if (year && month) {
      // Normalizar year y month a enteros
      const normalizedYear = parseInt(year, 10);
      const normalizedMonth = parseInt(month, 10);

      if (isNaN(normalizedYear) || isNaN(normalizedMonth)) {
        return NextResponse.json(
          { error: 'year and month must be valid numbers' },
          { status: 400 }
        );
      }

      const monthRecord = await prisma.month.findFirst({
        where: {
          year: normalizedYear,
          month: normalizedMonth,
        },
      });

      if (monthRecord) {
        where.monthId = monthRecord.id;
        console.log(`GET /api/movements - Mes encontrado: ${monthRecord.id} (${normalizedYear}-${normalizedMonth})`);
      } else {
        console.log(`GET /api/movements - Mes no encontrado: ${normalizedYear}-${normalizedMonth}, retornando array vacío`);
        return NextResponse.json([]);
      }
    }

    const movements = await prisma.movement.findMany({
      where,
      include: {
        concept: true,
        month: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Validar que todos los movimientos tengan amountUSD válido (no NaN, no null)
    const validMovements = movements.filter(m => {
      const isValid = m.amountUSD !== null && !isNaN(m.amountUSD) && typeof m.amountUSD === 'number';
      if (!isValid) {
        console.warn(`GET /api/movements - Movimiento con amountUSD inválido detectado:`, {
          id: m.id,
          amountUSD: m.amountUSD,
          type: typeof m.amountUSD,
        });
      }
      return isValid;
    });

    console.log(`GET /api/movements - Retornando ${validMovements.length} movimientos válidos de ${movements.length} totales`);

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(validMovements || []);
  } catch (error: any) {
    console.error('Error fetching movements:', error);
    // Asegurar que siempre se devuelve JSON válido
    return NextResponse.json(
      { error: 'Failed to fetch movements', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

