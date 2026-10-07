import { useEffect, useRef } from "react";

/**
 * Sparks streaming down the hero beam. Most ride the core; a few drift in the
 * outer glow. Near the impact they fan out along the card and fade.
 * Fine glittering dust clings to the beam's edges, flaring out with the skirt near
 * the impact; only a few grains stray further. It sinks, drifts or barely moves.
 */

/** the sparks' strip, centred on the beam */
const SPARK_W = 360;
/** the dust spreads a little wider */
const WIDTH = 900;
const COLORS = ["255,250,246", "255,214,206", "255,150,150", "255,82,96", "255,120,80"];

type Spark = {
  x: number;
  y: number;
  vy: number;
  size: number;
  phase: number;
  twinkle: number;
  color: string;
  fan: number;
};

/** dust speed classes, px/s — all slower than the slowest spark */
const TIERS = [
  { share: 0.4, vy: [22, 46], sway: [0.5, 2] }, // sinking
  { share: 0.35, vy: [6, 16], sway: [1, 3] }, // drifting
  { share: 0.25, vy: [0.5, 3], sway: [1.5, 4] }, // all but hanging in the air
];

type Ember = {
  x: number;
  y: number;
  vy: number;
  sway: number;
  swayHz: number;
  size: number;
  phase: number;
  twinkle: number;
  color: string;
  glow: number;
  age: number;
  life: number;
};

const gauss = () => {
  // Box–Muller, clipped
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.max(-3, Math.min(3, Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)));
};

const range = ([lo, hi]: number[]) => lo + Math.random() * (hi - lo);

export default function BeamParticles({
  left,
  height,
  count = 520,
  embers = 170,
}: {
  left: string;
  height: number;
  count?: number;
  embers?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heightRef = useRef(height);
  heightRef.current = height;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (h: number, anywhere: boolean): Spark => {
      const wide = Math.random() < 0.3;
      return {
        x: gauss() * (wide ? 30 : 11),
        y: anywhere ? Math.random() * h : -Math.random() * 60,
        vy: (wide ? 50 : 90) + Math.random() * (wide ? 110 : 260),
        size: wide ? 0.5 + Math.random() * 0.9 : 0.6 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        twinkle: 2 + Math.random() * 6,
        color: wide ? COLORS[2 + Math.floor(Math.random() * 3)] : COLORS[Math.floor(Math.random() * 3)],
        fan: gauss(),
      };
    };

    const spawnEmber = (h: number, anywhere: boolean): Ember => {
      // hugs the beam's edge; roughly one grain in twelve strays out into the dark
      const stray = Math.random() < 0.08;
      const off = Math.min(WIDTH / 2 - 60, (stray ? 40 : 12) - Math.log(1 - Math.random()) * (stray ? 150 : 16));
      const glow = Math.exp(-(off - 12) / 60);
      let roll = Math.random();
      const tier = TIERS.find((tr) => (roll -= tr.share) < 0) ?? TIERS[0];
      const life = 7 + Math.random() * 10;
      return {
        x: (Math.random() < 0.5 ? -1 : 1) * off,
        y: anywhere ? Math.random() * h : -Math.random() * 40,
        vy: range(tier.vy),
        sway: range(tier.sway),
        swayHz: 0.15 + Math.random() * 0.4,
        size: 0.35 + Math.random() * (0.35 + 0.35 * glow),
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 2,
        // pale glitter by the beam, a warmer red on the strays
        color: COLORS[stray ? 1 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 3)],
        glow,
        age: 0,
        life,
      };
    };

    let h = Math.max(1, heightRef.current);
    const sparks: Spark[] = Array.from({ length: count }, () => spawn(h, true));
    const motes: Ember[] = Array.from({ length: embers }, () => spawnEmber(h, true));

    const resize = () => {
      h = Math.max(1, heightRef.current);
      canvas.width = Math.round(WIDTH * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
    };
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000) * (reduce ? 0.15 : 1);
      last = now;
      t += dt;
      if (Math.abs(heightRef.current - h) > 1) resize();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, WIDTH, h);
      ctx.globalCompositeOperation = "lighter";
      const cx = WIDTH / 2;
      const fanStart = h - 140;

      // dust: fades in and out over its life, so the near-still grains don't hang forever
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.age += dt;
        m.y += m.vy * dt;
        if (m.age > m.life || m.y > h + 4) {
          // burnt out → reappear anywhere; fell off the bottom → re-enter at the top
          motes[i] = spawnEmber(h, m.age > m.life);
          continue;
        }
        const depth = Math.max(0, m.y) / h;
        // follow the beam's skirt as it flares into the card
        const flare = 1 + 2.2 * depth ** 5;
        const x = cx + m.x * flare + Math.sin(t * m.swayHz * Math.PI * 2 + m.phase) * m.sway;
        const life = Math.sin((Math.PI * m.age) / m.life);
        const top = Math.min(1, depth / 0.18);
        const bottom = 1 - Math.max(0, (m.y - (h - 40)) / 44);
        const glint = 0.55 + 0.45 * Math.sin(t * m.twinkle + m.phase) ** 2;
        const a = Math.max(0, life * top * bottom * glint * (0.3 + 0.6 * m.glow));
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(${m.color},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // sparks stay in their original strip
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - SPARK_W / 2, 0, SPARK_W, h);
      ctx.clip();
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        // gather speed as they fall, like they're being pulled into the impact
        s.y += s.vy * dt * (0.7 + (0.6 * Math.max(0, s.y)) / h);
        if (s.y > h + 4) {
          sparks[i] = spawn(h, false);
          continue;
        }
        // hug the core up high, loosen as they fall, fan out along the card in the last stretch
        const depth = Math.max(0, s.y) / h;
        const spread = 0.28 + 0.72 * depth;
        const k = Math.max(0, (s.y - fanStart) / 140);
        const x = cx + s.x * spread + s.fan * k * k * 120;
        // barely there at the top, full strength low down, gone at the very bottom
        const top = Math.min(1, depth / 0.6) ** 1.6;
        const bottom = 1 - Math.max(0, (s.y - (h - 30)) / 34);
        const glint = 0.45 + 0.55 * Math.sin(t * s.twinkle + s.phase) ** 2;
        const a = Math.max(0, top * bottom * glint);
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(${s.color},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        // a short streak behind the faster ones, along the beam
        if (s.vy > 220) {
          ctx.fillStyle = `rgba(${s.color},${(a * 0.35).toFixed(3)})`;
          ctx.fillRect(x - s.size * 0.4, s.y - s.vy * 0.05, s.size * 0.8, s.vy * 0.05);
        }
      }
      ctx.restore();
      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [count, embers]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute top-0 -translate-x-1/2 mix-blend-screen"
      style={{ left, width: WIDTH, height }}
    />
  );
}
