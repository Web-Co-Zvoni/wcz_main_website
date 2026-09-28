import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Chip, Reveal, SectionHead } from "./ui";

const PROJECTS = [
  {
    name: "Instalatérství Kovařík",
    place: "Plzeň–Doubravka",
    services: ["Web", "Lokální SEO"],
    result: "+64 % poptávek za první 3 měsíce",
    img: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Instalatér montuje rozvody vody v koupelně",
  },
  {
    name: "Truhlářství Dvořák",
    place: "Rokycany",
    services: ["Web", "Fotky zakázek"],
    result: "Výroba naplněná na 2 měsíce dopředu",
    img: "https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Truhlář opracovává dřevo na pile v dílně",
  },
  {
    name: "Kadeřnictví Markéta",
    place: "Plzeň–Bory",
    services: ["Web", "Online rezervace"],
    result: "70 % objednávek už řeší kalendář sám",
    img: "https://images.pexels.com/photos/39559306/pexels-photo-39559306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Kadeřník stříhá vlasy v salonu",
  },
  {
    name: "Autoservis u Houby",
    place: "Nýřany",
    services: ["Web", "Google profil"],
    result: "20+ hovorů měsíčně navíc z map a hledání",
    img: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Automechanik kontroluje motor v servisu",
  },
];

export default function Portfolio() {
  return (
    <section id="reference" className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          eyebrow="Reference"
          title={
            <>
              Práce, co dělá
              <br />
              <span className="text-accent">zakázky.</span>
            </>
          }
          desc="Žádné slovníky výsledků. Vždycky ukážeme konkrétní firmu z Plzeňska a co jí web přinesl — v číslech."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.12}>
              <a
                href="#kontakt"
                className="group relative block overflow-hidden rounded-3xl border border-paper/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                  {/* chips top */}
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    {p.services.map((s) => (
                      <Chip key={s} className="border-paper/20 bg-ink/60 text-paper backdrop-blur">
                        {s}
                      </Chip>
                    ))}
                  </div>
                  {/* arrow */}
                  <div className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-paper/20 bg-ink/60 text-paper opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                    <span className="size-1 rounded-full bg-accent" />
                    {p.place}
                  </p>
                  <h3 className="mt-2 stretch text-2xl font-extrabold tracking-tight md:text-[28px]">
                    {p.name}
                  </h3>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-[13px] font-semibold text-leaf">
                    <TrendingUp className="size-3.5" />
                    {p.result}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
            Vaše jméno tu klidně může být další —{" "}
            <a href="#kontakt" className="text-accent underline-offset-4 hover:underline">
              stačí se ozvat
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
