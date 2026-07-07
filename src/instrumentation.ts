export async function register() {
  // Pyroscope ne tourne que côté Node.js (pas dans l'Edge runtime)
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const serverAddress = process.env.PYROSCOPE_SERVER_ADDRESS;
  const authToken     = process.env.PYROSCOPE_BASIC_AUTH_PASSWORD;
  if (!serverAddress || !authToken) return;

  const { default: Pyroscope } = await import('@pyroscope/nodejs');

  Pyroscope.init({
    serverAddress,
    appName:           'eco-conception-backend',
    basicAuthUser:     process.env.PYROSCOPE_BASIC_AUTH_USER ?? '',
    basicAuthPassword: authToken,
    flushIntervalMs:   1000,
    tags: { environment: process.env.NODE_ENV ?? 'production' },
  });

  Pyroscope.start();
}
