import { ArrowRight, Check, Flame } from "lucide-react";
import { PRICING } from "../content";
import { cn } from "../utils/cn";
import { Eyebrow, Reveal, SectionHead } from "./ui";

export default function Pricing() {
  return (
    <section id="cenik" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="05"
          eyebrow={PRICING.eyebrow}
          title={
            <>
              {PRICING.titleLead}
              <br />
              <span className="text-stroke">{PRICING.titleAccent}</span>
            </>
          }
          desc={PRICING.description}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PRICING.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9",
                  p.featured
                    ? "border-accent/60 bg-gradient-to-b from-accent/10 via-card to-card shadow-[0_40px_80px_-40px_rgba(255,92,31,0.35)]"
                    : "border-paper/10 bg-card"
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                    <Flame className="size-3.5" />
                    {PRICING.featuredLabel}
                  </span>
                )}
                <Eyebrow dot={false} className={cn(p.featured && "text-accent")}>
                  {p.name}
                </Eyebrow>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="stretch text-4xl font-black tracking-tight">{p.price}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{p.per}</span>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{p.desc}</p>
                <ul className="mt-7 flex flex-col gap-3 border-t border-paper/10 pt-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14.5px] text-paper/85">
                      <span
                        className={cn(
                          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                          p.featured ? "bg-accent text-ink" : "border border-paper/20 text-accent"
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontakt"
                  className={cn(
                    "group mt-8 flex items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold tracking-tight transition-all duration-300",
                    p.featured
                      ? "bg-accent text-ink hover:bg-flame hover:shadow-[0_0_40px_-8px_var(--color-accent)]"
                      : "border border-paper/15 text-paper hover:border-accent/60 hover:text-accent"
                  )}
                >
                  {p.cta}
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-paper/10 bg-card/60 p-6 font-mono text-[12px] leading-relaxed tracking-wide text-mute md:flex-row md:items-center md:gap-6">
            <span className="text-accent">{PRICING.noteLabel}</span>
            <p>
              {PRICING.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
