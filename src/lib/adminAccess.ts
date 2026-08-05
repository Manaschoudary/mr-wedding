import crypto from "crypto";
import { cookies, headers } from "next/headers";

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

function getOwnerAccessCode(): string {
  return String(process.env.OWNER_ACCESS_CODE || "").trim();
}

function getSigningSecret(): string {
  return String(process.env.SITE_ACCESS_SECRET || getOwnerAccessCode()).trim();
}

function signPayload(payload: string): string {
  const signingSecret = getSigningSecret();
  if (!signingSecret) {
    throw new Error("SITE_ACCESS_SECRET or OWNER_ACCESS_CODE is required");
  }

  return base64Url(
    crypto
      .createHmac("sha256", signingSecret)
      .update(payload)
      .digest()
  );
}

export function isValidOwnerCode(code: unknown): boolean {
  const configuredCode = getOwnerAccessCode();
  const submittedCode = String(code || "").trim();
  return Boolean(
    configuredCode &&
    submittedCode &&
    timingSafeStringEqual(submittedCode, configuredCode)
  );
}

export function createOwnerToken(): string {
  const payload = base64Url(JSON.stringify({
    scope: "owner",
    exp: Date.now() + TOKEN_TTL_SECONDS * 1000,
  }));

  return `${payload}.${signPayload(payload)}`;
}

export function isValidOwnerToken(token: unknown): boolean {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return false;
  if (!getSigningSecret()) return false;

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

export async function setOwnerAccessCookie() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const token = createOwnerToken();
  const isSecure = headerStore.get("x-forwarded-proto") === "https" || process.env.VERCEL === "1";

  cookieStore.set(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: TOKEN_TTL_SECONDS,
    secure: isSecure,
  });
}
