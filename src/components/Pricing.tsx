import { animate, AnimatePresence, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Boxes, Check, KeyRound, Layers, Lock, PanelTop, Plus, Server, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { kc, PRICING } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { BentoCard } from "./Bento";
import { SERVICE_DEMO_COMPONENTS } from "./ServiceDemos";
import { Button, EASE, Reveal, SectionHead } from "./ui";

const ICONS: Record<string, LucideIcon> = { page: PanelTop, layers: Layers, boxes: Boxes, server: Server, shield: ShieldCheck, sparkles: Sparkles };
const BUILD = PRICING.plans;
const CARE = PRICING.care;
const V = CARE.visuals;
const [HOSTING, UPKEEP, FULL] = CARE.plans;
const CareDemo = SERVICE_DEMO_COMPONENTS.care;

/**
 * A price that counts up the first time it scrolls into view.
 * The prerendered HTML already carries the real figure; the count starts only in the browser.
 */
function Figure({ value, className }: { value: number | null; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(value ?? 0);
  const text = useTransform(mv, (v) => kc(Math.round(v)));

  useEffect(() => {
    if (value === null || value === 0 || !inView || reduce) return;
    const c = animate(mv, value, { from: 0, duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, value, reduce, mv]);

  return (
    <span ref={ref} className={cn("whitespace-nowrap tabular-nums", className)}>
      {value === null ? PRICING.custom : <motion.span>{text}</motion.span>}
    </span>
  );
}

/** true while the element is on screen — the tile visuals only play then */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const on = useInView(ref, { margin: "-80px" });
  return [ref, on] as const;
}

/** cycles 0..n-1 every `ms` while active; rests on the last step otherwise */
function useCycle(active: boolean, n: number, ms: number) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(n - 1);
  useEffect(() => {
    if (!active || reduce) {
      setI(n - 1);
      return;
    }
    setI(0);
    const t = window.setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => window.clearInterval(t);
  }, [active, reduce, n, ms]);
  return i;
}

/* ------------------------------------------------------------------ */
/* Krok 1 — the webs                                                   */
/* ------------------------------------------------------------------ */

/**
 * One web plan. The cursor drags a spotlight and a lit edge across it; the glowing frame rests on
 * the featured plan and glides over to whichever card the cursor is on.
 */
function BuildCard({ p, framed, onHover, delay }: { p: (typeof BUILD)[number]; framed: boolean; onHover: (on: boolean) => void; delay: number }) {
  const Icon = ICONS[p.icon] ?? PanelTop;
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spot = useMotionTemplate`radial-gradient(26rem circle at ${mx}px ${my}px, rgba(255,59,71,0.14), transparent 70%)`;

  return (
    <Reveal delay={delay} className="h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        className={cn(
          "group/plan relative isolate flex h-full flex-col rounded-[1.75rem] border px-7 pb-7 pt-8 transition-[background-color,border-color] duration-500 xl:px-9 xl:pb-9 xl:pt-10",
          framed ? "border-transparent bg-[linear-gradient(180deg,#1a1013,#0c0a0c_55%,#0a090b)]" : "border-paper/10 bg-[#0b0a0c]/80"
        )}
      >
        {framed && (
          <motion.span
            layoutId="build-frame"
            aria-hidden
            style={{ borderRadius: 28 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="pointer-events-none absolute -inset-px z-0 shadow-[0_40px_100px_-40px_rgba(255,59,71,0.7),inset_0_0_0_1px_rgba(255,59,71,0.35)]"
          >
            <span className="conic-ring" />
          </motion.span>
        )}
        <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
          <motion.span style={{ background: spot }} className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/plan:opacity-100" />
        </span>

        {p.featured && (
          <span className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-signal px-5 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_0_24px_-4px_var(--color-accent)] xl:text-[0.875rem]">
            {PRICING.featuredLabel}
          </span>
        )}

        <span
          aria-hidden
          className={cn(
            "relative grid size-12 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-500",
            framed ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_30px_-6px_rgba(255,59,71,0.8)]" : "border-paper/12 bg-paper/[0.04] text-paper/60"
          )}
        >
          <Icon className="size-5.5" strokeWidth={2} />
        </span>

        <h4 className={cn("relative mt-6 text-[1.0625rem] font-semibold transition-colors duration-500 xl:text-[1.1875rem]", framed ? "text-accent" : "text-paper/70")}>{p.name}</h4>
        <p className="display relative mt-3 text-[clamp(2.3rem,3.4vw,3.6rem)] leading-none">
          <Figure value={p.price} />
        </p>
        <p className="relative mt-2 text-[0.875rem] text-mute xl:text-[0.9375rem]">{p.per}</p>
        <p className="relative mt-5 text-[1rem] leading-relaxed text-paper/80 xl:text-[1.0938rem]">{cz(p.desc)}</p>
        <ul className="relative mt-6 flex flex-1 flex-col gap-3 border-t border-paper/10 pt-6">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-paper/80 xl:text-[1.0312rem]">
              <Check className={cn("mt-0.5 size-4.5 shrink-0 transition-colors duration-500", framed ? "text-accent" : "text-mute")} strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
        <div className="relative mt-8">
          <Button href="#kontakt" size="lg" variant={framed ? "primary" : "ghost"} className="w-full xl:py-5 xl:text-[1.0625rem]">
            {p.cta}
          </Button>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Krok 2 — the care, as a bento                                       */
/* ------------------------------------------------------------------ */

/** name, price and what's in it — the words of every care tile */
function CareWords({ plan, badge }: { plan: (typeof CARE.plans)[number]; badge?: boolean }) {
  const Icon = ICONS[plan.icon] ?? Server;
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-11 place-items-center rounded-2xl border",
            plan.featured ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_30px_-6px_rgba(255,59,71,0.8)]" : "border-paper/12 bg-paper/[0.04] text-paper/70"
          )}
        >
          <Icon className="size-5" strokeWidth={2} />
        </span>
        <h4 className={cn("text-[1.0625rem] font-semibold xl:text-[1.1875rem]", plan.featured ? "text-accent" : "text-paper")}>{plan.name}</h4>
        {/* on a phone the badge gets a row of its own, above the name */}
        {badge && (
          <span className="max-sm:order-first max-sm:w-full sm:ml-auto">
            <span className="inline-block whitespace-nowrap rounded-full bg-signal px-3.5 py-1.5 text-[0.75rem] font-semibold text-white shadow-[0_0_24px_-4px_var(--color-accent)] xl:text-[0.8125rem]">{PRICING.featuredLabel}</span>
          </span>
        )}
      </div>
      <p className="mt-5 flex items-baseline gap-2.5">
        <Figure value={plan.price} className="display text-[clamp(2.2rem,3.2vw,3.3rem)] leading-none" />
        <span className="text-[0.9375rem] text-mute">{CARE.per}</span>
      </p>
      <p className="mt-3 text-[1rem] leading-relaxed text-paper/80 xl:text-[1.0625rem]">{cz(plan.desc)}</p>
      <ul className="mt-5 grid gap-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className={cn("flex items-start gap-2.5 text-[0.9375rem] leading-snug xl:text-[1rem]", f.startsWith("Všechno z") ? "font-semibold text-paper" : "text-paper/75")}>
            <Check className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-accent" : "text-mute")} strokeWidth={2.75} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** a small panel the visuals sit in, with the "ukázka" tag */
function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[1.25rem] border border-paper/10 bg-[#0d0b0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]", className)}>
      <span className="absolute right-3 top-3 z-10 rounded-full bg-paper/[0.06] px-2.5 py-1 text-[0.6875rem] text-mute">{CARE.sample}</span>
      {children}
    </div>
  );
}

/** hosting: an address bar going green, then the page loading under it */
function HostingVisual() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const step = useCycle(on, 3, 1400);
  return (
    <div ref={ref}>
      <Panel className="px-4 pb-4 pt-11">
        <div className="flex items-center gap-2.5 rounded-full border border-paper/10 bg-ink/80 px-3.5 py-2">
          <motion.span animate={{ color: step >= 1 ? "#3bff8f" : "#a39a9d", scale: step === 1 ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.4 }}>
            <Lock className="size-3.5" strokeWidth={2.75} />
          </motion.span>
          <span className="text-[0.8125rem] text-paper/80">
            <span className="text-mute">https://</span>
            {V.domain}
          </span>
          <AnimatePresence>
            {step >= 1 && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-auto text-[0.6875rem] font-semibold text-volt"
              >
                {V.secure}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/[0.06]">
          <motion.span
            key={step === 0 ? "load" : "done"}
            className="block h-full rounded-full bg-gradient-to-r from-signal to-flame"
            initial={{ width: step === 0 ? "0%" : "100%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </div>
        <div className="mt-3 grid grid-cols-[2fr_1fr] gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: step === 0 ? 0.15 : 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn("h-3 rounded-full bg-paper/30", i === 0 && "col-span-2 h-5 w-3/4 bg-paper/45")}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

/** upkeep: a status strip filling day by day — one red day turns green, then the backup lands */
const DAYS = 30;
const BAD_DAY = 21;
function UpkeepVisual() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const step = useCycle(on, 4, 1500);
  const reduce = useReducedMotion();
  return (
    <div ref={ref}>
      <Panel className="px-4 pb-4 pt-4">
        <p className="flex items-center gap-2 text-[0.75rem] font-medium text-paper/80">
          <span className="size-1.5 animate-signal rounded-full bg-volt" />
          {V.up}
        </p>
        <div className="mt-4 flex h-9 items-end gap-[3px]">
          {Array.from({ length: DAYS }, (_, i) => {
            const bad = i === BAD_DAY && step === 1;
            return (
              <motion.span
                key={i}
                initial={reduce ? false : { scaleY: 0.2, opacity: 0.2 }}
                animate={on || reduce ? { scaleY: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.025, ease: EASE }}
                className={cn("h-full flex-1 origin-bottom rounded-[2px] transition-colors duration-500", bad ? "bg-accent" : "bg-volt/70")}
              />
            );
          })}
        </div>
        <div className="mt-3 h-7">
          <AnimatePresence mode="wait">
            {step >= 2 && (
              <motion.p
                key={step === 2 ? "fixed" : "backup"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-volt/25 bg-volt/[0.08] px-3 py-1 text-[0.75rem] font-medium text-volt"
              >
                <Check className="size-3.5" strokeWidth={3} />
                {step === 2 ? V.fixed : V.backup}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}

/** the monthly report: bars rising month by month, the last one lit — an illustration, no real figures */
const REPORT = [34, 46, 42, 58, 70, 88];
function ReportVisual({ on }: { on: boolean }) {
  const reduce = useReducedMotion();
  return (
    <Panel className="flex h-[13rem] flex-col p-5 sm:h-[17rem]">
      <p className="text-[0.8125rem] font-semibold text-paper">{V.report}</p>
      <div className="mt-5 flex flex-1 items-end gap-2.5">
        {REPORT.map((h, i) => {
          const last = i === REPORT.length - 1;
          return (
            <motion.span
              key={i}
              initial={reduce ? false : { scaleY: 0 }}
              animate={on || reduce ? { scaleY: 1 } : undefined}
              transition={{ duration: 0.9, delay: reduce ? 0 : 0.15 + i * 0.1, ease: EASE }}
              style={{ height: `${h}%` }}
              className={cn(
                "relative flex-1 origin-bottom rounded-t-md",
                last ? "bg-gradient-to-t from-signal to-accent shadow-[0_0_24px_-4px_rgba(255,59,71,0.9)]" : "bg-paper/15"
              )}
            >
              {last && <span className="pulse-ring rounded-t-md text-accent/60" />}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-3 h-px bg-paper/10" />
    </Panel>
  );
}

/** full care: the text-message demo from the services bento beside the monthly report */
function FullCareVisual() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2">
      <div className="relative h-[17rem]">
        <span className="absolute right-3 top-3 z-10 rounded-full bg-paper/[0.06] px-2.5 py-1 text-[0.6875rem] text-mute">{CARE.sample}</span>
        <CareDemo active={on} />
      </div>
      <ReportVisual on={on} />
    </div>
  );
}

/** no care: a wide strip with a big 0 Kč, so paying nothing monthly is plainly an option */
function NoCareTile() {
  const N = CARE.none;
  return (
    <BentoCard delay={0.3} edge="bright" className="lg:col-span-12">
      <span aria-hidden className="pointer-events-none absolute inset-2 -z-10 rounded-[1.4rem] border border-dashed border-paper/15" />
      <div className="grid items-center gap-8 px-7 py-8 md:grid-cols-[auto_1fr] md:gap-12 xl:px-10 xl:py-10 lg:grid-cols-[auto_1fr_auto]">
        <div className="flex items-baseline gap-3 max-md:justify-center">
          <span className="display bg-[linear-gradient(110deg,#f4efec_35%,#ffffff_50%,#f4efec_65%)] bg-[length:250%_100%] bg-clip-text text-[clamp(3.6rem,6vw,5.6rem)] leading-none text-transparent [animation:text-shimmer_3.5s_linear_infinite]">
            {kc(N.price)}
          </span>
          <span className="text-[1.0625rem] font-medium text-paper/70">{CARE.per}</span>
        </div>
        <div className="max-md:text-center">
          <p className="flex items-center gap-2.5 text-[1.125rem] font-semibold text-paper max-md:justify-center xl:text-[1.25rem]">
            <KeyRound className="size-5 text-paper/70" strokeWidth={2} />
            {N.name}
          </p>
          <p className="mt-2 max-w-[48ch] text-[1rem] leading-relaxed text-paper/75 max-md:mx-auto xl:text-[1.0625rem]">{cz(N.desc)}</p>
        </div>
        <ul className="flex flex-col gap-2.5 max-lg:md:col-span-2 max-md:items-center lg:min-w-[17rem]">
          {N.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[0.9375rem] text-paper/80 xl:text-[1rem]">
              <Check className="size-4 shrink-0 text-paper/60" strokeWidth={2.75} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </BentoCard>
  );
}

/** the plus between the two steps: light runs down a thread into a pulsing badge */
function Joiner({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative flex h-36 justify-center", className)}>
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-paper/15 to-transparent" />
      <motion.span
        className="absolute left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
        animate={{ top: ["-15%", "85%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative my-auto grid size-14 place-items-center rounded-full border border-accent/40 bg-ink text-accent shadow-[0_0_40px_-8px_rgba(255,59,71,0.8)]">
        <span className="pulse-ring rounded-full text-accent/50" />
        <Plus className="size-6" strokeWidth={2.5} />
      </span>
    </div>
  );
}

/** a step's heading: which choice this is and what it means */
function GroupHead({ step, title, lead }: { step: string; title: string; lead: string }) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <span className="rounded-full border border-accent/30 bg-accent/[0.08] px-4 py-1.5 text-[0.8125rem] font-semibold text-accent xl:text-[0.875rem]">{step}</span>
      <h3 className="display mt-5 text-[clamp(1.9rem,3vw,3rem)] leading-[1.02]">{cz(title)}</h3>
      <p className="mt-3 max-w-[48ch] text-[1rem] leading-relaxed text-mute xl:text-[1.0938rem]">{cz(lead)}</p>
    </Reveal>
  );
}

export default function Pricing() {
  const featured = Math.max(0, BUILD.findIndex((p) => p.featured));
  const [hovered, setHovered] = useState<number | null>(null);
  const framed = hovered ?? featured;

  return (
    <section id="cenik" className="relative py-24 md:py-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[30%] -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[140px]" />
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={PRICING.kicker} title={PRICING.title} desc={PRICING.description} size="lg" />

        {/* 1 — the web, once */}
        <div className="mt-20">
          <GroupHead {...PRICING.build} />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" onPointerLeave={() => setHovered(null)}>
            {BUILD.map((p, i) => (
              <BuildCard key={p.name} p={p} framed={i === framed} onHover={(on) => setHovered(on ? i : null)} delay={i * 0.1} />
            ))}
          </div>
        </div>

        <Joiner className="mt-10" />

        {/* 2 — the care: any of it with any web, or none */}
        <div className="mt-6">
          <GroupHead step={CARE.step} title={CARE.title} lead={CARE.lead} />
          <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:gap-6">
            {/* full care: the big tile, words beside the live demo */}
            <BentoCard tone="signal" edge="bright" className="lg:col-span-12">
              {/* the tile clips its overflow, so the ring sits just inside the border */}
              <span className="conic-ring" style={{ inset: 0 }} aria-hidden />
              <div className="grid items-center gap-8 p-7 xl:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
                <CareWords plan={FULL} badge />
                <FullCareVisual />
              </div>
            </BentoCard>

            <BentoCard delay={0.1} edge="bright" className="lg:col-span-6">
              <div className="grid h-full gap-6 p-7 xl:p-9 grid-rows-[1fr_auto]">
                <CareWords plan={UPKEEP} />
                <UpkeepVisual />
              </div>
            </BentoCard>

            <BentoCard delay={0.2} edge="bright" className="lg:col-span-6">
              <div className="grid h-full gap-6 p-7 xl:p-9 grid-rows-[1fr_auto]">
                <CareWords plan={HOSTING} />
                <HostingVisual />
              </div>
            </BentoCard>

            <NoCareTile />
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-mute xl:text-[1.0312rem]">{cz(PRICING.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
