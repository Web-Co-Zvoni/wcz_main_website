import { Chip, Reveal, SectionHead } from "./ui";
import { PORTFOLIO } from "../content";

export default function Portfolio() {
  return (
    <section id="reference" className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          eyebrow={PORTFOLIO.eyebrow}
          title={
            <>
              {PORTFOLIO.titleLead}
              <br />
              <span className="text-accent">{PORTFOLIO.titleAccent}</span>
            </>
          }
          desc={PORTFOLIO.description}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {PORTFOLIO.items.map((p, i) => (
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
                    <Chip className="border-accent/40 bg-ink/80 text-accent backdrop-blur">{PORTFOLIO.conceptLabel}</Chip>
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
            {PORTFOLIO.closing}{" "}
            <a href="#kontakt" className="text-accent underline-offset-4 hover:underline">
              {PORTFOLIO.closingLink}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
