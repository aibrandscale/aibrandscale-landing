import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import TrackerInit from "./_tracker-init";

const SITE_URL = "https://aibrandscale.io";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1300040625301757";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Brand Scale — AI рекламна система за €5K–€20K/месец",
    template: "%s · AI Brand Scale",
  },
  description:
    "Безплатно обучение за AI рекламна система, с която обикновени хора изграждат €5K–€20K/месец без опит, без голям бюджет, без аудитория. Старт за 60 секунди.",
  applicationName: "AI Brand Scale",
  generator: "Next.js",
  keywords: [
    "AI реклами",
    "AI Brand Scale",
    "AI маркетинг",
    "AI marketing",
    "Facebook реклами",
    "Meta Ads",
    "Google Ads с AI",
    "AI обучение България",
    "онлайн бизнес",
    "AI агенция",
    "пасивен доход",
    "€5K-€20K на месец",
    "Венелин Йорданов",
    "AI копирайтинг",
    "performance marketing",
    "обучение по реклами",
    "AI ads България",
    "стартиране на онлайн бизнес",
    "дигитален маркетинг",
    "ChatGPT реклами",
  ],
  authors: [{ name: "Венелин Йорданов", url: SITE_URL }],
  creator: "Венелин Йорданов",
  publisher: "AI Brand Scale",
  category: "education",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: SITE_URL,
    siteName: "AI Brand Scale",
    title: "AI Brand Scale — AI рекламна система за начинаещи",
    description:
      "Безплатно обучение за AI рекламна система, с която обикновени хора изграждат €5K–€20K/месец без опит и без голям бюджет.",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "AI Brand Scale — AI рекламна система за начинаещи", type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Brand Scale — AI рекламна система за начинаещи",
    description:
      "Безплатно обучение за AI рекламна система до €5K–€20K/месец без опит.",
    images: ["/og.png"],
    creator: "@aibrandscale",
    site: "@aibrandscale",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "bg-BG": SITE_URL, "x-default": SITE_URL },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    // Add Google Search Console verification token here when available
    // google: "your-token",
  },
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

const FAQS = [
  { q: "Имам ли нужда от опит или капитал, за да започна?", a: "Не. Цялата причина AI рекламите да работят за начинаещи е, че инструментите вече вършат това, което преди изискваше опит и бюджет." },
  { q: "Пробвал съм неща в онлайн бизнеса и нищо не сработи. Защо това е различно?", a: "Защото dropshipping, Amazon FBA и faceless YouTube са продукти, а продуктите се пренасищат. AI рекламата е умение и бизнесите плащат за умения всеки месец." },
  { q: "Има толкова много обучения, какво прави този различен?", a: "Това е безплатно обучение, което показва точната система, която бихме използвали, ако трябваше да започнем от 0 днес — без теория, само работният процес." },
  { q: "Колко дълго е обучението?", a: "Около 20–30 минути, а в първите 10 минути ще разбереш дали е за теб." },
  { q: "Наистина ли е безплатно или има уловка?", a: "Да, наистина е безплатно. Няма НО." },
  { q: "Студент съм / работя на пълно работно време. Имам ли време?", a: "Да. Системата е проектирана за 1–2 фокусирани часа на ден." },
  { q: "Нямам идея как AI се вписва в управлението на реклами. Ще се загубя ли?", a: "Не. Обучението приема, че никога не си докосвал AI или реклама — започваме от нула умишлено." },
];

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "AI Brand Scale",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-white.png` },
      sameAs: [
        "https://www.instagram.com/aibrandscale.io",
        "https://www.tiktok.com/@venelinnyordan0v",
      ],
      contactPoint: [{
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "venelinyordanov@visionstudios.services",
        availableLanguage: ["Bulgarian", "English"],
      }],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "AI Brand Scale",
      inLanguage: "bg-BG",
      publisher: { "@id": `${SITE_URL}#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}#webpage`,
      url: SITE_URL,
      name: "AI Brand Scale — AI рекламна система за начинаещи",
      isPartOf: { "@id": `${SITE_URL}#website` },
      about: { "@id": `${SITE_URL}#organization` },
      inLanguage: "bg-BG",
      description: "Безплатно обучение за AI рекламна система до €5K–€20K/месец.",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person-venelin`,
      name: "Венелин Йорданов",
      jobTitle: "Лектор и основател",
      worksFor: { "@id": `${SITE_URL}#organization` },
      sameAs: [
        "https://www.instagram.com/aibrandscale.io",
        "https://www.tiktok.com/@venelinnyordan0v",
      ],
    },
    {
      "@type": "Course",
      "@id": `${SITE_URL}#course`,
      name: "AI Brand Scale — AI рекламната система",
      description:
        "Безплатно обучение за AI рекламна система до €5K–€20K/месец без опит и голям бюджет.",
      provider: { "@id": `${SITE_URL}#organization` },
      instructor: { "@id": `${SITE_URL}#person-venelin` },
      inLanguage: "bg",
      educationalLevel: "Beginner",
      teaches: ["AI реклами", "Performance marketing", "Meta Ads", "AI копирайтинг"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
        category: "Free",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT30M",
        inLanguage: "bg",
      },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1200", bestRating: "5", worstRating: "1" },
    },
    {
      "@type": "VideoObject",
      "@id": `${SITE_URL}#hero-video`,
      name: "AI рекламната система — безплатно обучение",
      description: "Видео обучение, което показва AI рекламната система за начинаещи.",
      thumbnailUrl: `${SITE_URL}/og.png`,
      uploadDate: "2026-01-01",
      contentUrl: `https://fast.wistia.com/embed/medias/fy5m3sogu1.bin`,
      embedUrl: `https://fast.wistia.com/embed/iframe/fy5m3sogu1`,
      inLanguage: "bg",
      publisher: { "@id": `${SITE_URL}#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Начало", item: SITE_URL },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <link rel="preload" as="font" type="font/woff2" href={ALFABET_FONTS[0]} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://framerusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="block-context-menu"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;e.preventDefault();},{capture:true});`,
          }}
        />
        <Script
          id="gfonts-async"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=optional';document.head.appendChild(l);})();`,
          }}
        />
        <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=optional" /></noscript>
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <Script
          id="wistia-rejection-swallow"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function isWistia(s){return typeof s==='string'&&(s.indexOf('wistia')>-1||s.indexOf('fast.wistia.com')>-1);}function shouldSwallow(args){try{for(var i=0;i<args.length;i++){var a=args[i];if(a==null)continue;var s=typeof a==='string'?a:(a&&(a.stack||a.message||(typeof a.toString==='function'&&a.toString())))||'';if(isWistia(s))return true;if(s&&s.indexOf('Failed to fetch')>-1)return true;}}catch(_){}return false;}function wrap(){var origErr=console.error;if(origErr&&origErr.__wistiaWrapped)return;var fn=function(){if(shouldSwallow(arguments))return;return origErr.apply(this,arguments);};fn.__wistiaWrapped=true;console.error=fn;var origWarn=console.warn;if(origWarn&&!origWarn.__wistiaWrapped){var fn2=function(){if(shouldSwallow(arguments))return;return origWarn.apply(this,arguments);};fn2.__wistiaWrapped=true;console.warn=fn2;}}wrap();setTimeout(wrap,0);setTimeout(wrap,500);setTimeout(wrap,1500);setTimeout(wrap,3000);window.addEventListener('unhandledrejection',function(e){var r=e.reason;if(r==null){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();return;}var s=(r&&(r.stack||r.message||(typeof r.toString==='function'&&r.toString())))||'';if(isWistia(s)||(s&&s.indexOf('Failed to fetch')>-1)){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();}},true);window.addEventListener('error',function(e){var src=(e&&e.filename)||'';var msg=(e&&e.message)||'';if(isWistia(src)||isWistia(msg)||(msg&&msg.indexOf('Failed to fetch')>-1)){e.preventDefault();e.stopImmediatePropagation&&e.stopImmediatePropagation();}},true);})();`,
          }}
        />
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');`,
          }}
        />
        <noscript><img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" /></noscript>
      </head>
      <body>
        <TrackerInit />
        {children}
      </body>
    </html>
  );
}
