import { NextResponse } from "next/server";

// Route privée : dépend de l'utilisateur → jamais mise en cache partagé.
export const dynamic = "force-dynamic";

/**
 * Étape 9 — route PRIVÉE.
 *
 * Contrairement à /api/products (public, cacheable par le CDN), une ressource
 * liée à l'utilisateur ne doit JAMAIS être stockée par un cache partagé, sinon
 * un visiteur pourrait recevoir les données d'un autre.
 *
 *   Cache-Control: private, no-store
 *     private  → seul le navigateur du client peut la garder, pas le CDN
 *     no-store → on interdit même ce stockage → l'onglet Network affiche
 *                MISS / PASS à chaque requête (jamais de HIT).
 *
 * En vrai on lirait la session ici ; on renvoie un profil factice pour la démo.
 */
export async function GET() {
  const user = {
    id: "usr_demo_001",
    name: "Demo User",
    email: "demo@example.com",
    // fausse donnée sensible pour illustrer pourquoi on ne cache pas
    lastOrderId: "ord_20260707_42",
  };

  return NextResponse.json(user, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Cache": "PASS",
    },
  });
}
