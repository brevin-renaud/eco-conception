/**
 * Instrumentation Pyroscope — profiling continu CPU (wall) + Heap.
 *
 * ⚠️ Limite serverless (Vercel) : entre deux requêtes, la fonction est « gelée »,
 * donc le flush périodique (flushIntervalMs) ne part pas de façon fiable et le
 * flamegraph peut rester vide. Chemin FIABLE pour la démo Avant/Après :
 *
 *   1. Lancer le serveur en process long-vivant :  pnpm build && pnpm start
 *   2. Renseigner les variables PYROSCOPE_* (voir .env.example)
 *   3. Envoyer la charge avec k6  → les samples remontent alors dans Grafana.
 *
 * Sur un hébergement non-serverless (Render/Fly/VM), le mode continu suffit.
 */
export async function register() {
  // Pyroscope ne tourne que côté Node.js (pas dans l'Edge runtime).
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const serverAddress = (process.env.PYROSCOPE_SERVER_ADDRESS ?? '').replace(/\/$/, '');
  const authToken = process.env.PYROSCOPE_BASIC_AUTH_PASSWORD;
  if (!serverAddress || !authToken) {
    console.info('[pyroscope] désactivé (PYROSCOPE_SERVER_ADDRESS / password absents)');
    return;
  }

  try {
    // Dépendance optionnelle à bindings natifs : installée en prod (Linux/Vercel),
    // parfois absente en local (échec de compilation native). L'import est protégé
    // par le try/catch → on ignore la résolution de type pour ne pas bloquer le build.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- module optionnel résolu au runtime uniquement
    const { default: Pyroscope } = await import('@pyroscope/nodejs');

    Pyroscope.init({
      serverAddress,
      appName: 'eco-conception-backend',
      basicAuthUser: process.env.PYROSCOPE_BASIC_AUTH_USER ?? '',
      basicAuthPassword: authToken,
      flushIntervalMs: 1000,
      tags: { environment: process.env.NODE_ENV ?? 'production' },
    });

    // start() démarre à la fois le profiling wall (CPU) et Heap → couvre le bonus mémoire.
    Pyroscope.start();
    console.info('[pyroscope] profiling démarré →', serverAddress);
  } catch (err) {
    // Un échec de profiling ne doit JAMAIS casser le service.
    console.error('[pyroscope] init échouée (profiling ignoré) :', err);
  }
}
