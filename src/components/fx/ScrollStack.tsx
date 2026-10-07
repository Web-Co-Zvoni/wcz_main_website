/**
 * Cards that pin one after another and pile up into a deck as the page scrolls.
 * Adapted from React Bits' ScrollStack (MIT) for this site: TypeScript, window scroll only,
 * and no Lenis instance of its own — the page's smooth scroll (App.tsx) already drives
 * window.scrollY, so this just reads it every frame while the stack is near the screen.
 * The deck releases when its bottom card reaches the end marker instead of at mid-screen.
 * Layout offsets are measured without transforms, so pinned cards can't feed back into
 * their own maths. Cards further back in the deck dim instead of blurring (cheaper).
 */
import { useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { cn } from "../../utils/cn";
import { remScale } from "../../utils/remScale";

export function ScrollStackItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-stack-card data-active="false" className={cn("group/stack relative origin-top [backface-visibility:hidden]", className)}>
      {children}
      {/* darkens the card as more cards land on top of it */}
      <span data-stack-shade aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-ink opacity-0" />
    </div>
  );
}

type Props = {
  children: ReactNode;
  className?: string;
  /** gap between cards in the flow, px */
  itemDistance?: number;
  /** how much less each card shrinks than the one before */
  itemScale?: number;
  /** how far each pinned card sits below the previous one, px */
  itemStackDistance?: number;
  /**
   * where the first card pins: a share of the viewport height (px floor applied), or "center"
   * to pin the finished deck in the middle of the screen
   */
  stackPosition?: number | "center";
  /** never pin higher than this, px — keeps the deck clear of the fixed header */
  minTop?: number;
  /** with "center": how far above the true middle the deck sits, as a share of the viewport height */
  lift?: number;
  /**
   * an element beside the stack (a heading column) that should hold still, centred on the
   * finished deck, for exactly as long as the deck is pinned — moved by the same maths, so the
   * two let go on the same frame
   */
  asideRef?: RefObject<HTMLElement | null>;
  /** where a card reaches its final scale, as a share of the viewport height */
  scaleEndPosition?: number;
  baseScale?: number;
  /** opacity of the shade on each card one step back in the deck */
  dimAmount?: number;
  /** extra scroll, as viewport heights, the finished deck stays pinned for */
  hold?: number;
};

/** document offset from layout alone — ignores transforms, unlike getBoundingClientRect */
const docTop = (el: HTMLElement) => {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
};

const progress = (v: number, start: number, end: number) => (v <= start ? 0 : v >= end ? 1 : (v - start) / (end - start));

export default function ScrollStack({
  children,
  className,
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = 0.2,
  scaleEndPosition = 0.1,
  baseScale = 0.85,
  dimAmount = 0.18,
  hold = 0.35,
  minTop = 110,
  lift = 0,
  asideRef,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const end = endRef.current;
    if (!root || !end) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-card]"));
    const shades = cards.map((c) => c.querySelector<HTMLElement>("[data-stack-shade]"));

    cards.forEach((c, i) => {
      c.style.marginBottom = i < cards.length - 1 ? `${itemDistance / 16}rem` : "0px";
      c.style.willChange = reduce ? "" : "transform";
    });
    if (reduce) {
      cards.forEach((c) => (c.style.transform = ""));
      return;
    }

    let tops: number[] = [];
    let endTop = 0;
    let lastH = 0;
    let asideTop = 0;
    let asideH = 0;
    let beside = false;
    let vh = window.innerHeight;
    /** px distances below are design px — scale them with the root font size */
    let unit = remScale();
    const aside = asideRef?.current ?? null;
    const measure = () => {
      vh = window.innerHeight;
      unit = remScale();
      tops = cards.map(docTop);
      endTop = docTop(end);
      lastH = cards[cards.length - 1]?.offsetHeight ?? 0;
      if (aside) {
        asideTop = docTop(aside);
        asideH = aside.offsetHeight;
        // it only holds still while it stands beside the stack (it sits above it on narrow screens)
        beside = aside.offsetLeft + aside.offsetWidth <= root.offsetLeft;
      }
    };
    measure();

    const last: string[] = [];
    const update = () => {
      const step = itemStackDistance * unit;
      const y = window.scrollY;
      const deckH = lastH + step * (cards.length - 1);
      const pinAt = Math.max(minTop * unit, stackPosition === "center" ? (vh - deckH) / 2 - vh * lift : vh * stackPosition);
      const scaleEnd = vh * scaleEndPosition;
      // the deck lets go when its bottom card would pass the end marker, so it never spills out
      const pinEnd = endTop - pinAt - step * (cards.length - 1) - lastH;

      // the card currently on top of the deck
      let topIndex = -1;
      for (let i = 0; i < cards.length; i++) if (y >= tops[i] - pinAt - step * i) topIndex = i;
      // the card being read: the newest one that has come a third of the screen up toward its pin
      let reading = 0;
      for (let i = 0; i < cards.length; i++) if (y >= tops[i] - pinAt - step * i - vh * 0.3) reading = i;

      if (aside && beside) {
        // the aside's top sits level with the middle of the finished deck, from the moment the
        // first card pins until the deck lets go; outside that window it rides with the page
        const pinStart0 = tops[0] - pinAt;
        const yc = Math.min(Math.max(y, pinStart0), pinEnd);
        const t = `translate3d(0,${(yc + pinAt + deckH / 2 - asideH / 2 - asideTop).toFixed(1)}px,0)`;
        if (aside.style.transform !== t) aside.style.transform = t;
      } else if (aside && aside.style.transform) aside.style.transform = "";

      cards.forEach((card, i) => {
        const pinStart = tops[i] - pinAt - step * i;
        const s = progress(y, pinStart, tops[i] - scaleEnd);
        const scale = 1 - s * (1 - (baseScale + i * itemScale));
        const ty = y < pinStart ? 0 : Math.min(y, pinEnd) - pinStart;
        const t = `translate3d(0,${ty.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
        if (last[i] !== t) card.style.transform = last[i] = t;
        // the card being read lights up (CSS reads data-active)
        const on = String(i === reading);
        if (card.dataset.active !== on) card.dataset.active = on;
        const shade = shades[i];
        if (shade) shade.style.opacity = String(i < topIndex ? Math.min(0.7, (topIndex - i) * dimAmount) : 0);
      });
    };

    let raf = 0;
    let near = false;
    const loop = () => {
      update();
      raf = near ? requestAnimationFrame(loop) : 0;
    };
    // only run per-frame while the stack is around the viewport
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        if (near && !raf) raf = requestAnimationFrame(loop);
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    io.observe(root);

    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);
    update();

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, dimAmount, minTop, lift, asideRef, reduce]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {children}
      {/* room for the finished deck to stay pinned before it scrolls away */}
      <div aria-hidden style={{ height: `${hold * 100}vh` }} />
      <div ref={endRef} aria-hidden className="h-px w-full" />
    </div>
  );
}
