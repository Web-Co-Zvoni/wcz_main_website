import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRICING } from "../content";
import { cn } from "../utils/cn";
import { Button, Reveal, SectionHead } from "./ui";
import { cz } from "../utils/typo";

export default function Pricing() {
  return (
    <section id="cenik" className="relative py-24 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={PRICING.kicker} title={PRICING.title} desc={PRICING.description} size="lg" />

        <div className="mt-20 grid items-center gap-6 lg:grid-cols-3 lg:gap-8">
          {PRICING.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className={cn("h-full", p.featured && "lg:-my-8")}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={cn(
                  "relative mx-auto flex h-full max-w-md flex-col items-center rounded-[1.75rem] px-8 pb-9 pt-11 text-center lg:max-w-none xl:px-12 xl:pb-12 xl:pt-14",
                  p.featured
                    ? "bg-gradient-to-b from-accent/[0.14] via-[#120e11] to-[#0a090b] shadow-[0_40px_100px_-40px_rgba(255,59,71,0.6)] lg:py-16 xl:py-20"
                    : "border border-paper/10 bg-[#0b0a0c]/80"
                )}
              >
                {p.featured && (
                  <>
                    <span className="conic-ring" aria-hidden />
                    <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-accent/25" aria-hidden />
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-signal px-5 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_0_24px_-4px_var(--color-accent)] xl:text-[0.875rem]">
                      {PRICING.featuredLabel}
                    </span>
                  </>
                )}

                <h3 className={cn("text-[1.0625rem] font-semibold xl:text-[1.1875rem]", p.featured ? "text-accent" : "text-mute")}>{p.name}</h3>
                <p className="display mt-5 text-[clamp(2.6rem,4.2vw,4.4rem)] leading-none">{p.price}</p>
                <p className="mt-2.5 text-[0.875rem] text-mute xl:text-[0.9688rem]">{p.per}</p>
                <p className="mt-6 max-w-[32ch] text-[1.0312rem] leading-relaxed text-paper/80 xl:text-[1.125rem]">{cz(p.desc)}</p>

                <ul className="mt-8 flex w-full flex-col gap-4 border-t border-paper/10 pt-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center justify-center gap-3 text-[0.9688rem] text-paper/85 xl:text-[1.0625rem]">
                      <Check className={cn("size-5 shrink-0", p.featured ? "text-accent" : "text-mute")} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full pt-10">
                  <Button href="#kontakt" size="lg" variant={p.featured ? "primary" : "ghost"} className="w-full xl:py-5 xl:text-[1.0625rem]">
                    {p.cta}
                  </Button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-16 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-mute xl:text-[1.0312rem]">{cz(PRICING.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
