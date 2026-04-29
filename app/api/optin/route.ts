import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Field = "name" | "email" | "phone";
type Result = { ok: true; name: string; email: string; phone: string } | { ok: false; field: Field; message: string };

function validate(name: unknown, email: unknown, phone: unknown): Result {
  if (typeof name !== "string" || name.trim().length < 2) {
    return { ok: false, field: "name", message: "Моля, въведи името си." };
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { ok: false, field: "email", message: "Невалиден имейл адрес." };
  }
  if (typeof phone !== "string") {
    return { ok: false, field: "phone", message: "Невалиден телефонен номер." };
  }
  const digits = phone.replace(/\D/g, "").replace(/^359/, "").replace(/^0+/, "");
  if (digits.length !== 9) {
    return { ok: false, field: "phone", message: "Телефонът трябва да е 9 цифри след +359." };
  }
  if (!/^[2-9]/.test(digits)) {
    return { ok: false, field: "phone", message: "Невалиден български телефонен номер." };
  }
  return { ok: true, name: name.trim(), email: email.trim(), phone: `+359${digits}` };
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

async function forwardLead(
  data: { name: string; email: string; phone: string; event_id?: string },
  meta: { ip: string | null; ua: string | null; referer: string | null },
) {
  const url = process.env.TRACKER_WEBHOOK_URL;
  const secret = process.env.TRACKER_WEBHOOK_SECRET;
  if (!url) return { skipped: "no_webhook_url" };

  const eventId = data.event_id || crypto.randomUUID();
  const payload = {
    event_id: eventId,
    event_name: "Lead",
    timestamp: Date.now(),
    source: "optin_endpoint",
    user: { name: data.name, email: data.email, phone: data.phone },
    page: { referrer: meta.referer },
    device: { ua: meta.ua },
    server: { ip: meta.ip, received_at: Date.now() },
    props: { content_name: "AI Brand Scale Free Training", currency: "EUR", value: 0, priority: true },
  };
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) {
    headers["X-Tracker-Signature"] = crypto.createHmac("sha256", secret).update(body).digest("hex");
  }
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(5000) });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; phone?: unknown; hp?: unknown; event_id?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Невалидна заявка." }, { status: 400 });
  }

  // honeypot
  if (typeof body.hp === "string" && body.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const result = validate(body.name, body.email, body.phone);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  // Priority forward to consumer software — never block the user response on this.
  const meta = {
    ip: getClientIp(req),
    ua: req.headers.get("user-agent"),
    referer: req.headers.get("referer"),
  };
  const eventId = typeof body.event_id === "string" ? body.event_id : undefined;
  // Fire and forget; Vercel will keep the function alive long enough thanks to the awaited promise.
  await forwardLead({ name: result.name, email: result.email, phone: result.phone, event_id: eventId }, meta).catch(() => {});

  return NextResponse.json({ ok: true });
}
