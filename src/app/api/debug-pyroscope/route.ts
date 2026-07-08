import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const serverAddress = process.env.PYROSCOPE_SERVER_ADDRESS;
  const authUser = process.env.PYROSCOPE_BASIC_AUTH_USER;
  const authPassword = process.env.PYROSCOPE_BASIC_AUTH_PASSWORD;
  const runtime = process.env.NEXT_RUNTIME;

  let pyroscopeStatus = "not_attempted";
  let pyroscopeError: string | null = null;

  if (serverAddress && authPassword) {
    try {
      const Pyroscope = (await import("@pyroscope/nodejs")).default;
      pyroscopeStatus = "import_ok";
      await Pyroscope.stop();
      Pyroscope.start();
      pyroscopeStatus = "flush_ok";
    } catch (e) {
      pyroscopeStatus = "error";
      pyroscopeError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    runtime,
    env: {
      PYROSCOPE_SERVER_ADDRESS: serverAddress ? `${serverAddress.slice(0, 30)}...` : "MISSING",
      PYROSCOPE_BASIC_AUTH_USER: authUser ?? "MISSING",
      PYROSCOPE_BASIC_AUTH_PASSWORD: authPassword ? "SET (hidden)" : "MISSING",
    },
    pyroscope: { status: pyroscopeStatus, error: pyroscopeError },
  });
}
