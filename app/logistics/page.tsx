"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";

/* ─────────────────────────  TOKENS  ───────────────────────── */

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const FOCUS_RING = "0 0 0 3px rgba(196,155,217,0.85), 0 0 0 5px rgba(123,47,190,0.4)";

const CARD_INNER_GLOW =
  "inset 32.972px 5.495px 167.131px -4.375px rgba(85,43,105,0.45), inset 19.148px 3.191px 97.060px -3.750px rgba(85,43,105,0.68), inset 11.698px 1.950px 59.295px -3.125px rgba(85,43,105,0.81), inset 7.244px 1.207px 36.717px -2.500px rgba(85,43,105,0.88), inset 4.357px 0.726px 22.086px -1.875px rgba(85,43,105,0.93), inset 2.389px 0.398px 12.108px -1.250px rgba(85,43,105,0.96), inset 1.008px 0.168px 5.108px -0.625px rgba(85,43,105,0.98)";

const COLOR = {
  bg0: "#0E0E10",
  bg1: "#1A1A1A",
  bg2: "#111111",
  fg: "#F9F9F9",
  fgMuted: "#ADB0B7",
  fgDim: "#B8B8B8",
  purple500: "#7B2FBE",
  purple600: "#903CA5",
  purple700: "#A044B8",
  purple800: "#552B69",
  purple100: "#C49BD9",
};

/* ─────────────────────────  HOOKS  ───────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const on = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return canHover;
}

function useInView<T extends HTMLElement>(rootMargin = "-80px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return { ref, seen };
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  return scrolled;
}

/* ─────────────────────────  ICONS  ───────────────────────── */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const baseSvg = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const Icon = {
  Truck: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M1 7h12v10H1z" />
      <path d="M13 10h5l3 4v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  Package: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  ),
  MapPin: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M20 10c0 7-8 12-8 12S4 17 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clipboard: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  ),
  Snowflake: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M12 2v20M4.2 5.6l15.6 12.8M19.8 5.6 4.2 18.4M2 12h20" />
    </svg>
  ),
  Satellite: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M5 19c4-1 8-5 9-9" />
      <path d="M3 19c5-1 11-7 12-12" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  ),
  Store: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M3 9 4.5 4h15L21 9" />
      <path d="M3 9v11h18V9" />
      <path d="M9 20v-5h6v5" />
    </svg>
  ),
  Cart: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l3.4 12.4a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L22 7H6" />
    </svg>
  ),
  Factory: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M3 21V10l5 3V10l5 3V6l8 4v11z" />
      <path d="M8 21v-4M13 21v-4M18 21v-4" />
    </svg>
  ),
  Lock: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  ),
  Play: ({ size = 24, ...p }: IconProps) => (
    <svg {...{ ...baseSvg(size), fill: "currentColor", stroke: "none" }} {...p}>
      <path d="M6 4v16l14-8z" />
    </svg>
  ),
  Plus: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Phone: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  Mail: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Menu: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: ({ size = 24, ...p }: IconProps) => (
    <svg {...baseSvg(size)} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Instagram: ({ size = 22, ...p }: IconProps) => (
    <svg {...baseSvg(size)} strokeWidth={1.8} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  LinkedIn: ({ size = 22, ...p }: IconProps) => (
    <svg {...{ ...baseSvg(size), fill: "currentColor", stroke: "none" }} {...p}>
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.3 18.5H5.7V9.7h2.6zM7 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.5 10h-2.6v-4.3c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.4H10V9.7h2.5v1.2h.1a2.7 2.7 0 0 1 2.5-1.4c2.7 0 3.2 1.7 3.2 4z" />
    </svg>
  ),
  Facebook: ({ size = 22, ...p }: IconProps) => (
    <svg {...{ ...baseSvg(size), fill: "currentColor", stroke: "none" }} {...p}>
      <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1z" />
    </svg>
  ),
};

/* ─────────────────────────  PRIMITIVES  ───────────────────────── */

function Section({
  id,
  tone = "a",
  children,
  style,
}: {
  id?: string;
  tone?: "a" | "b" | "deep";
  children: ReactNode;
  style?: CSSProperties;
}) {
  const bg = tone === "b" ? COLOR.bg2 : tone === "deep" ? COLOR.bg0 : COLOR.bg1;
  return (
    <section
      id={id}
      style={{
        position: "relative",
        width: "100%",
        background: bg,
        padding: "clamp(64px, 9vw, 110px) 0",
        scrollMarginTop: 80,
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  const rule: CSSProperties = {
    width: 56,
    height: 1,
    opacity: 0.5,
    background: "linear-gradient(90deg, #04070D 0%, #FFFFFF 100%)",
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "0 16px", height: 26 }}>
      <span style={rule} />
      <span
        style={{
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: 14,
          letterSpacing: "0.08em",
          color: COLOR.fg,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <span style={{ ...rule, transform: "scaleX(-1)" }} />
    </div>
  );
}

function SectionHead({ eyebrow, title, kicker }: { eyebrow: string; title: string; kicker?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        textAlign: "center",
        opacity: reduced || seen ? 1 : 0,
        transform: reduced || seen ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 600ms ${EASE_OUT}, transform 600ms ${EASE_OUT}`,
      }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        style={{
          fontWeight: 800,
          fontSize: "clamp(28px, 4.2vw, 44px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          margin: 0,
          maxWidth: 900,
        }}
      >
        {title}
      </h2>
      {kicker && (
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: COLOR.fgMuted, maxWidth: 720 }}>{kicker}</p>
      )}
    </div>
  );
}

/* Reusable interactive button (CTA) */
function CTA({
  children,
  onClick,
  size = "md",
  variant = "solid",
  href,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost";
  href?: string;
  ariaLabel?: string;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const isHover = canHover && hover && !press;

  const pad = size === "lg" ? "20px 40px" : size === "sm" ? "10px 20px" : "14px 28px";
  const fs = size === "lg" ? 18 : size === "sm" ? 14 : 16;

  const transform = reduced ? "none" : press ? "scale(0.97)" : isHover ? "translateY(-2px)" : "translateY(0)";

  const baseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: pad,
    minHeight: 44,
    border: variant === "ghost" ? "1px solid rgba(255,255,255,0.18)" : 0,
    borderRadius: 1000,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: fs,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "#fff",
    background:
      variant === "ghost"
        ? isHover
          ? "rgba(255,255,255,0.06)"
          : "transparent"
        : isHover
        ? `linear-gradient(135deg, ${COLOR.purple700} 0%, ${COLOR.purple600} 100%)`
        : `linear-gradient(135deg, ${COLOR.purple600} 0%, ${COLOR.purple500} 100%)`,
    boxShadow:
      variant === "ghost"
        ? focus
          ? FOCUS_RING
          : "none"
        : "inset 0 -1px 0 0 rgba(0,0,0,0.18), inset 0 1px 0 0 rgba(255,255,255,0.22)" +
          (isHover ? ", 0 14px 44px rgba(144,60,165,0.45)" : ", 0 6px 22px rgba(144,60,165,0.25)") +
          (focus ? ", " + FOCUS_RING : ""),
    transform,
    transition: reduced ? "none" : `transform 140ms ${EASE_OUT}, box-shadow 220ms ${EASE_OUT}, background 200ms ${EASE_OUT}`,
    textAlign: "center",
    lineHeight: 1.15,
    outline: "none",
    textDecoration: "none",
    willChange: "transform",
    whiteSpace: "nowrap",
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onPointerCancel: () => setPress(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} style={baseStyle} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} style={baseStyle} {...handlers}>
      {children}
    </button>
  );
}

/* ─────────────────────────  NAVBAR  ───────────────────────── */

const NAV_LINKS = [
  { href: "#home", label: "Начало" },
  { href: "#uslugi", label: "Услуги" },
  { href: "#za-kogo", label: "За кого е" },
  { href: "#rezultati", label: "Резултати" },
  { href: "#chzv", label: "ЧЗВ" },
];

function Logo() {
  return (
    <a href="#home" aria-label="ЛОГИСТИК — начало" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <span
        aria-hidden
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${COLOR.purple600} 0%, ${COLOR.purple500} 100%)`,
          color: "#fff",
          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.25)",
        }}
      >
        <Icon.Truck size={18} />
      </span>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "0.04em", color: "#fff" }}>
        ЛОГИ<span style={{ color: COLOR.purple100 }}>СТИК</span>
      </span>
    </a>
  );
}

function Navbar() {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 60,
          background: scrolled ? "rgba(14,14,16,0.85)" : "rgba(26,26,26,0.65)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
          boxShadow: scrolled ? "0 6px 30px rgba(0,0,0,0.35)" : "none",
          transition: `background 240ms ${EASE_OUT}, box-shadow 240ms ${EASE_OUT}, border-color 240ms ${EASE_OUT}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 60px)",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Logo />

          <nav
            aria-label="Главна навигация"
            className="logi-nav-desktop"
            style={{ display: "none", gap: 26 }}
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="logi-nav-link" style={{ color: COLOR.fg, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="logi-nav-cta" style={{ display: "none" }}>
            <CTA href="#kontakt" size="sm">
              Заяви консултация
            </CTA>
          </div>

          <button
            type="button"
            className="logi-nav-burger"
            aria-label="Отвори меню"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Icon.Menu />
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        aria-hidden={!open}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            opacity: open ? 1 : 0,
            transition: `opacity 240ms ${EASE_OUT}`,
          }}
        />
        <aside
          role="dialog"
          aria-label="Мобилно меню"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(86vw, 360px)",
            background: COLOR.bg1,
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: `transform 320ms ${EASE_OUT}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Logo />
            <button
              type="button"
              aria-label="Затвори меню"
              onClick={() => setOpen(false)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon.X />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "14px 12px",
                  borderRadius: 10,
                  fontSize: 17,
                  fontWeight: 500,
                  color: COLOR.fg,
                  textDecoration: "none",
                  transition: `background 180ms ${EASE_OUT}`,
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: "auto" }}>
            <CTA href="#kontakt" size="md">
              Заяви консултация
            </CTA>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ─────────────────────────  HERO  ───────────────────────── */

function LockedVideo({ onUnlock, unlocked }: { onUnlock: () => void; unlocked: boolean }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      style={{
        position: "relative",
        width: "min(100%, 880px)",
        aspectRatio: "16 / 9",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 1px 60px 0 rgba(144,60,165,0.35), 0 30px 80px rgba(0,0,0,0.55)",
        background: `radial-gradient(120% 90% at 50% 30%, #2a1842 0%, #0f0a1a 70%)`,
      }}
    >
      {/* fake video poster */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 40% at 30% 30%, rgba(123,47,190,0.35) 0%, transparent 60%), radial-gradient(50% 35% at 75% 70%, rgba(196,155,217,0.25) 0%, transparent 60%)",
        }}
      />

      {/* lock overlay */}
      <div
        onClick={!unlocked ? onUnlock : undefined}
        aria-hidden={unlocked}
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: unlocked ? "blur(0px)" : "blur(10px)",
          WebkitBackdropFilter: unlocked ? "blur(0px)" : "blur(10px)",
          background: unlocked ? "rgba(0,0,0,0)" : "rgba(8,4,20,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          opacity: unlocked ? 0 : 1,
          pointerEvents: unlocked ? "none" : "auto",
          cursor: "pointer",
          transition: `opacity 320ms ${EASE_OUT}, backdrop-filter 320ms ${EASE_OUT}, background 320ms ${EASE_OUT}`,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            transform: reduced ? "none" : unlocked ? "scale(0.92)" : "scale(1)",
            transition: `transform 320ms ${EASE_OUT}`,
          }}
        >
          <Icon.Lock size={42} />
        </div>
        <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)" }}>
          Натисни, за да отключиш
        </span>
      </div>

      {/* play */}
      <div
        aria-hidden={!unlocked}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: unlocked ? 1 : 0,
          transition: `opacity 320ms ${EASE_OUT}`,
          pointerEvents: unlocked ? "auto" : "none",
        }}
      >
        <button
          type="button"
          aria-label="Пусни видеото"
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: 0,
            cursor: "pointer",
            background: `linear-gradient(135deg, ${COLOR.purple600}, ${COLOR.purple500})`,
            color: "#fff",
            boxShadow: "0 14px 40px rgba(144,60,165,0.5)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon.Play size={32} />
        </button>
      </div>

      {/* control bar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 38,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 14px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0))",
          color: "#fff",
          fontSize: 12,
          letterSpacing: "0.05em",
        }}
      >
        <Icon.Play size={12} />
        <span>2:15</span>
        <div style={{ flex: 1, height: 3, borderRadius: 999, background: "linear-gradient(90deg, rgba(145,101,171,0.9), rgba(247,203,255,0.9))" }} />
        <span style={{ opacity: 0.85 }}>HD</span>
      </div>
    </div>
  );
}

function Hero() {
  const [unlocked, setUnlocked] = useState(false);
  const reduced = usePrefersReducedMotion();
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 68px)",
        background: COLOR.bg1,
        padding: "clamp(40px, 8vw, 96px) 0 clamp(64px, 9vw, 110px)",
        overflow: "hidden",
        scrollMarginTop: 80,
      }}
    >
      {/* grid + glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-20%",
          top: "10%",
          width: "70%",
          height: "70%",
          background: "radial-gradient(closest-side, rgba(123,47,190,0.28), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-15%",
          bottom: "-10%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(closest-side, rgba(196,155,217,0.18), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(196,155,217,0.4)",
            background: "rgba(123,47,190,0.12)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLOR.purple100,
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.purple100, boxShadow: `0 0 10px ${COLOR.purple100}` }} />
          Логистика без главоболия
        </div>

        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(32px, 5.4vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            margin: 0,
            maxWidth: 1080,
          }}
        >
          Разкриваме стъпките, с които намираме <span style={{ color: COLOR.purple100 }}>бързи и печеливши</span> логистични решения за вашия бизнес
        </h1>

        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: COLOR.fgMuted, maxWidth: 760 }}>
          Безплатно видео, в което показваме точната система, с която помагаме на компании да намалят логистичните разходи с 18–35% за под 90 дни — без смяна на партньор и без хаос в операциите.
        </p>

        <div style={{ marginTop: 14 }}>
          <LockedVideo onUnlock={() => setUnlocked(true)} unlocked={unlocked} />
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <CTA size="lg" onClick={() => setUnlocked(true)}>
            {unlocked ? "Видеото е отключено" : "Отключи видеото"}
          </CTA>
          <CTA size="lg" variant="ghost" href="#kontakt">
            Заяви консултация
          </CTA>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: COLOR.fgMuted, maxWidth: 620 }}>
          Бонус: безплатен 20-минутен audit на текущите ви логистични потоци за първите 10 заявки този месец.
        </p>
      </div>

      <style>{`
        @media (min-width: 980px) {
          .logi-nav-desktop { display: flex !important; }
          .logi-nav-cta { display: block !important; }
          .logi-nav-burger { display: none !important; }
        }
        .logi-nav-link { transition: color 200ms ${EASE_OUT}; }
        @media (hover: hover) and (pointer: fine) {
          .logi-nav-link:hover { color: ${COLOR.purple100}; }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 6px 22px rgba(144,60,165,0.25), inset 0 -1px 0 0 rgba(0,0,0,0.18), inset 0 1px 0 0 rgba(255,255,255,0.22); }
          50%      { box-shadow: 0 14px 50px rgba(144,60,165,0.55), inset 0 -1px 0 0 rgba(0,0,0,0.18), inset 0 1px 0 0 rgba(255,255,255,0.22); }
        }
      `}</style>
      {!reduced && null}
    </section>
  );
}

/* ─────────────────────────  AUDIENCE  ───────────────────────── */

function AudienceCard({
  icon,
  title,
  body,
  delay = 0,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  delay?: number;
}) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const canHover = useCanHover();
  const isHover = canHover && hover;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        flex: "1 1 280px",
        maxWidth: 380,
        minHeight: 260,
        padding: 32,
        borderRadius: 18,
        border: `1px solid ${isHover ? "rgba(123,47,190,0.5)" : "rgba(123,47,190,0.25)"}`,
        background: "linear-gradient(145deg, #2D1B4E 0%, #1F1635 100%)",
        boxShadow: CARD_INNER_GLOW + (isHover ? ", 0 18px 50px rgba(144,60,165,0.35)" : ""),
        transform: reduced || seen ? (isHover && !reduced ? "translateY(-6px)" : "translateY(0)") : "translateY(20px)",
        opacity: reduced || seen ? 1 : 0,
        transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 600ms ${EASE_OUT} ${delay}ms, box-shadow 240ms ${EASE_OUT}, border-color 240ms ${EASE_OUT}`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(123,47,190,0.22)",
          border: "1px solid rgba(196,155,217,0.35)",
          color: COLOR.purple100,
          marginBottom: 18,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: '"Times New Roman", Georgia, serif',
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 26,
          margin: 0,
          marginBottom: 10,
          color: "#fff",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "rgba(249,249,249,0.78)" }}>{body}</p>
    </div>
  );
}

function Audience() {
  return (
    <Section id="za-kogo" tone="b">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <SectionHead
          eyebrow="За кого работим"
          title="Логистика, която расте заедно с бизнеса ти"
          kicker="Работим с екипи, които са надраснали хаоса в Excel-таблиците и искат предвидими, проследими доставки."
        />
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
          <AudienceCard
            icon={<Icon.Store size={26} />}
            title="Малки бизнеси"
            body="Малки и средни бизнеси, които искат да оптимизират доставките и да намалят разходите без да жертват скоростта."
            delay={0}
          />
          <AudienceCard
            icon={<Icon.Cart size={26} />}
            title="E-commerce"
            body="Онлайн магазини, изградили обем и стремящи се към по-бърза, надеждна и проследима логистика."
            delay={80}
          />
          <AudienceCard
            icon={<Icon.Factory size={26} />}
            title="Производители"
            body="Производствени компании, които градят дистрибуционни мрежи и имат нужда от стабилен оперативен партньор."
            delay={160}
          />
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────  SERVICES  ───────────────────────── */

const SERVICES = [
  { icon: <Icon.Truck size={26} />, title: "Шосеен транспорт", body: "Цялостни и групажни товари в България и Европа с пълна проследимост." },
  { icon: <Icon.Package size={26} />, title: "Складова логистика", body: "Модерни складове клас A с WMS, picking, опаковане и cross-docking." },
  { icon: <Icon.MapPin size={26} />, title: "Last-mile доставки", body: "Експресна доставка до краен клиент в рамките на 24 часа в София и страната." },
  { icon: <Icon.Clipboard size={26} />, title: "Митническо оформяне", body: "Лицензирани агенти за внос/износ — документи, акцизи, T1, EORI." },
  { icon: <Icon.Snowflake size={26} />, title: "Температурен контрол", body: "Хладилни превози 2–8°C и -25°C с пълен мониторинг и одит на веригата." },
  { icon: <Icon.Satellite size={26} />, title: "Дигитален трекинг", body: "Real-time GPS трекинг, автоматични известия, API към ERP/e-commerce." },
];

function ServiceTile({ icon, title, body, idx }: { icon: ReactNode; title: string; body: string; idx: number }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const canHover = useCanHover();
  const isHover = canHover && hover;
  const delay = (idx % 3) * 70;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: 26,
        borderRadius: 16,
        border: `1px solid ${isHover ? "rgba(196,155,217,0.5)" : "rgba(255,255,255,0.08)"}`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
        boxShadow: isHover ? "0 16px 50px rgba(144,60,165,0.25)" : "none",
        opacity: reduced || seen ? 1 : 0,
        transform: reduced || seen ? (isHover && !reduced ? "translateY(-4px)" : "translateY(0)") : "translateY(20px)",
        transition: `opacity 500ms ${EASE_OUT} ${delay}ms, transform 500ms ${EASE_OUT} ${delay}ms, box-shadow 240ms ${EASE_OUT}, border-color 240ms ${EASE_OUT}`,
        willChange: "transform",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          opacity: isHover ? 1 : 0,
          transition: `opacity 240ms ${EASE_OUT}`,
          background:
            "radial-gradient(120% 80% at 0% 0%, rgba(123,47,190,0.18), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 48,
          height: 48,
          borderRadius: 12,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(123,47,190,0.18)",
          border: "1px solid rgba(196,155,217,0.3)",
          color: COLOR.purple100,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3 style={{ position: "relative", margin: 0, marginBottom: 8, fontSize: 19, fontWeight: 700, color: "#fff" }}>{title}</h3>
      <p style={{ position: "relative", margin: 0, fontSize: 15, lineHeight: 1.55, color: COLOR.fgMuted }}>{body}</p>
    </div>
  );
}

function Services() {
  return (
    <Section id="uslugi" tone="a">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SectionHead
          eyebrow="Услуги"
          title="Цялата ти верига на доставки — на едно място"
          kicker="От товара в склада до подписа на клиента — поемаме всяка стъпка с измерими SLA."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            width: "100%",
          }}
        >
          {SERVICES.map((s, i) => (
            <ServiceTile key={s.title} icon={s.icon} title={s.title} body={s.body} idx={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────  PROCESS  ───────────────────────── */

const STEPS = [
  { num: "01", title: "Анализ", body: "Анализираме текущите ви логистични потоци, идентифицираме bottlenecks и реалните разходи на пратка." },
  { num: "02", title: "Стратегия", body: "Изграждаме персонализирано решение, съобразено с целите, обема и бюджета ви — с ясни KPI." },
  { num: "03", title: "Изпълнение", body: "Имплементираме процесите, поемаме операцията и отчитаме резултатите всяка седмица." },
];

function StepCard({ num, title, body, idx }: { num: string; title: string; body: string; idx: number }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const delay = idx * 100;
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        flex: "1 1 260px",
        padding: 28,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
        opacity: reduced || seen ? 1 : 0,
        transform: reduced || seen ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 600ms ${EASE_OUT} ${delay}ms`,
      }}
    >
      <div
        style={{
          fontFamily: '"Times New Roman", Georgia, serif',
          fontStyle: "italic",
          fontSize: 56,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${COLOR.purple100}, ${COLOR.purple500})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          marginBottom: 12,
        }}
      >
        {num}
      </div>
      <h3 style={{ margin: 0, marginBottom: 8, fontSize: 22, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: COLOR.fgMuted }}>{body}</p>
    </div>
  );
}

function Process() {
  return (
    <Section id="proces" tone="b">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SectionHead eyebrow="Процес" title="3 стъпки до оптимална логистика" />
        <div style={{ position: "relative", display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {/* connector line on desktop */}
          <div
            aria-hidden
            className="logi-step-line"
            style={{
              position: "absolute",
              top: "50%",
              left: "8%",
              right: "8%",
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(196,155,217,0.4), transparent)",
              display: "none",
            }}
          />
          {STEPS.map((s, i) => (
            <StepCard key={s.num} num={s.num} title={s.title} body={s.body} idx={i} />
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 900px) {
          .logi-step-line { display: block !important; }
        }
      `}</style>
    </Section>
  );
}

/* ─────────────────────────  RESULTS / TESTIMONIALS  ───────────────────────── */

function ResultCard({
  duration,
  caption,
  idx,
}: {
  duration: string;
  caption: string;
  idx: number;
}) {
  const { ref, seen } = useInView<HTMLButtonElement>();
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const isHover = canHover && hover && !press;
  const delay = idx * 90;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Изгледай отзив (${duration})`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        position: "relative",
        flex: "1 1 230px",
        maxWidth: 280,
        aspectRatio: "9 / 16",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        background:
          "linear-gradient(160deg, #2a1842 0%, #0f0a1a 100%)",
        boxShadow: CARD_INNER_GLOW + (isHover ? ", 0 18px 50px rgba(144,60,165,0.4)" : ""),
        cursor: "pointer",
        padding: 0,
        opacity: reduced || seen ? 1 : 0,
        transform: reduced || seen ? (press ? "scale(0.985)" : isHover ? "translateY(-4px)" : "translateY(0)") : "translateY(20px)",
        transition: `opacity 600ms ${EASE_OUT} ${delay}ms, transform 280ms ${EASE_OUT}, box-shadow 240ms ${EASE_OUT}`,
        willChange: "transform",
      }}
    >
      {/* abstract poster */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 50% at 30% 25%, rgba(196,155,217,0.45), transparent 60%), radial-gradient(60% 40% at 70% 80%, rgba(123,47,190,0.35), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          transform: "translate(-50%, -50%)",
          width: 92,
          height: 64,
          borderRadius: 12,
          background: `linear-gradient(180deg, rgba(145,101,171,0.95) 0%, rgba(247,203,255,0.95) 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          boxShadow: "0 8px 26px rgba(0,0,0,0.4)",
        }}
      >
        <Icon.Play size={28} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          padding: "10px 12px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          fontSize: 13,
          textAlign: "left",
          lineHeight: 1.4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75 }}>
          {duration}
        </span>
        <span>{caption}</span>
      </div>
    </button>
  );
}

function Results() {
  return (
    <Section id="rezultati" tone="a">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SectionHead
          eyebrow="Резултати"
          title="Какво казват клиентите ни"
          kicker="Реални разкази от собственици и оперативни мениджъри, които вече минаха през трансформацията."
        />
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
          <ResultCard duration="2:15" caption="„Намалихме разходите си с 24% за първото тримесечие.“" idx={0} />
          <ResultCard duration="2:13" caption="„От 5 дни забавяне до доставка на 24-ия час.“" idx={1} />
          <ResultCard duration="3:02" caption="„Най-после имам видимост върху всяка пратка.“" idx={2} />
          <ResultCard duration="1:47" caption="„Партньор, който носи отговорност за резултата.“" idx={3} />
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────  FAQ  ───────────────────────── */

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: "Какви видове стоки транспортирате?", a: "Транспортираме генерални товари, ADR (опасни товари с лиценз), палетизирани, групажни и температурно контролирани пратки 2–8°C и -25°C." },
  { q: "Как се следи статусът на пратките?", a: "Всяка пратка получава уникален код и линк за real-time трекинг. Имаме API интеграции с най-използваните e-commerce и ERP платформи." },
  { q: "Какви са сроковете за доставка?", a: "За България: 24 часа за София и 48 часа до всяка точка от страната. За EU маршрути: 2–5 работни дни в зависимост от дестинацията." },
  { q: "Предлагате ли застраховка на товарите?", a: "Да. Всеки товар е покрит със стандартна CMR застраховка, а за стоки с по-висока стойност предлагаме разширени полици до 1 000 000 €." },
  { q: "Каква е минималната поръчка?", a: "Нямаме минимална поръчка за съществуващи клиенти. За първа заявка работим от 1 палет нагоре или цял камион." },
  { q: "Как започваме работа заедно?", a: "Започваме с безплатен 20-минутен audit, в който картираме текущата ви логистика и предлагаме конкретен план за оптимизация." },
];

function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${open ? "rgba(196,155,217,0.45)" : "rgba(255,255,255,0.08)"}`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
        overflow: "hidden",
        transition: `border-color 240ms ${EASE_OUT}, box-shadow 240ms ${EASE_OUT}`,
        boxShadow: open ? "0 14px 40px rgba(144,60,165,0.18)" : "none",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-panel-${idx}`}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          padding: "20px 22px",
          background: "transparent",
          border: 0,
          color: "#fff",
          cursor: "pointer",
          textAlign: "left",
          fontSize: 17,
          fontWeight: 600,
          fontFamily: "inherit",
        }}
      >
        <span>{q}</span>
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: open ? `linear-gradient(135deg, ${COLOR.purple600}, ${COLOR.purple500})` : "rgba(255,255,255,0.06)",
            color: "#fff",
            transform: reduced ? "none" : open ? "rotate(45deg)" : "rotate(0deg)",
            transition: `transform 240ms ${EASE_OUT}, background 240ms ${EASE_OUT}`,
            flexShrink: 0,
          }}
        >
          <Icon.Plus size={16} />
        </span>
      </button>
      <div
        id={`faq-panel-${idx}`}
        ref={ref}
        style={{
          maxHeight: open ? (ref.current?.scrollHeight ?? 400) + 32 : 0,
          opacity: open ? 1 : 0,
          transition: reduced ? "none" : `max-height 320ms ${EASE_IN_OUT}, opacity 240ms ${EASE_OUT}`,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "0 22px 22px", color: COLOR.fgMuted, fontSize: 15, lineHeight: 1.65 }}>{a}</div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <Section id="chzv" tone="b">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <SectionHead eyebrow="ЧЗВ" title="Често задавани въпроси" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 820 }}>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} idx={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────  FINAL CTA BANNER  ───────────────────────── */

function FinalCTA() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  return (
    <Section id="kontakt" tone="deep">
      <div
        ref={ref}
        style={{
          position: "relative",
          padding: "clamp(40px, 6vw, 72px) clamp(24px, 5vw, 60px)",
          borderRadius: 24,
          border: "1px solid rgba(196,155,217,0.35)",
          background: "linear-gradient(135deg, rgba(123,47,190,0.18) 0%, rgba(85,43,105,0.15) 100%)",
          overflow: "hidden",
          textAlign: "center",
          opacity: reduced || seen ? 1 : 0,
          transform: reduced || seen ? "translateY(0)" : "translateY(18px)",
          transition: `opacity 600ms ${EASE_OUT}, transform 600ms ${EASE_OUT}`,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "60%",
            height: "180%",
            background: "radial-gradient(closest-side, rgba(196,155,217,0.22), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Eyebrow>Следващата стъпка</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              maxWidth: 880,
              lineHeight: 1.1,
            }}
          >
            Готов ли си да видиш как ще изглежда логистиката ти след 90 дни?
          </h2>
          <p style={{ margin: 0, color: COLOR.fgMuted, fontSize: 17, maxWidth: 640 }}>
            Безплатен 20-минутен разговор. Без презентации. Излизаш с конкретен план — независимо дали ще работим заедно.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
            <CTA size="lg" href="#kontakt" ariaLabel="Заяви безплатна консултация">
              Заяви консултация
            </CTA>
            <CTA size="lg" variant="ghost" href="#uslugi">
              Виж услугите
            </CTA>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────  FOOTER  ───────────────────────── */

function SocialBtn({ children, label, brand }: { children: ReactNode; label: string; brand: "ig" | "li" | "fb" }) {
  const [hover, setHover] = useState(false);
  const bg =
    brand === "li"
      ? hover
        ? "#0A66C2"
        : "rgba(10,102,194,0.18)"
      : brand === "ig"
      ? hover
        ? "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)"
        : "rgba(221,42,123,0.18)"
      : hover
      ? "#1877F2"
      : "rgba(24,119,242,0.18)";
  return (
    <a
      href="#"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        background: bg,
        border: "1px solid rgba(255,255,255,0.1)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: `transform 200ms ${EASE_OUT}, background 220ms ${EASE_OUT}`,
      }}
    >
      {children}
    </a>
  );
}

function Footer() {
  return (
    <footer style={{ background: COLOR.bg0, padding: "64px 0 36px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px, 4vw, 60px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 }}>
            <Logo />
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: COLOR.fgMuted }}>
              Логистичен партньор за бизнеси, които искат предвидими доставки, реални SLA и по-малко главоболия.
            </p>
          </div>

          <div>
            <h4 style={{ margin: 0, marginBottom: 14, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: COLOR.fgDim }}>
              Навигация
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a className="logi-foot-link" href={l.href} style={{ color: COLOR.fg, fontSize: 15, textDecoration: "none" }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ margin: 0, marginBottom: 14, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: COLOR.fgDim }}>
              Контакти
            </h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: 15, color: COLOR.fg }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon.Phone size={16} /> <a className="logi-foot-link" href="tel:+359000000000" style={{ color: COLOR.fg, textDecoration: "none" }}>+359 00 000 0000</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon.Mail size={16} /> <a className="logi-foot-link" href="mailto:info@logistik.bg" style={{ color: COLOR.fg, textDecoration: "none" }}>info@logistik.bg</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon.MapPin size={16} /> <span>София, България</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ margin: 0, marginBottom: 14, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: COLOR.fgDim }}>
              Социални мрежи
            </h4>
            <div style={{ display: "flex", gap: 10 }}>
              <SocialBtn label="Instagram" brand="ig">
                <Icon.Instagram />
              </SocialBtn>
              <SocialBtn label="LinkedIn" brand="li">
                <Icon.LinkedIn />
              </SocialBtn>
              <SocialBtn label="Facebook" brand="fb">
                <Icon.Facebook />
              </SocialBtn>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 10, fontSize: 13, color: COLOR.fgDim }}>
            <a className="logi-foot-link" href="#" style={{ color: COLOR.fgDim, textDecoration: "none" }}>Privacy Policy</a>
            <span aria-hidden>|</span>
            <a className="logi-foot-link" href="#" style={{ color: COLOR.fgDim, textDecoration: "none" }}>Terms &amp; Conditions</a>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: COLOR.fgDim, maxWidth: 720 }}>
            Този сайт е независим и не е свързан с Facebook или Meta Platforms, Inc.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: COLOR.fgDim }}>
            © {new Date().getFullYear()} logistik.bg. Всички права запазени.
          </p>
        </div>
      </div>
      <style>{`
        .logi-foot-link { transition: color 200ms ${EASE_OUT}; }
        @media (hover: hover) and (pointer: fine) {
          .logi-foot-link:hover { color: ${COLOR.purple100}; }
        }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
      `}</style>
    </footer>
  );
}

/* ─────────────────────────  PAGE  ───────────────────────── */

export default function LogisticsPage() {
  return (
    <div style={{ background: COLOR.bg1, color: COLOR.fg, fontFamily: "Manrope, sans-serif", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Audience />
      <Services />
      <Process />
      <Results />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
