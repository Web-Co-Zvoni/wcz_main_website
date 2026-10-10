/**
 * 3D cover-flow carousel: the current card faces you, its neighbours turn away on either side,
 * and a blurred copy of the current photo washes the background.
 * Adapted from the "3-d-coverflow-carousel" component: TypeScript + Tailwind in the site's
 * colours, Czech labels, keys only while the carousel has focus (the original listened on the
 * whole window, so arrows in the form would flip slides), autoplay that also rests off screen,
 * and the background crossfading through small thumbnails instead of a swapped full-size image.
 * The card facing you can hand itself to `onOpen` for the page morph; the carousel remembers
 * which card that was, so coming back shows the same one.
 */
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { cn } from "../../utils/cn";

export type CoverFlowItem = {
  img: string;
  /** small version for the blurred background */
  ambient: string;
  alt: string;
  tag?: string;
  title: string;
  subtitle?: string;
  /** page the card opens */
  href: string;
};

type Props = {
  items: CoverFlowItem[];
  ctaText: string;
  /** open card i yourself (a plain left click on its link), given the card element */
  onOpen?: (i: number, e: MouseEvent, card: HTMLElement | null) => void;
  /** the card to face you first (otherwise the one that faced you when the carousel was last left) */
  initialIndex?: number;
  autoplayDelay?: number;
  label?: string;
  prevLabel?: string;
  nextLabel?: string;
  slideLabel?: (n: number) => string;
  className?: string;
};

/** where a card sits for each distance from the current one (beyond ±2 they wait out of sight) */
const POSES: Record<number, { t: string; o: number; z: number; f: string }> = {
  0: { t: "translateX(0px) scale(1) rotateY(0deg)", o: 1, z: 30, f: "brightness(1)" },
  1: { t: "translateX(20rem) scale(0.84) rotateY(-24deg)", o: 0.65, z: 20, f: "brightness(0.7)" },
  2: { t: "translateX(35.9375rem) scale(0.68) rotateY(-38deg)", o: 0.38, z: 10, f: "brightness(0.5) blur(1px)" },
  [-1]: { t: "translateX(-20rem) scale(0.84) rotateY(24deg)", o: 0.65, z: 20, f: "brightness(0.7)" },
  [-2]: { t: "translateX(-35.9375rem) scale(0.68) rotateY(38deg)", o: 0.38, z: 10, f: "brightness(0.5) blur(1px)" },
};
const HIDDEN = { t: "translateX(0px) scale(0.4) rotateY(0deg)", o: 0, z: 0, f: "brightness(0.4) blur(2px)" };

/** the darkening over each card's photo, so its words read (also used by the page morph) */
export const COVER_SHADE = "linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.1) 25%,rgba(0,0,0,0.68) 60%,rgba(0,0,0,0.96) 100%)";

/** the card that faced you when the carousel was last left */
let resumeIndex = 0;

export default function CoverFlow({
  items,
  ctaText,
  onOpen,
  initialIndex,
  autoplayDelay = 5000,
  label = "Galerie",
  prevLabel = "Předchozí",
  nextLabel = "Další",
  slideLabel = (n) => `Snímek ${n}`,
  className,
}: Props) {
  const [current, setCurrent] = useState(() => initialIndex ?? (resumeIndex < items.length ? resumeIndex : 0));
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = items.length;

  useEffect(() => {
    resumeIndex = current;
  }, [current]);

  const openCard = (i: number) => (e: MouseEvent) => onOpen?.(i, e, cardRefs.current[i]);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (held || !onScreen || total <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(next, autoplayDelay);
    return () => window.clearInterval(id);
  }, [held, onScreen, total, next, autoplayDelay]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
  };

  if (!total) return null;

  const arrowCls =
    "absolute top-1/2 z-40 grid size-14 -translate-y-1/2 place-items-center rounded-full border border-paper/20 bg-black/55 text-paper shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md transition-[background-color,border-color,transform] duration-200 hover:scale-105 hover:border-signal hover:bg-signal";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={cn("relative w-full select-none overflow-hidden py-12 focus-visible:outline-offset-[-4px]", className)}
    >
      {/* the current photo, blurred, washing the background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]">
        {items.map((it, i) => (
          <img
            key={it.ambient}
            src={it.ambient}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full scale-[1.15] object-cover blur-[32px] brightness-[0.3] transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,18,21,0.3)_0%,rgba(20,18,21,0.92)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        {/* the stage */}
        <div className="relative mb-9 flex h-[36.875rem] w-full items-center justify-center [perspective:1600px]">
          {items.map((it, i) => {
            let off = (i - current + total) % total;
            if (off > total / 2) off -= total;
            const pose = POSES[off] ?? HIDDEN;
            const centre = off === 0;
            return (
              <div
                key={it.img}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => !centre && setCurrent(i)}
                aria-hidden={!centre}
                className={cn(
                  "absolute h-[35rem] w-[23.125rem] overflow-hidden rounded-[1.625rem] border border-paper/12 bg-[#0b0a0c] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none",
                  centre ? "shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(255,59,71,0.22)]" : "cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:brightness-110"
                )}
                style={{ transform: pose.t, opacity: pose.o, zIndex: pose.z, filter: pose.f }}
              >
                <img src={it.img} alt={it.alt} draggable={false} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                {/* the card facing you opens its page */}
                {centre && <a href={it.href} onClick={openCard(i)} aria-label={`${ctaText}: ${it.title}`} className="absolute inset-0 z-[15] rounded-[inherit]" />}
                <div className="pointer-events-none absolute inset-0 z-10" style={{ background: COVER_SHADE }} />

                {/* only the card facing you carries its words */}
                <div
                  className={cn(
                    "pointer-events-none relative z-20 flex size-full flex-col justify-between px-6 pb-7 pt-6 text-center transition-[opacity,transform] duration-500",
                    centre ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                >
                  <div className="text-right">
                    <span className="rounded-full border border-paper/25 bg-black/30 px-3 py-1 text-[0.8125rem] font-medium text-paper/90">{it.tag}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="display text-[2.15rem] uppercase leading-[1.05] tracking-[0.02em] [text-shadow:0_3px_12px_rgba(0,0,0,0.95)]">{it.title}</h3>
                    {it.subtitle && <p className="text-[1.0625rem] font-medium text-paper/85 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">{it.subtitle}</p>}
                    <span className="mx-auto my-3 h-0.5 w-9 rounded-full bg-accent shadow-[0_0_8px_rgba(255,59,71,0.8)]" />
                    <a
                      href={it.href}
                      onClick={openCard(i)}
                      tabIndex={centre ? 0 : -1}
                      className="group/cta pointer-events-auto inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-[0.9062rem] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent"
                    >
                      {ctaText}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" strokeWidth={2.6} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={prev} aria-label={prevLabel} className={cn(arrowCls, "left-6")}>
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>
        <button type="button" onClick={next} aria-label={nextLabel} className={cn(arrowCls, "right-6")}>
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>

        {/* dots */}
        <div className="z-30 flex items-center justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.img}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={slideLabel(i + 1)}
              aria-current={i === current}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current ? "w-7 bg-accent shadow-[0_0_10px_rgba(255,59,71,0.7)]" : "w-2 bg-paper/25 hover:bg-paper/45"
              )}
            />
          ))}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {items[current]?.title} — {current + 1} / {total}
      </span>
    </div>
  );
}
