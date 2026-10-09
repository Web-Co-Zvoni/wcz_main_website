import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, type Ref } from "react";
import { cardPhoto, conceptPhoto, PORTFOLIO, ROUTES } from "../content";
import { COVER_SHADE } from "../components/fx/CoverFlow";
import { morphClick, useMorph } from "../lib/morph";
import { canGoBack, currentEntry } from "../lib/router";
import { cn } from "../utils/cn";

const HOME_TITLE = document.title;

/** the tab title for a page; null puts the home page's back */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    document.title = title ?? HOME_TITLE;
  }, [title]);
}

/**
 * Back: steps back through the site's history when the visitor came from inside the site (so the
 * photo flies home into its card), otherwise opens `fallback` — the section the page belongs to.
 * With `onlyFrom` it steps back only when this page was opened from that page; from anywhere else
 * it opens `fallback`, so clicking through ten concepts doesn't take ten Backs to get out.
 */
export function BackLink({ fallback, label, onlyFrom }: { fallback: string; label: string; onlyFrom?: string }) {
  return (
    <a
      href={fallback}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !canGoBack()) return;
        if (onlyFrom !== undefined && currentEntry().state.morph?.path !== onlyFrom) return;
        e.preventDefault();
        history.back();
      }}
      className="group inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink/55 py-2 pl-3 pr-4 text-[0.9062rem] font-medium text-paper/85 backdrop-blur-md transition-colors duration-300 hover:border-accent/60 hover:text-paper"
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.4} />
      {label}
    </a>
  );
}

/** darkening from the left, for the words on a wide concept card */
const WIDE_SHADE = "linear-gradient(90deg, rgba(10,9,11,0.94) 0%, rgba(10,9,11,0.6) 42%, rgba(10,9,11,0.08) 100%)";

/**
 * A concept as a card that flies into its page. Portrait like the cover-flow cards, or `wide`
 * (the "next concept" banner), which shows the page's own large photo so nothing crossfades.
 */
export function ConceptCard({
  slug,
  wide = false,
  label,
  className,
  cardRef,
}: {
  slug: string;
  wide?: boolean;
  /** small line above the title */
  label?: string;
  className?: string;
  cardRef?: Ref<HTMLAnchorElement>;
}) {
  const { open } = useMorph();
  const own = useRef<HTMLAnchorElement | null>(null);
  const p = PORTFOLIO.items.find((x) => x.slug === slug);
  if (!p) return null;

  const href = ROUTES.concept(slug);
  const large = conceptPhoto(slug);
  const small = wide ? large : cardPhoto(p.src);
  const shade = wide ? WIDE_SHADE : COVER_SHADE;

  return (
    <a
      ref={(el) => {
        own.current = el;
        if (typeof cardRef === "function") cardRef(el);
        else if (cardRef) cardRef.current = el;
      }}
      href={href}
      onClick={(e) => morphClick(e, open, { href, small, large, el: own.current, shade })}
      className={cn(
        "group relative block overflow-hidden border border-paper/12 bg-[#0b0a0c] shadow-[0_25px_60px_rgba(0,0,0,0.75)] transition-[border-color,box-shadow] duration-500 hover:border-accent/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_44px_rgba(255,59,71,0.22)]",
        wide ? "h-[clamp(18rem,26vw,25rem)] rounded-[1.75rem]" : "aspect-[37/56] rounded-[1.625rem]",
        className
      )}
    >
      <img src={small} alt={p.alt} draggable={false} className="absolute inset-0 size-full object-cover" />
      <div aria-hidden className="absolute inset-0" style={{ background: shade }} />

      {wide ? (
        <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
          {label && <span className="text-[0.9375rem] font-medium text-paper/70">{label}</span>}
          <span className="display mt-2 text-[clamp(2.4rem,4.6vw,5.2rem)] uppercase leading-none tracking-[0.01em]">{p.title}</span>
          <span className="mt-3 text-[1.0625rem] text-paper/75">{p.subtitle}</span>
          <span className="absolute bottom-8 right-8 grid size-16 place-items-center rounded-full bg-signal text-white shadow-[0_0_30px_-6px_var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1 md:bottom-12 md:right-12">
            <ArrowRight className="size-6" strokeWidth={2.4} />
          </span>
        </div>
      ) : (
        <div className="relative flex h-full flex-col justify-end px-6 pb-7 text-center">
          {label && <span className="text-[0.8125rem] font-medium text-paper/70">{label}</span>}
          <span className="display mt-1 text-[clamp(1.6rem,2vw,2.1rem)] uppercase leading-[1.05] tracking-[0.02em] [text-shadow:0_3px_12px_rgba(0,0,0,0.95)]">{p.title}</span>
          <span className="mt-1 text-[1rem] font-medium text-paper/80">{p.subtitle}</span>
          <span className="mx-auto mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-paper transition-colors group-hover:text-accent">
            {PORTFOLIO.open}
            <ArrowRight className="size-4 text-accent transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.6} />
          </span>
        </div>
      )}
    </a>
  );
}
