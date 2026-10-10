import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Lock, Quote, Star, UserRound } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import Contact from "../components/Contact";
import CurvedSteps from "../components/CurvedSteps";
import { Button, InstantReveal, Kicker, Reveal, SectionHead } from "../components/ui";
import { CONCEPT_DETAILS, CONCEPT_PAGE, cardPhoto, conceptPhoto, PORTFOLIO, PRICING, PROCESS, SITE } from "../content";
import { Landed, MorphImage, MorphLayer, useMorph } from "../lib/morph";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import NotFound from "./NotFound";
import { BackLink, ConceptCard, useDocumentTitle } from "./shared";

type Item = (typeof PORTFOLIO.items)[number];
type Detail = (typeof CONCEPT_DETAILS)[string];
type Plan = (typeof PRICING.plans)[number];

/** the photo, blurred, washing the top of the page — comes up as soon as the page is in place */
function Ambient({ src }: { src: string }) {
  const { holdContent } = useMorph();
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[62rem] overflow-hidden transition-opacity duration-700 [mask-image:linear-gradient(#000_30%,transparent)]",
        holdContent ? "opacity-0" : "opacity-100"
      )}
    >
      <img src={src} alt="" className="absolute inset-0 size-full scale-[1.15] object-cover blur-[48px] brightness-[0.28]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(20,18,21,0.2),rgba(20,18,21,0.95)_75%)]" />
    </div>
  );
}

/**
 * The key facts in one open strip under the browser window — hairlines between them, no boxes.
 * Hover lights a fact's value and runs a short red rule out under it.
 */
function Facts({ items }: { items: { label: string; value: string; sub?: string }[] }) {
  return (
    <dl className="flex flex-wrap justify-center">
      {items.map((f, k) => (
        <div key={f.label} className="group relative flex min-w-[11rem] flex-col items-center px-8 py-4 text-center xl:px-14">
          {k > 0 && <span aria-hidden className="absolute left-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-paper/20 to-transparent sm:block" />}
          <dt className="text-[0.9688rem] font-medium text-mute">{f.label}</dt>
          <dd className="display-soft mt-2 text-[clamp(1.65rem,2.2vw,2.35rem)] leading-tight transition-colors duration-300 group-hover:text-accent">{f.value}</dd>
          {f.sub && <dd className="mt-0.5 text-[0.9688rem] text-mute">{f.sub}</dd>}
          <span aria-hidden className="mt-3 h-0.5 w-3 rounded-full bg-accent/50 transition-[width,background-color,box-shadow] duration-500 group-hover:w-12 group-hover:bg-accent group-hover:shadow-[0_0_12px_rgba(255,59,71,0.9)]" />
        </div>
      ))}
    </dl>
  );
}

/** headline, then the site itself in a browser window — the spot the card's photo flies to */
function Hero({ p, d, n, plan, launch }: { p: Item; d: Detail; n: number; plan: Plan; launch: string }) {
  const { holdContent } = useMorph();
  // the words sit at z-[2], above the photo while it flies in
  return (
    <section className="relative pb-10 pt-[7.5rem] min-[1224px]:pt-[8.75rem]">
      <Ambient src={cardPhoto(p.src)} />
      <div className="relative mx-auto max-w-[88rem] px-4 md:px-8">
        <Landed className="relative z-[2] flex items-center justify-between gap-4">
          <BackLink fallback="/#koncepty" label={CONCEPT_PAGE.back} onlyFrom="/" />
          <span className="rounded-full border border-paper/20 bg-black/30 px-3.5 py-1.5 text-[0.8438rem] font-medium tabular-nums text-paper/85">
            {CONCEPT_PAGE.label(n, PORTFOLIO.items.length)}
          </span>
        </Landed>

        <div className="relative z-[2] mt-10 grid items-end gap-6 lg:grid-cols-12 lg:gap-10 max-md:text-center">
          <Landed i={1} className="lg:col-span-8">
            <h1 tabIndex={-1} className="display text-[clamp(3rem,5.8vw,6.6rem)] leading-[0.92] outline-none">
              {cz(d.headline)}
            </h1>
          </Landed>
          <Landed i={2} className="lg:col-span-4 lg:pb-2">
            <p className="text-[clamp(1.2rem,1.45vw,1.45rem)] font-medium text-paper/85">{p.subtitle}</p>
            <p className="mt-2 max-w-[36ch] text-[1.0625rem] leading-relaxed text-mute max-md:mx-auto">{cz(CONCEPT_PAGE.honesty)}</p>
          </Landed>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: holdContent ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mt-12 rounded-[1.75rem] border border-paper/12 bg-[#0b0a0c]/90 p-2.5 shadow-[0_60px_140px_-50px_rgba(0,0,0,0.95),0_0_90px_-34px_rgba(255,59,71,0.35)]"
        >
          <Landed i={1}>
            <div className="flex items-center gap-4 px-3 pb-3 pt-1.5">
              <span aria-hidden className="flex w-[3.25rem] gap-1.5">
                <i className="size-2.5 rounded-full bg-paper/15" />
                <i className="size-2.5 rounded-full bg-paper/15" />
                <i className="size-2.5 rounded-full bg-accent/70" />
              </span>
              <span className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-2 truncate rounded-full bg-paper/[0.06] px-4 py-1.5 text-[0.8125rem] text-mute">
                <Lock className="size-3 shrink-0" strokeWidth={2.6} />
                {SITE.domain}/koncepty/{p.slug}
              </span>
              <span aria-hidden className="w-[3.25rem]" />
            </div>
          </Landed>
          <MorphImage small={cardPhoto(p.src)} large={conceptPhoto(p.slug)} alt={p.alt} className="aspect-[16/9] w-full rounded-[1.25rem]" />
          {!d.preview && (
            <MorphLayer className="bottom-[1.625rem] right-[1.625rem]">
              <span className="block rounded-full bg-black/60 px-3.5 py-1.5 text-[0.8125rem] text-paper/80 backdrop-blur-md">{CONCEPT_PAGE.previewNote}</span>
            </MorphLayer>
          )}
        </motion.div>

        <Landed i={3} className="relative z-[2] mt-8">
          <Facts
            items={[
              { label: CONCEPT_PAGE.facts.plan, value: plan.name },
              { label: CONCEPT_PAGE.facts.price, value: plan.price, sub: plan.per },
              { label: CONCEPT_PAGE.facts.launch, value: launch },
              { label: CONCEPT_PAGE.facts.scope, value: CONCEPT_PAGE.scope(plan.name, d.pages.length) },
            ]}
          />
        </Landed>
      </div>
    </section>
  );
}

/** the package this concept would be built on — the same card as the featured price on the home page */
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="relative mx-auto flex max-w-md flex-col items-center rounded-[1.75rem] bg-gradient-to-b from-accent/[0.14] via-[#120e11] to-[#0a090b] px-8 pb-10 pt-14 text-center shadow-[0_40px_100px_-40px_rgba(255,59,71,0.6)] lg:max-w-none xl:px-12 xl:pb-12 xl:pt-16"
    >
      <span className="conic-ring" aria-hidden />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-accent/25" aria-hidden />
      {plan.featured && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-signal px-5 py-2 text-[0.875rem] font-semibold text-white shadow-[0_0_24px_-4px_var(--color-accent)]">
          {PRICING.featuredLabel}
        </span>
      )}
      <h3 className="text-[1.1875rem] font-semibold text-accent xl:text-[1.3125rem]">{plan.name}</h3>
      <p className="display mt-5 text-[clamp(2.8rem,4.4vw,4.6rem)] leading-none">{plan.price}</p>
      <p className="mt-2.5 text-[0.9688rem] text-mute xl:text-[1.0625rem]">{plan.per}</p>
      <p className="mt-6 max-w-[32ch] text-[1.125rem] leading-relaxed text-paper/80 xl:text-[1.1875rem]">{cz(plan.desc)}</p>
      <ul className="mt-8 flex w-full flex-col gap-4 border-t border-paper/10 pt-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center justify-center gap-3 text-[1.0625rem] text-paper/85 xl:text-[1.125rem]">
            <Check className="size-5 shrink-0 text-accent" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto w-full pt-10">
        <Button href="#kontakt" size="lg" className="w-full xl:py-5 xl:text-[1.0938rem]">
          {CONCEPT_PAGE.planCta}
        </Button>
      </div>
    </motion.div>
  );
}

/** the price: the words on the left, the price card from the home page on the right */
function Price({ plan }: { plan: Plan }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-1/2 size-[40rem] -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[140px]" />
      <div className="relative mx-auto grid max-w-[88rem] items-center gap-16 px-4 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 max-lg:text-center">
          <Reveal>
            <Kicker className="xl:text-[1rem]">{CONCEPT_PAGE.planKicker}</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-5 max-w-[13ch] text-[clamp(2.6rem,4.6vw,5.2rem)] leading-[0.98] max-lg:mx-auto">{cz(CONCEPT_PAGE.priceTitle)}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[40ch] text-[clamp(1.2rem,1.5vw,1.5rem)] leading-relaxed text-paper/75 max-lg:mx-auto">{cz(PRICING.description)}</p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-5 max-w-[46ch] text-[1.0938rem] leading-relaxed text-mute max-lg:mx-auto">{cz(PRICING.note)}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <a href="/#cenik" className="group mt-9 inline-flex items-center gap-2 text-[1.0625rem] font-semibold text-paper transition-colors hover:text-accent">
              {CONCEPT_PAGE.allPlans}
              <ArrowRight className="size-4.5 text-accent transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <PlanCard plan={plan} />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * What the site has to do, as a deck of cards: stacked and squared up while the section comes in,
 * then they deal out into a fan. Hover lifts a card out of the fan, straightens it and runs a
 * light round its edge. Below md the cards simply stack down the page.
 */
function About({ d }: { d: Detail }) {
  const deckRef = useRef<HTMLDivElement>(null);
  const instant = useContext(InstantReveal);
  const inView = useInView(deckRef, { once: true, amount: 0.45 });
  const dealt = inView || instant;
  // the deal is staggered; after it has played, a hover answers at once
  const [settled, setSettled] = useState(instant);
  const [lifted, setLifted] = useState<number | null>(null);
  useEffect(() => {
    if (!dealt || settled) return;
    const t = window.setTimeout(() => setSettled(true), 1100);
    return () => window.clearTimeout(t);
  }, [dealt, settled]);
  const n = d.features.length;

  const card = (f: Detail["features"][number], i: number, on: boolean) => (
    <>
      {on && (
        <span className="orbit-glow" aria-hidden>
          <span className="orbit-ring" />
        </span>
      )}
      {on && <span className="orbit-ring" aria-hidden />}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="absolute -right-16 -top-16 size-48 rounded-full bg-accent/[0.12] blur-3xl transition-opacity duration-500" style={{ opacity: on ? 1 : 0.5 }} />
      </span>
      <span className="relative font-sans text-[3.4rem] font-black leading-none tracking-[-0.05em] text-accent [text-shadow:0_0_30px_rgba(255,59,71,0.45)]">
        {String(i + 1).padStart(2, "0")}
      </span>
      <div className="relative mt-auto">
        <h3 className="display-soft text-[clamp(1.5rem,1.9vw,1.95rem)] leading-tight">{f.title}</h3>
        <p className="mt-3 text-[1.125rem] leading-relaxed text-paper/70">{cz(f.text)}</p>
      </div>
    </>
  );
  const face = "relative flex flex-col rounded-[1.75rem] border border-paper/10 bg-[linear-gradient(160deg,#1a161a,#0b0a0c_65%)] p-8 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] xl:p-9";

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={CONCEPT_PAGE.aboutKicker} title={CONCEPT_PAGE.aboutTitle} desc={d.about} size="lg" />

        {/* md and up: the deck */}
        <div ref={deckRef} className="relative mx-auto mt-20 hidden h-[31rem] max-w-[78rem] items-center justify-center md:flex">
          {d.features.map((f, i) => {
            const off = i - (n - 1) / 2;
            const on = lifted === i;
            return (
              <motion.article
                key={f.title}
                onHoverStart={() => setLifted(i)}
                onHoverEnd={() => setLifted((l) => (l === i ? null : l))}
                initial={false}
                animate={
                  dealt
                    ? { x: `${off * 104}%`, y: on ? -22 : Math.abs(off) * 26, rotate: on ? 0 : off * 5, scale: on ? 1.05 : 1 }
                    : { x: `${off * 5}%`, y: Math.abs(off) * 6, rotate: off * 8, scale: 0.92 }
                }
                transition={{ type: "spring", stiffness: 150, damping: 19, delay: dealt && !settled ? 0.12 + i * 0.09 : 0 }}
                style={{ zIndex: on ? 20 : 10 - Math.abs(off) }}
                className={cn(face, "absolute h-[26rem] w-[min(23rem,30vw)] cursor-default")}
              >
                {card(f, i, on)}
              </motion.article>
            );
          })}
        </div>

        {/* below md: the cards down the page */}
        <div className="mt-14 flex flex-col gap-4 md:hidden">
          {d.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <article className={cn(face, "min-h-[16rem] items-center text-center")}>{card(f, i, false)}</article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center">
          <p className="text-[1rem] font-medium text-mute">{CONCEPT_PAGE.pagesLabel}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {d.pages.map((pg) => (
              <li key={pg} className="rounded-full border border-paper/12 bg-card/60 px-4 py-2 text-[1.0625rem] text-paper/85 transition-[border-color,color] duration-300 hover:border-accent/50 hover:text-paper">
                {pg}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** the agency's real process and timings, strung on one curved wire */
function Steps() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={CONCEPT_PAGE.processKicker} title={CONCEPT_PAGE.processTitle} desc={PROCESS.guarantee.replace(" %", "\u00a0%")} size="lg" />
        <div className="mt-12">
          <CurvedSteps steps={PROCESS.steps} />
        </div>
      </div>
    </section>
  );
}

/** an empty frame where the client's review goes, once there is a client — nothing made up */
function Review({ p }: { p: Item }) {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <Reveal>
          <Kicker>{CONCEPT_PAGE.reviewKicker}</Kicker>
        </Reveal>
        <Reveal delay={0.1}>
          <figure className="relative mt-10 rounded-[2rem] border border-dashed border-paper/15 bg-[#0b0a0c]/70 px-8 py-14 md:px-16">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-paper/15 bg-ink px-4 py-1 text-[0.8125rem] text-mute">
              {CONCEPT_PAGE.reviewBadge}
            </span>
            <Quote aria-hidden className="mx-auto size-10 text-accent/50" />
            <div aria-hidden className="mt-6 flex justify-center gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-5 text-paper/20" strokeWidth={1.8} />
              ))}
            </div>
            <blockquote className="display-soft mx-auto mt-6 max-w-[30ch] text-[clamp(1.4rem,2.1vw,2rem)] leading-snug text-paper/50">
              {cz(CONCEPT_PAGE.reviewText)}
            </blockquote>
            <figcaption className="mt-9 flex items-center justify-center gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-dashed border-paper/25 text-mute">
                <UserRound className="size-5" />
              </span>
              <span className="text-left">
                <span className="block font-semibold text-paper/55">{CONCEPT_PAGE.reviewAuthor}</span>
                <span className="text-[0.875rem] text-mute">{CONCEPT_PAGE.reviewRole(p.title)}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export default function ConceptPage({ slug }: { slug: string }) {
  const i = PORTFOLIO.items.findIndex((x) => x.slug === slug);
  const p = PORTFOLIO.items[i];
  const d = p ? CONCEPT_DETAILS[p.slug] : undefined;
  useDocumentTitle(p && d ? CONCEPT_PAGE.documentTitle(p.title) : null);
  const plan = d && PRICING.plans.find((x) => x.name === d.plan);
  if (!p || !d || !plan) return <NotFound />;

  const launch = plan.features.find((f) => f.startsWith("Spuštění"))?.replace(/^Spuštění\s*/, "") ?? "";
  const next = PORTFOLIO.items[(i + 1) % PORTFOLIO.items.length];

  return (
    <>
      <Hero p={p} d={d} n={i + 1} plan={plan} launch={launch} />
      <About d={d} />
      <Steps />
      <Price plan={plan} />
      <Review p={p} />
      <section className="relative pb-6 pt-10">
        <div className="mx-auto max-w-[88rem] px-4 md:px-8">
          <Reveal>
            <ConceptCard slug={next.slug} wide label={CONCEPT_PAGE.nextLabel} />
          </Reveal>
        </div>
      </section>
      <Contact trade={d.trade} pinned={false} />
    </>
  );
}
