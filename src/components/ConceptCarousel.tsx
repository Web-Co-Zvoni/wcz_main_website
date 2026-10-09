import { cardPhoto, conceptPhoto, PORTFOLIO, ROUTES } from "../content";
import { morphClick, useMorph } from "../lib/morph";
import { useEntry } from "../lib/router";
import CoverFlow, { COVER_SHADE } from "./fx/CoverFlow";

const total = String(PORTFOLIO.items.length).padStart(2, "0");
const cards = PORTFOLIO.items.map((p, i) => ({
  img: cardPhoto(p.src),
  ambient: p.src.replace("h=1000&w=800", "h=200&w=160"),
  alt: p.alt,
  tag: `${PORTFOLIO.sampleLabel} ${String(i + 1).padStart(2, "0")}/${total}`,
  title: p.title,
  subtitle: p.subtitle,
  href: ROUTES.concept(p.slug),
}));

/**
 * All the concepts in the cover-flow; the card facing you flies into its page. `startAt` (a concept
 * slug) turns that card to face you first — unless the page was brought back with Back, then the
 * carousel shows the card the visitor left from, so the photo can fly home into it.
 */
export default function ConceptCarousel({ startAt }: { startAt?: string }) {
  const { open } = useMorph();
  const { restored } = useEntry();
  const start = startAt ? PORTFOLIO.items.findIndex((p) => p.slug === startAt) : -1;

  return (
    <CoverFlow
      items={cards}
      ctaText={PORTFOLIO.open}
      initialIndex={start >= 0 && !restored ? start : undefined}
      onOpen={(i, e, card) => {
        morphClick(e, open, { href: cards[i].href, small: cards[i].img, large: conceptPhoto(PORTFOLIO.items[i].slug), el: card, shade: COVER_SHADE });
      }}
      label={PORTFOLIO.title}
      prevLabel={PORTFOLIO.prev}
      nextLabel={PORTFOLIO.next}
      slideLabel={(n) => `${PORTFOLIO.sampleLabel} ${n}`}
    />
  );
}
