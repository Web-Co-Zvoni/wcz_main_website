/**
 * Photo morph between pages. Clicking a card lifts its photo into an overlay and it starts growing
 * at once, toward where the new page will show it (a guess, then the real spot). Meanwhile the
 * page behind sinks into the dark, the new page is swapped in underneath, the photo's course bends
 * to the spot marked `data-morph-target` (a <MorphImage>) and it lands there, becoming it. From the
 * swap on the photo flies *under* the new page's content (anything at z-[2], e.g. <MorphLayer>,
 * the page's words), so the shading and the words arrive together with the photo. On the
 * way the small card photo crossfades to the large one the new page uses. Back reverses it: the
 * photo leaves at once, the old page comes back at its scroll position and the photo settles into
 * the card it came from.
 */
import { animate, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { cn } from "../utils/cn";
import { remScale } from "../utils/remScale";
import { applyPop, commit, currentEntry, go, onPop, parseRoute, type Entry, type MorphRecord } from "./router";
import { jumpTo, lockScroll, transition } from "./scroll";

type Box = MorphRecord["box"];

export type OpenOptions = {
  href: string;
  /** the photo as the card shows it (already loaded) */
  small: string;
  /** the photo the new page shows */
  large: string;
  rect: DOMRect;
  radius?: number;
  /** the card's darkening over the photo, as a CSS background, faded out on the way */
  shade?: string;
  /** the card's brightness at the click … */
  light?: number;
  /** … and at rest, for the landing on the way back */
  restLight?: number;
};

type Flight = {
  small: string;
  large: string;
  from: Box;
  shade?: string;
  light: number;
  /** the large photo is showing from the start (on the way back) */
  largeFirst: boolean;
};

type MorphState = {
  /** a photo is in the air — the spot it lands on stays hidden */
  flying: boolean;
  /** the page's own content waits: before the swap, and on a page being left */
  holdContent: boolean;
  open: (o: OpenOptions) => void;
};

const MorphContext = createContext<MorphState>({ flying: false, holdContent: false, open: () => {} });
export const useMorph = () => useContext(MorphContext);

const LIFT_EASE = [0.22, 1, 0.36, 1] as const;
/** moves from the very first frame after the click, then glides in */
const FLY_EASE = [0.25, 0.9, 0.3, 1] as const;
const FLY_TIME = 1.25;
/** how long the old page takes to sink into the dark before it is swapped */
const COVER_TIME = 0.16;
/** how long the course takes to bend from the guessed spot to the real one */
const RETARGET_MS = 260;

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const boxOf = (r: DOMRect, radius: number): Box => ({ x: r.left, y: r.top, w: r.width, h: r.height, r: radius });
const boxStyle = (b: Box) => ({ left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: b.r });
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Box, b: Box, t: number): Box => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });
const smooth01 = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};
const place = (el: HTMLElement, b: Box) => {
  el.style.left = `${b.x}px`;
  el.style.top = `${b.y}px`;
  el.style.width = `${b.w}px`;
  el.style.height = `${b.h}px`;
  el.style.borderRadius = `${b.r}px`;
};

/** where each kind of page showed its photo last time (at this window width), to aim at straight away */
const landed = new Map<string, { box: Box; vw: number }>();

/** best guess at the new page's photo before that page exists — mirrors the layout of NichePage / ConceptPage */
function guessTarget(kind: string): Box {
  const vw = document.documentElement.clientWidth;
  const hit = landed.get(kind);
  if (hit && hit.vw === vw) return hit.box;
  const rem = 16 * remScale();
  if (kind === "niche") return { x: 0, y: 0, w: vw, h: Math.max(38 * rem, window.innerHeight), r: 0 };
  // the browser window on a concept page: the 88rem container, its padding, the frame's padding
  const wrap = Math.min(vw, 88 * rem);
  const inset = (vw >= 768 ? 2 * rem : rem) + 0.625 * rem + 1;
  const w = wrap - inset * 2;
  return { x: (vw - wrap) / 2 + inset, y: 32.5 * rem, w, h: (w * 9) / 16, r: 1.25 * rem };
}

/** move `el` from `from` to wherever `to()` says now, over the flight — so the destination may shift on the way */
const fly = (el: HTMLElement, from: Box, to: () => Box) =>
  animate(0, 1, { duration: FLY_TIME, ease: FLY_EASE, onUpdate: (p) => place(el, mix(from, to(), p)) });

function targetBox(): Box | null {
  const el = document.querySelector<HTMLElement>("[data-morph-target]");
  if (!el) return null;
  return boxOf(el.getBoundingClientRect(), parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0);
}

/** send keyboard and screen-reader users to the new page's heading */
function focusHeading() {
  document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
}

export function MorphProvider({ children }: { children: ReactNode }) {
  const [flight, setFlight] = useState<Flight | null>(null);
  /** the new page is in place under the flying photo — its words can come in already */
  const [swapped, setSwapped] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const largeRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  const begin = (f: Flight) => {
    transition.busy = true;
    lockScroll(true);
    flushSync(() => {
      setFlight(f);
      setSwapped(false);
    });
  };
  const end = () => {
    flushSync(() => {
      setFlight(null);
      setSwapped(false);
    });
    transition.busy = false;
    lockScroll(false);
  };

  const open = useCallback(async (o: OpenOptions) => {
    if (transition.busy) return;
    if (reduced()) {
      go(o.href);
      focusHeading();
      return;
    }
    const from = boxOf(o.rect, o.radius ?? 0);
    const record: MorphRecord = { path: currentEntry().path, small: o.small, large: o.large, box: from, shade: o.shade, restLight: o.restLight };
    begin({ small: o.small, large: o.large, from, shade: o.shade, light: o.light ?? 1, largeFirst: false });
    const box = boxRef.current!;
    const backdrop = backdropRef.current!;

    // 1 — the photo sets off at once toward where the new page will most likely show it,
    //     while the page behind sinks into the dark
    const kind = parseRoute(new URL(o.href, location.href).pathname).page;
    const guess = guessTarget(kind);
    let real: Box | null = null;
    let realAt = 0;
    let realScroll = 0;
    // once the page is there it can be scrolled while the photo lands: the spot moves with the page
    const to = () =>
      real ? mix(guess, { ...real, y: real.y - (window.scrollY - realScroll) }, smooth01((performance.now() - realAt) / RETARGET_MS)) : guess;
    const flight = fly(box, from, to);
    if (shadeRef.current) animate(shadeRef.current, { opacity: 0 }, { duration: 0.6, ease: "easeOut" });
    animate(box, { filter: "brightness(1)" }, { duration: 0.6 });
    await animate(backdrop, { opacity: 1 }, { duration: COVER_TIME, ease: "easeOut" });

    // 2 — swap the page underneath; the course bends to where the photo really lives there
    commit(o.href, { morph: record });
    setSwapped(true);
    // from here the photo flies beneath the new page's words and shading (z-[2]), and the dark
    // sinks under both, uncovering the rest of the page
    box.style.zIndex = "1";
    box.style.boxShadow = "none";
    backdrop.style.zIndex = "0";
    backdrop.style.pointerEvents = "none";
    jumpTo(0);
    await frame();
    real = targetBox();
    realAt = performance.now();
    realScroll = window.scrollY;
    lockScroll(false);
    if (real) landed.set(kind, { box: real, vw: document.documentElement.clientWidth });
    animate(backdrop, { opacity: 0 }, { duration: 0.4, ease: "easeOut" });

    // 3 — it lands and becomes the page's photo
    await flight;
    if (!real) {
      await animate(box, { opacity: 0 }, { duration: 0.3 });
      end();
      return;
    }
    end();
    focusHeading();
  }, []);

  // Back to the page a photo came from: fly it home into its card
  useEffect(() => {
    const back = (from: Entry, to: Entry) => {
      const m = from.state.morph;
      if (!m || m.path !== to.path || transition.busy || reduced()) return false;
      const start = targetBox();
      if (!start) return false;

      (async () => {
        begin({ small: m.small, large: m.large, from: start, shade: m.shade, light: 1, largeFirst: true });
        const box = boxRef.current!;
        const backdrop = backdropRef.current!;

        // the photo heads straight back to its card while this page sinks into the dark
        const flight = fly(box, start, () => m.box);
        if (shadeRef.current) animate(shadeRef.current, { opacity: 1 }, { duration: 0.5, delay: 0.25 });
        if (largeRef.current) animate(largeRef.current, { opacity: 0 }, { duration: 0.45, delay: 0.2 });
        animate(box, { filter: `brightness(${m.restLight ?? 1})` }, { duration: 0.5, delay: 0.25 });
        await animate(backdrop, { opacity: 1 }, { duration: COVER_TIME, ease: "easeOut" });

        applyPop();
        const y = to.state.scrollY ?? 0;
        jumpTo(y);
        await frame();
        jumpTo(y);
        animate(backdrop, { opacity: 0 }, { duration: 0.5, ease: "easeOut" });

        await flight;
        await animate(box, { opacity: 0 }, { duration: 0.28, ease: "easeOut" });
        end();
      })();
      return true;
    };
    onPop(back);
    return () => onPop(null);
  }, []);

  return (
    <MorphContext.Provider value={{ flying: flight !== null, holdContent: flight !== null && !swapped, open }}>
      {children}
      {flight && (
        <>
          {/* under the header, which is the same on every page */}
          <div ref={backdropRef} aria-hidden className="fixed inset-0 z-[45] bg-ink" style={{ opacity: 0 }} />
          <div
            ref={boxRef}
            aria-hidden
            className="fixed z-[46] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] will-change-transform"
            style={{ ...boxStyle(flight.from), filter: `brightness(${flight.light})` }}
          >
            <img src={flight.small} alt="" className="absolute inset-0 size-full object-cover" />
            <img
              ref={largeRef}
              src={flight.large}
              alt=""
              className="absolute inset-0 size-full object-cover"
              style={{ opacity: flight.largeFirst ? 1 : 0 }}
              onLoad={(e) => {
                if (!flight.largeFirst) animate(e.currentTarget, { opacity: 1 }, { duration: 0.45 });
              }}
            />
            {flight.shade && (
              <div ref={shadeRef} className="absolute inset-0" style={{ background: flight.shade, opacity: flight.largeFirst ? 0 : 1 }} />
            )}
          </div>
        </>
      )}
    </MorphContext.Provider>
  );
}

/**
 * The spot a flying photo lands on. Hidden while a photo is in the air. Shows the small photo at
 * once and the large one over it when loaded — the same pair the flight crossfaded. Shading or
 * labels over it go in a <MorphLayer>, so they lie over the photo while it is still flying.
 */
export function MorphImage({ small, large, alt, className }: { small: string; large: string; alt: string; className?: string }) {
  const { flying } = useMorph();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) setLoaded(true);
  }, [large]);

  return (
    <div data-morph-target className={cn("relative overflow-hidden bg-coal", className)} style={{ visibility: flying ? "hidden" : "visible" }}>
      <img src={small} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
      <img
        ref={imgRef}
        src={large}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

/**
 * Laid over a morph target (shading, labels), above the flying photo: it fades in as the new page
 * arrives, so the photo darkens and gets its words while it grows, not after it lands.
 */
export function MorphLayer({ children, className }: { children: ReactNode; className?: string }) {
  const { holdContent } = useMorph();
  return (
    <motion.div
      className={cn("pointer-events-none absolute z-[2]", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: holdContent ? 0 : 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** content that rises in as soon as its page is in place — while the photo is still flying in */
export function Landed({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  const { holdContent } = useMorph();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
      animate={holdContent ? { opacity: 0, y: 20, filter: "blur(6px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: holdContent ? 0 : 0.03 + i * 0.05, ease: LIFT_EASE }}
    >
      {children}
    </motion.div>
  );
}

/** an <a> that opens its page by flying `photo` (the element showing it) into that page */
export function morphClick(
  e: React.MouseEvent,
  open: (o: OpenOptions) => void,
  o: Omit<OpenOptions, "rect"> & { el: Element | null }
) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !o.el) return;
  e.preventDefault();
  const { el, ...rest } = o;
  open({ ...rest, rect: el.getBoundingClientRect(), radius: rest.radius ?? (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) });
}
