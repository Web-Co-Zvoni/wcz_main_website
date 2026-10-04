import { CalendarCheck, Camera, LayoutTemplate, MapPin, ServerCog, ShoppingBag } from "lucide-react";
import { SERVICES } from "../content";
import CardFlip from "./CardFlip";
import { Reveal, SectionHead } from "./ui";

const SERVICE_ICONS = [LayoutTemplate, MapPin, CalendarCheck, ShoppingBag, ServerCog, Camera];

export default function Services() {
  return (
    <section id="sluzby" className="relative px-4 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHead kicker={SERVICES.kicker} title={SERVICES.title} desc={SERVICES.description} />

        <div className="mt-16 grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.1} className="flex w-full justify-center">
              <CardFlip
                title={s.title}
                subtitle={s.subtitle}
                description={s.text}
                features={s.tags}
                icon={SERVICE_ICONS[i]}
                cta={SERVICES.cta}
                href="#kontakt"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-[13px] text-mute/80">{SERVICES.flipHint}</p>
        </Reveal>
      </div>
    </section>
  );
}
