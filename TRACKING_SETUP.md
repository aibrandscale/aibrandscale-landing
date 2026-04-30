# Tracking Setup — Vercel ENV Vars

The landing site has a centralized event tracker at `lib/tracker.ts` + `/api/track`. Add these environment variables in **Vercel → Project → Settings → Environment Variables** (apply to Production + Preview + Development).

## Required

| Name | Example value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | `1300040625301757` | Meta Pixel ID, exposed to client |
| `META_CAPI_TOKEN` | `EAAxxx...` (from Meta Events Manager) | Server-side Conversions API token |

## Optional

| Name | Example | Purpose |
|---|---|---|
| `META_TEST_EVENT_CODE` | `TEST12345` | When set, CAPI events appear in **Test Events** tab in Events Manager (use during dev only — remove in prod) |
| `TRACKER_WEBHOOK_URL` | `https://your-software.com/api/tracking/webhook` | Sends every event to your software |
| `TRACKER_WEBHOOK_SECRET` | random 64-char hex | HMAC signing key, must match the value in your software |
| `GOOGLE_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/.../exec` | Apps Script web app URL — appends every form submit as a row in a Google Sheet |
| `GOOGLE_SHEET_WEBHOOK_SECRET` | string (optional) | If set, must equal `SECRET` constant inside the Apps Script |

## How to get the CAPI token

1. https://business.facebook.com/events_manager
2. Click your Pixel (ID `1300040625301757`)
3. Top tab **Settings**
4. Scroll to **Conversions API** section → **Generate access token**
5. Copy immediately (shown only once)
6. Paste as `META_CAPI_TOKEN` ENV in Vercel

## How to test

After deploy:

1. Open https://aibrandscale.io in incognito
2. Open Events Manager → your Pixel → **Test Events** tab
3. Set `META_TEST_EVENT_CODE` ENV in Vercel (Vercel will redeploy)
4. Open the site → click around → submit form
5. You should see real-time events appearing in Test Events:
   - `PageView`, `ScrollDepth`, `Click`, `Modal_Open`, `Lead`, `CompleteRegistration`
6. Each event with `event_id` proves deduplication works (client + server fire same id, Meta dedupes)
7. **Remove `META_TEST_EVENT_CODE` after testing** so production traffic flows to the live pixel.

## Generating the webhook secret

```bash
openssl rand -hex 32
```

Use the same value in:
- Landing site Vercel ENV `TRACKER_WEBHOOK_SECRET`
- Your software's ENV `TRACKER_WEBHOOK_SECRET`

## Architecture

```
Browser
  ├─ Meta Pixel client (fbevents.js)         → Meta directly
  └─ lib/tracker.ts → /api/track             → Meta CAPI (server-side, dedupe by event_id)
                                              → TRACKER_WEBHOOK_URL (your software)
```

Server-side path covers iOS/ad-blocker users (~30% of mobile traffic) where the client pixel is blocked.

## Additional integrations

### Microsoft Clarity
Project ID `wjp6an4e9n` is hard-coded in `app/layout.tsx` (no env var needed). Loads via `afterInteractive` script. Heatmaps + session recordings at https://clarity.microsoft.com.

### Google Sheets logging
Every successful `/api/optin` POST is forwarded to `GOOGLE_SHEET_WEBHOOK_URL` (Apps Script web app). Sheet columns: Date, Name, Email, Phone, IP, UA, Referrer, UTM Source/Medium/Campaign, fbclid, Path, Event ID. The Apps Script source lives in the linked Google Sheet (Extensions → Apps Script).

### Form rate limiting
`/api/optin` enforces 5 requests/minute/IP via in-memory Map (per Vercel function instance). Over-limit returns 429.

### `/organic` mirror route
- `app/organic/page.tsx` re-renders home but with `metadata.robots = { index:false, follow:false }` and canonical → `/`.
- `app/robots.ts` adds `Disallow: /organic` and `/api/`.
- `lib/tracker.ts` auto-tags traffic on `/organic` paths as `utm_source=organic, utm_medium=organic, traffic_source=organic` if no UTM is present.

### Lead persistence + auto-unlock
On successful submit, `localStorage.aibs_lead = { name, email, phone, ts }`. On Page mount, if present → video auto-unlocks (no confetti, no modal). Tracker also auto-attaches stored email/phone/name to **every** subsequent event so EMQ stays high (~9+) for the whole session post-opt-in.

### CAPI geo enrichment
`/api/track` reads Vercel headers `x-vercel-ip-country/city/country-region/postal-code` and forwards them as hashed `country/ct/st/zp` in CAPI `user_data`. Boosts EMQ for anonymous traffic.

### Standard events fired on form success
- `Lead` (event_id = leadEventId)
- `CompleteRegistration` (event_id = leadEventId + "-reg")
- `SubmitApplication` (event_id = leadEventId + "-app")

All include `value: 0, currency: "EUR"` and the user object (name/email/phone) for Advanced Matching + CAPI.

### Meta Pixel autoConfig disabled
`fbq('set','autoConfig','false', PIXEL_ID)` runs before init in `app/layout.tsx` to prevent Meta auto-detected events that fire without our `currency`/`value` and pollute diagnostics.
