import { ArrowUpRight, ChevronRight, Phone, Search } from "lucide-react";
import { NICHE_PAGE, NICHE_PAGES, NICHES, PRICING, PROCESS, ROUTES, SITE } from "../content";
import { BentoCard } from "../components/Bento";
import Contact from "../components/Contact";
import { NICHE_ICONS } from "../components/nicheIcons";
import Shell from "../components/Shell";
import { Button, Kicker, Reveal, SectionHead } from "../components/ui";
import { homeLink } from "../utils/homeLink";
import { cz } from "../utils/typo";

/** the carousel photos are 600² crops — the hero wants a bigger portrait one from the same Pexels source */
const heroPhoto = (src: string) => src.replace(/h=\d+&w=\d+/, "h=1250&w=1000");

function Hero({ niche, page }: { niche: (typeof NICHES.items)[number]; page: (typeof NICHE_PAGES)[string] }) {
  const Icon = NICHE_ICONS[niche.icon];
  return (
    <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[38rem] rounded-full bg-accent/10 blur-[140px]" />
      <div className="relative mx-auto grid max-w-[88rem] items-center gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <nav aria-label="Drobečková navigace">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.8438rem] text-mute">
                <li>
                  <a href="/" className="transition-colors hover:text-paper">{NICHE_PAGE.home}</a>
                </li>
                <ChevronRight aria-hidden className="size-3.5 text-mute/50" />
                <li>
                  <a href="/#obory" className="transition-colors hover:text-paper">{NICHE_PAGE.section}</a>
                </li>
                <ChevronRight aria-hidden className="size-3.5 text-mute/50" />
                <li aria-current="page" className="text-paper/80">{niche.name}</li>
              </ol>
            </nav>
          </Reveal>
          <Reveal delay={0.06}>
            <Kicker className="mt-10">{niche.group}</Kicker>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="display mt-5 max-w-[14ch] text-[clamp(2.6rem,5.4vw,5.8rem)] leading-[0.98]">{cz(page.heading)}</h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-7 max-w-[46ch] text-[clamp(1.1rem,1.4vw,1.4rem)] leading-relaxed text-paper/70">{cz(page.lead)}</p>
          </Reveal>
          <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#kontakt" size="lg" shine>
              {NICHE_PAGE.primaryCta}
              <ArrowUpRight className="size-4" />
            </Button>
            <Button href={`tel:${SITE.phoneLink}`} size="lg" variant="ghost">
              <Phone className="size-4" />
              <span className="tabular-nums">{SITE.phone}</span>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={40} className="lg:col-span-5">
          <figure>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-paper/[0.08] shadow-[0_60px_120px_-60px_rgba(0,0,0,0.9)]">
              <img src={heroPhoto(niche.src)} alt={niche.alt} className="aspect-[4/5] w-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 grid size-12 place-items-center rounded-2xl bg-signal text-white shadow-[0_0_24px_-6px_var(--color-accent)]">
                <Icon className="size-5" strokeWidth={2.2} />
              </span>
            </div>
            <figcaption className="mt-3 text-[0.7812rem] text-mute/70">{NICHE_PAGE.photoNote}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/** the queries we want to rank for, drawn as a search box with suggestions */
function Searches({ searches }: { searches: string[] }) {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={NICHE_PAGE.searchKicker} title={NICHE_PAGE.searchTitle} desc={NICHE_PAGE.searchNote} />
        <Reveal delay={0.1} className="mx-auto mt-14 max-w-2xl">
          <div className="overflow-hidden rounded-[1.75rem] border border-paper/10 bg-[#0b0a0c]">
            <div className="flex items-center gap-3 border-b border-paper/10 px-6 py-5">
              <Search className="size-5 text-accent" />
              <span className="text-[1.0625rem] text-paper">{searches[0]}</span>
              <span aria-hidden className="h-5 w-px animate-signal bg-accent" />
            </div>
            <ul className="divide-y divide-paper/[0.05]">
              {searches.map((q) => (
                <li key={q} className="flex items-center gap-3 px-6 py-3.5 text-[0.9688rem] text-paper/75">
                  <Search className="size-4 text-mute/60" />
                  {q}
                  <ArrowUpRight aria-hidden className="ml-auto size-4 text-mute/40" />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Needs({ needs }: { needs: { title: string; text: string }[] }) {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={NICHE_PAGE.needsKicker} title={NICHE_PAGE.needsTitle} />
        <ul className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2 md:gap-5">
          {needs.map((n, i) => (
            <BentoCard key={n.title} as="li" delay={i * 0.08} className="p-8 md:p-10">
              <span className="display text-[1.125rem] text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-6 text-[clamp(1.4rem,1.9vw,1.9rem)] leading-[1.08]">{cz(n.title)}</h3>
              <p className="mt-3 max-w-[42ch] text-[1.0312rem] leading-relaxed text-mute">{cz(n.text)}</p>
            </BentoCard>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProcessAndPrice() {
  const start = PRICING.plans[0].price;
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <SectionHead kicker={NICHE_PAGE.processKicker} title={PROCESS.title} />
        <ol className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.steps.map((s, i) => (
            <BentoCard key={s.title} as="li" delay={i * 0.08} className="p-7">
              <span className="text-[0.8438rem] font-semibold text-accent">{s.meta}</span>
              <h3 className="mt-3 text-[1.1875rem] font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[0.9688rem] leading-relaxed text-mute">{cz(s.text)}</p>
            </BentoCard>
          ))}
        </ol>

        <Reveal delay={0.1} className="mx-auto mt-6 max-w-6xl">
          <div className="flex flex-col items-start gap-6 rounded-[1.5rem] border border-accent/25 bg-gradient-to-r from-accent/[0.1] to-transparent p-7 md:flex-row md:items-center md:p-9">
            <div>
              <p className="text-[0.9688rem] text-mute">{NICHE_PAGE.priceLead}</p>
              <p className="display mt-1 text-[clamp(2.2rem,3.4vw,3.4rem)] leading-none">{start}</p>
              <p className="mt-2 text-[0.9062rem] text-mute">{NICHE_PAGE.priceNote}</p>
            </div>
            <p className="max-w-[44ch] text-[1rem] leading-relaxed text-paper/75 md:ml-10">{cz(PROCESS.guarantee)}</p>
            <Button href={homeLink("#cenik")} variant="ghost" className="md:ml-auto">
              {NICHE_PAGE.priceLink}
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OtherNiches({ current }: { current: string }) {
  return (
    <section className="relative pb-6 pt-14">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
        <Reveal>
          <h2 className="text-[1.0625rem] font-semibold text-mute">{NICHE_PAGE.othersTitle}</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {NICHES.items
              .filter((n) => n.slug !== current)
              .map((n) => {
                const Icon = NICHE_ICONS[n.icon];
                return (
                  <li key={n.slug}>
                    <a
                      href={ROUTES.niche(n.slug)}
                      className="group inline-flex items-center gap-2 rounded-full border border-paper/12 bg-ink/50 px-4 py-2.5 text-[0.9062rem] text-paper/80 transition-colors duration-300 hover:border-accent/60 hover:text-paper"
                    >
                      <Icon className="size-4 text-mute transition-colors duration-300 group-hover:text-accent" />
                      {n.name}
                    </a>
                  </li>
                );
              })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export default function NichePage({ slug }: { slug: string }) {
  const niche = NICHES.items.find((n) => n.slug === slug);
  const page = NICHE_PAGES[slug];
  if (!niche || !page) throw new Error(`Unknown niche page: ${slug}`);

  return (
    <Shell>
      <Hero niche={niche} page={page} />
      <Searches searches={page.searches} />
      <Needs needs={page.needs} />
      <ProcessAndPrice />
      <OtherNiches current={slug} />
      <Contact defaultTrade={page.trade} />
    </Shell>
  );
}
