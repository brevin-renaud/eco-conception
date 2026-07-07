/**
 * Éco-conception — cache mémoire in-process (Node).
 *
 * Objectif : servir une réponse déjà calculée sans refaire le travail coûteux
 * (moins de CPU = moins d'énergie consommée). Zéro dépendance externe.
 *
 * NB : le cache vit dans le process du serveur ; il est partagé entre requêtes
 * mais réinitialisé à chaque redémarrage / cold start. Suffisant pour démontrer
 * le gain HIT vs MISS (profiling Pyroscope, test de charge k6).
 */

type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

export type CacheResult<T> = { value: T; status: "HIT" | "MISS" };

/**
 * Retourne la valeur en cache si présente et non expirée (HIT), sinon exécute
 * `producer`, met le résultat en cache pour `ttlMs` et le retourne (MISS).
 */
export async function cached<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T> | T,
): Promise<CacheResult<T>> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && hit.expiresAt > now) {
    return { value: hit.value as T, status: "HIT" };
  }
  const value = await producer();
  store.set(key, { value, expiresAt: now + ttlMs });
  return { value, status: "MISS" };
}

/** Vide le cache (utile pour rejouer un test de charge « à froid »). */
export function clearCache(): void {
  store.clear();
}
