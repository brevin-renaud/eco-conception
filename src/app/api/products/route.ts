import { NextRequest, NextResponse } from "next/server";
import mencardData from "@/data/MenCloths";
import womencardData from "@/data/WomenCloths";
import { toImageUrl } from "@/lib/imageUrl";
import { cached } from "@/lib/cache";

// Route dynamique : on gère nous-mêmes le cache + les headers Cache-Control.
export const dynamic = "force-dynamic";

type ApiProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  mainPrice: string;
  isTrending: boolean;
  // URL servie EN DIRECT depuis le bucket/CDN (voir src/lib/imageUrl.ts).
  image: string;
};

/**
 * Construit le catalogue à partir des données hommes + femmes.
 * C'est l'étape « coûteuse » qu'on veut éviter de rejouer à chaque requête :
 * en prod ce serait un appel SQL + sérialisation. Le cache mémoire la court-circuite.
 */
function buildCatalog(): ApiProduct[] {
  const source = [
    ...mencardData.map((p, i) => ({ ...p, _id: `men-${i}` })),
    ...womencardData.map((p, i) => ({ ...p, _id: `women-${i}` })),
  ];
  return source.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.description,
    price: p.price,
    // mainPrice n'existe que côté hommes → repli sur price sinon.
    mainPrice: "mainPrice" in p ? p.mainPrice : p.price,
    isTrending: Boolean(p.isTrending),
    image: toImageUrl(p.imageSrc),
  }));
}

/**
 * Charge volontairement coûteuse pour le profiling (Pyroscope) et le test k6.
 * Active via ?expensive=1&count=10000 : génère `count` objets + un tri O(n log n)
 * répété, ce qui fait apparaître un pic CPU/heap net dans le flamegraph.
 * NON caché exprès quand activé, pour mesurer le coût réel.
 */
function expensiveWorkload(count: number): { generated: number; checksum: number } {
  const items: { i: number; k: number }[] = [];
  for (let i = 0; i < count; i++) {
    // calcul arbitraire non trivial pour occuper le CPU
    const k = Math.sqrt(i) * Math.sin(i) + (i % 97);
    items.push({ i, k });
  }
  items.sort((a, b) => a.k - b.k);
  let checksum = 0;
  for (const it of items) checksum = (checksum + it.k) % 1_000_000;
  return { generated: items.length, checksum };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const expensive = searchParams.get("expensive") === "1";

  // --- Chemin « coûteux » : profiling / test de charge, jamais caché ---
  if (expensive) {
    const count = Math.min(
      Math.max(Number(searchParams.get("count")) || 10000, 1),
      1_000_000,
    );
    const start = process.hrtime.bigint();
    const work = expensiveWorkload(count);
    const catalog = buildCatalog();
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

    return NextResponse.json(
      { products: catalog, workload: work, durationMs },
      {
        headers: {
          "X-Cache": "BYPASS",
          // Non mis en cache : on veut mesurer le coût brut à chaque appel.
          "Cache-Control": "no-store",
        },
      },
    );
  }

  // --- Chemin normal : catalogue mis en cache mémoire (HIT/MISS) ---
  const { value: products, status } = await cached(
    "catalog:products",
    60_000, // TTL 60 s
    buildCatalog,
  );

  return NextResponse.json(
    { products, count: products.length },
    {
      headers: {
        // Démonstration étape 9 : ressource PUBLIQUE et cacheable par le CDN.
        // public       → cacheable par navigateur ET CDN partagé
        // max-age=60   → cache navigateur 60 s
        // s-maxage=300 → cache CDN 5 min
        // stale-while-revalidate → sert le cache pendant la revalidation en fond
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        // En-tête custom pour visualiser HIT/MISS dans l'onglet Network.
        "X-Cache": status,
      },
    },
  );
}
