import { Reveal, SectionHead } from "./ui";

export default function Testimonials() {
  return (
    <section className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="06"
          eyebrow="Recenze"
          title={
            <>
              Žádné vymyšlené
              <br />
              <span className="text-accent">recenze.</span>
            </>
          }
          desc="Zatím nemáme klientské recenze ani realizace, o které bychom se mohli opřít. Až budeme mít svolení klientů, zveřejníme jejich skutečné zkušenosti."
        />

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-y border-paper/10 py-8 md:flex-row md:items-center">
            <p className="max-w-2xl text-[15px] leading-relaxed text-mute">
              Raději vám ukážeme náš postup, ceny a ukázkové koncepty, než abychom zveřejňovali zkušenosti, které
              zatím nemáme.
            </p>
            <a
              href="#kontakt"
              className="shrink-0 rounded-full border border-paper/15 px-6 py-3.5 text-sm font-bold transition-colors hover:border-accent/60 hover:text-accent"
            >
              Probrat váš web
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
