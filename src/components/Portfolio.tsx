import { ArrowRight, MoveHorizontal } from "lucide-react";
import { PORTFOLIO } from "../content";
import { cz } from "../utils/typo";
import ConceptCarousel from "./ConceptCarousel";
import { Reveal, SectionHead } from "./ui";

export default function Portfolio() {
  return (
    <section id="koncepty" className="relative py-24 md:py-32">
      <div className="relative px-4">
        <SectionHead kicker={PORTFOLIO.kicker} title={PORTFOLIO.title} desc={PORTFOLIO.description} size="lg" />
      </div>

      <Reveal delay={0.1} y={40} className="mt-6">
        <ConceptCarousel />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-4 flex flex-col items-center gap-4 px-4 text-center">
          <p className="inline-flex items-center gap-2 text-[0.8125rem] text-mute/80">
            <MoveHorizontal className="size-4 text-accent" />
            {PORTFOLIO.hint}
          </p>
          <p className="max-w-md text-[0.9375rem] text-mute">{cz(PORTFOLIO.reviewsNote)}</p>
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-paper transition-colors hover:text-accent"
          >
            {PORTFOLIO.closingLink}
            <ArrowRight className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
