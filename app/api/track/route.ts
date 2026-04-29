import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE;
const WEBHOOK_URL = process.env.TRACKER_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.TRACKER_WEBHOOK_SECRET;

// Meta Standard events that map to CAPI
const META_STANDARD = new Set([
  "PageView", "ViewContent", "Lead", "CompleteRegistration", "Contact",
  "InitiateCheckout", "Purchase", "AddToCart", "Search", "Subscribe",
  "AddPaymentInfo", "AddToWishlist", "FindLocation", "Schedule",
  "StartTrial", "SubmitApplication", "CustomizeProduct", "Donate",
]);

function sha256(value: string | undefined | null): string | null {
  if (!value) return null;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string | undefined | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits || null;
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

type IncomingEvent = {
  event_id: string;
  event_name: string;
  timestamp: number;
  anon_id: string;
  session_id: string;
  user?: { email?: string; phone?: string; name?: string; external_id?: string };
  page?: { url?: string; path?: string; referrer?: string; title?: string };
  device?: { ua?: string; is_mobile?: boolean; [k: string]: unknown };
  utm?: Record<string, string>;
  fbp?: string | null;
  fbc?: string | null;
  props?: Record<string, unknown>;
  [k: string]: unknown;
};

async function sendToCAPI(event: IncomingEvent, ip: string | null, ua: string | null) {
  if (!PIXEL_ID || !CAPI_TOKEN) return { skipped: "no_credentials" };
  const isStandard = META_STANDARD.has(event.event_name);

  const userData: Record<string, unknown> = {
    client_ip_address: ip || undefined,
    client_user_agent: ua || event.device?.ua || undefined,
    fbp: event.fbp || undefined,
    fbc: event.fbc || undefined,
    external_id: sha256(event.user?.external_id || event.anon_id),
  };
  if (event.user?.email) userData.em = sha256(event.user.email);
  if (event.user?.phone) userData.ph = sha256(normalizePhone(event.user.phone) || "");
  if (event.user?.name) {
    const parts = event.user.name.trim().split(/\s+/);
    if (parts[0]) userData.fn = sha256(parts[0]);
    if (parts.length > 1) userData.ln = sha256(parts.slice(1).join(" "));
  }
  for (const k of Object.keys(userData)) if (userData[k] == null) delete userData[k];

  const capiEvent = {
    event_name: isStandard ? event.event_name : event.event_name,
    event_time: Math.floor((event.timestamp || Date.now()) / 1000),
    event_id: event.event_id,
    event_source_url: event.page?.url,
    action_source: "website" as const,
    user_data: userData,
    custom_data: {
      ...(event.props || {}),
      session_id: event.session_id,
      anon_id: event.anon_id,
      ...(event.utm || {}),
    },
  };

  const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`;
  const body: Record<string, unknown> = { data: [capiEvent] };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, response: json };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function sendToWebhook(event: IncomingEvent, ip: string | null) {
  if (!WEBHOOK_URL) return { skipped: "no_webhook" };
  const payload = { ...event, server: { ip, received_at: Date.now() } };
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (WEBHOOK_SECRET) {
    const sig = crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
    headers["X-Tracker-Signature"] = sig;
  }
  try {
    const res = await fetch(WEBHOOK_URL, { method: "POST", headers, body, signal: AbortSignal.timeout(5000) });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function POST(req: NextRequest) {
  let event: IncomingEvent;
  try {
    event = (await req.json()) as IncomingEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!event || !event.event_name) {
    return NextResponse.json({ ok: false, error: "missing_event_name" }, { status: 400 });
  }

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent");

  const [capi, webhook] = await Promise.all([sendToCAPI(event, ip, ua), sendToWebhook(event, ip)]);

  return NextResponse.json({ ok: true, capi, webhook });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "track" });
}
