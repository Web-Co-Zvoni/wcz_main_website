/**
 * Mini-demos for the Services bento: each one shows its service doing the job for a made-up
 * business (the tile labels it "ukázka"). They fill the panel slot their tile gives them and
 * only run while the tile is on screen; otherwise they rest on their finished state.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Check, MapPin, Phone, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { SERVICE_DEMOS as D } from "../content";
import { cn } from "../utils/cn";
import { EASE } from "./ui";

/** Steps through a little storyboard while active; `loop` bumps every pass so typed text can restart. */
function useSteps(active: boolean, durations: readonly number[]) {
  const reduce = useReducedMotion();
  const last = durations.length - 1;
  const [state, setState] = useState({ step: last, loop: 0 });

  useEffect(() => {
    if (!active || reduce) {
      setState((s) => ({ step: last, loop: s.loop }));
      return;
    }
    let i = 0;
    let timer = 0;
    setState((s) => ({ step: 0, loop: s.loop + 1 }));
    const tick = () => {
      timer = window.setTimeout(() => {
        i = (i + 1) % durations.length;
        setState((s) => ({ step: i, loop: i === 0 ? s.loop + 1 : s.loop }));
        tick();
      }, durations[i]);
    };
    tick();
    return () => window.clearTimeout(timer);
    // durations are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce, last]);

  return state;
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-[1.375rem] border border-paper/12 bg-[#0d0b0e]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-30px_rgba(0,0,0,0.95)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** letters appearing one after another; `run` restarts it */
function Typed({ text, run, className }: { text: string; run: number; className?: string }) {
  return (
    <span key={run} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <motion.span key={i} aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.055, duration: 0.01 }}>
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ---------------- weby na míru: a phone showing the tradesman's site ---------------- */

const WEB_STEPS = [1500, 1700, 1900, 1300] as const;

function WebDemo({ active }: { active: boolean }) {
  const { step } = useSteps(active, WEB_STEPS);
  return (
    <Frame className="grid place-items-center bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(255,59,71,0.16),transparent)]">
      <div className="relative aspect-[1/2] h-[90%] overflow-hidden rounded-[1.875rem] border-[5px] border-[#2b272b] bg-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
        <span className="absolute left-1/2 top-1.5 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#2b272b]" />
        <motion.div animate={{ y: step >= 1 ? -64 : 0 }} transition={{ duration: 1.1, ease: EASE }} className="px-3.5 pt-8">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-signal text-[0.6875rem] font-bold text-white">N</span>
            <span className="text-[0.7188rem] font-semibold text-paper">{D.business}</span>
          </div>
          <motion.p
            initial={false}
            animate={{ opacity: step === 0 ? [0, 1] : 1, y: step === 0 ? [10, 0] : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="display mt-5 text-[1.1875rem] leading-[1.08] text-paper"
          >
            {D.web.headline}
          </motion.p>
          <motion.span
            animate={{ scale: step === 2 ? [1, 0.93, 1] : 1 }}
            transition={{ duration: 0.45 }}
            className="relative mt-4 flex items-center justify-center gap-2 rounded-xl bg-signal py-2.5 text-[0.7812rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,59,71,0.9)]"
          >
            {step === 2 && <span className="pulse-ring rounded-xl text-accent" />}
            <Phone className={cn("size-3.5", step === 2 && "animate-ringshake")} fill="currentColor" />
            {D.web.call}
          </motion.span>
          <ul className="mt-5 flex flex-col gap-2">
            {D.web.rows.map((r, i) => (
              <motion.li
                key={r}
                animate={{ opacity: step >= 1 ? 1 : 0.25, x: step >= 1 ? 0 : 8 }}
                transition={{ duration: 0.6, delay: step >= 1 ? 0.25 + i * 0.12 : 0, ease: EASE }}
                className="flex items-center gap-2 rounded-lg bg-paper/[0.05] px-2.5 py-2 text-[0.6875rem] text-paper/85"
              >
                <span className="size-1.5 rounded-full bg-accent" />
                {r}
              </motion.li>
            ))}
          </ul>
          <div className="mt-4 h-20 rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-ink to-transparent" />
      </div>
      <span className="absolute left-5 top-4 text-[0.7188rem] text-mute/70">{D.web.url}</span>
    </Frame>
  );
}

/* ---------------- lokální seo: search, a pin drops, you're on top ---------------- */

const SEO_STEPS = [1800, 1500, 2700] as const;

function SeoDemo({ active }: { active: boolean }) {
  const { step, loop } = useSteps(active, SEO_STEPS);
  return (
    <Frame className="flex flex-col p-4">
      <div className="flex items-center gap-2.5 rounded-full border border-paper/12 bg-paper/[0.04] px-4 py-2.5 text-[0.8125rem] text-paper">
        <Search className="size-4 text-mute" />
        {active ? <Typed text={D.seo.query} run={loop} /> : <span>{D.seo.query}</span>}
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} className="-ml-1.5 h-4 w-px bg-accent" />
      </div>

      {/* the map */}
      <div className="relative mt-3 h-[42%] overflow-hidden rounded-2xl border border-paper/[0.07] bg-[#141115]">
        <svg viewBox="0 0 200 120" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <g fill="none" stroke="rgba(244,239,236,0.07)" strokeWidth="6" strokeLinecap="round">
            <path d="M-10 84 C40 70 80 92 120 64 S180 40 215 46" />
            <path d="M62 -10 C70 40 58 80 74 130" />
          </g>
          <g fill="none" stroke="rgba(244,239,236,0.05)" strokeWidth="2.5">
            <path d="M-10 30 L210 18" />
            <path d="M130 -10 L150 130" />
            <path d="M-10 108 L210 100" />
            <path d="M24 -10 L36 130" />
            <path d="M180 -10 L170 130" />
          </g>
          <path d="M98 6 C120 14 140 8 160 22 L170 50 C150 46 130 52 112 40 Z" fill="rgba(59,255,143,0.05)" />
        </svg>
        {[
          [22, 30],
          [76, 22],
          [82, 74],
        ].map(([l, t]) => (
          <span key={`${l}-${t}`} className="absolute size-2.5 rounded-full border-2 border-paper/30 bg-coal" style={{ left: `${l}%`, top: `${t}%` }} />
        ))}
        <motion.div
          className="absolute left-[46%] top-[34%] -translate-x-1/2 rounded-full text-accent"
          animate={{ y: step >= 1 ? 0 : -46, opacity: step >= 1 ? 1 : 0 }}
          transition={step >= 1 ? { type: "spring", stiffness: 520, damping: 16 } : { duration: 0.2 }}
        >
          <MapPin className="size-8 drop-shadow-[0_0_12px_var(--color-accent)]" fill="currentColor" stroke="#0d0b0e" strokeWidth={1.5} />
          {step >= 1 && <span className="pulse-ring rounded-full" />}
        </motion.div>
      </div>

      {/* results: ours lands on top */}
      <div className="mt-3 flex flex-col gap-2">
        <motion.div
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 12 }}
          transition={{ duration: 0.55, ease: EASE, delay: step >= 1 ? 0.25 : 0 }}
          className="rounded-2xl border border-accent/45 bg-accent/[0.08] p-3"
        >
          <p className="text-[0.8125rem] font-semibold text-paper">{D.business}</p>
          <p className="mt-0.5 text-[0.7188rem] text-mute">{D.seo.place}</p>
          <p className="mt-0.5 text-[0.7188rem] text-volt">{D.seo.open}</p>
          <div className="mt-2.5 flex gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-signal px-3 py-1 text-[0.6875rem] font-semibold text-white">
              <Phone className="size-3" fill="currentColor" />
              {D.seo.call}
            </span>
            <span className="rounded-full border border-paper/15 px-3 py-1 text-[0.6875rem] text-paper/80">{D.seo.route}</span>
          </div>
        </motion.div>
        {D.seo.others.map((o) => (
          <div key={o} className="rounded-xl px-3 py-1.5 text-[0.7188rem] text-mute/60">
            {o}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------------- rezervace: a 9pm enquiry and a booked slot ---------------- */

const BOOKING_STEPS = [1300, 1900, 2500] as const;

function BookingDemo({ active }: { active: boolean }) {
  const { step } = useSteps(active, BOOKING_STEPS);
  return (
    <Frame className="flex flex-col p-5">
      <div className="flex items-baseline justify-between">
        <p className="display text-[1.375rem] text-paper">{D.booking.day}</p>
        <p className="text-[0.8125rem] tabular-nums text-mute">{D.booking.time}</p>
      </div>

      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mt-4 flex items-start gap-3 rounded-2xl border border-paper/10 bg-card p-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]"
          >
            <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-signal text-white">
              <Bell className="animate-ringshake size-4" />
            </span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-2 text-[0.7812rem] font-semibold text-paper">
                {D.booking.notice}
                <span className="font-normal tabular-nums text-mute">{D.booking.time}</span>
              </span>
              <span className="mt-0.5 block text-[0.7188rem] leading-snug text-mute">{D.booking.noticeText}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="mt-auto flex flex-col gap-2 pb-5">
        {D.booking.slots.map((s, i) => {
          const booked = i === D.booking.bookedSlot && step >= 2;
          return (
            <motion.li
              key={s}
              layout
              className={cn(
                "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-[0.7812rem] transition-colors duration-500",
                booked ? "border-accent/60 bg-accent/[0.12] text-paper" : "border-paper/[0.08] text-paper/70"
              )}
            >
              <span className="tabular-nums">{s}</span>
              <AnimatePresence mode="popLayout">
                {booked ? (
                  <motion.span
                    key="booked"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-[0.7188rem] font-semibold text-accent"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                    {D.booking.booked}
                  </motion.span>
                ) : (
                  <motion.span key="free" className="h-1.5 w-10 rounded-full bg-paper/10" />
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </Frame>
  );
}

/* ---------------- správa: one text message and it's done ---------------- */

const CARE_STEPS = [1500, 1300, 2700] as const;

function CareDemo({ active }: { active: boolean }) {
  const { step } = useSteps(active, CARE_STEPS);
  return (
    <Frame className="flex flex-col p-5">
      <div className="flex items-center gap-2.5 border-b border-paper/[0.07] pb-3">
        <span className="grid size-8 place-items-center rounded-full bg-paper/10 text-[0.75rem] font-bold text-paper">N</span>
        <span className="text-[0.8125rem] font-semibold text-paper">{D.business}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-3">
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[86%] rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 text-[0.7812rem] leading-snug text-paper/90"
        >
          {D.care.incoming}
        </motion.p>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.span
              key="typing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex gap-1 self-end rounded-2xl rounded-br-md bg-signal/80 px-3.5 py-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  className="size-1.5 rounded-full bg-white"
                />
              ))}
            </motion.span>
          )}
          {step !== 1 && step !== 0 && (
            <motion.p
              key="reply"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex max-w-[80%] items-center gap-2 self-end rounded-2xl rounded-br-md bg-signal px-3.5 py-2.5 text-[0.7812rem] font-medium text-white"
            >
              {D.care.reply}
              <Check className="size-3.5 shrink-0" strokeWidth={3} />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <p className="mb-5 flex items-center gap-2 text-[0.7188rem] text-mute">
        <span className="size-1.5 animate-signal rounded-full bg-volt" />
        {D.care.status}
      </p>
    </Frame>
  );
}

export const SERVICE_DEMO_COMPONENTS = { web: WebDemo, seo: SeoDemo, booking: BookingDemo, care: CareDemo };
