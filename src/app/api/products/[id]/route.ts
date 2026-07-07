import { NextRequest, NextResponse } from 'next/server';
import mencardData from '@/data/MenCloths';
import womencardData from '@/data/WomenCloths';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const all = [
    ...mencardData.map((p, i) => ({ ...p, id: `men-${i}` })),
    ...womencardData.map((p, i) => ({ ...p, id: `women-${i}` })),
  ];

  const product = all.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }

  return NextResponse.json({ product }, { status: 200 });
}
