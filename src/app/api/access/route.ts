import { NextResponse } from "next/server";
import { isOwnerRequest, isValidOwnerCode, setOwnerAccessCookie } from "@/lib/adminAccess";

export async function GET() {
  return NextResponse.json({ authenticated: await isOwnerRequest() });
}

export async function POST(request: Request) {
  let body: { code?: unknown };
  try {
    body = await request.json() as { code?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidOwnerCode(body.code)) {
    return NextResponse.json({ error: "Invalid owner code" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setOwnerAccessCookie(response, request);
  return response;
}
