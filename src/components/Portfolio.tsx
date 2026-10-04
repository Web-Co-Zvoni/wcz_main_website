import { ArrowRight, MoveHorizontal } from "lucide-react";
import { PORTFOLIO } from "../content";
import FlexCarousel from "./fx/FlexCarousel";
import { Reveal, SectionHead } from "./ui";
import { cz } from "../utils/typo";

export default function Portfolio() {
  return (
    <section id="koncepty" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-[520px] -translate-y-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,214,10,0.10),transparent)]" />

      <div className="relative px-4">
        <SectionHead kicker={PORTFOLIO.kicker} title={PORTFOLIO.title} desc={PORTFOLIO.description} />
      </div>

      <Reveal delay={0.1} y={40}>
        <div
          className="relative mt-10 h-[clamp(480px,78vh,720px)] w-full text-paper [&_.flex-carousel__count]:text-[13px] [&_.flex-carousel__subtitle]:font-sans [&_.flex-carousel__subtitle]:text-[14px] [&_.flex-carousel__title]:font-display [&_.flex-carousel__title]:text-[24px] [&_.flex-carousel__title]:font-bold [&_.flex-carousel__title]:tracking-tight [&_.flex-carousel:focus-visible]:shadow-[inset_0_0_0_2px_var(--color-accent)]"
        >
          <FlexCarousel
            items={PORTFOLIO.items}
            preset="liquid"
            intro="rise"
            fit="portrait"
            cardHeight={0.56}
            gap={16}
            radius={14}
            squeeze={0.2}
            captureWheel={false}
            focusOnClick
            captions
          />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-col items-center gap-4 px-4 text-center">
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
