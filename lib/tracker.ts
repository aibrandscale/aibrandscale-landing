"use client";

// Central event tracker. Fires to Meta Pixel (client) + /api/track (server-side proxy).
// Server route forwards to Meta Conversions API and to TRACKER_WEBHOOK_URL (user's software).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _aibsTracker?: TrackerState;
  }
}

type TrackerState = {
  anonId: string;
  sessionId: string;
  sessionStart: number;
  pageStart: number;
  utm: Record<string, string>;
  pageviewCount: number;
};

const ANON_KEY = "aibs_anon_id";
const SESSION_KEY = "aibs_session_id";
const SESSION_TS_KEY = "aibs_session_ts";
const UTM_KEY = "aibs_utm";
const SESSION_TTL_MS = 30 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function getOrCreateAnonId(): string {
  if (typeof localStorage === "undefined") return "anon_" + uuid();
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = "anon_" + uuid();
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

function getOrCreateSessionId(): { id: string; start: number } {
  if (typeof sessionStorage === "undefined") return { id: "sess_" + uuid(), start: Date.now() };
  const now = Date.now();
  const id = sessionStorage.getItem(SESSION_KEY);
  const ts = parseInt(sessionStorage.getItem(SESSION_TS_KEY) || "0", 10);
  if (id && ts && now - ts < SESSION_TTL_MS) {
    sessionStorage.setItem(SESSION_TS_KEY, String(now));
    return { id, start: ts };
  }
  const fresh = "sess_" + uuid();
  sessionStorage.setItem(SESSION_KEY, fresh);
  sessionStorage.setItem(SESSION_TS_KEY, String(now));
  return { id: fresh, start: now };
}

function captureUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const fresh: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) fresh[k] = v;
  }
  const fbclid = url.searchParams.get("fbclid");
  if (fbclid) fresh["fbclid"] = fbclid;
  const gclid = url.searchParams.get("gclid");
  if (gclid) fresh["gclid"] = gclid;

  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(localStorage.getItem(UTM_KEY) || "{}");
  } catch {}

  // Auto-tag /organic path as organic traffic when no UTM is present.
  if (url.pathname.startsWith("/organic") && !fresh.utm_source && !stored.utm_source) {
    fresh.utm_source = "organic";
    fresh.utm_medium = "organic";
    fresh.traffic_source = "organic";
  }

  if (Object.keys(fresh).length > 0) {
    const merged = { ...stored, ...fresh };
    localStorage.setItem(UTM_KEY, JSON.stringify(merged));
    return merged;
  }
  return stored;
}

function detectDevice() {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = /Mobi|Android|iPhone/.test(ua);
  const isTablet = /iPad|Tablet/.test(ua) || (isAndroid && !/Mobile/.test(ua));
  let os = "Unknown";
  if (isIOS) os = "iOS";
  else if (isAndroid) os = "Android";
  else if (/Mac/.test(ua)) os = "macOS";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Linux/.test(ua)) os = "Linux";
  let browser = "Unknown";
  if (/Chrome\/[0-9]/.test(ua) && !/Edg\/|OPR\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Edg\//.test(ua)) browser = "Edge";
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection;
  return {
    ua,
    os,
    browser,
    is_mobile: isMobile,
    is_tablet: isTablet,
    is_desktop: !isMobile && !isTablet,
    viewport: [window.innerWidth, window.innerHeight] as [number, number],
    screen: [window.screen.width, window.screen.height] as [number, number],
    dpr: window.devicePixelRatio || 1,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection: conn ? { type: conn.effectiveType, downlink: conn.downlink, rtt: conn.rtt, save_data: conn.saveData } : null,
  };
}

function getState(): TrackerState {
  if (typeof window === "undefined") {
    return { anonId: "", sessionId: "", sessionStart: 0, pageStart: 0, utm: {}, pageviewCount: 0 };
  }
  if (window._aibsTracker) return window._aibsTracker;
  const { id: sessionId, start: sessionStart } = getOrCreateSessionId();
  const state: TrackerState = {
    anonId: getOrCreateAnonId(),
    sessionId,
    sessionStart,
    pageStart: Date.now(),
    utm: captureUtm(),
    pageviewCount: 0,
  };
  window._aibsTracker = state;
  return state;
}

// Standard Meta events whitelist. Custom events go through trackCustom.
const META_STANDARD = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "CompleteRegistration",
  "Contact",
  "InitiateCheckout",
  "Purchase",
  "AddToCart",
  "Search",
  "Subscribe",
  "AddPaymentInfo",
  "AddToWishlist",
  "FindLocation",
  "Schedule",
  "StartTrial",
  "SubmitApplication",
  "CustomizeProduct",
  "Donate",
]);

export type TrackPayload = {
  event_id?: string;
  user?: { email?: string; phone?: string; name?: string; external_id?: string };
  props?: Record<string, unknown>;
};

function getStoredLead(): { name?: string; email?: string; phone?: string } | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem("aibs_lead");
    if (!raw) return null;
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    return { name: j.name, email: j.email, phone: j.phone };
  } catch { return null; }
}

export function track(eventName: string, payload: TrackPayload = {}): string {
  if (typeof window === "undefined") return "";
  const state = getState();
  const eventId = payload.event_id || uuid();
  const now = Date.now();

  // Auto-attach identified user PII from localStorage to every event so
  // match quality stays high for the whole session after opt-in.
  if (!payload.user || (!payload.user.email && !payload.user.phone)) {
    const stored = getStoredLead();
    if (stored && (stored.email || stored.phone)) {
      payload = { ...payload, user: { ...stored, ...(payload.user || {}) } };
    }
  }

  const fullEvent = {
    event_id: eventId,
    event_name: eventName,
    timestamp: now,
    anon_id: state.anonId,
    session_id: state.sessionId,
    session_age_ms: now - state.sessionStart,
    page_age_ms: now - state.pageStart,
    user: payload.user || {},
    page: {
      url: window.location.href,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer,
      title: document.title,
    },
    device: detectDevice(),
    utm: state.utm,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") || (state.utm.fbclid ? `fb.1.${now}.${state.utm.fbclid}` : null),
    props: payload.props || {},
  };

  // Fire Meta Pixel client-side
  if (typeof window.fbq === "function") {
    // Advanced Matching: if this event carries user PII, re-init pixel with
    // plaintext fields so the browser SDK hashes them and improves match quality.
    // Persists for subsequent fbq() calls in the same session.
    if (payload.user && (payload.user.email || payload.user.phone || payload.user.name)) {
      const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1300040625301757";
      const am: Record<string, string> = {};
      if (payload.user.email) am.em = payload.user.email.trim().toLowerCase();
      if (payload.user.phone) {
        const digits = payload.user.phone.replace(/\D/g, "");
        if (digits) am.ph = digits;
      }
      if (payload.user.name) {
        const parts = payload.user.name.trim().split(/\s+/);
        if (parts[0]) am.fn = parts[0].toLowerCase();
        if (parts.length > 1) am.ln = parts.slice(1).join(" ").toLowerCase();
      }
      if (payload.user.external_id) am.external_id = payload.user.external_id;
      else am.external_id = state.anonId;
      try { window.fbq("init", PIXEL_ID, am); } catch {}
    }

    const fbqProps = { ...(payload.props || {}), eventID: eventId };
    if (META_STANDARD.has(eventName)) {
      window.fbq("track", eventName, fbqProps, { eventID: eventId });
    } else {
      window.fbq("trackCustom", eventName, fbqProps, { eventID: eventId });
    }
  }

  // Fire to /api/track (server-side proxy → CAPI + webhook)
  try {
    const blob = new Blob([JSON.stringify(fullEvent)], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", blob)) {
      // sent via beacon
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullEvent),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}

  return eventId;
}

export function getAnonId(): string {
  return getState().anonId;
}
export function getSessionId(): string {
  return getState().sessionId;
}

// Reset the per-page timer when SPA navigation occurs so page_age_ms is correct.
export function markPageStart(): void {
  if (typeof window === "undefined") return;
  const state = getState();
  state.pageStart = Date.now();
}
