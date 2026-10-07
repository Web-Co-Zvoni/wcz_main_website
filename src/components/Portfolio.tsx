import { ArrowRight, MoveHorizontal } from "lucide-react";
import { PORTFOLIO, ROUTES } from "../content";
import { cz } from "../utils/typo";
import CoverFlow from "./fx/CoverFlow";
import { Reveal, SectionHead } from "./ui";

const total = String(PORTFOLIO.items.length).padStart(2, "0");
const cards = PORTFOLIO.items.map((p, i) => ({
  img: p.src.replace("h=1000&w=800", "h=1120&w=740"),
  ambient: p.src.replace("h=1000&w=800", "h=200&w=160"),
  alt: p.alt,
  tag: `${PORTFOLIO.sampleLabel} ${String(i + 1).padStart(2, "0")}/${total}`,
  title: p.title,
  subtitle: p.subtitle,
  href: ROUTES.concept(p.slug),
}));

export default function Portfolio() {
  return (
    <section id="koncepty" className="relative py-24 md:py-32">
      <div className="relative px-4">
        <SectionHead kicker={PORTFOLIO.kicker} title={PORTFOLIO.title} desc={PORTFOLIO.description} size="lg" />
      </div>

      <Reveal delay={0.1} y={40} className="mt-6">
        <CoverFlow
          items={cards}
          ctaText={PORTFOLIO.open}
          label={PORTFOLIO.title}
          prevLabel={PORTFOLIO.prev}
          nextLabel={PORTFOLIO.next}
          slideLabel={(n) => `${PORTFOLIO.sampleLabel} ${n}`}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-4 flex flex-col items-center gap-4 px-4 text-center">
          <p className="inline-flex items-center gap-2 text-[13px] text-mute/80">
            <MoveHorizontal className="size-4 text-accent" />
            {PORTFOLIO.hint}
          </p>
          <p className="max-w-md text-[15px] text-mute">{cz(PORTFOLIO.reviewsNote)}</p>
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-paper transition-colors hover:text-accent"
          >
            {PORTFOLIO.closingLink}
            <ArrowRight className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
