import { Quote, Star } from "lucide-react";
import { Reveal, SectionHead } from "./ui";

const QUOTES = [
  {
    text: "Web jsem odkládal tři roky, asi jako každej. Kluci to zvládli za dva týdny a od spuštění mi každej týden někdo volá, že mě našel na Googlu.",
    name: "Martin Kovařík",
    role: "Instalatérství · Plzeň–Doubravka",
    initials: "MK",
  },
  {
    text: "Konečně nemusím po večerech odepisovat na zprávy. Lidi si termín zarezervujou sami a já jen ráno kouknu do kalendáře na mobilu.",
    name: "Markéta Ludvíková",
    role: "Kadeřnictví · Plzeň–Bory",
    initials: "ML",
  },
  {
    text: "Žádný schůze po kancelářích, žádnej korporátní cirkus. Jeden telefonát, jedno schválení návrhu a hotovo. A cena seděla na korunu.",
    name: "Radek Houba",
    role: "Autoservis · Nýřany",
    initials: "RH",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="06"
          eyebrow="Co říkají řemeslníci"
          title={
            <>
              Kluci, co si dělají
              <br />
              <span className="text-accent">svoji práci pořádně.</span>
            </>
          }
          desc="Slovy lidí, kteří se živí rukama stejně jako jejich zákazníci — a web už řešit nemusí."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.1} className="h-full">
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-paper/10 bg-ink p-8 transition-colors duration-500 hover:border-accent/40">
                <div>
                  <div className="flex items-center justify-between">
                    <Quote className="size-7 text-accent" fill="currentColor" strokeWidth={0} />
                    <span className="flex gap-0.5 text-flame">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="size-3.5" fill="currentColor" strokeWidth={0} />
                      ))}
                    </span>
                  </div>
                  <blockquote className="mt-6 text-[15.5px] leading-relaxed text-paper/90">
                    „{q.text}“
                  </blockquote>
                </div>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-paper/10 pt-6">
                  <span className="grid size-11 place-items-center rounded-full border border-accent/40 bg-card stretch text-sm font-extrabold text-accent">
                    {q.initials}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold tracking-tight">{q.name}</span>
                    <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-mute">
                      {q.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
