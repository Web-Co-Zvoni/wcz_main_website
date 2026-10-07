import { AppWindow, BedDouble, Car, Fan, Hammer, HardHat, House, Sun, Wrench, Zap, type LucideIcon } from "lucide-react";
import { NICHES, ROUTES } from "../content";
import GrainyCarousel from "./fx/GrainyCarousel";
import { Reveal } from "./ui";

type Niche = (typeof NICHES.items)[number];

const cards = NICHES.items.map((n) => ({ src: n.src, alt: n.alt, href: ROUTES.niche(n.slug) }));

const ICONS: Record<Niche["icon"], LucideIcon> = {
  zap: Zap,
  wrench: Wrench,
  hammer: Hammer,
  hardhat: HardHat,
  car: Car,
  sun: Sun,
  fan: Fan,
  window: AppWindow,
  house: House,
  bed: BedDouble,
};

/** the HTML laid over each card in the canvas; data-hover comes from the carousel */
function Caption({ n }: { n: Niche }) {
  const Icon = ICONS[n.icon];
  return (
    <div className="relative size-full">
      <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-xl border border-paper/10 bg-ink/70 text-accent transition-colors duration-500 group-data-[hover=true]/cap:border-signal group-data-[hover=true]/cap:bg-signal group-data-[hover=true]/cap:text-white">
        <Icon className="size-4 group-data-[hover=true]/cap:animate-ringshake" strokeWidth={2.2} />
      </span>
      <div className="absolute inset-x-4 bottom-4">
        <p className="text-[0.7188rem] font-medium text-paper/60 transition-colors duration-500 group-data-[hover=true]/cap:text-accent">{n.group}</p>
        <p className="display mt-0.5 text-[clamp(1.05rem,1.2vw,1.3rem)] leading-[1.08]">{n.name}</p>
      </div>
    </div>
  );
}

export default function Niches() {
  return (
    <section aria-labelledby="niches-title" className="relative overflow-hidden pb-10 pt-20 md:pb-14 md:pt-24">
      <Reveal>
        <h2 id="niches-title" className="display text-center text-[clamp(1.8rem,2.8vw,3rem)] leading-none">
          {NICHES.title}
        </h2>
      </Reveal>

      {/* the canvas can't be tabbed through; the same cards as links, shown when focused */}
      <ul className="sr-only focus-within:not-sr-only focus-within:flex focus-within:flex-wrap focus-within:justify-center focus-within:gap-3 focus-within:pt-4">
        {NICHES.items.map((n) => (
          <li key={n.name}>
            <a href={ROUTES.niche(n.slug)} className="text-[0.875rem] text-paper underline-offset-4 focus:underline">
              {n.name}
            </a>
          </li>
        ))}
      </ul>

      <Reveal delay={0.1} y={30} className="mt-2">
        <GrainyCarousel items={cards} renderCaption={(i) => <Caption n={NICHES.items[i]} />} />
      </Reveal>
      <p className="-mt-6 text-center text-[0.7812rem] text-mute/70">{NICHES.note}</p>
    </section>
  );
}
