import crypto from "crypto";

const SECRET_ENV = "EDUCATION_TOKEN_SECRET";

function getSecret(): string {
  const s = process.env[SECRET_ENV];
  if (!s || s.length < 16) {
    throw new Error(`${SECRET_ENV} is not set or is too short`);
  }
  return s;
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function toBase64Url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Buffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

export function signEducationToken(email: string): string {
  const mac = crypto.createHmac("sha256", getSecret()).update(normalize(email)).digest();
  return toBase64Url(mac);
}

export function verifyEducationToken(email: string, token: string): boolean {
  if (typeof email !== "string" || typeof token !== "string") return false;
  if (!email || !token) return false;
  let provided: Buffer;
  try {
    provided = fromBase64Url(token);
  } catch {
    return false;
  }
  const expected = crypto.createHmac("sha256", getSecret()).update(normalize(email)).digest();
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

export function buildEducationUrl(baseUrl: string, email: string): string {
  const token = signEducationToken(email);
  const u = new URL("/education", baseUrl);
  u.searchParams.set("e", email);
  u.searchParams.set("t", token);
  return u.toString();
}
