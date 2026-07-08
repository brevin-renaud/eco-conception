import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function burnCpu(ms: number) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) x = Math.sqrt(x + Math.random());
  return x;
}

export async function GET() {
  const rawAddress = process.env.PYROSCOPE_SERVER_ADDRESS ?? "";
  // Retire le trailing slash pour éviter double slash dans le path d'ingest
  const serverAddress = rawAddress.replace(/\/$/, "");
  const authUser = process.env.PYROSCOPE_BASIC_AUTH_USER ?? "";
  const authPassword = process.env.PYROSCOPE_BASIC_AUTH_PASSWORD ?? "";
  const runtime = process.env.NEXT_RUNTIME;

  const steps: string[] = [];

  // 1. Test HTTP direct vers le endpoint ingest (indépendant du SDK)
  const ingestUrl = `${serverAddress}/pyroscope/ingest?name=eco-conception-backend.cpu&from=${Math.floor(Date.now() / 1000) - 5}&until=${Math.floor(Date.now() / 1000)}`;
  const credentials = Buffer.from(`${authUser}:${authPassword}`).toString("base64");
  try {
    const res = await fetch(ingestUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/octet-stream",
      },
      body: new Uint8Array(0),
    });
    steps.push(`direct_ingest_http: ${res.status} ${res.statusText}`);
    if (!res.ok) {
      const body = await res.text();
      steps.push(`response_body: ${body.slice(0, 200)}`);
    }
  } catch (e) {
    steps.push(`direct_ingest_error: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 2. SDK Pyroscope
  try {
    const Pyroscope = (await import("@pyroscope/nodejs")).default;
    steps.push("sdk_import_ok");

    try {
      Pyroscope.init({
        serverAddress,
        appName: "eco-conception-backend",
        basicAuthUser: authUser,
        basicAuthPassword: authPassword,
        flushIntervalMs: 500,
        tags: { environment: process.env.NODE_ENV ?? "production" },
      });
      Pyroscope.start();
      steps.push("sdk_init+start_ok");
    } catch {
      steps.push("sdk_already_running");
    }

    burnCpu(2000);
    steps.push("workload_done");

    await Pyroscope.stop();
    // Laisse 2s supplémentaires pour que Vercel n'éteigne pas le process avant la réponse réseau
    await new Promise((r) => setTimeout(r, 2000));
    steps.push("sdk_stop_ok");
  } catch (e) {
    steps.push(`sdk_error: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({
    runtime,
    serverAddress,
    steps,
  });
}
