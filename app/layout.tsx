import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://aibrandscale.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI Brand Scale растеж за вашия бранд с изкуствен интелект",
  description:
    "Безплатно обучение за AI рекламна система, с която обикновени хора изграждат €5K–€20K/месец без опит, без голям бюджет, без аудитория.",
  applicationName: "AI Brand Scale",
  keywords: ["AI реклами", "AI Brand Scale", "AI marketing", "Facebook реклами", "обучение", "€5K-€20K"],
  authors: [{ name: "AI Brand Scale" }],
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: SITE_URL,
    siteName: "AI Brand Scale",
    title: "AI Brand Scale AI рекламната система за начинаещи",
    description:
      "Безплатно обучение за AI рекламна система, с която обикновени хора изграждат €5K–€20K/месец.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "AI Brand Scale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brand Scale AI рекламната система за начинаещи",
    description:
      "Безплатно обучение за AI рекламна система до €5K–€20K/месец.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0612",
  width: "device-width",
  initialScale: 1,
};

const ALFABET_FONTS = [
  "https://framerusercontent.com/assets/sIf2fVJGK0gmwbluERmSeUNkuw.woff2",
  "https://framerusercontent.com/assets/6bOkTp33nScsMROIc9ZF8AfE.woff2",
  "https://framerusercontent.com/assets/vaZ5MR4DhH9gd1BS7igOssKjLT4.woff2",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "AI Brand Scale AI рекламната система",
  description:
    "Безплатно обучение за AI рекламна система до €5K–€20K/месец без опит и голям бюджет.",
  provider: {
    "@type": "Organization",
    name: "AI Brand Scale",
    sameAs: SITE_URL,
  },
  inLanguage: "bg",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1200" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <head>
        {ALFABET_FONTS.map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />
        ))}
        <link rel="preconnect" href="https://framerusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/qrt3bsu.css" />
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="wistia-rejection-swallow"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function isWistia(s){return typeof s==='string'&&(s.indexOf('wistia')>-1||s.indexOf('fast.wistia.com')>-1);}window.addEventListener('unhandledrejection',function(e){var r=e.reason;if(r==null){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();return;}var s=(r&&(r.stack||r.message||(typeof r.toString==='function'&&r.toString())))||'';if(isWistia(s)||(s&&s.indexOf('Failed to fetch')>-1)){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();}},true);window.addEventListener('error',function(e){var src=(e&&e.filename)||'';var msg=(e&&e.message)||'';if(isWistia(src)||isWistia(msg)){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();}},true);})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
