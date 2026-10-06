/**
 * Light glowing out of a card's frame from two points on opposite corners: a soft red halo
 * with a white core spilling outside the card, a halftone of dots fading out of it, and the
 * border itself lit where the light sits. The two lights glide round the frame from corner to
 * corner, rest on each corner for a while, then move on — always opposite each other.
 *
 * Drop it inside a `relative` card with a solid background: the halo layers sit behind the
 * card (negative z-index), so only what spills past the edge shows; the lit border sits on top.
 */
import { useEffect, useRef, useState } from "react";

type Props = {
  /** corner radius of the card, px */
  radius: number;
  /** how long a light rests on a corner, ms */
  hold?: number;
  /** travel speed between corners, px per second */
  speed?: number;
};

/** how far the halo layers reach past the card, px */
const SPILL = 240;

/** a point `s` px along the rounded rect's outline, starting just after the top-left corner, clockwise */
function pointAt(s: number, W: number, H: number, r: number): [number, number] {
  const a = W - 2 * r;
  const b = H - 2 * r;
  const q = (Math.PI * r) / 2;
  const P = 2 * a + 2 * b + 4 * q;
  s = ((s % P) + P) % P;
  const arc = (cx: number, cy: number, from: number, len: number): [number, number] => {
    const t = from + len / r;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
  };
  if (s < a) return [r + s, 0];
  s -= a;
  if (s < q) return arc(W - r, r, -Math.PI / 2, s);
  s -= q;
  if (s < b) return [W, r + s];
  s -= b;
  if (s < q) return arc(W - r, H - r, 0, s);
  s -= q;
  if (s < a) return [W - r - s, H];
  s -= a;
  if (s < q) return arc(r, H - r, Math.PI / 2, s);
  s -= q;
  if (s < b) return [0, H - r - s];
  s -= b;
  return arc(r, r, Math.PI, s);
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function GlowFrame({ radius, hold = 2600, speed = 230 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const g1 = useRef<SVGRadialGradientElement>(null);
  const g2 = useRef<SVGRadialGradientElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    const { w: W, h: H } = box;
    if (!el || !W) return;
    const r = Math.min(radius, W / 2, H / 2);
    const a = W - 2 * r;
    const b = H - 2 * r;
    const q = (Math.PI * r) / 2;
    const P = 2 * a + 2 * b + 4 * q;
    // the middles of the four corners along the outline, from the top-left one round to it again
    const stops = [-q / 2, a + q / 2, a + q + b + q / 2, 2 * a + 2 * q + b + q / 2, P - q / 2];
    const moves = stops.slice(1).map((c, i) => ((c - stops[i]) / speed) * 1000);
    const cycle = moves.reduce((x, y) => x + y, 0) + hold * 4;

    const along = (t: number) => {
      t %= cycle;
      for (let i = 0; i < 4; i++) {
        if (t < hold) return stops[i];
        t -= hold;
        if (t < moves[i]) return stops[i] + (stops[i + 1] - stops[i]) * ease(t / moves[i]);
        t -= moves[i];
      }
      return stops[4];
    };

    const place = (t: number) => {
      const s = along(t);
      const [x1, y1] = pointAt(s, W, H, r);
      const [x2, y2] = pointAt(s + P / 2, W, H, r);
      el.style.setProperty("--l1x", `${x1.toFixed(1)}px`);
      el.style.setProperty("--l1y", `${y1.toFixed(1)}px`);
      el.style.setProperty("--l2x", `${x2.toFixed(1)}px`);
      el.style.setProperty("--l2y", `${y2.toFixed(1)}px`);
      g1.current?.setAttribute("cx", String(x1));
      g1.current?.setAttribute("cy", String(y1));
      g2.current?.setAttribute("cx", String(x2));
      g2.current?.setAttribute("cy", String(y2));
    };

    place(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    let visible = false;
    const loop = (now: number) => {
      if (!start) start = now;
      place(now - start);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [box, radius, hold, speed]);

  // the halo layers are SPILL px bigger on every side, so their gradients are offset by it
  const at = (n: 1 | 2) => `calc(var(--l${n}x) + ${SPILL}px) calc(var(--l${n}y) + ${SPILL}px)`;
  const halo = `radial-gradient(90px circle at ${at(1)}, rgba(255,255,255,0.16), transparent 70%), radial-gradient(90px circle at ${at(2)}, rgba(255,255,255,0.16), transparent 70%), radial-gradient(210px circle at ${at(1)}, rgba(255,59,71,0.28), transparent 72%), radial-gradient(210px circle at ${at(2)}, rgba(255,59,71,0.28), transparent 72%)`;
  const dotsMask = `radial-gradient(180px circle at ${at(1)}, #000, transparent 75%), radial-gradient(180px circle at ${at(2)}, #000, transparent 75%)`;
  const inset = 0.75;

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]">
      {/* the glow spilling out past the edge */}
      <div className="absolute -z-10" style={{ inset: -SPILL, background: halo }} />
      {/* a halftone of dots fading out of it */}
      <div
        className="absolute -z-10 opacity-40"
        style={{
          inset: -SPILL,
          backgroundImage: "radial-gradient(rgba(255,140,146,0.95) 0.9px, transparent 1.5px)",
          backgroundSize: "6px 6px",
          maskImage: dotsMask,
          WebkitMaskImage: dotsMask,
        }}
      />
      {/* the frame itself, lit where the light sits: white at the core, then red */}
      {box.w > 0 && (
        <svg className="absolute inset-0 size-full overflow-visible">
          <defs>
            {[g1, g2].map((g, i) => (
              <radialGradient key={i} ref={g} id={`glow-frame-${i}`} gradientUnits="userSpaceOnUse" r="230">
                <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="0.2" stopColor="#ff7a82" stopOpacity="0.8" />
                <stop offset="0.6" stopColor="#ff3b47" stopOpacity="0.3" />
                <stop offset="1" stopColor="#ff3b47" stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {[0, 1].map((i) => (
            <rect
              key={i}
              x={inset}
              y={inset}
              width={box.w - inset * 2}
              height={box.h - inset * 2}
              rx={radius - inset}
              fill="none"
              stroke={`url(#glow-frame-${i})`}
              strokeWidth={1.5}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
