import { NextRequest, NextResponse } from 'next/server';
import mencardData from '@/data/MenCloths';
import womencardData from '@/data/WomenCloths';
import { toImageUrl } from '@/lib/imageUrl';
import { cached } from '@/lib/cache';

// Route dynamique : on gère nous-mêmes le cache + les headers Cache-Control.
export const dynamic = 'force-dynamic';

type ApiProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  mainPrice: string;
  isTrending: boolean;
  image: string;
};

/**
 * Construit l'index produits (id → produit) une seule fois puis le met en cache
 * mémoire. Éco-conception : on évite de reconstruire tout le catalogue et de
 * refaire un find() linéaire à chaque requête (moins de CPU = moins d'énergie).
 */
function buildIndex(): Map<string, ApiProduct> {
  const source = [
    ...mencardData.map((p, i) => ({ ...p, _id: `men-${i}` })),
    ...womencardData.map((p, i) => ({ ...p, _id: `women-${i}` })),
  ];
  const index = new Map<string, ApiProduct>();
  for (const p of source) {
    index.set(p._id, {
      id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      mainPrice: 'mainPrice' in p ? p.mainPrice : p.price,
      isTrending: Boolean(p.isTrending),
      image: toImageUrl(p.imageSrc),
    });
  }
  return index;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Index produits mis en cache mémoire (HIT/MISS) — même stratégie que /api/products.
  const { value: index, status } = await cached(
    'catalog:index',
    60_000, // TTL 60 s
    buildIndex,
  );

  const product = index.get(id);

  if (!product) {
    return NextResponse.json(
      { error: 'Produit introuvable' },
      {
        status: 404,
        // Un 404 reste cacheable côté CDN mais brièvement.
        headers: { 'Cache-Control': 'public, max-age=30', 'X-Cache': status },
      },
    );
  }

  return NextResponse.json(
    { product },
    {
      status: 200,
      headers: {
        // Ressource PUBLIQUE (fiche produit) → cacheable navigateur + CDN.
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': status,
      },
    },
  );
}
