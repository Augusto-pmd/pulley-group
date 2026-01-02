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

    const asset = await getPrisma().asset.findUnique({
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

