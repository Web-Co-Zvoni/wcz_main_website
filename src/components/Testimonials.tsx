import { Reveal, SectionHead } from "./ui";
import { TESTIMONIALS } from "../content";

export default function Testimonials() {
  return (
    <section className="relative bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="06"
          eyebrow={TESTIMONIALS.eyebrow}
          title={
            <>
              {TESTIMONIALS.titleLead}
              <br />
              <span className="text-accent">{TESTIMONIALS.titleAccent}</span>
            </>
          }
          desc={TESTIMONIALS.description}
        />

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-y border-paper/10 py-8 md:flex-row md:items-center">
            <p className="max-w-2xl text-[15px] leading-relaxed text-mute">
              {TESTIMONIALS.note}
            </p>
            <a
              href="#kontakt"
              className="shrink-0 rounded-full border border-paper/15 px-6 py-3.5 text-sm font-bold transition-colors hover:border-accent/60 hover:text-accent"
            >
              {TESTIMONIALS.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
