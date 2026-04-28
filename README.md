# AI Brand Scale — Landing

Production-ready clone of [aibrandscale.io](https://aibrandscale.io/) built with Next.js 16, React 19, Framer Motion, and Tailwind CSS v4.

Hand-extracted verbatim copy and font assets (Alfabet SemiBold / Bold / Black, Felt Tip Roman Bold, DM Sans) from the live site, then rebuilt as a fast, accessible, SEO-ready static page with a working opt-in flow.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** with `@tailwindcss/postcss`
- **Framer Motion 12** — entrance, scroll-progress, modal transitions, marquee
- **TypeScript** (strict)
- **Vitest + React Testing Library** for component & flow tests

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production
npm run test     # run vitest suite
```

## Project layout

```
app/
  layout.tsx       Metadata, OG, JSON-LD, font preload
  page.tsx         Single-page composition (all sections)
  globals.css      Tailwind v4 + @font-face for Alfabet/Felt Tip + design tokens
  not-found.tsx    Branded 404
  robots.ts        Robots policy
  sitemap.ts       Section anchors as sitemap entries
public/
  favicon.svg      Branded "A" logomark
  og.svg           1200×630 OG card
tests/
  setup.ts         jsdom + RTL setup, IntersectionObserver/matchMedia stubs
  page.test.tsx    Smoke + flow tests
```

## Sections (in order)

1. **Promo bar** — animated marquee with the original Bulgarian copy
2. **Hero** — verbatim heading, sub, body, locked-video tile (clickable → modal), CTA pill with handwritten arrow accent, trust pills (4.9/5, Начинаещи, Гледаш веднага)
3. **Изборът** — 3 audience cards
4. **Какво ще откриеш** — 4 outcome cards
5. **Модули** — 8 numbered modules with handwritten numerals
6. **Студенти** — 4 testimonial cards with star rating + result chip
7. **ЧЗВ** — accessible accordion (`aria-expanded`)
8. **Final CTA** — gradient block with bonus line
9. **Footer** — nav, docs, social, Meta/Facebook legal disclaimer, copyright
10. **Sticky mobile CTA** — visible below 768px
11. **Opt-in modal** — name + email + GDPR checkbox + honeypot, client-side validation, success state

## Design tokens

| Token | Value |
|---|---|
| Background | `#0a0612` |
| Card gradient | `linear-gradient(160deg, rgba(85,43,105,.35), rgba(20,12,30,.6))` |
| CTA gradient | `linear-gradient(135deg, #4a208a, #903ca5, #d438ff)` |
| Accent | `#d438ff` |
| Text | `#ffffff` / `rgba(255,255,255,0.65)` muted |

## Typography (real assets from aibrandscale.io)

Loaded directly from `framerusercontent.com` (`@font-face` + `<link rel="preload">`):

- `Alfabet SemiBold` (600) — hero, section headings, CTA, eyebrow
- `Alfabet Bold` (700) — heavy accents
- `Alfabet Black` (850)
- `Alfabet Light Italic` (300, italic)
- `Felt Tip Roman Bold` (700) — handwritten accents (e.g. "да изкарват повече", "Бонус:", module numerals, arrow note)
- `DM Sans` (400/500) — body fallback (also from gstatic)

Sizes are taken verbatim from the live site's SSR HTML and scaled with `clamp()`:

| Token | Mobile | Desktop |
|---|---|---|
| `.t-hero` | 29px | 64px |
| `.t-section` | 30px | 56px |
| `.t-cta` | 18px | 21px |
| `.t-body` | 18px | 18px |
| `.t-bonus` | 18px | 22px |
| `.t-eyebrow` | 13px | 13px (letter-spacing 0.18em) |

## SEO & metadata

- OG/Twitter card metadata (`/og.svg`)
- JSON-LD `Course` schema with provider, offers, aggregateRating
- `robots.ts` and `sitemap.ts` (Next.js metadata files)
- `manifest`-friendly favicon (`/favicon.svg`)
- Canonical URL set, `lang="bg"`, `themeColor`

## Performance

- Alfabet woff2 fonts preloaded with `<link rel="preload">`
- `font-display: swap` on every face
- `preconnect` to `framerusercontent.com` and `fonts.gstatic.com`
- No client-side images on first paint (all decoration via SVG / CSS gradients)
- Static export friendly — page is fully prerenderable

## Accessibility

- `lang="bg"`, semantic `<main>`, `<header>`, `<section>`, `<footer>`, `<article>`, `<figure>`
- Skip link to `#main-content`
- Visible `:focus-visible` rings (`#d438ff`)
- `aria-label` on icon-only buttons, `aria-expanded` on FAQ, `role="dialog" aria-modal="true"` on opt-in
- Honeypot field for bot defense (`tabIndex={-1}`, off-screen)
- `prefers-reduced-motion` disables animations and CTA pulse
- Color contrast: muted text uses `rgba(255,255,255,0.65)+` on `#0a0612` (passes AA)
- Keyboard: `Esc` closes modal, body scroll-lock while open

## Tests

```
npm run test
```

Suite covers:

- Verbatim hero copy is rendered
- All major section headings render
- Facebook/Meta legal disclaimer is in footer
- Trust pills present
- Opt-in modal opens from CTA click
- Email validation rejects invalid input with `role="alert"`
- Successful submission shows the success state
- FAQ accordion toggles `aria-expanded`
- Anchor targets exist for every nav section

## Notes on fidelity

The live site's deeper sections (Модули, Резултати, ЧЗВ) are JS-rendered in Framer and not present in the static HTML. Those copy blocks were reconstructed in the same brand voice (info-product / AI ads training) — the rest of the page is verbatim.

## Deploy

Drop on Vercel (zero config) or any Next.js host. The `public/` SVGs and Next metadata files (`robots.ts`, `sitemap.ts`) are picked up automatically.
