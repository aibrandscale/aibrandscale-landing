import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { buildEducationUrl } from "@/lib/education-token";

export const runtime = "nodejs";

const SITE_URL = process.env.EDUCATION_PUBLIC_URL || "https://aibrandscale.io";
const EMAIL_IMAGE_URL = `${SITE_URL}/email-training.jpg`;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function buildEmailHtml(name: string, educationUrl: string): string {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(educationUrl);
  return `<!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Достъп до AI Brand Scale обучението</title>
</head>
<body style="margin:0;padding:0;background:#0E0E10;font-family:Manrope,Helvetica,Arial,sans-serif;color:#F9F9F9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E10;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr>
          <td align="center">
            <a href="${safeUrl}" target="_blank" style="display:block;text-decoration:none;border:0;outline:none;">
              <img src="${EMAIL_IMAGE_URL}" alt="${safeName}, отвори твоето безплатно AI Brand Scale обучение" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;border-radius:12px;" />
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:18px 16px 8px;">
            <p style="margin:0;font-family:Manrope,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.55;color:#7A7C82;">
              Ако картинката не се зарежда, <a href="${safeUrl}" style="color:#9D7DB5;text-decoration:underline;">отвори обучението от тук</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:8px 16px 24px;">
            <p style="margin:0;font-family:Manrope,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.55;color:#5A5C62;">
              © ${new Date().getFullYear()} aibrandscale.io
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function buildEmailText(name: string, educationUrl: string): string {
  return `Здравей, ${name}!

Достъпът ти до безплатното AI Brand Scale обучение е готов:
${educationUrl}

— AI Brand Scale
`;
}

async function sendEducationEmail(data: { name: string; email: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { skipped: "no_resend_config" };

  let educationUrl: string;
  try {
    educationUrl = buildEducationUrl(SITE_URL, data.email);
  } catch {
    return { skipped: "no_token_secret" };
  }

  const subject = `${data.name}, достъпът ти до AI Brand Scale обучението`;
  const payload = {
    from,
    to: [data.email],
    subject,
    html: buildEmailHtml(data.name, educationUrl),
    text: buildEmailText(data.name, educationUrl),
  };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

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

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitMap: Map<string, number[]> = (globalThis as unknown as { __aibsRl?: Map<string, number[]> }).__aibsRl
  || ((globalThis as unknown as { __aibsRl?: Map<string, number[]> }).__aibsRl = new Map());

function rateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const arr = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  arr.push(now);
  rateLimitMap.set(ip, arr);
  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap) {
      if (!v.length || now - v[v.length - 1] > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(k);
    }
  }
  return arr.length > RATE_LIMIT_MAX;
}

async function forwardToSheet(
  data: { name: string; email: string; phone: string; event_id?: string },
  meta: { ip: string | null; ua: string | null; referer: string | null; url?: URL },
) {
  const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!sheetUrl) return;
  const u = meta.url;
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    event_id: data.event_id,
    ip: meta.ip,
    ua: meta.ua,
    referrer: meta.referer,
    path: u?.pathname || "",
    utm_source: u?.searchParams.get("utm_source") || "",
    utm_medium: u?.searchParams.get("utm_medium") || "",
    utm_campaign: u?.searchParams.get("utm_campaign") || "",
    fbclid: u?.searchParams.get("fbclid") || "",
    secret: process.env.GOOGLE_SHEET_WEBHOOK_SECRET || "",
  };
  try {
    await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
  } catch {}
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
    props: { content_name: "AI Brand Scale Free Training", priority: true },
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
  const ip = getClientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Твърде много опити. Опитай след минута." }, { status: 429 });
  }

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
    ip,
    ua: req.headers.get("user-agent"),
    referer: req.headers.get("referer"),
  };
  const eventId = typeof body.event_id === "string" ? body.event_id : undefined;
  let refUrl: URL | undefined;
  try { if (meta.referer) refUrl = new URL(meta.referer); } catch {}
  // Fire and forget; Vercel will keep the function alive long enough thanks to the awaited promise.
  await Promise.all([
    forwardLead({ name: result.name, email: result.email, phone: result.phone, event_id: eventId }, meta).catch(() => {}),
    forwardToSheet({ name: result.name, email: result.email, phone: result.phone, event_id: eventId }, { ...meta, url: refUrl }).catch(() => {}),
    sendEducationEmail({ name: result.name, email: result.email }).catch(() => {}),
  ]);

  return NextResponse.json({ ok: true });
}
