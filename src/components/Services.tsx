import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { SERVICE_DEMOS, SERVICES } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { BentoCard } from "./Bento";
import GrowthTile from "./GrowthTile";
import { SERVICE_DEMO_COMPONENTS } from "./ServiceDemos";
import { Button, Reveal } from "./ui";

type Service = (typeof SERVICES.items)[number];

/**
 * Two rows that swap their wide and narrow tiles, and a light falling into each from above —
 * red, with a white core here and there, so no two tiles are lit the same.
 */
const TILES: Record<Service["demo"], { span: string; wide: boolean; light: string }> = {
  web: {
    span: "lg:col-span-5",
    wide: false,
    light:
      "radial-gradient(ellipse 30% 38% at 50% 0%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(ellipse 65% 60% at 50% 0%, rgba(255,59,71,0.34), transparent 72%)",
  },
  seo: {
    span: "lg:col-span-7",
    wide: true,
    light:
      "radial-gradient(ellipse 45% 60% at 50% 0%, rgba(255,59,71,0.3), transparent 72%), radial-gradient(ellipse 60% 70% at 85% 0%, rgba(255,255,255,0.07), transparent 70%)",
  },
  booking: {
    span: "lg:col-span-7",
    wide: true,
    light:
      "radial-gradient(ellipse 40% 55% at 30% 0%, rgba(255,59,71,0.3), transparent 72%), radial-gradient(ellipse 25% 40% at 50% 0%, rgba(255,255,255,0.12), transparent 70%)",
  },
  care: {
    span: "lg:col-span-5",
    wide: false,
    // a ring of light behind the chat
    light:
      "radial-gradient(circle at 50% 42%, transparent 18%, rgba(255,59,71,0.22) 27%, rgba(255,255,255,0.06) 31%, transparent 46%), radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,59,71,0.18), transparent 70%)",
  },
};

/** a dim panel set back on either side of the demo, so the wide tiles read as a scene */
function Ghost({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute top-24 hidden h-[18.75rem] w-[14.375rem] rounded-[1.25rem] border border-paper/[0.07] bg-[#0f0d10] p-5 opacity-40 [mask-image:linear-gradient(#000_40%,transparent)] md:block",
        side === "left" ? "right-[calc(50%+11.5625rem)]" : "left-[calc(50%+11.5625rem)]"
      )}
    >
      <span className="block h-2.5 w-24 rounded-full bg-paper/15" />
      <span className="mt-5 block h-16 rounded-xl bg-paper/[0.05]" />
      <span className="mt-3 block h-2 w-32 rounded-full bg-paper/10" />
      <span className="mt-2 block h-2 w-20 rounded-full bg-paper/10" />
      <span className="mt-5 block h-16 rounded-xl bg-paper/[0.05]" />
    </div>
  );
}

function ServiceTile({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { amount: 0.45 });
  const Demo = SERVICE_DEMO_COMPONENTS[s.demo];
  const tile = TILES[s.demo];

  return (
    <BentoCard delay={0.08 * i} className={cn("bg-[#121013]", tile.span)}>
      <div ref={ref} className="relative h-[30rem]">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: tile.light }} />
        {tile.wide && (
          <>
            <Ghost side="left" />
            <Ghost side="right" />
          </>
        )}

        <span className="absolute left-5 top-5 z-10 rounded-full border border-paper/15 bg-ink/50 px-2.5 py-0.5 text-[0.7188rem] text-mute">
          {SERVICE_DEMOS.sampleLabel}
        </span>

        {/* the demo, standing in the light; the bottom of it sinks into the caption */}
        <div className="absolute left-1/2 top-11 h-[26.25rem] w-[min(20.625rem,82%)] -translate-x-1/2 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tile:-translate-y-2">
          <Demo active={live} />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-[#121013]/90 to-[#121013]" />
        <p className="absolute inset-x-7 bottom-7 z-10 max-w-[44ch] text-[clamp(1rem,1.15vw,1.15rem)] leading-snug text-paper/60">
          <strong className="font-semibold text-paper">{s.title}</strong> {cz(s.text)}
        </p>
      </div>
    </BentoCard>
  );
}

export default function Services() {
  return (
    <section id="sluzby" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Reveal>
              <h2 className="display max-w-[16ch] text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.98]">{cz(SERVICES.title)}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-[clamp(1.1rem,1.4vw,1.4rem)] text-paper/70">{cz(SERVICES.description)}</p>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <Button href="#kontakt" size="lg" shine className="xl:px-9 xl:py-5 xl:text-[1.0625rem]">
              {SERVICES.outroCta}
              <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {SERVICES.items.map((s, i) => (
            <ServiceTile key={s.demo} s={s} i={i} />
          ))}
        </div>

        <div className="mt-4">
          <GrowthTile />
        </div>
      </div>
    </section>
  );
}
