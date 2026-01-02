import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const assets = await getPrisma().asset.findMany({
      include: {
        valuations: {
          orderBy: {
            date: 'desc',
          },
        },
        liability: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Asegurar que siempre se devuelve un array (incluso si está vacío)
    return NextResponse.json(assets || []);
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    // Asegurar que siempre se devuelve JSON válido
    return NextResponse.json(
      { error: 'Failed to fetch assets', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[POST /api/assets] Body recibido:', JSON.stringify(body, null, 2));
    
    const { name, type, fiscalStatus } = body;
    console.log('[POST /api/assets] Campos extraídos:', { name, type, fiscalStatus });

    // Validación de campos requeridos (name y type son obligatorios)
    if (!name || !type) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!type) missingFields.push('type');
      
      console.log('[POST /api/assets] Error 400 - Campos faltantes:', missingFields);
      return NextResponse.json(
        { error: 'name and type are required', missingFields },
        { status: 400 }
      );
    }

    // Validación de valores enum
    const validTypes = ['inmueble', 'vehiculo', 'otro'];
    const validFiscalStatuses = ['declarado', 'no_declarado'];
    
    if (!validTypes.includes(type)) {
      console.log('[POST /api/assets] Error 400 - Tipo inválido:', type);
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}`, received: `${type}` },
        { status: 400 }
      );
    }
    
    // fiscalStatus es opcional, usar default si no viene
    const finalFiscalStatus = fiscalStatus || 'no_declarado';
    
    if (!validFiscalStatuses.includes(finalFiscalStatus)) {
      console.log('[POST /api/assets] Error 400 - FiscalStatus inválido:', finalFiscalStatus);
      return NextResponse.json(
        { error: `Invalid fiscalStatus. Must be one of: ${validFiscalStatuses.join(', ')}`, received: `${finalFiscalStatus}` },
        { status: 400 }
      );
    }

    console.log('[POST /api/assets] Intentando crear activo en Prisma...');
    const asset = await getPrisma().asset.create({
      data: {
        name,
        type,
        fiscalStatus: finalFiscalStatus,
      },
    });

    console.log('[POST /api/assets] Activo creado exitosamente:', asset.id);
    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/assets] Error completo:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
      name: error.name,
    });
    console.error('[POST /api/assets] Error en línea aproximada:', error.stack?.split('\n')[1]);
    
    return NextResponse.json(
      { 
        error: 'Failed to create asset', 
        message: error.message,
        code: error.code,
        meta: error.meta,
      },
      { status: 500 }
    );
  }
}

