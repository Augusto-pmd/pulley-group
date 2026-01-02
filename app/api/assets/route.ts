import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const assets = await prisma.asset.findMany({
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
    const { name, type, fiscalStatus } = body;

    if (!name || !type || !fiscalStatus) {
      return NextResponse.json(
        { error: 'name, type, and fiscalStatus are required' },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        name,
        type,
        fiscalStatus,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset', message: error.message },
      { status: 500 }
    );
  }
}

