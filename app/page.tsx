"use client";

import { motion, AnimatePresence, useScroll, useSpring, type Variants } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import {
  PurpleAlertNav,
  Eyebrow as DesignEyebrow,
  GlowCard,
  CTAPill,
  LockedVideo as DesignLockedVideo,
  TestimonialCard9x16,
  COLOR as DC,
  CARD_INNER_GLOW,
} from "./_design";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: EASE_OUT_QUINT },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_QUINT } },
};

/* ─────────── ICONS ─────────── */
const I = {
  Lock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  ),
  Play: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7L8 5z" /></svg>),
  Star: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z"/></svg>),
  Bolt: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L3 14h7l-1 8 11-13h-7l1-7z"/></svg>),
  User: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>),
  Check: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>),
  ArrowDown: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M6 13l6 6 6-6"/></svg>),
  Chevron: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>),
  X: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M6 6l12 12M6 18L18 6"/></svg>),
  Inst: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>),
  YT: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M22 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.5 5 12 5 12 5s-4.5 0-7.3.1c-.4.1-1.2.1-1.9.9C2.2 6.6 2 8 2 8s-.2 1.7-.2 3.4v1.6C1.8 14.7 2 16.4 2 16.4s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.6.2 6.6.2 6.6.2s4.5 0 7.3-.1c.4-.1 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.7.2-3.4v-1.6C22.2 9.7 22 8 22 8zM10 15V9l5 3-5 3z"/></svg>),
  TT: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19 8.5a6 6 0 01-3.5-1.1V15a5 5 0 11-5-5v3a2 2 0 102 2V3h3a4 4 0 003.5 3.5v2z"/></svg>),
};

/* ─────────── DATA ─────────── */

const oldWay = [
  "€1K–€5K минимум, само за да започнеш да тестваш продукти.",
  "6–12 месеца преди да видиш първото си евро, ако изобщо стигнеш дотам.",
  `Пренаситени пазари; всеки „печеливш продукт" вече има 500 копия.`,
  "Влизаш в директна битка с хора, започнали преди 10 години.",
  "Една промяна в алгоритъма може да срине всичко за една нощ.",
];

const newWay = [
  "Първият клиент е възможен още в първите 30 дни.",
  "Това е умение, а не продукт. Търсенето е глобално и постоянно.",
  "AI съкращава това, което преди отнемаше 10 години, до няколко седмици фокусирана работа.",
  "Свързано е директно с приходи. Бизнесите плащат за него, защото им носи пари.",
];

const discover = [
  {
    n: "01",
    title: "Рамката „AI Edge“",
    desc: "Защо 19-годишен човек с правилните умения вече може да побеждава агенции, които таксуват €10,000/месец, и как точно да се позиционираш в тази празнина, преди всички останали.",
    long: true,
  },
  {
    n: "02",
    title: "Базови AI реклами",
    desc: "Точният софтуер и работен процес за създаване на рекламен креатив от нула до първия вариант за под 30 минути.",
  },
  {
    n: "03",
    title: "Вътрешна информация",
    desc: "На какво ниво е пазарът точно сега; кои ниши горят, кои офферти конвертират и какво плащат реалните клиенти през 2026.",
  },
];

const modules = [
  { n: "01", title: "AI Foundations", desc: "Как работят рекламните алгоритми и защо AI промени играта в полза на новите играчи." },
  { n: "02", title: "Anti-Guru Mindset", desc: "Защо повечето „онлайн бизнес“ модели не работят и как да разпознаеш реална възможност." },
  { n: "03", title: "Намиране на ниша", desc: "Списък с печеливши ниши за 2026 къде търсенето е високо, а конкуренцията слаба." },
  { n: "04", title: "Building the Offer", desc: "Как да опаковаш услугата си така, че клиентите да казват „да“ от първия разговор." },
  { n: "05", title: "AI Ad Creatives", desc: "Шаблони и инструменти за реклами, които конвертират; без снимачен екип и без бюджет за дизайн." },
  { n: "06", title: "Client Acquisition", desc: "Outbound и inbound системата, с която затваряш клиенти всяка седмица." },
  { n: "07", title: "Onboarding & Delivery", desc: "Процес за обслужване, който звучи и изглежда като агенция от €10M+." },
  { n: "08", title: "Scaling до €20K/мес", desc: "Кога да наемаш, кога да делегираш и кога да отказваш клиенти." },
];

const testimonials = [
  { name: "Никола Г.", result: "€8,400 за 47 дни", quote: "Бях dropshipping-нал 2 години и нямах нищо да покажа. С AI Brand Scale първите 3 клиента дойдоха още в първия месец." },
  { name: "Елена П.", result: "€12,000/мес след 4-ия месец", quote: "Това е единственото обучение, в което всичко е реално и конкретно. Без водна реч, без guru магия. Просто система." },
  { name: "Мартин Д.", result: "От 0 до €5K за 60 дни", quote: "Напуснах работа в IT за да правя това на пълно работно време. След 6 месеца оборотите ми са повече от заплатата." },
  { name: "Ивайло К.", result: "Първи клиент за 11 дни", quote: "Не вярвах, че може да е толкова бързо. Следвах модулите буквално и затворих първия си клиент за €1,800/мес." },
];

const faqs = [
  { q: "Имам ли нужда от опит или капитал, за да започна?", a: "Не. Цялата причина AI рекламите да работят за начинаещи е, че инструментите вече вършат това, което преди изискваше опит и бюджет. Единственото, което се иска от теб, е реално да гледаш обучението и да следваш стъпките по ред." },
  { q: "Пробвал съм неща в онлайн бизнеса и нищо не сработи. Защо това е различно?", a: "Защото dropshipping, Amazon FBA и faceless YouTube са продукти а продуктите се пренасищат. AI рекламата е умение. Бизнесите плащат за умения всеки месец и те не се изчерпват. Напълно различна категория, напълно различна математика." },
  { q: "Има толкова много обучения какво прави този различен?", a: "Това е безплатно обучение, което ти показва точната система, която бих използвал, ако трябваше да започна от 0 днес. Без теория, без преразказан YouTube съвет само работният процес, който реално работи в 2026." },
  { q: "Колко дълго е обучението?", a: "Би ти отнело около 20 и 30 минути да изгледаш и приложиш нещата, а в първите 10 минути ще разбереш дали е за теб." },
  { q: "Наиситна ли е безплатно или има някаква уловка?", a: "Да, наистина е безплатно. Няма НО...." },
  { q: "Аз съм студент / работя на пълно работно време. Имам ли реално време за това?", a: "Да. Системата е проектирана за 1–2 фокусирани часа на ден. Първите 30 дни искат фокус, не свободно време." },
  { q: "Нямам идея как AI се вписва в управлението на реклами. Ще се загубя ли?", a: "Не. Обучението приема, че никога не си докосвал AI или реклама. Започваме от нула умишлено това е целият смисъл." },
];

/* ─────────── PRIMITIVES ─────────── */

function Logo() {
  return (
    <span className="font-alfabet-black tracking-tight text-lg">
      <span style={{ color: "var(--text)" }}>AI Brand</span>{" "}
      <span style={{ color: "var(--accent)" }}>Scale</span>
    </span>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

function StickyMobileCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="sticky-cta-mobile" style={{ display: "flex", justifyContent: "center" }}>
      <CTAPill onClick={onOpen} ariaLabel="Отключи безплатното видео">
        Отключи видеото
      </CTAPill>
    </div>
  );
}

function WistiaPlayer({ mediaId, unlocked, onUnlock }: { mediaId: string; unlocked: boolean; onUnlock: () => void }) {
  useEffect(() => {
    const swallow = (e: PromiseRejectionEvent) => {
      // Wistia's player.js periodically throws bare `undefined` rejections
      // when its internal media-fetch race resolves out of order. Suppress
      // only those (no real reason), keep real errors visible.
      if (e.reason === undefined || e.reason === null) {
        e.preventDefault();
        return;
      }
      const stack = (e.reason.stack || e.reason.toString?.() || "") + "";
      if (stack.includes("wistia") || stack.includes("fast.wistia.com")) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", swallow);

    const scripts = [
      { src: "https://fast.wistia.com/player.js", type: "" },
      { src: `https://fast.wistia.com/embed/${mediaId}.js`, type: "module" },
    ];
    scripts.forEach(({ src, type }) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      if (type) s.type = type;
      document.head.appendChild(s);
    });
    const styleId = `wistia-style-${mediaId}`;
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `wistia-player[media-id='${mediaId}']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`;
      document.head.appendChild(st);
    }

    return () => {
      window.removeEventListener("unhandledrejection", swallow);
    };
  }, [mediaId]);

  return (
    <div
      data-hero-video
      className={unlocked ? "video-unlocked" : undefined}
      style={{
        position: "relative",
        width: "min(100%, 880px)",
        margin: "0 auto",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 1px 60px 0 rgba(144,60,165,0.4), 0 30px 80px -20px rgba(0,0,0,0.7)",
        background: "#000",
      }}
    >
      <div
        style={{
          filter: unlocked ? "none" : "blur(14px)",
          transform: unlocked ? "scale(1)" : "scale(1.04)",
          transition: "filter 600ms cubic-bezier(0.23,1,0.32,1), transform 600ms cubic-bezier(0.23,1,0.32,1)",
          pointerEvents: unlocked ? "auto" : "none",
        }}
        dangerouslySetInnerHTML={{
          __html: `<wistia-player media-id="${mediaId}" aspect="1.7777777777777777"></wistia-player>`,
        }}
      />

      <button
        type="button"
        onClick={onUnlock}
        aria-label="Отключи видеото"
        aria-pressed={unlocked}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          background: unlocked ? "rgba(0,0,0,0)" : "rgba(8,4,20,0.45)",
          backdropFilter: unlocked ? "blur(0px)" : "blur(8px)",
          WebkitBackdropFilter: unlocked ? "blur(0px)" : "blur(8px)",
          opacity: unlocked ? 0 : 1,
          pointerEvents: unlocked ? "none" : "auto",
          cursor: unlocked ? "default" : "pointer",
          border: 0,
          color: "#fff",
          transition: "opacity 320ms cubic-bezier(0.23,1,0.32,1), backdrop-filter 320ms cubic-bezier(0.23,1,0.32,1), background 320ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <div
          className={unlocked ? undefined : "lock-pulse cta-ring-pulse"}
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
            WebkitBackdropFilter: "blur(8px)",
            transform: unlocked ? "scale(0.92)" : undefined,
            transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 1 1 8 0v4" />
          </svg>
        </div>
        <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontFamily: "Manrope, sans-serif" }}>
          Натисни, за да отключиш
        </span>
      </button>
    </div>
  );
}

function HandwrittenArrow() {
  return (
    <div className="hidden lg:flex absolute -left-[200px] top-1/2 -translate-y-1/2 items-center gap-1 pointer-events-none select-none" aria-hidden="true">
      <span className="font-felt text-[22px] leading-none whitespace-nowrap" style={{ color: "var(--accent)", transform: "rotate(-6deg)", display: "inline-block" }}>натисни тук</span>
      <svg viewBox="0 0 90 60" className="w-[88px] h-12" fill="none">
        <path d="M4 14 C 28 8, 54 24, 78 40" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" style={{ color: "var(--accent)" }} />
        <path d="M70 34 L 80 42 L 72 50" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }} />
      </svg>
    </div>
  );
}

/* ─────────── PROMO ─────────── */
// Replaced by PurpleAlertNav from _design.tsx kept for back-compat if referenced.
function PromoBar() {
  return <PurpleAlertNav />;
}

/* ─────────── HERO ─────────── */

function Hero({ onOpen, unlocked }: { onOpen: () => void; unlocked: boolean }) {
  const handleUnlock = () => { onOpen(); };
  return (
    <section id="home" className="relative pt-16 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-wash" aria-hidden="true" />
      <div className="relative max-w-[1280px] mx-auto px-6 text-center">
        <motion.h1
          initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="mx-auto"
          style={{
            fontFamily: '"alfabet", "Alfabet Black", "Alfabet Bold", Manrope, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 850,
            fontSize: "clamp(24px, 3vw, 38px)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            color: DC.fg,
            maxWidth: 880,
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <span style={{ display: "block" }}>
            <span style={{ fontFamily: "Manrope, sans-serif" }}>AI</span> рекламното умение, с което начинаещи
          </span>
          <span style={{ display: "block" }}>започват да изкарват повече от хора,</span>
          <span style={{ display: "block" }}>
            които са в сферата от <span style={{ fontFamily: "Manrope, sans-serif" }}>10</span> години.
          </span>
        </motion.h1>

        <motion.div
          initial="hidden" animate="show" variants={fadeUp} custom={2}
          aria-hidden
          style={{
            marginTop: 28,
            marginInline: "auto",
            width: 80,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(196,155,217,0.55), transparent)",
          }}
        />

        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={3}
          className="mx-auto"
          style={{
            marginTop: 22,
            marginInline: "auto",
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(15px, 1.25vw, 17px)",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
            color: DC.fg,
            maxWidth: 880,
            textAlign: "center",
            textWrap: "balance" as never,
          }}
        >
          Безплатно обучение, което ти показва точната AI рекламна система, с която обикновени хора изграждат{" "}
          <span
            className="whitespace-nowrap font-semibold"
            style={{
              color: DC.fg,
              backgroundImage: "linear-gradient(transparent 62%, rgba(144, 60, 165, 0.45) 62%)",
              padding: "0 0.15em",
            }}
          >
            €5K–€20K&nbsp;/&nbsp;месец
          </span>{" "}
          без опит, без голям бюджет, без собствен продукт и без аудитория.
        </motion.p>

        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={4}
          className="mx-auto"
          style={{
            marginTop: 14,
            marginInline: "auto",
            fontFamily: "Manrope, sans-serif",
            fontStyle: "italic",
            fontSize: "clamp(15px, 1.25vw, 17px)",
            lineHeight: 1.5,
            letterSpacing: "-0.005em",
            color: DC.fg,
            maxWidth: 880,
            textAlign: "center",
            textWrap: "balance" as never,
          }}
        >
          Ако вече си пробвал dropshipping, Amazon FBA или SMM агенция и си уморен от „онлайн бизнес“ гурута, които никога не показват реални резултати,{" "}
          <span style={{ color: DC.fg, fontStyle: "normal", fontWeight: 600 }}>изгледай видеото внимателно…</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.85, delay: 0.4, ease: EASE_OUT_QUINT }} className="mt-12 mx-auto" style={{ width: "100%" }}>
          <WistiaPlayer mediaId="fy5m3sogu1" unlocked={unlocked} onUnlock={handleUnlock} />
        </motion.div>

        {!unlocked && (
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5} className="mt-12 flex flex-col items-center gap-7">
          <button
            type="button"
            onClick={handleUnlock}
            aria-label="Отключи видеото"
            className="hero-cta-pulse"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "18px 80px",
              minHeight: 64,
              borderRadius: 1000,
              cursor: "pointer",
              fontFamily: "Manrope, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(14px, 1.2vw, 17px)",
              letterSpacing: "0.02em",
              color: "#fff",
              textAlign: "center",
              lineHeight: 1.25,
              textTransform: "uppercase",
              background: "linear-gradient(180deg, rgba(123,47,190,0.35) 0%, rgba(85,43,105,0.30) 50%, rgba(30,18,52,0.45) 100%)",
              border: "1px solid rgba(255,255,255,0.30)",
              outline: "none",
              maxWidth: 600,
              width: "auto",
            }}
          >
            <span style={{ position: "relative" }}>
              {unlocked ? "Видеото е отключено" : <>Отключи видеото, в което разкривам<br />как може да го направиш и ти</>}
            </span>
          </button>

          <div style={{ width: "min(100%, 880px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <span aria-hidden style={{ fontSize: 22, lineHeight: 1 }}>🎁</span>
              <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(17px, 1.6vw, 21px)", color: DC.fg, letterSpacing: "-0.01em" }}>
                Бонус: 10-минутна безплатна консултация
              </span>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: 720,
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(13px, 1.05vw, 15px)",
                lineHeight: 1.55,
                color: DC.fg,
                textAlign: "center",
                textWrap: "balance" as never,
              }}
            >
              Вземи безплатното обучение и виж как в действителност може и ти да започнеш. След това ще можеш сам да решиш дали това е за теб.
            </p>
          </div>
        </motion.div>
        )}

        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={7} className="mt-32 flex flex-col items-center gap-7">
          <DesignEyebrow>Защо да го гледаш</DesignEyebrow>
          <div className="trust-pills-grid">
            {/* Pill 1 Beginners */}
            <div className="trust-pill" data-accent="purple">
              <div className="trust-pill__top">
                <div className="trust-pill__icon-wrap">
                  <I.User className="w-7 h-7" style={{ color: "#fff" }} />
                </div>
                <span className="trust-pill__badge">За начинаещи</span>
              </div>
              <div className="trust-pill__metric">
                <span className="trust-pill__big">100%</span>
              </div>
              <p className="trust-pill__copy">Създадено за хора без опит стъпка по стъпка от нулата.</p>
            </div>

            {/* Pill 2 Rating */}
            <div className="trust-pill" data-accent="purple">
              <div className="trust-pill__top">
                <div className="trust-pill__icon-wrap">
                  <I.Star className="w-7 h-7" style={{ color: "#fff" }} />
                </div>
                <span className="trust-pill__badge">Реални оценки</span>
              </div>
              <div className="trust-pill__metric">
                <span className="trust-pill__big">4.5<span style={{ fontSize: "0.55em", color: DC.fgMuted, fontWeight: 600 }}>/5</span></span>
              </div>
              <p className="trust-pill__copy">Оценено от <strong style={{ color: DC.fg }}>1,200+</strong> курсисти, които вече имат резултати.</p>
            </div>

            {/* Pill 3 Instant */}
            <div className="trust-pill" data-accent="purple">
              <div className="trust-pill__top">
                <div className="trust-pill__icon-wrap">
                  <I.Bolt className="w-7 h-7" style={{ color: "#fff" }} />
                </div>
                <span className="trust-pill__badge live">
                  <span className="trust-pill__dot" /> На живо
                </span>
              </div>
              <div className="trust-pill__metric">
                <span className="trust-pill__big">
                  0
                  <span style={{ fontSize: "0.55em", color: DC.fgMuted, fontWeight: 600 }}>&nbsp;сек.</span>
                </span>
              </div>
              <p className="trust-pill__copy">Гледаш веднага след регистрация без плащания, без чакане за имейл.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ─────────── STUDENTS CALLOUT ─────────── */

function StudentsCallout() {
  return (
    <section className="relative px-6 pt-4 pb-14 md:pb-20" aria-label="Социално доказателство">
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} variants={fadeIn}
        className="max-w-3xl mx-auto surface-accent rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-center gap-5"
      >
        <div className="flex flex-col items-center shrink-0">
          <div className="t-eyebrow mb-2">Students</div>
          <div className="flex items-center gap-1" style={{ color: "var(--accent)" }}>
            {Array.from({ length: 5 }).map((_, k) => <I.Star key={k} className="w-5 h-5" />)}
          </div>
          <div className="text-xs mt-1.5" style={{ color: "var(--text-3)" }}>4.9/5 от 1,200+ курсисти</div>
        </div>
        <p className="leading-relaxed text-center md:text-left" style={{ color: "var(--text-2)" }}>
          Не е твърде късно <span className="font-felt text-xl" style={{ color: "var(--accent)" }}>да наваксаш</span>.{" "}
          <span style={{ color: "var(--text)", fontWeight: 700 }}>AI рекламата обръща цялата игра.</span>{" "}
          Начинаещи вече изпреварват хора с години опит, защото теренът беше върнат обратно на нула.
        </p>
      </motion.div>
    </section>
  );
}

/* ─────────── COMPARISON ─────────── */

function Comparison() {
  return (
    <section id="izborut" className="relative px-6 py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
          className="max-w-5xl mb-14 mx-auto flex flex-col items-center text-center">
          <div className="mb-5"><DesignEyebrow>Ако си като повечето хора, които попадат на тази страница…</DesignEyebrow></div>
          <h2
            className="t-section"
            style={{ fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.02em", maxWidth: 1100, fontWeight: 700, textWrap: "balance" }}
          >
            Не си изостанал. Не си бил без късмет.<br />Просто са ти продали грешната възможност.
          </h2>
          <p className="mt-5 t-body" style={{ color: "var(--text-2)", maxWidth: 1080, fontStyle: "italic", fontSize: "clamp(14px, 1.1vw, 17px)", lineHeight: 1.55, textWrap: "balance" }}>
            <strong style={{ color: "var(--text-1)" }}>Dropshipping. Amazon FBA. SMM агенции. Crypto bots. Faceless YouTube.</strong> Всяко едно от тях изискваше пари, които нямаше. Време, което не можеше да отделиш или преднина, която нямаше как да наваксаш. <strong style={{ color: "var(--text-1)" }}>AI рекламата обръща цялата игра</strong> и начинаещи вече изпреварват хора с години опит, защото теренът беше върнат обратно на нула.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
            className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.002)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "inset 32.972px 5.495px 167.131px -4.375px rgba(140,30,30,0.10), inset 19.148px 3.191px 97.060px -3.750px rgba(140,30,30,0.13), inset 11.698px 1.950px 59.295px -3.125px rgba(140,30,30,0.16), inset 7.244px 1.207px 36.717px -2.500px rgba(140,30,30,0.20), inset 4.357px 0.726px 22.086px -1.875px rgba(140,30,30,0.24), inset 2.389px 0.398px 12.108px -1.250px rgba(140,30,30,0.28), inset 1.008px 0.168px 5.108px -0.625px rgba(140,30,30,0.32)" }}>
            <div className="t-eyebrow mb-4" style={{ color: "#ff8a8a", textAlign: "center" }}>Старите модели</div>
            <h3 className="font-alfabet-bold mb-7" style={{ fontSize: "clamp(20px, 2.4vw, 26px)", lineHeight: 1.15, textAlign: "center" }}>
              Защо „старите“ онлайн бизнеси продължават да те разочароват
            </h3>
            <ul className="space-y-4">
              {oldWay.map((t) => (
                <li key={t} className="flex items-start gap-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
                  <span className="w-6 h-6 rounded-full grid place-items-center text-xs font-bold mt-0.5 shrink-0" style={{ background: "var(--rust-soft)", color: "var(--rust)", border: "1px solid var(--rust-line)" }}>
                    ✕
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
            className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.002)", border: "1px solid rgba(255,255,255,0.30)", boxShadow: CARD_INNER_GLOW }}>
            <div className="t-eyebrow mb-4" style={{ color: "var(--accent)", textAlign: "center" }}>Защо AI рекламата е различна</div>
            <h3 className="font-alfabet-bold mb-7" style={{ fontSize: "clamp(20px, 2.4vw, 26px)", lineHeight: 1.15, textAlign: "center" }}>
              Системата, която превръща AI в реален доход, а не просто в още една отворена страница в Google
            </h3>
            <ul className="space-y-4">
              {newWay.map((t) => (
                <li key={t} className="flex items-start gap-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
                  <span className="w-6 h-6 rounded-full grid place-items-center shrink-0 mt-0.5 bg-accent">
                    <I.Check className="w-3.5 h-3.5" style={{ color: "var(--bg)" }} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHAT YOU'LL LEARN ─────────── */

function WhatYouLearn() {
  const items = [
    {
      n: "1",
      title: "Рамката „AI Edge“",
      body: "Защо 19-годишен човек с правилните умения вече може да побеждава агенции, които таксуват €10,000/месец и как точно да се позиционираш в тази празнина, преди всички останали.",
    },
    {
      n: "2",
      title: "Как да създаваш базови реклами с AI",
      body: "Един от най-добрите софтуери на пазара за бързо и ефективно създаване на реклами.",
    },
    {
      n: "3",
      title: "Вътрешна информация",
      body: "Точната информация на какво ниво се намира пазарът в момента.",
    },
  ];
  return (
    <section className="relative px-6 py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
          className="mb-14 mx-auto flex flex-col items-center text-center max-w-6xl">
          <div className="mb-5"><DesignEyebrow>Вътре в безплатното обучение</DesignEyebrow></div>
          <h2 className="t-section" style={{ fontSize: "clamp(20px, 2.4vw, 32px)", lineHeight: 1.25, letterSpacing: "-0.02em", fontWeight: 700, maxWidth: 1100, textWrap: "balance" }}>
            Системата, която превръща AI в реален доход, <br />а не просто в още една отворена страница в Google.
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((it) => (
            <motion.div key={it.n} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
              className="relative rounded-2xl p-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.002)", border: "1px solid rgba(255,255,255,0.30)", boxShadow: CARD_INNER_GLOW }}>
              <div aria-hidden className="absolute select-none pointer-events-none" style={{ top: -8, right: 18, fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(80px, 8vw, 120px)", lineHeight: 1, letterSpacing: "-0.04em", background: "linear-gradient(180deg, rgba(196,155,217,0.22) 0%, rgba(196,155,217,0) 75%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                0{it.n}
              </div>
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                  <span style={{ width: 18, height: 1, background: "var(--accent)" }} />
                  Стъпка 0{it.n}
                </div>
                <h3 className="font-alfabet-bold mb-3" style={{ fontSize: "clamp(19px, 1.7vw, 23px)", lineHeight: 1.2 }}>
                  {it.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--text-2)", fontSize: 15 }}>{it.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── DISCOVER (asymmetric: 1 tall + 2 short) ─────────── */

function Discover() {
  return (
    <section id="kakvo-shte-otkriesh" className="relative px-6 py-14 md:py-20" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
          className="max-w-3xl mb-14">
          <div className="mb-5"><DesignEyebrow>Какво ще откриеш</DesignEyebrow></div>
          <h2 className="t-section">Какво ще откриеш вътре?</h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* Tall left card */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}>
            <GlowCard interactive minHeight={360} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(28px, 4vw, 44px)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
                <span className="font-felt" style={{ color: DC.purple100, fontSize: "clamp(56px, 6vw, 72px)", lineHeight: 1 }}>{discover[0].n}</span>
                <div style={{ marginTop: 12 }}><DesignEyebrow>Главен модул</DesignEyebrow></div>
              </div>
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 2.6vw, 32px)", lineHeight: 1.15, color: DC.fg, margin: 0, marginBottom: 14, letterSpacing: "-0.01em" }}>
                  {discover[0].title}
                </h3>
                <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 16, lineHeight: 1.65, color: DC.fgMuted, margin: 0, maxWidth: 60 + "ch" }}>{discover[0].desc}</p>
              </div>
            </GlowCard>
          </motion.div>

          {/* 2 short right cards */}
          <div className="grid gap-5">
            {discover.slice(1).map((d, i) => (
              <motion.div
                key={d.n}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <GlowCard interactive style={{ padding: 26 }}>
                  <span className="font-felt" style={{ color: DC.purple100, fontSize: 36, lineHeight: 1, display: "block", marginBottom: 14 }}>{d.n}</span>
                  <h3 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.2, margin: 0, marginBottom: 8, color: DC.fg }}>{d.title}</h3>
                  <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 14.5, lineHeight: 1.6, color: DC.fgMuted, margin: 0 }}>{d.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHY NOW (editorial, not card grid) ─────────── */

function WhyNow() {
  const stats = [
    { big: "€740B", tag: "Глобален пазар", label: "Харчат се за реклама глобално всяка година и бизнесите плащат отново следващата година." },
    { big: "~3%", tag: "Възприемане", label: "От малките бизнеси в момента използват AI в рекламите си. Останалите 97% ще имат нужда от някой да им го настрои." },
    { big: "12–18м.", tag: "Времеви прозорец", label: "Прозорецът преди AI рекламата да стане „стандартът“ и лесните пари да изчезнат." },
  ];
  return (
    <section id="zashto-sega" className="relative px-6 py-14 md:py-20 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
          className="mb-12 max-w-[1280px] mx-auto text-center flex flex-col items-center">
          <div className="mb-5"><DesignEyebrow>Прозорецът</DesignEyebrow></div>
          <h2 className="t-section" style={{ fontSize: "clamp(24px, 3vw, 38px)", lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 700, textWrap: "balance" }}>
            Това работи само защото по-голямата част от света е с 18 месеца назад.
          </h2>
          <p className="mt-5 t-body" style={{ color: "var(--text-2)", maxWidth: 1280, fontStyle: "italic", fontSize: "clamp(14px, 1.1vw, 17px)", lineHeight: 1.55, textWrap: "balance" }}>
            На всеки 5–10 години се отваря нов рекламен канал. Малка група хора влизат рано и печелят сериозно, преди всички останали да разберат. <strong style={{ color: "var(--text-1)" }}>Facebook реклами през 2012. YouTube през 2016. TikTok през 2020.</strong> AI рекламата е този прозорец точно сега. И хората, които печелят от него, не са експертите с години опит. <strong style={{ color: "var(--text-1)" }}>Те са начинаещите.</strong> Защото експертите се опитват да приложат старите правила в нова игра. А начинаещите просто правят това, което работи сега.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((s) => (
            <motion.div key={s.big} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
              className="relative rounded-2xl p-8 text-center flex flex-col items-center" style={{ background: "rgba(255,255,255,0.002)", border: "1px solid rgba(255,255,255,0.30)", boxShadow: CARD_INNER_GLOW }}>
              <div className="mb-4 inline-flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                <span style={{ width: 18, height: 1, background: "var(--accent)" }} />
                {s.tag}
                <span style={{ width: 18, height: 1, background: "var(--accent)" }} />
              </div>
              <div className="mb-3" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4.4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff" }}>
                {s.big}
              </div>
              <p className="leading-relaxed" style={{ color: "var(--text-2)", fontSize: 15 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── ABOUT ─────────── */

function About() {
  return (
    <section id="ot-kogo" className="relative px-6 py-14 md:py-20 overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="mb-12 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="mb-5"><DesignEyebrow>От кого ще учиш</DesignEyebrow></div>
          <h2 className="t-section" style={{ fontSize: "clamp(22px, 2.8vw, 34px)", lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 700, maxWidth: 1100, textWrap: "balance" }}>
            Истински човек, който изгради това от нулата.
          </h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
          className="rounded-2xl mx-auto overflow-hidden" style={{ maxWidth: 1200, background: "rgba(255,255,255,0.002)", border: "1px solid rgba(255,255,255,0.30)", boxShadow: CARD_INNER_GLOW }}>
          <div className="grid lg:grid-cols-[420px_1fr]">
            <div className="relative" style={{ minHeight: 460, background: "#0E0E10" }}>
              <img
                src="/venelin.png"
                alt="Инструктор"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(14,14,16,0.85) 100%)" }} />
            </div>
            <div className="p-10 md:p-12 flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2" style={{ fontFamily: "Manrope, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                <span style={{ width: 18, height: 1, background: "var(--accent)" }} />
                Венелин Йорданов · Лектор
              </div>
              <div className="space-y-4 mb-6" style={{ color: "var(--text-2)", fontSize: "clamp(15px, 1.15vw, 17px)", lineHeight: 1.7 }}>
                <p>
                  Започнах точно от мястото, на което си ти в момента. <br /><strong style={{ color: "var(--text-1)" }}>Без пари. Без аудитория. Без диплома, която някой да цени.</strong>
                </p>
                <p>
                  Пробвах dropshipping. Пробвах работа от 9-5. Нищо не сработваше докато AI не промени какво един човек, дори работещ сам, може реално да направи.
                </p>
                <p>
                  В това безплатно обучение ще ти покажа точния път, който бих изминал, ако трябваше да започна отначало днес <strong style={{ color: "var(--text-1)" }}>без трите години грешки, през които преминах.</strong>
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {["€2.4M+ управлявани реклами", "15+ обучени студенти", "Активен собственик на такъв бизнес"].map((t) => (
                  <span key={t} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 12.5, fontFamily: "Manrope, sans-serif", color: DC.fg, background: "rgba(123,47,190,0.10)", border: "1px solid rgba(196,155,217,0.35)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── MODULES (curriculum row, not 8-card grid) ─────────── */

function Modules() {
  return (
    <section id="moduli" className="relative px-6 py-14 md:py-20">
      <div className="max-w-[1100px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5 max-w-4xl">
          <div>
            <div className="mb-5"><DesignEyebrow>Модули</DesignEyebrow></div>
            <h2 className="t-section">8 модула до първия клиент</h2>
          </div>
          <p className="t-small max-w-sm" style={{ color: "var(--text-3)" }}>
            Учебна програма, не теория. Всеки модул завършва с конкретно действие, което ще предприемеш.
          </p>
        </motion.div>

        {/* Curriculum list 2 columns, divided rows, no boxed cards */}
        <ol className="grid md:grid-cols-2 gap-x-12">
          {modules.map((m, i) => (
            <motion.li
              key={m.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.05, ease: EASE_OUT_QUINT }}
              className="border-t py-6 grid grid-cols-[auto_1fr] gap-6 items-start group"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="font-felt text-3xl leading-none mt-1" style={{ color: "var(--accent)" }}>{m.n}</span>
              <div>
                <h3 className="font-alfabet-bold mb-1.5" style={{ fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.2 }}>
                  {m.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--text-3)" }}>{m.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────── TESTIMONIALS (varied, not 4-identical) ─────────── */

function Testimonials() {
  return (
    <section id="rezultati" className="relative px-6 py-14 md:py-20" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
          className="mb-14 max-w-3xl">
          <div className="mb-5"><DesignEyebrow>Студенти</DesignEyebrow></div>
          <h2 className="t-section">Какво казват нашите студенти</h2>
        </motion.div>

        {/* Featured quote + 3 supporting quotes */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
          {/* Big featured */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={fadeIn}
          >
            <GlowCard interactive style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(28px, 4vw, 44px)", minHeight: 360 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 22, color: DC.purple100 }}>
                {Array.from({ length: 5 }).map((_, k) => <I.Star key={k} className="w-5 h-5" />)}
              </div>
              <blockquote style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.25, letterSpacing: "-0.01em", color: DC.fg, margin: 0 }}>
                „{testimonials[0].quote}“
              </blockquote>
              <figcaption style={{ marginTop: 32, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${DC.purple600}, ${DC.purple500})`, display: "grid", placeItems: "center", fontFamily: "Manrope, sans-serif", fontWeight: 800, color: "#fff" }}>
                    {testimonials[0].name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: DC.fg }}>{testimonials[0].name}</div>
                    <div style={{ fontSize: 12, color: DC.fgMuted }}>Студент в програмата</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: DC.fgMuted }}>Резултат</div>
                  <div style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: DC.purple100 }}>{testimonials[0].result}</div>
                </div>
              </figcaption>
            </GlowCard>
          </motion.div>

          {/* Stack of 3 compact */}
          <div className="grid gap-4">
            {testimonials.slice(1).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.07, ease: EASE_OUT_QUINT }}
              >
                <GlowCard interactive style={{ padding: 22 }}>
                  <blockquote style={{ fontFamily: "Manrope, sans-serif", fontSize: 15, lineHeight: 1.55, color: DC.fg, margin: 0 }}>„{t.quote}“</blockquote>
                  <figcaption style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 13, fontFamily: "Manrope, sans-serif" }}>
                    <div style={{ color: DC.fg, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ color: DC.purple100, fontWeight: 700 }}>{t.result}</div>
                  </figcaption>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */

function FAQ({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="chzv" className="relative px-6 py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_2fr] gap-12">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="flex flex-col items-center text-center lg:items-center lg:text-center">
          <div className="mb-5"><DesignEyebrow>Първоначални въпроси</DesignEyebrow></div>
          <h2 className="t-section" style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 700, textWrap: "balance" }}>Въпросите, които ти минават през ума в момента.</h2>
          <p className="t-small mt-5" style={{ color: "var(--text-3)", maxWidth: 520 }}>
            Не намираш отговор? Запази 10-минутна безплатна консултация след като отключиш видеото.
          </p>
          <div className="mt-6">
            <CTAPill onClick={onOpen} ariaLabel="Запази безплатна консултация">Запази безплатна консултация →</CTAPill>
          </div>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.04, ease: EASE_OUT_QUINT }}
                style={{
                  borderRadius: 16,
                  border: `1px solid ${isOpen ? "rgba(196,155,217,0.35)" : "rgba(196,155,217,0.14)"}`,
                  background: "rgba(255,255,255,0.002)",
                  boxShadow: isOpen
                    ? CARD_INNER_GLOW
                    : "inset 20px 4px 100px -3px rgba(140,80,200,0.10), inset 10px 2px 50px -2px rgba(140,80,200,0.14), inset 4px 0.7px 18px -1px rgba(140,80,200,0.20)",
                  overflow: "hidden",
                  transition: "border-color 240ms cubic-bezier(0.23,1,0.32,1), box-shadow 320ms cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 cursor-pointer"
                  style={{ padding: "20px 22px", background: "transparent", border: 0, textAlign: "left" }}
                >
                  <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: DC.fg, fontSize: "clamp(16px, 1.6vw, 18px)", lineHeight: 1.35 }}>{f.q}</span>
                  <span aria-hidden style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    width: 32, height: 32, borderRadius: "50%",
                    background: isOpen ? `linear-gradient(135deg, ${DC.purple600}, ${DC.purple500})` : "rgba(196,155,217,0.18)",
                    border: isOpen ? "none" : "1px solid rgba(196,155,217,0.35)",
                    color: "#fff",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 240ms cubic-bezier(0.23,1,0.32,1), background 240ms cubic-bezier(0.23,1,0.32,1)",
                  }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </button>
                <div aria-hidden={!isOpen} style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 500ms cubic-bezier(0.32,0.72,0,1), opacity 350ms ease" , opacity: isOpen ? 1 : 0 }}>
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <div style={{ padding: "0 22px 22px", color: DC.fgMuted, fontFamily: "Manrope, sans-serif", fontSize: 15, lineHeight: 1.65 }}>{f.a}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── FINAL CTA ─────────── */

function FinalCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <section id="cta" className="relative px-6 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
        className="max-w-[1200px] mx-auto relative overflow-hidden text-center"
        style={{
          padding: "clamp(48px, 6vw, 80px) clamp(28px, 5vw, 60px)",
          borderRadius: 24,
          border: "1px solid rgba(196,155,217,0.22)",
          background: "rgba(255,255,255,0.002)",
          boxShadow: CARD_INNER_GLOW,
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: "70%", height: "120%", background: "radial-gradient(closest-side, rgba(196,155,217,0.20), transparent 70%)", pointerEvents: "none", filter: "blur(20px)" }} />
        <div className="relative flex flex-col items-center gap-6">
          <DesignEyebrow>Едно последно нещо</DesignEyebrow>
          <h2 style={{ margin: 0, fontFamily: "alfabet, sans-serif", fontWeight: 800, fontSize: "clamp(22px, 2.4vw, 32px)", letterSpacing: "-0.02em", color: DC.fg, lineHeight: 1.2, textWrap: "balance", maxWidth: 820, textTransform: "uppercase" }}>
            До 2 години AI ще управлява половината реклами по света. Въпросът е само един: ще си <em style={{ fontStyle: "italic", color: DC.purple100 }}>консуматор</em>, или <em style={{ fontStyle: "italic", color: DC.purple100 }}>създател</em>?
          </h2>
          <div className="mt-2 cta-pulse" style={{ display: "inline-flex", borderRadius: 999, animation: "ctaPulse 3.2s ease-in-out infinite" }}>
            <CTAPill big onClick={onOpen} ariaLabel="Получи мигновен достъп">Получи мигновен достъп →</CTAPill>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 4 }}>
            {[
              { label: "100% Безплатно", sub: "Без скрити такси" },
              { label: "Мигновен достъп", sub: "Гледаш веднага" },
              { label: "Без кредитна карта", sub: "Без плащания" },
            ].map((b) => (
              <div key={b.label} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "10px 16px", borderRadius: 999,
                border: "1px solid rgba(196,155,217,0.22)",
                background: "rgba(255,255,255,0.02)",
                fontFamily: "Manrope, sans-serif",
              }}>
                <span aria-hidden style={{
                  width: 22, height: 22, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: `linear-gradient(135deg, ${DC.purple600}, ${DC.purple500})`,
                  color: "#fff", flexShrink: 0,
                  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.25)",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", lineHeight: 1.15 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: DC.fg }}>{b.label}</span>
                  <span style={{ fontSize: 11, color: DC.fgMuted }}>{b.sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */

function Footer() {
  const eyebrowStyle: React.CSSProperties = { fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: DC.fg, fontFamily: "Manrope, sans-serif", marginBottom: 18, fontWeight: 700 };
  const linkStyle: React.CSSProperties = { fontFamily: "Manrope, sans-serif", color: DC.fgMuted, fontSize: 15, textDecoration: "none", transition: "color 200ms cubic-bezier(0.23,1,0.32,1)" };
  return (
    <footer className="px-6" style={{ padding: "40px 24px 24px" }}>
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 24,
            border: "1px solid rgba(196,155,217,0.18)",
            background: "rgba(255,255,255,0.002)",
            boxShadow: CARD_INNER_GLOW,
            padding: "clamp(28px, 3vw, 44px) clamp(28px, 4vw, 56px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-center">
            <div className="flex flex-col items-center">
              <img src="/logo-white.png" alt="AI Brand Scale" style={{ width: "clamp(220px, 18vw, 260px)", height: "auto", display: "block" }} />
            </div>

            <div className="flex flex-col items-center gap-4">
              <DesignEyebrow>Навигация</DesignEyebrow>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12, fontFamily: "Manrope, sans-serif", fontSize: 14 }}>
                {[
                  ["#home", "Начало"],
                  ["#izborut", "Изборът"],
                  ["#kakvo-shte-otkriesh", "Какво ще откриеш"],
                  ["#zashto-sega", "Защо сега"],
                  ["#chzv", "ЧЗВ"],
                ].map(([h, l]) => (
                  <li key={h}><a href={h} className="logi-foot-link" style={linkStyle}>{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4">
              <DesignEyebrow>Социални мрежи</DesignEyebrow>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { Icon: I.Inst, label: "Instagram", href: "https://www.instagram.com/aibrandscale.io?igsh=MWdxbG02NGl4YWd4ag%3D%3D&utm_source=qr" },
                  { Icon: I.TT, label: "TikTok", href: "https://www.tiktok.com/@venelinnyordan0v" },
                ].map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="logi-social-chip"
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(85,43,105,0.45)", color: "#fff",
                      border: "1px solid rgba(196,155,217,0.25)",
                      transition: "transform 200ms cubic-bezier(0.23,1,0.32,1), background 220ms cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-divider" aria-hidden />
          <div style={{ marginTop: 24, position: "relative", zIndex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: "Manrope, sans-serif", fontSize: 13 }}>
            <a href="/privacy" className="logi-foot-link" style={linkStyle}>Privacy Policy</a>
            <span aria-hidden style={{ color: DC.fgMuted, opacity: 0.5 }}>|</span>
            <a href="/terms" className="logi-foot-link" style={linkStyle}>Terms &amp; Conditions</a>
          </div>
          <div style={{ marginTop: 18, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: 12 } as React.CSSProperties} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-center md:text-left">
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 12, color: DC.fgMuted, lineHeight: 1.6, maxWidth: 760 }}>
              Този сайт не е част от Facebook или Meta Platforms, Inc. FACEBOOK е регистрирана търговска марка на Meta Platforms, Inc.
            </p>
            <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontSize: 12, color: DC.fgDim, whiteSpace: "nowrap" }}>
              © {new Date().getFullYear()} aibrandscale.io
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .logi-foot-link { transition: color 200ms cubic-bezier(0.23, 1, 0.32, 1); }
        @media (hover: hover) and (pointer: fine) {
          .logi-foot-link:hover { color: ${DC.purple100}; }
          .logi-social-chip:hover { background: ${DC.purple500} !important; transform: translateY(-2px); }
        }
        .footer-divider {
          position: relative;
          margin-top: 36px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 20%, rgba(255,255,255,0.22) 80%, transparent 100%);
        }
        .footer-divider::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 64px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent 0%, #F7CBFF 50%, transparent 100%);
          box-shadow:
            0 0 12px 2px rgba(247,203,255,0.55),
            0 0 28px 6px rgba(196,155,217,0.35);
          filter: blur(0.3px);
        }
        .footer-divider::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          height: 220px;
          background:
            radial-gradient(ellipse 50% 90% at 50% 0%, rgba(247,203,255,0.28) 0%, rgba(196,155,217,0.18) 25%, rgba(123,47,190,0.08) 55%, transparent 80%);
          pointer-events: none;
          filter: blur(2px);
        }
      `}</style>
    </footer>
  );
}

/* ─────────── OPT-IN MODAL ─────────── */

function OptInModal({ open, onClose, onUnlock }: { open: boolean; onClose: () => void; onUnlock: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const phoneDigits = phone.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);
  const phoneFormatted = phoneDigits.replace(/^(\d{3})(\d{0,3})(\d{0,3}).*/, (_m, a, b, c) =>
    [a, b, c].filter(Boolean).join(" "),
  );
  const nameValid = name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
  const phoneValid = phoneDigits.length === 9 && /^[2-9]/.test(phoneDigits);
  const canSubmit = nameValid && emailValid && phoneValid && status !== "loading";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (hp || status === "loading") return;
    const next: typeof errors = {};
    if (!nameValid) next.name = "Моля, въведи името си.";
    if (!emailValid) next.email = "Невалиден имейл адрес.";
    if (!phoneValid) next.phone = phoneDigits.length !== 9 ? "Трябват 9 цифри след +359." : "Невалиден български номер.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: `+359${phoneDigits}`,
          hp,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setStatus("idle");
        if (data.field === "email") setErrors({ email: data.message });
        else if (data.field === "phone") setErrors({ phone: data.message });
        else setErrors({ form: data.message || "Възникна грешка. Опитай отново." });
        return;
      }
      // Success: close modal, unlock video, scroll into view smoothly.
      onClose();
      // small delay so the modal close animation finishes before the unlock pulse
      setTimeout(() => {
        onUnlock();
        const target = document.querySelector('[data-hero-video]') as HTMLElement | null;
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 220);
      setStatus("idle");
    } catch {
      setStatus("idle");
      setErrors({ form: "Няма връзка със сървъра. Опитай отново." });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-backdrop" onClick={onClose}
          role="dialog" aria-modal="true" aria-labelledby="modal-title"
        >
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Затвори" className="modal-close-page" type="button">
            <I.X className="w-5 h-5" />
          </button>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT_QUINT }}
            className="modal-card" onClick={(e) => e.stopPropagation()}
          >
            <span className="modal-eyebrow">{status === "success" ? "Достъп отключен" : "Безплатно обучение"}</span>
            <h3 id="modal-title" className="font-alfabet-bold" style={{ fontSize: "clamp(24px, 3vw, 30px)", textAlign: "center", marginBottom: 18, lineHeight: 1.15, letterSpacing: "-0.01em", textTransform: status === "success" ? "none" : "uppercase" }}>
              {status === "success" ? "Готово!" : "Отключи достъп"}
            </h3>

            {status === "success" ? (
              <div style={{ color: "var(--text-2)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <p style={{ margin: 0, lineHeight: 1.55 }}>
                  ✓ Готово! Провери имейла си в следващите <strong style={{ color: "var(--text)" }}>60 секунди</strong> линкът към достъпа е на път. Не виждаш имейла? Провери папка „Промоции“ или „Спам“.
                </p>
                <CTAPill onClick={onClose} ariaLabel="Затвори">Затвори</CTAPill>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 18, width: "100%" }}>
                {/* Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", width: "100%" }}>
                  <label htmlFor="optin-name" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "Manrope, sans-serif", fontWeight: 600, textAlign: "center" }}>
                    Име
                  </label>
                  <div className={`field-shell${errors.name ? " is-error" : ""}`}>
                    <input
                      id="optin-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                      autoComplete="given-name"
                      placeholder="Име и фамилия"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "optin-name-err" : undefined}
                      className="field-input"
                    />
                  </div>
                  {errors.name && (
                    <p id="optin-name-err" role="alert" className="field-err">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", width: "100%" }}>
                  <label htmlFor="optin-email" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "Manrope, sans-serif", fontWeight: 600, textAlign: "center" }}>
                    Имейл
                  </label>
                  <div className={`field-shell${errors.email ? " is-error" : ""}`}>
                    <input
                      id="optin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                      autoComplete="email"
                      placeholder="example@email.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "optin-email-err" : undefined}
                      className="field-input"
                    />
                  </div>
                  {errors.email && (
                    <p id="optin-email-err" role="alert" className="field-err">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", width: "100%" }}>
                  <label htmlFor="optin-phone" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "Manrope, sans-serif", fontWeight: 600, textAlign: "center" }}>
                    Телефон
                  </label>
                  <div className={`field-shell${errors.phone ? " is-error" : ""}`}>
                    <span className="field-prefix" aria-hidden>
                      <span className="field-flag" role="img" aria-label="България">
                        <span style={{ background: "#FFFFFF" }} />
                        <span style={{ background: "#00966E" }} />
                        <span style={{ background: "#D62612" }} />
                      </span>
                      +359
                    </span>
                    <input
                      id="optin-phone"
                      type="tel"
                      required
                      value={phoneFormatted}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9);
                        setPhone(d);
                        if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="888 123 456"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "optin-phone-err" : undefined}
                      maxLength={11}
                      className="field-input"
                      style={{ letterSpacing: "0.05em" }}
                    />
                  </div>
                  {errors.phone && (
                    <p id="optin-phone-err" role="alert" className="field-err">{errors.phone}</p>
                  )}
                </div>

                <input type="text" name="company" tabIndex={-1} autoComplete="off" value={hp}
                  onChange={(e) => setHp(e.target.value)} aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />

                {errors.form && (
                  <p role="alert" className="field-err" style={{ textAlign: "center", marginTop: 4 }}>{errors.form}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                  className="optin-submit"
                  style={{ marginTop: 4, opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "wait" : "pointer" }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="spinner" aria-hidden="true" style={{ marginRight: 10 }} />
                      Изпращаме…
                    </>
                  ) : (
                    <>Виж как може да го направиш и ти&nbsp;→</>
                  )}
                </button>

                <ul style={{
                  margin: "4px 0 0",
                  padding: 0,
                  listStyle: "none",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "var(--text-3)",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: 16,
                  rowGap: 8,
                  textAlign: "center",
                }}>
                  {["100% безплатно", "Мигновен достъп", "Без кредитна карта", "10 мин. безплатна консултация"].map((t) => (
                    <li key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }} aria-hidden>
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
                <p style={{ margin: "6px auto 0", fontSize: 11, lineHeight: 1.5, color: "var(--text-3)", textAlign: "center", whiteSpace: "nowrap", opacity: 0.75 }}>
                  С натискането на бутона приемаш{" "}
                  <a href="/privacy" target="_blank" style={{ color: "var(--text-2)", textDecoration: "underline" }}>политиката за поверителност</a>.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── PAGE ─────────── */

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const handleUnlock = () => {
    setUnlocked(true);
    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#7B2FBE", "#C49BD9", "#F7CBFF", "#ffffff"];
      const fire = (originX: number) =>
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 55,
          origin: { x: originX, y: 0.7 },
          colors,
          scalar: 1.1,
        });
      fire(0.2);
      fire(0.8);
      setTimeout(() => fire(0.5), 180);
    }).catch(() => {});
  };
  return (
    <>
      <a href="#main-content" className="skip-link">Към съдържанието</a>
      <PromoBar />
      <main id="main-content" className="overflow-x-hidden w-full">
        <Hero onOpen={open} unlocked={unlocked} />
        <Comparison />
        <WhatYouLearn />
        <WhyNow />
        <About />
        <FAQ onOpen={open} />
        <FinalCTA onOpen={open} />
      </main>
      <Footer />
      <OptInModal open={modalOpen} onClose={close} onUnlock={handleUnlock} />
    </>
  );
}
