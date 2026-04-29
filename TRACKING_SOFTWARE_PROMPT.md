# Prompt за Claude Code — Tracking Module в твоя software

Копирай целия текст по-долу и го пусни на Claude Code в проекта на софтуера. Той описва точно какъв webhook receiver, database schema, admin UI menu и API да създаде, за да получава и визуализира всички tracking събития от `aibrandscale.io`.

---

## TASK

Build a complete **Tracking & Analytics module** inside this software. The landing site `aibrandscale.io` already has a centralized event tracker that POSTs every user action as JSON to a webhook URL. You need to build:

1. The webhook receiver endpoint
2. Database schema for events
3. Admin UI menu (sidebar item "Analytics") with sub-pages
4. Query APIs for the UI
5. Real-time live visitors view
6. Optional: PostHog integration (heatmaps/recordings via iframe)

Do NOT add tracking SDKs of your own. The site is the producer; you are the consumer.

## WEBHOOK SPEC

**Endpoint to expose:** `POST /api/tracking/webhook`

**Auth:** HMAC SHA-256 signature in header `X-Tracker-Signature`. The site signs the raw body with shared secret `TRACKER_WEBHOOK_SECRET`. Verify on receive — reject 401 if invalid.

```ts
const sig = req.headers["x-tracker-signature"];
const expected = crypto.createHmac("sha256", process.env.TRACKER_WEBHOOK_SECRET)
  .update(rawBody)
  .digest("hex");
if (sig !== expected) return res.status(401).end();
```

**Request body** (JSON, one event per request):

```json
{
  "event_id": "uuid-v4",
  "event_name": "Modal_Submit_Success",
  "timestamp": 1730000000000,
  "anon_id": "anon_<uuid>",
  "session_id": "sess_<uuid>",
  "session_age_ms": 124500,
  "page_age_ms": 30200,
  "user": {
    "name": "string|optional",
    "email": "string|optional",
    "phone": "string|optional",
    "external_id": "string|optional"
  },
  "page": {
    "url": "https://aibrandscale.io/?utm_source=...",
    "path": "/",
    "search": "?utm_source=...",
    "hash": "",
    "referrer": "https://www.facebook.com/",
    "title": "AI Brand Scale ..."
  },
  "device": {
    "ua": "Mozilla/5.0 ...",
    "os": "iOS|Android|macOS|Windows|Linux",
    "browser": "Chrome|Safari|Firefox|Edge",
    "is_mobile": true,
    "is_tablet": false,
    "is_desktop": false,
    "viewport": [390, 844],
    "screen": [390, 844],
    "dpr": 3,
    "lang": "bg-BG",
    "tz": "Europe/Sofia",
    "connection": { "type": "4g", "downlink": 10, "rtt": 50, "save_data": false }
  },
  "utm": { "utm_source": "facebook", "utm_medium": "cpc", "utm_campaign": "...", "fbclid": "..." },
  "fbp": "fb.1.123.456",
  "fbc": "fb.1.123.fbclid",
  "props": { /* event-specific properties */ },
  "server": { "ip": "1.2.3.4", "received_at": 1730000000123 }
}
```

**Response:** `200 OK` always (don't return errors to avoid breaking the producer). Log errors internally.

## EVENT TAXONOMY

The site emits these `event_name` values. Build the UI around them.

### Auto events (every visit)
- `PageView` — initial page load
- `SessionStart` — new session (30-min window)
- `ScrollDepth` — props.depth_pct ∈ {25, 50, 75, 90, 100}
- `TimeOnPage` — props.seconds ∈ {10, 30, 60, 120, 300}
- `Click` — props: tag, text, href, id, x_pct, y_pct, x_px, y_px, data_track
- `RageClick` — 3+ clicks within 30px in <2s (frustration)
- `DeadClick` — click on non-interactive element (UX bug)
- `OutboundLink` — click to external domain
- `Hover` — hover on data-track="cta-*"
- `Copy` — props: text (200 char max), length
- `TabHidden` / `TabVisible` — visibility change
- `PageLeave` — beforeunload/pagehide with time_on_page_ms
- `JSError` — props: message, src, line, col
- `PromiseRejection` — unhandled promise rejection
- `OrientationChange` — props.orientation: portrait|landscape
- `ViewportResize` — props: w, h
- `TouchStart` — props: x_pct, y_pct (mobile heatmap)
- `Swipe` — props: direction (up/down/left/right), distance_px, duration_ms
- `LongPress` — props: duration_ms

### Custom events (semantic)
- `Modal_Open` — opt-in modal opened
- `Modal_Submit_Attempt` — user clicked submit
- `Modal_Submit_ValidationError` — props.errors: string[]
- `Modal_Submit_Success` — server accepted the lead
- `Modal_Submit_Error` — props: field, message, status
- `Modal_Submit_NetworkError`
- `Lead` (Meta Standard) — successful opt-in with user data
- `CompleteRegistration` (Meta Standard) — same lead, registration complete
- `Hero_CTA_Click` (planned)
- `Video_Lock_Click`, `Video_Unlock_Success`, `Video_Play`, `Video_25/50/75/100%` (planned)
- `FAQ_Open`, `FAQ_Close` (planned)
- `Footer_Social_Click` (planned)
- `Section_View` (planned, IntersectionObserver)

## DATABASE SCHEMA

Use the project's existing DB (Postgres recommended). Create migrations.

```sql
CREATE TABLE tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL UNIQUE,
  event_name TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  anon_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_age_ms BIGINT,
  page_age_ms BIGINT,
  -- user
  user_name TEXT,
  user_email TEXT,
  user_email_hash TEXT,
  user_phone TEXT,
  user_phone_hash TEXT,
  user_external_id TEXT,
  -- page
  page_url TEXT,
  page_path TEXT,
  page_referrer TEXT,
  page_title TEXT,
  -- device
  ua TEXT,
  os TEXT,
  browser TEXT,
  is_mobile BOOLEAN,
  is_tablet BOOLEAN,
  is_desktop BOOLEAN,
  viewport_w INT,
  viewport_h INT,
  dpr REAL,
  lang TEXT,
  tz TEXT,
  connection_type TEXT,
  -- attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbclid TEXT,
  gclid TEXT,
  fbp TEXT,
  fbc TEXT,
  -- network
  ip INET,
  -- props
  props JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_te_event_name ON tracking_events (event_name);
CREATE INDEX idx_te_occurred_at ON tracking_events (occurred_at DESC);
CREATE INDEX idx_te_anon_id ON tracking_events (anon_id);
CREATE INDEX idx_te_session_id ON tracking_events (session_id);
CREATE INDEX idx_te_email_hash ON tracking_events (user_email_hash);
CREATE INDEX idx_te_props_gin ON tracking_events USING GIN (props);

-- Materialized view for sessions
CREATE TABLE tracking_sessions (
  session_id TEXT PRIMARY KEY,
  anon_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  last_event_at TIMESTAMPTZ NOT NULL,
  duration_ms BIGINT,
  pageview_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  scroll_max_pct INT DEFAULT 0,
  is_mobile BOOLEAN,
  os TEXT,
  browser TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  ip INET,
  city TEXT,
  country TEXT,
  converted BOOLEAN DEFAULT FALSE,
  user_email TEXT
);

CREATE INDEX idx_ts_started_at ON tracking_sessions (started_at DESC);
CREATE INDEX idx_ts_converted ON tracking_sessions (converted);

-- Materialized view for users (by anon_id or email_hash)
CREATE TABLE tracking_users (
  anon_id TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  session_count INT DEFAULT 0,
  total_events INT DEFAULT 0,
  email TEXT,
  email_hash TEXT,
  phone TEXT,
  name TEXT,
  is_lead BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_campaign TEXT,
  city TEXT,
  country TEXT
);
```

On every webhook receive: insert into `tracking_events`, then upsert into `tracking_sessions` and `tracking_users`. Use IP-to-city lookup (free MaxMind GeoLite2 or `ipapi.co`).

## ADMIN UI — SIDEBAR MENU

Add a top-level sidebar item **"Analytics"** with sub-routes:

```
Analytics
├── Overview            (/analytics)              KPI dashboard
├── Live Visitors       (/analytics/live)         Real-time map + active sessions
├── Events              (/analytics/events)       Raw event stream + filters
├── Sessions            (/analytics/sessions)     Session list + replay timeline
├── Users               (/analytics/users)        User profiles + history
├── Funnels             (/analytics/funnels)      Custom funnel builder
├── Heatmaps            (/analytics/heatmaps)     Click + scroll maps per page/device
├── Form Submissions    (/analytics/forms)        Lead list + export CSV
├── Attribution         (/analytics/attribution)  UTM/source breakdown + ROAS
├── Errors              (/analytics/errors)       JS errors + rage/dead clicks
└── Settings            (/analytics/settings)     Webhook secret, Meta Pixel ID, integrations
```

### Page details

**Overview** — KPI cards + charts:
- Today's: PageViews, Unique Visitors, Sessions, Leads, Conversion Rate, Avg Session Duration, Bounce Rate
- Charts: 7-day line of sessions, leads, CR; donut of device split (mobile/desktop/tablet); bar of top pages
- Period selector (Today / 7d / 30d / Custom)

**Live Visitors** — WebSocket / SSE feed:
- Number of active visitors (any event in last 30s)
- World map with dots
- Per-visitor: city, device, current page, time on page, recent events
- Filter by mobile/desktop

**Events** — Stream + filters:
- Searchable, paginated table of every event
- Filter by event_name, date range, anon_id, session_id, device, utm_source, country
- Click event → drawer with full JSON
- Export CSV

**Sessions** — Per-session view:
- Sortable table: started_at, duration, pageviews, clicks, scroll_max, device, source, converted
- Click session → timeline view with every event chronologically + screenshot/replay link if available
- "Customer journey" reconstruction

**Users** — Per-user (by anon_id or email):
- Card with: first_seen, last_seen, total sessions, lead status, source
- All sessions for this user
- All forms they submitted
- Notes field (free-text per user)

**Funnels** — Builder:
- Define steps as event_name (e.g., PageView → Hero_CTA_Click → Modal_Open → Modal_Submit_Success)
- Show drop-off % between each step
- Filter by date range, device, source
- Save named funnels

**Heatmaps** — Aggregated x_pct/y_pct from Click + TouchStart events:
- Pick page (path) + device type (mobile/desktop/tablet) + date range
- Render heatmap canvas overlaid on screenshot of that page
- Toggle between click density / scroll depth / rage clicks
- (Optional) Embed PostHog session replays via iframe if `POSTHOG_HOST` ENV is set

**Form Submissions** — Lead list:
- Table: timestamp, name, email, phone, utm_source, utm_campaign, ip, country, device
- Click → full session for that lead
- Export CSV with columns
- "Send to CRM" button (webhook out to existing CRM if integrated)

**Attribution** — UTM breakdown:
- Group leads by utm_source × utm_campaign
- Show: visitors, leads, CR, cost (manual entry of ad spend per campaign), CPL, ROAS
- Compare last 7d vs prior 7d

**Errors** — Issue tracker for the site:
- JSError + PromiseRejection counts grouped by message
- RageClick + DeadClick locations (heatmap)
- Mobile-specific issues (Form_Field_Zoom, Pinch_Zoom counts)

**Settings**:
- Webhook URL (read-only, copy button) — `https://<this-software>.com/api/tracking/webhook`
- Webhook secret rotation (regenerates `TRACKER_WEBHOOK_SECRET` and shows new value)
- Meta Pixel ID display
- PostHog host/key fields (optional integration)
- IP-to-geo provider key
- Test event button — emits a sample event to verify pipeline

## ENV VARS NEEDED

```
TRACKER_WEBHOOK_SECRET=<random 64-char hex>
META_PIXEL_ID=1300040625301757
DATABASE_URL=postgres://...
POSTHOG_HOST=https://posthog.example.com   # optional
POSTHOG_API_KEY=phc_...                    # optional
GEOIP_API_KEY=...                          # optional, for ip→city
```

After generating `TRACKER_WEBHOOK_SECRET`, give it to the user — they'll add the same value as `TRACKER_WEBHOOK_SECRET` ENV in the **landing site's Vercel project**, alongside `TRACKER_WEBHOOK_URL=https://<this-software>.com/api/tracking/webhook`.

## REQUIREMENTS

- Use the existing stack (don't add Express if it's Next.js, don't add Next if it's Nest, etc.).
- Use the existing DB and ORM (Prisma/Drizzle/raw SQL — match what's there).
- Use the existing auth — Analytics menu must be admin-only.
- Use the existing UI library (shadcn/ui or whatever) — match the visual style.
- All charts via existing chart lib (Recharts/Chart.js/visx).
- Real-time updates via WebSocket if available, else SSE, else polling every 5s.
- Mobile-responsive admin UI.

## OUT OF SCOPE

- Don't build a tracking SDK (the site already has one).
- Don't proxy events to Meta CAPI (the site already does).
- Don't store raw IPs longer than 30 days (GDPR) — anonymize after.
- Don't expose PII in the Events API endpoint without admin auth.

## DELIVERABLES

1. Migration file(s) for the schema above
2. `POST /api/tracking/webhook` endpoint with HMAC verification
3. Background worker / inline upserts for `tracking_sessions` + `tracking_users`
4. All admin pages listed above
5. README section explaining how the data flows from site → webhook → DB → UI
6. Test command that POSTs a sample event and verifies it appears in the UI

When done, give the user:
- The webhook URL to add to the landing site's Vercel ENV
- The generated webhook secret
- Sample SQL queries they can run to verify data is flowing
