import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { HERO, SITE } from "../content";
import ColorBends from "./ColorBends";
import { EASE, Eyebrow, Reveal } from "./ui";

const COLOR_BEND_COLORS = ["#ff5c1f", "#d93222"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <ColorBends
          colors={COLOR_BEND_COLORS}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          intensity={0.95}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <div>
          {/* left */}
          <div className="max-w-5xl">
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
