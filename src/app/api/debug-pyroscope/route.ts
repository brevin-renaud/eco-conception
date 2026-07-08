import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Charge CPU réelle pour générer des samples Pyroscope
function burnCpu(ms: number) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) x = Math.sqrt(x + Math.random());
  return x;
}

export async function GET() {
  const serverAddress = process.env.PYROSCOPE_SERVER_ADDRESS;
  const authUser = process.env.PYROSCOPE_BASIC_AUTH_USER;
  const authPassword = process.env.PYROSCOPE_BASIC_AUTH_PASSWORD;
  const runtime = process.env.NEXT_RUNTIME;

  const steps: string[] = [];
  let pyroscopeError: string | null = null;

  if (!serverAddress || !authPassword) {
    return NextResponse.json({
      runtime,
      env: {
        PYROSCOPE_SERVER_ADDRESS: serverAddress ? "SET" : "MISSING",
        PYROSCOPE_BASIC_AUTH_USER: authUser ?? "MISSING",
        PYROSCOPE_BASIC_AUTH_PASSWORD: authPassword ? "SET" : "MISSING",
      },
      steps,
      error: "Missing env vars",
    });
  }

  try {
    const Pyroscope = (await import("@pyroscope/nodejs")).default;
    steps.push("import_ok");

    // Init explicite avec toutes les credentials
    Pyroscope.init({
      serverAddress,
      appName: "eco-conception-backend",
      basicAuthUser: authUser ?? "",
      basicAuthPassword: authPassword,
      flushIntervalMs: 1000,
      tags: { environment: process.env.NODE_ENV ?? "production" },
    });
    steps.push("init_ok");

    Pyroscope.start();
    steps.push("start_ok");

    // 2s de CPU pour générer des samples
    burnCpu(2000);
    steps.push("workload_done");

    await Pyroscope.stop();
    steps.push("stop_ok — données envoyées à Grafana");
  } catch (e) {
    pyroscopeError = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
    steps.push(`error: ${pyroscopeError}`);
  }

  return NextResponse.json({
    runtime,
    env: {
      PYROSCOPE_SERVER_ADDRESS: serverAddress.slice(0, 40),
      PYROSCOPE_BASIC_AUTH_USER: authUser ?? "MISSING",
      PYROSCOPE_BASIC_AUTH_PASSWORD: "SET (hidden)",
    },
    steps,
    error: pyroscopeError,
  });
}
