export async function register() {
  // Pyroscope ne tourne que côté Node.js (pas dans l'Edge runtime)
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { default: Pyroscope } = await import('@pyroscope/nodejs');

  Pyroscope.init({
    serverAddress: process.env.PYROSCOPE_SERVER_ADDRESS ?? '',
    appName:       'eco-conception-backend',
    basicAuthUser: process.env.PYROSCOPE_BASIC_AUTH_USER ?? '',
    basicAuthPassword: process.env.PYROSCOPE_BASIC_AUTH_PASSWORD ?? '',
    tags: { environment: process.env.NODE_ENV ?? 'production' },
  });

  Pyroscope.start();
}
