import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PurpleAlertNav } from "../_design";

const SITE_URL = "https://aibrandscale.io";
const VIMEO_ID = "1188615739";

export const metadata: Metadata = {
  title: "Обучението — AI Brand Scale",
  description: "Безплатното AI обучение на AI Brand Scale.",
  alternates: { canonical: `${SITE_URL}/education` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const PURPLE_HALO = "0 1px 60px 0 rgba(144,60,165,0.4), 0 30px 80px -20px rgba(0,0,0,0.7)";
const CARD_INNER_GLOW =
  "inset 32.972px 5.495px 167.131px -4.375px rgba(85,43,105,0.45), inset 19.148px 3.191px 97.060px -3.750px rgba(85,43,105,0.68), inset 11.698px 1.950px 59.295px -3.125px rgba(85,43,105,0.81), inset 7.244px 1.207px 36.717px -2.500px rgba(85,43,105,0.88), inset 4.357px 0.726px 22.086px -1.875px rgba(85,43,105,0.93), inset 2.389px 0.398px 12.108px -1.250px rgba(85,43,105,0.96), inset 1.008px 0.168px 5.108px -0.625px rgba(85,43,105,0.98)";

function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconRocket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const blocks = [
  {
    Icon: IconTarget,
    title: "Фокусирай се",
    desc: "Дай си 15 минути без разсейване, това може да промени посоката ти.",
  },
  {
    Icon: IconEye,
    title: "Гледай до края",
    desc: "Последните минути ще ти дадат цялата картина.",
  },
  {
    Icon: IconRocket,
    title: "Действай",
    desc: "Ще ти покажа точни стъпки, които можеш да приложиш веднага.",
  },
];

export default function EducationPage() {
  const iframeSrc = `https://player.vimeo.com/video/${VIMEO_ID}?dnt=1&playsinline=1&title=0&byline=0&portrait=0&pip=1`;

  return (
    <>
      <PurpleAlertNav text="Гледай внимателно и разбери как да започнеш AI MARKETING" />
      <main className="relative px-6 py-16 md:py-20" style={{ minHeight: "100vh" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Eyebrow / unlocked badge */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="edu-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 18px",
              borderRadius: 999,
              border: "1px solid rgba(196,155,217,0.35)",
              background: "rgba(85,43,105,0.18)",
              fontFamily: "Manrope, sans-serif",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C49BD9",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 24px rgba(196,155,217,0.18)",
            }}
          >
            <span aria-hidden className="edu-badge-dot" />
            <span aria-hidden className="edu-badge-shimmer" />
            <span style={{ position: "relative", zIndex: 1 }}>Обучението ти е отключено</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "alfabet, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(30px, 4.6vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            textAlign: "center",
            color: "#FFFFFF",
            margin: "22px auto 12px",
            maxWidth: 880,
          }}
        >
          Ето как може<br />да започнеш AI Marketing
        </h1>

        <p
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(15px, 1.3vw, 17px)",
            lineHeight: 1.6,
            color: "#ADB0B7",
            textAlign: "center",
            margin: "0 auto 36px",
            maxWidth: 920,
          }}
        >
          Гледай внимателно — ще ти покажа как можеш да приложиш това директно за себе си.
        </p>

        {/* Video */}
        <div
          style={{
            position: "relative",
            width: "min(100%, 980px)",
            margin: "0 auto",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: PURPLE_HALO,
            background: "#000",
          }}
        >
          <div style={{ aspectRatio: "16 / 9", width: "100%" }}>
            <iframe
              src={iframeSrc}
              title="AI Brand Scale — обучение"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              loading="eager"
              style={{ width: "100%", height: "100%", display: "block", border: 0 }}
            />
          </div>
        </div>

        {/* Three instruction blocks */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            marginTop: 56,
            maxWidth: 980,
          }}
        >
          {blocks.map((b) => (
            <div
              key={b.title}
              style={{
                position: "relative",
                borderRadius: 24,
                border: "1px solid rgba(196,155,217,0.18)",
                background: "rgba(255,255,255,0.002)",
                boxShadow: CARD_INNER_GLOW,
                padding: "32px 26px 30px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 14,
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(85,43,105,0.55)",
                  border: "1px solid rgba(196,155,217,0.30)",
                  color: "#F7CBFF",
                  boxShadow: "0 0 18px rgba(196,155,217,0.25), inset 0 0 18px rgba(173,118,199,0.15)",
                }}
              >
                <b.Icon style={{ width: 22, height: 22 }} />
              </div>
              <h3
                style={{
                  fontFamily: "alfabet, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(18px, 1.6vw, 22px)",
                  letterSpacing: "-0.005em",
                  color: "#F7CBFF",
                  margin: 0,
                }}
              >
                {b.title}
              </h3>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#C8CAD0",
                  margin: 0,
                  maxWidth: 260,
                }}
              >
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

        <EducationFooter />
      </main>
      <style>{`
        .edu-badge {
          animation: edu-badge-breathe 3.4s ease-in-out infinite;
        }
        .edu-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C49BD9;
          box-shadow: 0 0 10px rgba(196,155,217,0.9);
          position: relative;
          z-index: 1;
          animation: edu-dot-pulse 1.6s ease-in-out infinite;
        }
        .edu-badge-shimmer {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            100deg,
            transparent 0%,
            transparent 35%,
            rgba(247,203,255,0.18) 50%,
            transparent 65%,
            transparent 100%
          );
          background-size: 220% 100%;
          background-repeat: no-repeat;
          animation: edu-badge-shimmer 3.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes edu-badge-breathe {
          0%, 100% { box-shadow: 0 0 24px rgba(196,155,217,0.18); border-color: rgba(196,155,217,0.35); }
          50%      { box-shadow: 0 0 38px rgba(196,155,217,0.40); border-color: rgba(196,155,217,0.55); }
        }
        @keyframes edu-dot-pulse {
          0%, 100% { transform: scale(1);   box-shadow: 0 0 10px rgba(196,155,217,0.9); opacity: 1; }
          50%      { transform: scale(1.4); box-shadow: 0 0 16px rgba(247,203,255,1); opacity: 0.85; }
        }
        @keyframes edu-badge-shimmer {
          0%   { background-position: 220% 0; }
          60%  { background-position: -20% 0; }
          100% { background-position: -20% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .edu-badge, .edu-badge-dot, .edu-badge-shimmer { animation: none; }
        }
      `}</style>
    </>
  );
}

function EducationFooter() {
  const linkStyle: React.CSSProperties = {
    fontFamily: "Manrope, sans-serif",
    fontSize: 13,
    color: "#ADB0B7",
    textDecoration: "none",
  };
  return (
    <footer style={{ padding: "80px 0 24px", marginTop: 40 }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            borderRadius: 24,
            border: "1px solid rgba(196,155,217,0.18)",
            background: "rgba(255,255,255,0.002)",
            boxShadow: CARD_INNER_GLOW,
            padding: "clamp(28px, 3vw, 40px) clamp(28px, 4vw, 48px)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <Image
              src="/logo-white.png"
              alt="AI Brand Scale"
              width={260}
              height={64}
              sizes="(max-width: 768px) 220px, 260px"
              style={{ width: "clamp(220px, 18vw, 260px)", height: "auto", display: "block" }}
              loading="lazy"
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
            }}
          >
            <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
            <span aria-hidden style={{ color: "#ADB0B7", opacity: 0.5 }}>|</span>
            <Link href="/terms" style={linkStyle}>Terms &amp; Conditions</Link>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#ADB0B7", lineHeight: 1.6, maxWidth: 760 }}>
              Този сайт не е част от Facebook или Meta Platforms, Inc. FACEBOOK е регистрирана търговска марка на Meta Platforms, Inc.
            </p>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
              © {new Date().getFullYear()} aibrandscale.io. Всички права запазени.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
