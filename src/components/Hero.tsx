import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  BatteryFull,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  PhoneOff,
  Signal,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HERO, SETTINGS, SITE } from "../content";
import { EASE, Eyebrow, Reveal } from "./ui";

function PhoneMockup() {
  const [idx, setIdx] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    if (accepted) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO.callers.length), SETTINGS.callerRotationMs);
    return () => clearInterval(t);
  }, [accepted]);

  useEffect(() => {
    if (!accepted) return;
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [accepted]);

  const c = HERO.callers[idx];
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  const hangUp = () => {
    setAccepted(false);
    setSec(0);
    setIdx((i) => (i + 1) % HERO.callers.length);
  };

  return (
    <div className="relative w-[300px] sm:w-[330px]">
      {/* glow + dashed orbit */}
      <div className="absolute -inset-16 -z-10 rounded-full bg-accent/15 blur-[90px]" />
      <div className="animate-spin-slow absolute -inset-10 -z-10 rounded-full border border-dashed border-paper/10" />

      {/* phone body */}
      <div className="animate-wiggle rounded-[2.8rem] border border-paper/12 bg-coal p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-ink">
          {/* notch */}
          <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-coal" />
          {/* status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-paper/80">
            <span className="font-mono text-[11px] tracking-wider">21:45</span>
            <span className="flex items-center gap-1.5">
              <Signal className="size-3.5" />
              <Wifi className="size-3.5" />
              <BatteryFull className="size-4" />
            </span>
          </div>

          {/* screen */}
          <div className="relative z-10 flex h-[480px] flex-col items-center px-5 pb-7 pt-10 sm:h-[510px]">
            <div className="flex items-center gap-2 rounded-full border border-leaf/25 bg-leaf/10 px-3.5 py-1.5">
              <span className="size-1.5 animate-blink rounded-full bg-leaf" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-leaf">
                {accepted ? HERO.callLabels.inProgress : HERO.callLabels.incoming}
              </span>
            </div>

            {/* avatar with rings */}
            <div className="relative mt-9">
              {!accepted && (
                <>
                  <span className="pulse-ring" />
                  <span className="pulse-ring" style={{ animationDelay: "0.7s" }} />
                  <span className="pulse-ring" style={{ animationDelay: "1.4s" }} />
                </>
              )}
              <div className="relative grid size-24 place-items-center rounded-full border border-accent/40 bg-gradient-to-br from-card to-coal">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={c.initials}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.35 }}
                    className="stretch text-2xl font-extrabold text-accent"
                  >
                    {c.initials}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* caller info */}
            <div className="mt-6 flex min-h-[76px] flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <p className="stretch text-[19px] font-bold tracking-tight">{c.name}</p>
                  <p className="mt-1.5 flex items-center justify-center gap-1 font-mono text-[11px] tracking-wider text-mute">
                    <MapPin className="size-3" />
                    {c.place}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
                    {c.tag}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {accepted ? (
              <div className="mt-auto flex w-full flex-col items-center gap-6">
                <div className="flex h-8 items-center gap-1">
                  {[0.5, 0.9, 0.6, 1, 0.7, 0.95, 0.5].map((d, i) => (
                    <span
                      key={i}
                      className="eq-bar w-1 rounded-full bg-leaf"
                      style={{ height: "100%", animationDelay: `${d * 0.3}s` /* keep bars varying */ }}
                    />
                  ))}
                </div>
                <p className="font-mono text-sm tracking-[0.3em] text-paper/70">
                  {mm}:{ss}
                </p>
                <button
                  onClick={hangUp}
                    aria-label={HERO.callLabels.hangUp}
                  className="grid size-16 place-items-center rounded-full bg-blood text-paper shadow-[0_0_36px_-8px_var(--color-blood)] transition-transform hover:scale-105 active:scale-95"
                >
                  <PhoneOff className="size-6" />
                </button>
              </div>
            ) : (
              <div className="mt-auto flex w-full items-center justify-between px-5">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setIdx((i) => (i + 1) % HERO.callers.length)}
                    aria-label={HERO.callLabels.reject}
                    className="grid size-15 place-items-center rounded-full bg-blood/90 p-4 text-paper transition-transform hover:scale-105 active:scale-95"
                  >
                    <PhoneOff className="size-6" />
                  </button>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{HERO.callLabels.next}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setAccepted(true)}
                    aria-label={HERO.callLabels.acceptRequest}
                    className="relative grid size-15 place-items-center rounded-full bg-leaf p-4 text-ink shadow-[0_0_40px_-6px_var(--color-leaf)] transition-transform hover:scale-110 active:scale-95"
                    data-cursor={HERO.callLabels.accept}
                  >
                    <Phone className="size-6" />
                  </button>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">{HERO.callLabels.accept}</span>
                </div>
              </div>
            )}
          </div>

          {/* screen glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-gradient-to-b from-paper/[0.05] to-transparent" />
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
        className="animate-floaty absolute -left-24 bottom-24 hidden rounded-2xl border border-paper/10 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur lg:block"
      >
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          <ClipboardList className="size-3.5 text-accent" />
          {HERO.callLabels.sampleFeature}
        </p>
        <p className="stretch mt-1 text-lg font-extrabold text-paper">{HERO.callLabels.requestForm}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.7, duration: 0.8, ease: EASE }}
        className="animate-floaty absolute -right-20 top-20 hidden w-48 rounded-2xl border border-paper/10 bg-card/95 px-4 py-3 shadow-2xl backdrop-blur [animation-delay:1.2s] lg:block"
      >
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
          <CheckCircle2 className="size-3.5 text-leaf" />
          {HERO.callLabels.sampleFeature}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-paper">{HERO.callLabels.booking}</p>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      {/* backdrop */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* left */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <Eyebrow>{HERO.eyebrowPrefix}{SITE.serviceArea}</Eyebrow>
            </Reveal>

            <h1 className="mt-7 stretch-max font-black uppercase leading-[0.92] tracking-tight">
              {HERO.titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: EASE }}
                    className={`block text-[clamp(3.4rem,9vw,7.5rem)] ${i === 0 ? "text-paper" : "text-accent"}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <Reveal delay={0.55}>
              <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-mute">
                {HERO.descriptionStart}<span className="text-paper">{HERO.audience}</span>{HERO.descriptionMiddle}
                <span className="text-paper">{HERO.descriptionEnd}</span>
              </p>
            </Reveal>

            <Reveal delay={0.65}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#kontakt"
                  className="group flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-[15px] font-bold tracking-tight text-ink transition-all duration-300 hover:bg-flame hover:shadow-[0_0_44px_-8px_var(--color-accent)]"
                >
                  {HERO.primaryCta}
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </a>
                <a
                  href="#reference"
                  className="group flex items-center gap-2.5 rounded-full border border-paper/15 px-7 py-4 text-[15px] font-bold tracking-tight text-paper transition-all duration-300 hover:border-accent/60 hover:text-accent"
                >
                  {HERO.secondaryCta}
                  <ArrowDownRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" strokeWidth={2.5} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.75}>
              <p className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-mute">
                <span className="uppercase">{HERO.disclaimer}</span>
              </p>
            </Reveal>
          </div>

          {/* right — phone */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>

        {/* stats */}
        <Reveal delay={0.2}>
          <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-4">
            {HERO.stats.map((s, i) => (
              <div key={i} className="group bg-ink px-6 py-7 transition-colors duration-500 hover:bg-card">
                <p className="stretch text-3xl font-extrabold tracking-tight text-paper transition-colors duration-500 group-hover:text-accent md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
