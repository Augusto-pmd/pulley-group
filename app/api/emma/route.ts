import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Obtener configuración de Emma (supuestos)
export async function GET(request: NextRequest) {
  try {
    // Buscar configuración de Emma (debe haber solo una)
    const emma = await prisma.emma.findFirst();
    
    if (!emma) {
      // Si no existe, retornar null (Emma no iniciado)
      return NextResponse.json(null, { status: 200 });
    }
    
    return NextResponse.json(emma, { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/emma] Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to get Emma configuration', message: error.message },
      { status: 500 }
    );
  }
}

// POST: Crear o actualizar configuración de Emma (solo supuestos)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      startDate,
      capitalInicial,
      aportePeriodico,
      expectedRate,
      horizon,
      contributionFrequency,
    } = body;

    // Validar campos requeridos
    if (!startDate || expectedRate === undefined || horizon === undefined || !contributionFrequency) {
      return NextResponse.json(
        { error: 'startDate, expectedRate, horizon, and contributionFrequency are required' },
        { status: 400 }
      );
    }

    // Validar capitalInicial (debe ser >= 0)
    if (capitalInicial === undefined || capitalInicial < 0) {
      return NextResponse.json(
        { error: 'capitalInicial must be a number >= 0' },
        { status: 400 }
      );
    }

    // Validar aportePeriodico (opcional, pero si existe debe ser >= 0)
    if (aportePeriodico !== undefined && aportePeriodico < 0) {
      return NextResponse.json(
        { error: 'aportePeriodico must be a number >= 0 if provided' },
        { status: 400 }
      );
    }

    // Validar frecuencia
    if (contributionFrequency !== 'mensual' && contributionFrequency !== 'anual') {
      return NextResponse.json(
        { error: 'contributionFrequency must be "mensual" or "anual"' },
        { status: 400 }
      );
    }

    // Validar tasa (debe ser un número positivo)
    if (typeof expectedRate !== 'number' || expectedRate < 0 || expectedRate > 100) {
      return NextResponse.json(
        { error: 'expectedRate must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Validar horizonte (debe ser un entero positivo)
    if (typeof horizon !== 'number' || horizon < 1 || !Number.isInteger(horizon)) {
      return NextResponse.json(
        { error: 'horizon must be a positive integer' },
        { status: 400 }
      );
    }

    // Buscar si ya existe configuración de Emma
    const existing = await prisma.emma.findFirst();
    
    let emma;
    if (existing) {
      // Actualizar configuración existente
      emma = await prisma.emma.update({
        where: { id: existing.id },
        data: {
          startDate: new Date(startDate),
          capitalInicial: capitalInicial ?? 0,
          aportePeriodico: aportePeriodico ?? null,
          expectedRate,
          horizon,
          contributionFrequency,
        },
      });
    } else {
      // Crear nueva configuración
      emma = await prisma.emma.create({
        data: {
          startDate: new Date(startDate),
          capitalInicial: capitalInicial ?? 0,
          aportePeriodico: aportePeriodico ?? null,
          expectedRate,
          horizon,
          contributionFrequency,
        },
      });
    }

    return NextResponse.json(emma, { status: existing ? 200 : 201 });
  } catch (error: any) {
    console.error('[POST /api/emma] Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to save Emma configuration', message: error.message },
      { status: 500 }
    );
  }
}

