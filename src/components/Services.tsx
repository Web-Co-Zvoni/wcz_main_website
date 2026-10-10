import { useInView } from "framer-motion";
import { useRef } from "react";
import { SERVICE_DEMOS, SERVICES } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { BentoCard } from "./Bento";
import ScrollStack, { ScrollStackItem } from "./fx/ScrollStack";
import GrowthTile from "./GrowthTile";
import { SERVICE_DEMO_COMPONENTS } from "./ServiceDemos";
import { PrimaryCta } from "./HeroCtas";
import { Reveal } from "./ui";

type Service = (typeof SERVICES.items)[number];

/** two rows that swap their wide and narrow tiles */
const TILES: Record<Service["demo"], { span: string; wide: boolean }> = {
  web: { span: "lg:col-span-5", wide: false },
  seo: { span: "lg:col-span-7", wide: true },
  booking: { span: "lg:col-span-7", wide: true },
  care: { span: "lg:col-span-5", wide: false },
};

/** the bento's two rows, each a card of the deck */
const ROWS = [SERVICES.items.slice(0, 2), SERVICES.items.slice(2)];
/** each card of the deck casts a shadow up onto the one it slides over */
const DECK_SHADOW = "shadow-[0_-1.5rem_3.75rem_-1.75rem_rgba(0,0,0,0.95)]";

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

  // near-black face, darker than the page; the caption fade below ends in its bottom colour
  return (
    <BentoCard delay={0.08 * i} edge="bright" dots={0.12} className={cn("border-accent/15 bg-[linear-gradient(180deg,#0f0d10,#0a090b_70%)]", tile.span)}>
      <div ref={ref} className="relative h-[30rem]">
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

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-[#0a090b]/90 to-[#0a090b]" />
        <p className="absolute inset-x-7 bottom-7 z-10 max-w-[44ch] text-[clamp(1rem,1.15vw,1.15rem)] leading-snug text-paper/60 max-md:text-center">
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
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 max-md:flex-col max-md:items-center max-md:text-center">
          <div>
            <Reveal>
              <h2 className="display max-w-[16ch] text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.98] max-md:mx-auto">{cz(SERVICES.title)}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-[clamp(1.1rem,1.4vw,1.4rem)] text-paper/70">{cz(SERVICES.description)}</p>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <PrimaryCta href="#kontakt" className="xl:px-9 xl:py-5 xl:text-[1.0625rem]">
              {SERVICES.outroCta}
            </PrimaryCta>
          </Reveal>
        </div>

        {/* scrolling on, the rows pile up into a deck — the second over the first, then the chart tile over both */}
        <ScrollStack
          className="mt-14"
          media="(min-width: 54.4rem)"
          itemDistance={16}
          itemStackDistance={26}
          itemScale={0}
          baseScale={1}
          stackPosition="center"
          lift={0.05}
          hold={0}
        >
          {ROWS.map((row, r) => (
            // no backing: the row behind shows through the gap between the two tiles
            <ScrollStackItem key={r} className={cn("rounded-[1.75rem]", r > 0 && DECK_SHADOW)}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                {row.map((s) => (
                  <ServiceTile key={s.demo} s={s} i={SERVICES.items.indexOf(s)} />
                ))}
              </div>
            </ScrollStackItem>
          ))}
          <ScrollStackItem className={cn("rounded-[1.75rem]", DECK_SHADOW)}>
            <GrowthTile />
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}
