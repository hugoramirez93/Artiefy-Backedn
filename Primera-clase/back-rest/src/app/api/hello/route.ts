import { NextResponse } from "next/server";

export async function GET() {
  const nameApi = process.env.NOMBRE_API || "API";
  return NextResponse.json({ message: `Hello ${nameApi}!` });
}
