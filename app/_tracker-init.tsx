"use client";

import { useEffect } from "react";
import { track, getAnonId, markPageStart } from "@/lib/tracker";

const SCROLL_BUCKETS = [25, 50, 75, 90, 100];
const TIME_BUCKETS_MS = [10_000, 30_000, 60_000, 120_000, 300_000];
const CLICK_HISTORY_WINDOW_MS = 2000;
const RAGE_CLICK_THRESHOLD = 3;
const RAGE_CLICK_RADIUS_PX = 30;
const SWIPE_MIN_DISTANCE = 50;
const SWIPE_MAX_TIME_MS = 500;

type ClickHist = { x: number; y: number; t: number };

export default function TrackerInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { __aibsInit?: boolean }).__aibsInit) return;
    (window as unknown as { __aibsInit?: boolean }).__aibsInit = true;

    // Initial PageView
    track("PageView", { props: { initial: true } });
    track("SessionStart", { props: { anon_id: getAnonId() } });

    // SPA navigation → fire PageView on client-side route changes.
    // App Router uses history.pushState / replaceState for <Link> navigations.
    let lastPath = window.location.pathname + window.location.search;
    const fireSpaPageView = () => {
      const cur = window.location.pathname + window.location.search;
      if (cur === lastPath) return;
      lastPath = cur;
      markPageStart();
      track("PageView", { props: { spa: true } });
    };
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      const r = origPush.apply(this, args);
      queueMicrotask(fireSpaPageView);
      return r;
    };
    history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      const r = origReplace.apply(this, args);
      queueMicrotask(fireSpaPageView);
      return r;
    };
    const onPopState = () => fireSpaPageView();
    window.addEventListener("popstate", onPopState);

    // Scroll depth tracker
    const firedScroll = new Set<number>();
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (window.scrollY / docHeight) * 100;
      for (const b of SCROLL_BUCKETS) {
        if (pct >= b && !firedScroll.has(b)) {
          firedScroll.add(b);
          track("ScrollDepth", { props: { depth_pct: b } });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Time on page buckets
    const timeTimers: ReturnType<typeof setTimeout>[] = [];
    for (const ms of TIME_BUCKETS_MS) {
      timeTimers.push(setTimeout(() => track("TimeOnPage", { props: { seconds: ms / 1000 } }), ms));
    }

    // Click tracking with rage / dead detection
    const clickHistory: ClickHist[] = [];
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const rect = { x: e.clientX, y: e.clientY };
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;

      let clickable = target;
      while (clickable && clickable !== document.body) {
        const tag = clickable.tagName;
        if (tag === "A" || tag === "BUTTON" || clickable.getAttribute("role") === "button" || clickable.onclick) break;
        clickable = clickable.parentElement as HTMLElement;
      }
      const tag = (clickable && clickable.tagName) || target.tagName;
      const text = (clickable?.textContent || target.textContent || "").trim().slice(0, 80);
      const href = (clickable as HTMLAnchorElement)?.href || null;
      const id = clickable?.id || null;
      const dataTrack = clickable?.getAttribute?.("data-track") || null;

      track("Click", {
        props: {
          tag, text, href, id, data_track: dataTrack,
          x_pct: +((rect.x / vw) * 100).toFixed(2),
          y_pct: +((rect.y / vh) * 100).toFixed(2),
          x_px: rect.x, y_px: rect.y,
        },
      });

      if (href && /^https?:\/\//.test(href) && !href.includes(window.location.host)) {
        track("OutboundLink", { props: { href, text } });
      }

      if (tag === "BODY" || tag === "HTML" || (!href && !clickable?.onclick && tag !== "BUTTON" && tag !== "A" && tag !== "INPUT")) {
        track("DeadClick", { props: { tag, text } });
      }

      const now = Date.now();
      clickHistory.push({ x: rect.x, y: rect.y, t: now });
      while (clickHistory.length && now - clickHistory[0].t > CLICK_HISTORY_WINDOW_MS) clickHistory.shift();
      const cluster = clickHistory.filter((c) => Math.hypot(c.x - rect.x, c.y - rect.y) < RAGE_CLICK_RADIUS_PX);
      if (cluster.length >= RAGE_CLICK_THRESHOLD) {
        track("RageClick", { props: { count: cluster.length, x_pct: +((rect.x / vw) * 100).toFixed(2), y_pct: +((rect.y / vh) * 100).toFixed(2), tag, text } });
        clickHistory.length = 0;
      }
    };
    document.addEventListener("click", onClick, { capture: true });

    // Hover on CTAs (intent signal)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      let el: HTMLElement | null = target;
      while (el && el !== document.body) {
        const dt = el.getAttribute?.("data-track");
        if (dt && dt.startsWith("cta-")) {
          track("Hover", { props: { data_track: dt, text: (el.textContent || "").trim().slice(0, 60) } });
          return;
        }
        el = el.parentElement;
      }
    };
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    // Copy detection
    const onCopy = () => {
      const sel = window.getSelection?.()?.toString().slice(0, 200) || "";
      track("Copy", { props: { text: sel, length: sel.length } });
    };
    document.addEventListener("copy", onCopy);

    // Tab visibility
    const onVis = () => track(document.visibilityState === "hidden" ? "TabHidden" : "TabVisible");
    document.addEventListener("visibilitychange", onVis);

    // Before unload — final time on page
    const onUnload = () => {
      track("PageLeave", { props: { time_on_page_ms: Date.now() - performance.timeOrigin } });
    };
    window.addEventListener("pagehide", onUnload);
    window.addEventListener("beforeunload", onUnload);

    // JS errors
    const onError = (e: ErrorEvent) => track("JSError", { props: { message: e.message, src: e.filename, line: e.lineno, col: e.colno } });
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      const msg = (r && (r.message || r.toString?.())) || "unknown";
      track("PromiseRejection", { props: { message: String(msg).slice(0, 300) } });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // Orientation + viewport
    const onOrient = () => track("OrientationChange", { props: { orientation: window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape" } });
    window.addEventListener("orientationchange", onOrient);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => track("ViewportResize", { props: { w: window.innerWidth, h: window.innerHeight } }), 400);
    };
    window.addEventListener("resize", onResize);

    // Touch & swipe
    let touchStart: { x: number; y: number; t: number } | null = null;
    let lastTouchEnd = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t) return;
      touchStart = { x: t.clientX, y: t.clientY, t: Date.now() };
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      track("TouchStart", { props: { x_pct: +((t.clientX / vw) * 100).toFixed(2), y_pct: +((t.clientY / vh) * 100).toFixed(2) } });
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t || !touchStart) return;
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      const dt = Date.now() - touchStart.t;
      const dist = Math.hypot(dx, dy);
      lastTouchEnd = Date.now();
      if (dist >= SWIPE_MIN_DISTANCE && dt <= SWIPE_MAX_TIME_MS) {
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
        track("Swipe", { props: { direction: dir, distance_px: Math.round(dist), duration_ms: dt } });
      } else if (dt > 500 && dist < 10) {
        track("LongPress", { props: { duration_ms: dt } });
      }
      touchStart = null;
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    // Suppress unused var lint by referencing
    void lastTouchEnd;

    return () => {
      window.removeEventListener("scroll", onScroll);
      timeTimers.forEach((t) => clearTimeout(t));
      document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onUnload);
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("orientationchange", onOrient);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("popstate", onPopState);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  return null;
}
