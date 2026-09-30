import {
  ArrowUpRight,
  CalendarCheck,
  Camera,
  LayoutTemplate,
  MapPin,
  ServerCog,
  ShoppingBag,
} from "lucide-react";
import { SERVICES } from "../content";
import { Chip, Reveal, SectionHead } from "./ui";

const SERVICE_ICONS = [LayoutTemplate, MapPin, CalendarCheck, ShoppingBag, ServerCog, Camera];

export default function Services() {
  return (
    <section id="sluzby" className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="02"
          eyebrow={SERVICES.eyebrow}
          title={
            <>
              {SERVICES.titleLead}
              <br />
              <span className="text-stroke">{SERVICES.titleAccent}</span>
            </>
          }
          desc={SERVICES.description}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
            <Reveal key={s.title} delay={(i % 3) * 0.1}>
              <a
                href="#kontakt"
                className="group flex h-full flex-col justify-between rounded-3xl border border-paper/10 bg-ink p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgba(255,92,31,0.25)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl border border-paper/10 bg-card text-accent transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="size-5.5" strokeWidth={2} />
                    </div>
                    <ArrowUpRight className="size-5 text-mute opacity-0 transition-all duration-500 group-hover:text-accent group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-6 stretch text-xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{s.text}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </a>
            </Reveal>
          );})}
        </div>
      </div>
    </section>
  );
}
