import { Chip, Reveal, SectionHead } from "./ui";

const CONCEPTS = [
  {
    name: "Web pro instalatéra",
    place: "Koncept pro řemeslníka",
    services: ["Služby", "Poptávkový formulář"],
    description: "Přehled služeb, oblast výjezdu a jednoduchá cesta k poptávce.",
    img: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Instalatér montuje rozvody vody v koupelně",
  },
  {
    name: "Web pro truhláře",
    place: "Koncept pro řemeslníka",
    services: ["Realizace", "Fotogalerie"],
    description: "Prostor pro ukázky práce, materiály a popis zakázek na míru.",
    img: "https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Truhlář opracovává dřevo na pile v dílně",
  },
  {
    name: "Web pro salon",
    place: "Koncept pro služby",
    services: ["Ceník", "Rezervace"],
    description: "Ceník, informace o službách a návrh online objednávání.",
    img: "https://images.pexels.com/photos/39559306/pexels-photo-39559306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    alt: "Kadeřník stříhá vlasy v salonu",
  },
  {
    name: "Web pro autoservis",
    place: "Koncept pro služby",
    services: ["Služby", "Kontakt"],
    description: "Srozumitelná nabídka oprav, otevírací doba a rychlý kontakt.",
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
          eyebrow="Oborové koncepty"
          title={
            <>
              Ukázky, ne
              <br />
              <span className="text-accent">reference.</span>
            </>
          }
          desc="Zatím nemáme realizované weby, které bychom mohli ukázat. Tyto oborové koncepty ilustrují obsah a funkce, které můžeme navrhnout. Fotografie jsou ilustrační."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {CONCEPTS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.12}>
              <article className="relative overflow-hidden rounded-3xl border border-paper/10">
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
                    <Chip className="border-accent/40 bg-ink/80 text-accent backdrop-blur">Koncept</Chip>
                    {p.services.map((s) => (
                      <Chip key={s} className="border-paper/20 bg-ink/60 text-paper backdrop-blur">
                        {s}
                      </Chip>
                    ))}
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
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/75">{p.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
            Chcete probrat vlastní web?{" "}
            <a href="#kontakt" className="text-accent underline-offset-4 hover:underline">
              Ozvěte se
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
