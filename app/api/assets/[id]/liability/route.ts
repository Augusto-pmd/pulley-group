import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar que el activo existe
    const asset = await getPrisma().asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    const liability = await getPrisma().liability.findUnique({
      where: { assetId: id },
    });

    if (!liability) {
      return NextResponse.json(
        { error: 'Liability not found for this asset' },
        { status: 404 }
      );
    }

    return NextResponse.json(liability);
  } catch (error: any) {
    console.error('Error fetching liability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch liability', message: error.message },
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

// Función helper para normalizar enteros
function normalizeInteger(value: any): number {
  const normalized = normalizeNumber(value);
  if (!Number.isInteger(normalized)) {
    throw new Error(`Invalid integer format: "${value}" must be a whole number`);
  }
  return normalized;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`POST /api/assets/${id}/liability - Payload recibido:`, JSON.stringify(body, null, 2));
    
    const {
      totalAmountUSD,
      remainingAmountUSD,
      installmentsTotal,
      installmentsRemaining,
      monthlyInstallmentUSD,
    } = body;

    if (
      !totalAmountUSD ||
      remainingAmountUSD === undefined ||
      !installmentsTotal ||
      installmentsRemaining === undefined ||
      !monthlyInstallmentUSD
    ) {
      return NextResponse.json(
        {
          error:
            'totalAmountUSD, remainingAmountUSD, installmentsTotal, installmentsRemaining, and monthlyInstallmentUSD are required',
        },
        { status: 400 }
      );
    }

    // Verificar que el activo existe
    const asset = await getPrisma().asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Verificar que no existe ya un pasivo para este activo
    const existingLiability = await getPrisma().liability.findUnique({
      where: { assetId: id },
    });

    if (existingLiability) {
      return NextResponse.json(
        { error: 'Liability already exists for this asset. Use PUT to update.' },
        { status: 400 }
      );
    }

    // Normalizar todos los valores numéricos antes de enviar a Prisma
    const normalizedTotalAmountUSD = normalizeNumber(totalAmountUSD);
    const normalizedRemainingAmountUSD = normalizeNumber(remainingAmountUSD);
    const normalizedInstallmentsTotal = normalizeInteger(installmentsTotal);
    const normalizedInstallmentsRemaining = normalizeInteger(installmentsRemaining);
    const normalizedMonthlyInstallmentUSD = normalizeNumber(monthlyInstallmentUSD);
    
    console.log(`POST /api/assets/${id}/liability - Valores normalizados:`, {
      totalAmountUSD: normalizedTotalAmountUSD,
      remainingAmountUSD: normalizedRemainingAmountUSD,
      installmentsTotal: normalizedInstallmentsTotal,
      installmentsRemaining: normalizedInstallmentsRemaining,
      monthlyInstallmentUSD: normalizedMonthlyInstallmentUSD,
    });

    const liability = await getPrisma().liability.create({
      data: {
        assetId: id,
        totalAmountUSD: normalizedTotalAmountUSD,
        remainingAmountUSD: normalizedRemainingAmountUSD,
        installmentsTotal: normalizedInstallmentsTotal,
        installmentsRemaining: normalizedInstallmentsRemaining,
        monthlyInstallmentUSD: normalizedMonthlyInstallmentUSD,
      },
    });

    return NextResponse.json(liability, { status: 201 });
  } catch (error: any) {
    console.error('Error creating liability:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Liability already exists for this asset' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create liability', message: error.message },
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
    console.log(`PUT /api/assets/${id}/liability - Payload recibido:`, JSON.stringify(body, null, 2));
    
    const {
      totalAmountUSD,
      remainingAmountUSD,
      installmentsTotal,
      installmentsRemaining,
      monthlyInstallmentUSD,
    } = body;

    // Verificar que el activo existe
    const asset = await getPrisma().asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (totalAmountUSD !== undefined) {
      updateData.totalAmountUSD = normalizeNumber(totalAmountUSD);
    }
    if (remainingAmountUSD !== undefined) {
      updateData.remainingAmountUSD = normalizeNumber(remainingAmountUSD);
    }
    if (installmentsTotal !== undefined) {
      updateData.installmentsTotal = normalizeInteger(installmentsTotal);
    }
    if (installmentsRemaining !== undefined) {
      updateData.installmentsRemaining = normalizeInteger(installmentsRemaining);
    }
    if (monthlyInstallmentUSD !== undefined) {
      updateData.monthlyInstallmentUSD = normalizeNumber(monthlyInstallmentUSD);
    }

    console.log(`PUT /api/assets/${id}/liability - Valores normalizados para update:`, updateData);

    const liability = await getPrisma().liability.update({
      where: { assetId: id },
      data: updateData,
    });

    return NextResponse.json(liability);
  } catch (error: any) {
    console.error('Error updating liability:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Liability not found for this asset' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update liability', message: error.message },
      { status: 500 }
    );
  }
}

