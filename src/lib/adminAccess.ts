import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_ACCESS_CODE = "manasrupa";
const COOKIE_NAME = "mr_owner_access";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64Url(input: string): string {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function signPayload(payload: string): string {
  return base64Url(
    crypto
      .createHmac("sha256", ADMIN_ACCESS_CODE)
      .update(payload)
      .digest()
  );
}

export function isValidOwnerCode(code: unknown): boolean {
  const submittedCode = String(code || "").trim();
  return Boolean(submittedCode && timingSafeStringEqual(submittedCode, ADMIN_ACCESS_CODE));
}

function createOwnerToken(): string {
  const payload = base64Url(JSON.stringify({
    scope: "owner",
    exp: Date.now() + TOKEN_TTL_SECONDS * 1000,
  }));

  return `${payload}.${signPayload(payload)}`;
}

function isValidOwnerToken(token: unknown): boolean {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return false;

  if (!timingSafeStringEqual(signature, signPayload(payload))) {
    return false;
  }

  try {
    const data = JSON.parse(fromBase64Url(payload)) as { scope?: string; exp?: number };
    return data.scope === "owner" && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}

export async function isOwnerRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidOwnerToken(cookieStore.get(COOKIE_NAME)?.value);
}

export function setOwnerAccessCookie(response: NextResponse, request: Request) {
  response.cookies.set(COOKIE_NAME, createOwnerToken(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: TOKEN_TTL_SECONDS,
    secure: request.headers.get("x-forwarded-proto") === "https" || process.env.VERCEL === "1",
  });
}
