import { useEffect, useRef } from "react";

/**
 * Sparks streaming down the hero beam. Most ride the core; a few drift in the
 * outer glow. Near the impact they fan out along the card and fade.
 */

const WIDTH = 360;
const COLORS = ["244,255,248", "205,255,226", "140,255,190", "61,245,140", "150,255,110"];

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

const gauss = () => {
  // Box–Muller, clipped
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.max(-3, Math.min(3, Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)));
};

export default function BeamParticles({ left, height, count = 520 }: { left: string; height: number; count?: number }) {
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

    let h = Math.max(1, heightRef.current);
    const sparks: Spark[] = Array.from({ length: count }, () => spawn(h, true));

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
      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute top-0 -translate-x-1/2 mix-blend-screen"
      style={{ left, width: WIDTH, height }}
    />
  );
}
