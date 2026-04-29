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
