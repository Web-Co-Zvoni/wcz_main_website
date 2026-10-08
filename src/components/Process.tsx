import { animate, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PROCESS } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { BentoCard } from "./Bento";
import { BellMark, Button, EASE, ShineBorder } from "./ui";

/* ---------------- one small working picture per milestone ---------------- */

/** Den 1 — a ringing phone and the call timer running up to its 15 minutes */
function CallVisual({ lit }: { lit: boolean }) {
  const reduce = useReducedMotion();
  const [secs, setSecs] = useState(0);
  const total = PROCESS.callMinutes * 60;
  useEffect(() => {
    if (!lit) return;
    if (reduce) return setSecs(total);
    const c = animate(0, total, { duration: 2.2, ease: "easeOut", onUpdate: (v) => setSecs(Math.round(v)) });
    return () => c.stop();
  }, [lit, reduce, total]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-4">
      <span className="relative grid size-14 place-items-center rounded-2xl bg-signal text-white shadow-[0_10px_30px_-8px_rgba(255,59,71,0.8)]">
        {lit && <span className="pulse-ring rounded-2xl text-accent" />}
        <Phone className={cn("size-6", lit && "animate-ringshake")} fill="currentColor" />
      </span>
      <span className="display text-[2rem] tabular-nums leading-none text-paper/90">
        {mm}:{ss}
      </span>
    </div>
  );
}

/** Den 3 — the 72 hours closing into a full ring */
function DraftVisual({ lit }: { lit: boolean }) {
  return (
    <div className="relative size-[5.5rem]">
      <svg viewBox="0 0 88 88" className="size-full -rotate-90">
        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(244,239,236,0.08)" strokeWidth="6" />
        <motion.circle
          cx="44"
          cy="44"
          r="38"
          fill="none"
          stroke="url(#draft-ring)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: lit ? 1 : 0 }}
          transition={{ duration: 2, ease: EASE, delay: 0.2 }}
        />
        <defs>
          <linearGradient id="draft-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e0182a" />
            <stop offset="1" stopColor="#ff8a8f" />
          </linearGradient>
        </defs>
      </svg>
      <span className="display absolute inset-0 grid place-items-center text-[1.1875rem]">{PROCESS.draftLabel}</span>
    </div>
  );
}

/** Den 14 — two weeks of days filling in, the last one is launch day */
function LaunchVisual({ lit }: { lit: boolean }) {
  const days = PROCESS.launchDays;
  return (
    <div className="grid w-max grid-cols-7 gap-1.5">
      {Array.from({ length: days }, (_, d) => (
        <motion.span
          key={d}
          initial={false}
          animate={{
            backgroundColor: lit ? (d === days - 1 ? "#ff3b47" : "rgba(255,59,71,0.38)") : "rgba(244,239,236,0.07)",
            scale: lit && d === days - 1 ? [1, 1.35, 1] : 1,
          }}
          transition={{ duration: 0.35, delay: lit ? 0.2 + d * 0.09 : 0 }}
          className={cn("size-[1.125rem] rounded-[0.3125rem]", d === days - 1 && lit && "shadow-[0_0_14px_var(--color-accent)]")}
        />
      ))}
    </div>
  );
}

/** Pořád — the bell keeps ringing */
function RingVisual({ lit }: { lit: boolean }) {
  return (
    <span className="relative grid size-[4.5rem] place-items-center text-accent">
      {lit && <span className="pulse-ring rounded-full" />}
      {lit && <span className="pulse-ring rounded-full [animation-delay:1.1s]" />}
      <BellMark className={cn("size-14 drop-shadow-[0_0_14px_var(--color-accent)]", lit && "animate-ringshake")} strokeWidth={8} compact />
    </span>
  );
}

const VISUALS = [CallVisual, DraftVisual, LaunchVisual, RingVisual];

/* ---------------- tiles ---------------- */

function Milestone({ s, i, lit }: { s: (typeof PROCESS.steps)[number]; i: number; lit: boolean }) {
  const Visual = VISUALS[i];
  return (
    <BentoCard as="li" delay={0.08 * i} edge="bright" className={cn("transition-[border-color] duration-700", lit && "border-accent/30")}>
      <div className="flex h-full min-h-[25rem] flex-col px-7 pb-8 pt-[4.75rem] xl:px-8">
        <div className="flex h-[6rem] items-center">
          <Visual lit={lit} />
        </div>
        <motion.p
          animate={{ color: lit ? "#f4efec" : "rgba(244,239,236,0.18)" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="display mt-auto pt-8 text-[clamp(2.6rem,4vw,4.4rem)] leading-[0.9] tracking-[-0.04em]"
        >
          {s.meta}
        </motion.p>
        <motion.div animate={{ opacity: lit ? 1 : 0.4 }} transition={{ duration: 0.8, ease: EASE }}>
          <h3 className="display-soft mt-4 text-[clamp(1.25rem,1.6vw,1.6rem)] leading-tight">{s.title}</h3>
          <p className="mt-2.5 text-[0.9688rem] leading-relaxed text-paper/65 xl:text-[1.0312rem]">{cz(s.text)}</p>
        </motion.div>
      </div>
    </BentoCard>
  );
}

/** the guarantee — the number counts up when the tile arrives */
function GuaranteeTile() {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(PROCESS.discount);
    const c = animate(0, PROCESS.discount, { duration: 1.4, ease: EASE, delay: 0.3, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce]);

  return (
    <BentoCard tone="signal" delay={0.1} edge="bright" className="md:col-span-2">
      <ShineBorder width={1.5} duration={9} colors={["rgba(255,120,128,0.8)"]} />
      <div className="relative flex h-full flex-col justify-between gap-8 p-8 lg:flex-row lg:items-end xl:p-11">
        <div className="min-w-0">
          <p ref={ref} className="display glow-text text-[clamp(5rem,9vw,9.5rem)] leading-[0.85] tracking-[-0.05em] text-accent">
            {n} %
          </p>
          <p className="display-soft mt-6 max-w-[24ch] text-[clamp(1.3rem,1.9vw,1.9rem)] leading-tight">{cz(PROCESS.guarantee)}</p>
        </div>
        <Button href="#kontakt" size="lg" className="shrink-0 self-start lg:self-end xl:px-8 xl:py-5 xl:text-[1.0312rem]">
          {PROCESS.guaranteeCta}
          <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
        </Button>
      </div>
    </BentoCard>
  );
}

function TitleTile() {
  return (
    <BentoCard edge="bright" className="md:col-span-2">
      <div className="relative flex h-full min-h-[21.25rem] flex-col justify-end p-8 xl:p-11">
        {/* a wire with light running along it — the road from the call to the site */}
        <svg aria-hidden viewBox="0 0 600 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-6 h-[6rem] w-full">
          <path d="M-10 120 C120 120 150 40 280 44 S470 130 610 30" fill="none" stroke="rgba(244,239,236,0.08)" strokeWidth="2" />
          <motion.path
            d="M-10 120 C120 120 150 40 280 44 S470 130 610 30"
            fill="none"
            stroke="#ff3b47"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,59,71,0.9))" }}
            initial={{ pathLength: 0.12, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
        </svg>
        <h2 className="display relative max-w-[16ch] text-[clamp(2.6rem,4.4vw,5rem)] leading-[0.98]">{cz(PROCESS.title)}</h2>
      </div>
    </BentoCard>
  );
}

export default function Process() {
  const rowRef = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(0);

  // the current fills as the row climbs the screen; each node lights when it reaches it
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start 85%", "end 70%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  useMotionValueEvent(fill, "change", (v) => {
    let n = 0;
    for (let i = 0; i < 4; i++) if (v >= i / 3 - 0.01) n = i + 1;
    setLit(v <= 0 ? 0 : n);
  });
  const done = lit === 4;

  return (
    <section id="postup" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TitleTile />
          <GuaranteeTile />
        </div>

        <div className="relative mt-4">
          <ol ref={rowRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.steps.map((s, i) => (
              <Milestone key={s.title} s={s} i={i} lit={lit > i} />
            ))}
          </ol>

          {/* the current threading through all four tiles, from the first node to the last */}
          <div aria-hidden className="pointer-events-none absolute left-[2.25rem] right-[calc((100%-3rem)/4-2.25rem)] top-[2.5rem] z-30 hidden lg:block">
            <div className="relative h-px bg-paper/12">
              <motion.div
                style={{ scaleX: fill }}
                className="absolute inset-0 origin-left bg-gradient-to-r from-signal via-accent to-[#ffb4b8] shadow-[0_0_14px_var(--color-accent)]"
              />
              <div
                className={cn("absolute inset-y-0 left-full w-[calc(100%/3-4.75rem)] transition-opacity duration-700", done ? "opacity-100" : "opacity-0")}
                style={
                  {
                    backgroundImage: "linear-gradient(90deg, rgba(255,59,71,0.9) 0 10px, transparent 10px 22px)",
                    backgroundSize: "22px 1px",
                    "--flow-len": "22px",
                    animation: "edge-flow-right 0.8s linear infinite",
                  } as React.CSSProperties
                }
              />
              {PROCESS.steps.map((s, i) => (
                <span key={s.title} className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(i / 3) * 100}%` }}>
                  <motion.span
                    animate={{
                      backgroundColor: lit > i ? "#ff3b47" : "#19171a",
                      borderColor: lit > i ? "#ff3b47" : "rgba(244,239,236,0.25)",
                      scale: lit > i ? 1 : 0.8,
                      boxShadow: lit > i ? "0 0 0 6px rgba(255,59,71,0.14), 0 0 24px 4px rgba(255,59,71,0.6)" : "0 0 0 0 rgba(255,59,71,0)",
                    }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 rounded-full border-2"
                  />
                  {lit > i && i === 3 && <span className="pulse-ring rounded-full text-accent" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
