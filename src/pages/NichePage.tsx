import { Check, MoveHorizontal, Search } from "lucide-react";
import ConceptCarousel from "../components/ConceptCarousel";
import Contact from "../components/Contact";
import { PrimaryCta, SecondaryCta } from "../components/HeroCtas";
import { NICHE_ICONS } from "../components/Niches";
import { Kicker, Reveal, SectionHead } from "../components/ui";
import { heroPhoto, NICHE_DETAILS, NICHE_PAGE, NICHES, PORTFOLIO } from "../content";
import { Landed, MorphImage, MorphLayer } from "../lib/morph";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import NotFound from "./NotFound";
import { BackLink, useDocumentTitle } from "./shared";

type Niche = (typeof NICHES.items)[number];
type Detail = (typeof NICHE_DETAILS)[string];

/** the photo the card opened, full width, with the trade's headline over its foot */
function Hero({ n, d }: { n: Niche; d: Detail }) {
  const Icon = NICHE_ICONS[n.icon];
  return (
    // the photo fills the window (the words set the height when they need more), so the morph
    // ends on a full-screen photo — the fade into the page sits only in its last tenth
    <section className="relative flex min-h-[max(38rem,100vh)] flex-col">
      <MorphImage small={n.src} large={heroPhoto(n.src)} alt={n.alt} className="absolute inset-0" />
      <MorphLayer className="inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,21,0.72)_0%,rgba(20,18,21,0.06)_24%,rgba(20,18,21,0.22)_66%,rgba(20,18,21,0.55)_90%,#141215_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,18,21,0.92)_0%,rgba(20,18,21,0.55)_38%,transparent_72%)]" />
      </MorphLayer>

      {/* z-[2]: above the photo while it flies in */}
      <div className="relative z-[2] mx-auto flex w-full max-w-[88rem] flex-1 flex-col px-4 pb-20 pt-[7.5rem] md:px-8 md:pb-[clamp(6rem,15vh,12rem)] min-[1224px]:pt-[8.75rem]">
        <Landed>
          <BackLink fallback="/#obory" label={NICHE_PAGE.back} />
        </Landed>

        <div className="mt-auto pt-12">
          <Landed i={1}>
            <span className="inline-flex items-center gap-3 text-[1.0625rem] font-medium text-paper/80">
              <span className="grid size-10 place-items-center rounded-xl bg-signal text-white shadow-[0_0_24px_-6px_var(--color-accent)]">
                <Icon className="size-5" strokeWidth={2.2} />
              </span>
              {n.group}
            </span>
          </Landed>
          <Landed i={2}>
            <h1 tabIndex={-1} className="display mt-6 max-w-[13ch] text-[clamp(3rem,6.2vw,7.2rem)] leading-[0.92] outline-none">
              {cz(d.title)}
            </h1>
          </Landed>
          <Landed i={3}>
            <p className="mt-7 max-w-[46ch] text-[clamp(1.2rem,1.5vw,1.55rem)] leading-relaxed text-paper/75">{cz(d.lead)}</p>
          </Landed>
          <Landed i={4} className="mt-10 flex flex-wrap gap-4">
            <PrimaryCta href="#ukazky">{NICHE_PAGE.heroCta}</PrimaryCta>
            <SecondaryCta href="#kontakt" photo={n.src}>
              {NICHE_PAGE.heroCtaSecondary}
            </SecondaryCta>
          </Landed>
        </div>
      </div>
    </section>
  );
}

/** what the site does for this trade: a centred head, then four open numbered points */
function Features({ d }: { d: Detail }) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={NICHE_PAGE.featuresKicker} title={NICHE_PAGE.featuresTitle} desc={NICHE_PAGE.featuresLead} size="lg" />

        <ol className="mx-auto mt-20 grid max-w-[74rem] gap-x-20 gap-y-16 md:grid-cols-2">
          {d.features.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={0.06 + (i % 2) * 0.1}>
                {/* hover: the numeral lights up red, the rule under the words runs out */}
                <div className="group grid grid-cols-[auto_1fr] items-start gap-7">
                  <span aria-hidden className="relative select-none font-sans text-[clamp(4.4rem,6.6vw,7.4rem)] font-black leading-[0.8] tracking-[-0.06em] tabular-nums">
                    <span className="bg-gradient-to-b from-paper/30 to-paper/[0.04] bg-clip-text text-transparent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="absolute inset-0 text-accent opacity-0 transition-opacity duration-500 [text-shadow:0_0_38px_rgba(255,59,71,0.6)] group-hover:opacity-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="pt-1.5">
                    <h3 className="display-soft text-[clamp(1.55rem,2vw,2.15rem)] leading-tight">{f.title}</h3>
                    <p className="mt-3 max-w-[40ch] text-[1.125rem] leading-relaxed text-paper/65 xl:text-[1.1875rem]">{cz(f.text)}</p>
                    <span aria-hidden className="mt-6 block h-px origin-left scale-x-[0.18] bg-gradient-to-r from-accent via-accent/50 to-transparent shadow-[0_0_10px_rgba(255,59,71,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** what people around here type into Google — the first one with a blinking caret */
function Searches({ searches }: { searches: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-paper/10 bg-[#0b0a0c] p-6 md:p-8">
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(244,239,236,0.08)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,#000,transparent)]" />
      <p className="relative text-[0.9688rem] font-medium text-mute">{NICHE_PAGE.searchesLabel}</p>
      <ul className="relative mt-5 flex flex-col gap-3">
        {searches.map((q, i) => (
          <li
            key={q}
            className={cn(
              "flex items-center gap-3.5 rounded-full border px-5 py-3.5 text-[1.125rem]",
              i === 0 ? "border-accent/45 bg-accent/[0.07] text-paper shadow-[0_0_34px_-12px_rgba(255,59,71,0.7)]" : "border-paper/10 bg-ink/60 text-paper/70"
            )}
          >
            <Search className={cn("size-4.5 shrink-0", i === 0 ? "text-accent" : "text-mute")} strokeWidth={2.4} />
            <span>
              {q}
              {i === 0 && <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] animate-signal bg-accent" />}
            </span>
          </li>
        ))}
      </ul>
      <p className="relative mt-5 text-[1.0312rem] leading-relaxed text-mute">{cz(NICHE_PAGE.searchesNote)}</p>
    </div>
  );
}

/** how the site gets found */
function Optimisation({ d }: { d: Detail }) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-4 md:px-8 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div>
          <Reveal>
            <Kicker>{NICHE_PAGE.seoKicker}</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-5 max-w-[14ch] text-[clamp(2.4rem,4.2vw,4.6rem)] leading-[0.98]">{cz(NICHE_PAGE.seoTitle)}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[44ch] text-[clamp(1.15rem,1.4vw,1.4rem)] leading-relaxed text-mute">{cz(NICHE_PAGE.seoLead)}</p>
          </Reveal>
          <Reveal delay={0.24} className="mt-10">
            <Searches searches={d.searches} />
          </Reveal>
        </div>

        <ul className="self-center border-t border-paper/[0.08]">
          {NICHE_PAGE.seo.map((s, i) => (
            <li key={s.title} className="group relative border-b border-paper/[0.08]">
              {/* hover, as on the home page's questions: a red line runs out along the rule, the row steps forward */}
              <span
                aria-hidden
                className="absolute inset-x-0 -top-px z-[1] h-px origin-left scale-x-0 bg-gradient-to-r from-accent via-accent to-transparent shadow-[0_0_10px_rgba(255,59,71,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <Reveal delay={i * 0.05}>
                <div className="flex origin-left gap-5 py-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:scale-[1.025] xl:py-7">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/[0.08] text-accent transition-[background-color,border-color,color,box-shadow] duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-white group-hover:shadow-[0_0.5rem_1.5rem_-0.375rem_rgba(255,59,71,0.8)]">
                    <Check className="size-5" strokeWidth={2.6} />
                  </span>
                  <div>
                    <h3 className="display-soft text-[clamp(1.25rem,1.5vw,1.55rem)] leading-tight text-paper/85 transition-colors duration-500 group-hover:text-paper">{s.title}</h3>
                    <p className="mt-1.5 text-[1.0938rem] leading-relaxed text-paper/65">{cz(s.text)}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** the funnel: every concept in the carousel, turned to this trade's own one — the visitor picks */
function Funnel({ d }: { d: Detail }) {
  const startAt = d.concepts.find((s) => PORTFOLIO.items.some((p) => p.slug === s));

  return (
    <section id="ukazky" className="relative overflow-hidden py-24 md:py-32">
      <div className="relative px-4">
        <SectionHead kicker={NICHE_PAGE.funnelKicker} title={NICHE_PAGE.funnelTitle} desc={NICHE_PAGE.funnelLead} size="lg" />
      </div>

      <Reveal delay={0.1} y={40} className="mt-6">
        <ConceptCarousel startAt={startAt} />
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-4 flex items-center justify-center gap-2 px-4 text-center text-[0.9062rem] text-mute/80">
          <MoveHorizontal className="size-4 text-accent" />
          {PORTFOLIO.hint}
        </p>
      </Reveal>
    </section>
  );
}

export default function NichePage({ slug }: { slug: string }) {
  const n = NICHES.items.find((x) => x.slug === slug);
  const d = n ? NICHE_DETAILS[n.slug] : undefined;
  useDocumentTitle(d ? NICHE_PAGE.documentTitle(d.title) : null);
  if (!n || !d) return <NotFound />;

  return (
    <>
      <Hero n={n} d={d} />
      <Features d={d} />
      <Optimisation d={d} />
      <Funnel d={d} />
      <Contact trade={d.trade} pinned={false} />
    </>
  );
}
