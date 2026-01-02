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

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        valuations: {
          orderBy: {
            date: 'desc',
          },
        },
        liability: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error: any) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset', message: error.message },
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
    const { name, type, fiscalStatus } = body;

    // Validar que el activo existe
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (fiscalStatus !== undefined) updateData.fiscalStatus = fiscalStatus;

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: updateData,
      include: {
        valuations: {
          orderBy: {
            date: 'desc',
          },
        },
        liability: true,
      },
    });

    return NextResponse.json(updatedAsset, { status: 200 });
  } catch (error: any) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { error: 'Failed to update asset', message: error.message },
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

    // Validar que el activo existe
    const existingAsset = await prisma.asset.findUnique({
      where: { id },
      include: {
        valuations: true,
        liability: true,
      },
    });

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Eliminar en cascada: primero pasivos, luego valuaciones, luego el activo
    // Prisma debería manejar esto automáticamente si hay onDelete: Cascade en el schema
    // Pero lo hacemos explícitamente para asegurar integridad
    
    if (existingAsset.liability) {
      await prisma.liability.delete({
        where: { id: existingAsset.liability.id },
      });
    }

    // Eliminar todas las valuaciones
    if (existingAsset.valuations.length > 0) {
      await prisma.assetValuation.deleteMany({
        where: { assetId: id },
      });
    }

    // Finalmente eliminar el activo
    await prisma.asset.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Asset deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset', message: error.message },
      { status: 500 }
    );
  }
}

