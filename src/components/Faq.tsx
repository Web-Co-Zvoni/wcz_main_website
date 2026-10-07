import { ArrowRight, Mail } from "lucide-react";
import { useRef } from "react";
import { FAQ, SITE } from "../content";
import { cz } from "../utils/typo";
import ScrollStack, { ScrollStackItem } from "./fx/ScrollStack";
import { Button, Reveal } from "./ui";

export default function Faq() {
  const asideRef = useRef<HTMLDivElement>(null);
  return (
    <section id="faq" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-4 md:grid-cols-12 md:gap-10 md:px-8">
        {/* held level with the deck by ScrollStack, so the two let go together */}
        <div className="md:col-span-5">
          <div ref={asideRef} className="will-change-transform">
            <Reveal>
              <h2 className="display max-w-[11ch] text-[clamp(2.6rem,5vw,5.6rem)] leading-[0.98]">{cz(FAQ.title)}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-10 text-[clamp(1.05rem,1.3vw,1.3rem)] text-paper/70">{FAQ.more}</p>
              <a
                href={`mailto:${SITE.email}`}
                className="group mt-4 inline-flex items-center gap-3.5 text-paper transition-colors hover:text-accent"
              >
                <span className="grid size-11 place-items-center rounded-full border border-paper/15 text-accent transition-colors duration-300 group-hover:border-accent/60">
                  <Mail className="size-4.5" />
                </span>
                <span className="display-soft text-[clamp(1.25rem,1.7vw,1.7rem)]">{SITE.email}</span>
              </a>
              <div className="mt-8">
                <Button href="#kontakt" size="lg" className="xl:px-9 xl:py-5 xl:text-[1.0625rem]">
                  {FAQ.formCta}
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* the answers pile up into a deck as you scroll */}
        <ScrollStack className="md:col-span-7" itemDistance={56} itemStackDistance={26} itemScale={0.025} baseScale={0.88} stackPosition="center" lift={0.06} asideRef={asideRef} scaleEndPosition={0.09}>
          {FAQ.items.map((f, i) => (
            <ScrollStackItem key={f.question} className="rounded-[2rem]">
              <article className="group/card relative flex min-h-[clamp(18.75rem,36vh,22.5rem)] flex-col rounded-[2rem] border border-paper/[0.09] bg-[linear-gradient(160deg,#25212a,#19171a_70%)] p-8 shadow-[0_-24px_60px_-28px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025] xl:p-11">
                {/* light running round the border: full on the card being read or hovered, faint on the rest */}
                <span aria-hidden className="orbit-glow opacity-0 transition-opacity duration-700 group-hover/card:opacity-70 group-data-[active=true]/stack:opacity-60">
                  <span className="orbit-ring" />
                </span>
                <span aria-hidden className="orbit-ring opacity-20 transition-opacity duration-700 group-hover/card:opacity-100 group-data-[active=true]/stack:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full border border-accent/40 text-[0.875rem] font-bold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.8125rem] tabular-nums text-mute">
                    {i + 1} / {FAQ.items.length}
                  </span>
                </div>
                <h3 className="display mt-auto pt-10 text-[clamp(1.6rem,2.3vw,2.4rem)] leading-[1.06]">{cz(f.question)}</h3>
                <p className="mt-4 max-w-[54ch] text-[clamp(1.02rem,1.2vw,1.2rem)] leading-relaxed text-paper/65">{cz(f.answer)}</p>
              </article>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
