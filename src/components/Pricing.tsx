import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRICING } from "../content";
import { cn } from "../utils/cn";
import { Button, Reveal, SectionHead } from "./ui";
import { cz } from "../utils/typo";

export default function Pricing() {
  return (
    <section id="cenik" className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead kicker={PRICING.kicker} title={PRICING.title} desc={PRICING.description} />

        <div className="mt-16 grid items-center gap-6 lg:grid-cols-3 lg:gap-5">
          {PRICING.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className={cn("h-full", p.featured && "lg:-my-6")}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={cn(
                  "relative mx-auto flex h-full max-w-md flex-col items-center rounded-[22px] px-7 pb-8 pt-10 text-center",
                  p.featured
                    ? "bg-gradient-to-b from-accent/[0.14] via-card to-ink shadow-[0_40px_100px_-40px_rgba(61,245,140,0.6)] lg:py-14"
                    : "border border-paper/10 bg-coal/60"
                )}
              >
                {p.featured && (
                  <>
                    <span className="conic-ring" aria-hidden />
                    <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-accent/25" aria-hidden />
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-signal px-4 py-1.5 text-[12px] font-semibold text-white shadow-[0_0_24px_-4px_var(--color-accent)]">
                      {PRICING.featuredLabel}
                    </span>
                  </>
                )}

                <h3 className={cn("text-[15px] font-semibold", p.featured ? "text-accent" : "text-mute")}>{p.name}</h3>
                <p className="display mt-4 text-[clamp(2.1rem,3.6vw,2.8rem)]">{p.price}</p>
                <p className="mt-1 text-[13px] text-mute">{p.per}</p>
                <p className="mt-5 max-w-[30ch] text-[15px] leading-relaxed text-paper/80">{cz(p.desc)}</p>

                <ul className="mt-7 flex w-full flex-col gap-3 border-t border-paper/10 pt-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center justify-center gap-2.5 text-[14.5px] text-paper/85">
                      <Check className={cn("size-4 shrink-0", p.featured ? "text-accent" : "text-mute")} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full pt-9">
                  <Button href="#kontakt" variant={p.featured ? "primary" : "ghost"} className="w-full">
                    {p.cta}
                  </Button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-14 max-w-xl text-center text-[14px] leading-relaxed text-mute">{cz(PRICING.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
