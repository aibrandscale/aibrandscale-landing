"use client";

/* Shared design-kit primitives ported from claude.ai/design ui_kits/website.
   Used across the landing to give every section a consistent purple-glow look. */

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ──────── tokens ──────── */
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
export const FOCUS_RING =
  "0 0 0 3px rgba(196,155,217,0.85), 0 0 0 5px rgba(123,47,190,0.4)";

export const CARD_INNER_GLOW =
  "inset 32.972px 5.495px 167.131px -4.375px rgba(85,43,105,0.45), inset 19.148px 3.191px 97.060px -3.750px rgba(85,43,105,0.68), inset 11.698px 1.950px 59.295px -3.125px rgba(85,43,105,0.81), inset 7.244px 1.207px 36.717px -2.500px rgba(85,43,105,0.88), inset 4.357px 0.726px 22.086px -1.875px rgba(85,43,105,0.93), inset 2.389px 0.398px 12.108px -1.250px rgba(85,43,105,0.96), inset 1.008px 0.168px 5.108px -0.625px rgba(85,43,105,0.98)";

export const COLOR = {
  bg0: "#1A1A1A",
  bg1: "#1A1A1A",
  bg2: "#1A1A1A",
  fg: "#F9F9F9",
  fgMuted: "#ADB0B7",
  fgDim: "#B8B8B8",
  purple500: "#7B2FBE",
  purple600: "#903CA5",
  purple700: "#A044B8",
  purple800: "#552B69",
  purple100: "#C49BD9",
  pink100: "#F7CBFF",
};

/* ──────── hooks ──────── */
export function usePrefersReducedMotion() {
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

export function useCanHover() {
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

/* ──────── alert nav strip (marquee) ──────── */
export function PurpleAlertNav({
  text = "Още не си се записал? Вземи безплатен достъп сега",
  speedSec = 60,
  copies = 8,
}: {
  text?: string;
  speedSec?: number;
  copies?: number;
}) {
  const items = Array.from({ length: copies });
  const itemStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "0 28px",
    fontFamily: "Manrope, sans-serif",
    fontSize: "clamp(13px, 1.5vw, 16px)",
    color: "#fff",
    fontWeight: 500,
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  };
  const Arrow = () => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
  return (
    <div
      role="region"
      aria-label="Промо лента"
      style={{
        position: "relative",
        zIndex: 60,
        height: 38,
        background: "rgba(85,43,105,0.95)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="alert-static" style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
        <span style={{ ...itemStyle, padding: 0, fontSize: "clamp(11px, 3vw, 13px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <Arrow />
          <span>{text}</span>
          <Arrow />
        </span>
      </div>
      <div className="logi-marquee-track alert-marquee" style={{ whiteSpace: "nowrap" }}>
        {[0, 1].map((g) => (
          <div key={g} aria-hidden={g === 1} style={{ display: "flex", alignItems: "center" }}>
            {items.map((_, i) => (
              <span key={i} style={itemStyle}>
                <Arrow />
                <span>{text}</span>
                <Arrow />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────── eyebrow capsule ──────── */
export function Eyebrow({ children }: { children: ReactNode }) {
  const rule: CSSProperties = {
    width: 56,
    height: 1,
    opacity: 0.5,
    background: "linear-gradient(90deg, #04070D 0%, #FFFFFF 100%)",
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "0 16px",
        maxWidth: "100%",
      }}
    >
      <span style={{ ...rule, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: "Inter, Manrope, sans-serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(11px, 2.6vw, 14px)",
          letterSpacing: "0.08em",
          color: COLOR.fg,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {children}
      </span>
      <span style={{ ...rule, flexShrink: 0, transform: "scaleX(-1)" }} />
    </div>
  );
}

/* ──────── purple-glow card ──────── */
export function GlowCard({
  children,
  style,
  width,
  minHeight,
  interactive = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  width?: number | string;
  minHeight?: number | string;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const isHover = interactive && canHover && hover && !press;
  const transform = !interactive || reduced
    ? "translateY(0)"
    : press
    ? "scale(0.985)"
    : isHover
    ? "translateY(-4px)"
    : "translateY(0)";
  return (
    <div
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => { setHover(false); setPress(false); } : undefined}
      onPointerDown={interactive ? () => setPress(true) : undefined}
      onPointerUp={interactive ? () => setPress(false) : undefined}
      onPointerCancel={interactive ? () => setPress(false) : undefined}
      style={{
        position: "relative",
        width,
        minHeight,
        borderRadius: 14,
        background: "rgba(255,255,255,0.002)",
        boxShadow: isHover
          ? CARD_INNER_GLOW + ", 0 14px 44px rgba(144,60,165,0.32)"
          : CARD_INNER_GLOW,
        border: "1px solid rgba(255,255,255,0.3)",
        padding: "26px 22px",
        transform,
        transition: reduced
          ? "none"
          : `transform 220ms ${EASE_OUT}, box-shadow 220ms ${EASE_OUT}`,
        willChange: interactive ? "transform" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ──────── CTA pill ──────── */
export function CTAPill({
  children,
  onClick,
  big = false,
  href,
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  big?: boolean;
  href?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const isHover = canHover && hover && !press;
  const transform = reduced
    ? "translateY(0)"
    : press
    ? "scale(0.97)"
    : isHover
    ? "translateY(-2px)"
    : "translateY(0)";
  const style: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: big ? "clamp(14px, 3vw, 20px) clamp(20px, 5vw, 44px)" : "12px clamp(16px, 4vw, 30px)",
    minHeight: 44,
    whiteSpace: "nowrap",
    border: 0,
    borderRadius: 1000,
    cursor: "pointer",
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: big ? "clamp(15px, 3.4vw, 20px)" : "clamp(12px, 2.8vw, 16px)",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
    color: "#fff",
    background: isHover ? COLOR.purple700 : COLOR.purple600,
    boxShadow:
      "inset 0 -1px 0 0 rgba(0,0,0,0.18), inset 0 1px 0 0 rgba(255,255,255,0.22)" +
      (isHover ? ", 0 12px 44px rgba(144,60,165,0.45)" : ", 0 6px 20px rgba(144,60,165,0.25)") +
      (focus ? ", " + FOCUS_RING : ""),
    transform,
    transition: reduced
      ? "none"
      : `transform 140ms ${EASE_OUT}, box-shadow 220ms ${EASE_OUT}, background 200ms ${EASE_OUT}`,
    textAlign: "center",
    lineHeight: 1.15,
    outline: "none",
    textDecoration: "none",
    willChange: "transform",
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onPointerCancel: () => setPress(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };
  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} style={style} className="cta-ring-pulse" {...handlers}>
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} style={style} className="cta-ring-pulse" {...handlers}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

/* ──────── locked video ──────── */
export function LockedVideo({
  unlocked,
  onUnlock,
  duration = "18:42",
  ariaLabel = "Отключи видеото",
}: {
  unlocked: boolean;
  onUnlock: () => void;
  duration?: string;
  ariaLabel?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      style={{
        position: "relative",
        width: "min(100%, 880px)",
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 1px 60px 0 rgba(144,60,165,0.4), 0 30px 80px -20px rgba(0,0,0,0.7)",
        background: "radial-gradient(120% 90% at 50% 30%, #2a1842 0%, #0f0a1a 70%)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 40% at 30% 30%, rgba(123,47,190,0.35) 0%, transparent 60%), radial-gradient(50% 35% at 75% 70%, rgba(196,155,217,0.25) 0%, transparent 60%)",
        }}
      />

      <button
        type="button"
        onClick={!unlocked ? onUnlock : undefined}
        aria-label={ariaLabel}
        aria-pressed={unlocked}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          background: unlocked ? "rgba(0,0,0,0)" : "rgba(8,4,20,0.35)",
          backdropFilter: unlocked ? "blur(0px)" : "blur(10px)",
          WebkitBackdropFilter: unlocked ? "blur(0px)" : "blur(10px)",
          opacity: unlocked ? 0 : 1,
          pointerEvents: unlocked ? "none" : "auto",
          cursor: unlocked ? "default" : "pointer",
          border: 0,
          color: "#fff",
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
          <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 1 1 8 0v4" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
          }}
        >
          Заключено · {duration}
        </span>
      </button>

      {/* play after unlock */}
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
        <span
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLOR.purple600}, ${COLOR.purple500})`,
            color: "#fff",
            boxShadow: "0 14px 40px rgba(144,60,165,0.5)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4v16l14-8z" />
          </svg>
        </span>
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
          fontFamily: "Inter, Manrope, sans-serif",
          fontSize: 12,
          letterSpacing: "0.05em",
        }}
      >
        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4v16l14-8z" />
        </svg>
        <span>{duration}</span>
        <div
          style={{
            flex: 1,
            height: 3,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(145,101,171,0.9), rgba(247,203,255,0.9))",
          }}
        />
        <span style={{ opacity: 0.85 }}>HD</span>
      </div>
    </div>
  );
}

/* ──────── vertical 9:16 testimonial card ──────── */
export function TestimonialCard9x16({
  duration,
  caption,
  onPlay,
}: {
  duration: string;
  caption: string;
  onPlay?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const isHover = canHover && hover && !press;
  return (
    <button
      type="button"
      aria-label={`Изгледай отзив (${duration})`}
      onClick={onPlay}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        position: "relative",
        width: 240,
        aspectRatio: "9 / 16",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "linear-gradient(160deg, #2a1842 0%, #0f0a1a 100%)",
        boxShadow:
          CARD_INNER_GLOW +
          (isHover ? ", 0 18px 50px rgba(144,60,165,0.4)" : "") +
          (focus ? ", " + FOCUS_RING : ""),
        cursor: "pointer",
        padding: 0,
        transform: reduced
          ? "none"
          : press
          ? "scale(0.985)"
          : isHover
          ? "translateY(-4px)"
          : "translateY(0)",
        transition: reduced
          ? "none"
          : `transform 220ms ${EASE_OUT}, box-shadow 220ms ${EASE_OUT}`,
        outline: "none",
        willChange: "transform",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 50% at 30% 25%, rgba(196,155,217,0.45), transparent 60%), radial-gradient(60% 40% at 70% 80%, rgba(123,47,190,0.35), transparent 60%)",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          transform: "translate(-50%, -50%)",
          width: 110,
          height: 70,
          borderRadius: 12,
          background: `linear-gradient(180deg, rgba(145,101,171,0.95) 0%, rgba(247,203,255,0.95) 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          boxShadow: "0 8px 26px rgba(0,0,0,0.4)",
        }}
      >
        <svg width={28} height={36} viewBox="0 0 24 32" fill="#fff">
          <path d="M3 0 v32 l21-16 z" />
        </svg>
      </span>
      <div
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 10,
          padding: "10px 12px",
          borderRadius: 10,
          background:
            "linear-gradient(90deg, rgba(145,101,171,0.92) 0%, rgba(247,203,255,0.92) 100%)",
          color: "#fff",
          fontFamily: "Manrope, sans-serif",
          fontSize: 12,
          textAlign: "left",
          lineHeight: 1.4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.95 }}>
          {duration}
        </span>
        <span style={{ fontWeight: 600 }}>{caption}</span>
      </div>
    </button>
  );
}

/* ──────── alternating section band ──────── */
export function BandSection({
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
        scrollMarginTop: 60,
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
      <div
        style={{
          position: "relative",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 60px)",
        }}
      >
        {children}
      </div>
    </section>
  );
}
