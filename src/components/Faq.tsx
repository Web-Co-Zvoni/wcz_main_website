import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Plus } from "lucide-react";
import { useId, useState } from "react";
import { FAQ, SITE } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { Button, EASE, Reveal } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="faq" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-4 md:grid-cols-12 md:gap-10 md:px-8">
        {/* the heading sits level with the middle of the questions */}
        <div className="md:col-span-5 md:flex md:items-center">
          <div>
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

        <div className="border-b border-paper/[0.09] md:col-span-7">
          {FAQ.items.map((f, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-a${i}`;
            return (
              <Reveal key={f.question} delay={i * 0.04} y={18}>
                <div className="group relative border-t border-paper/[0.09]">
                  {/* a red line runs out along the rule on hover, and stays while open */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -top-px h-px origin-left bg-gradient-to-r from-accent via-accent to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center gap-6 py-8 text-left focus-visible:outline-offset-4"
                    >
                      <span
                        className={cn(
                          "display-soft flex-1 text-[clamp(1.25rem,1.75vw,1.75rem)] leading-snug transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isOpen ? "translate-x-2 text-paper" : "text-paper/75 group-hover:translate-x-2 group-hover:text-paper"
                        )}
                      >
                        {cz(f.question)}
                      </span>
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color,box-shadow] duration-500",
                          isOpen
                            ? "rotate-45 border-signal bg-signal text-white shadow-[0_0.5rem_1.5rem_-0.375rem_rgba(255,59,71,0.8)]"
                            : "border-paper/15 text-mute group-hover:border-accent/60 group-hover:text-accent"
                        )}
                      >
                        <Plus className="size-5" strokeWidth={2.2} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                        animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                        exit={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[58ch] pb-9 pl-2 text-[clamp(1.02rem,1.2vw,1.2rem)] leading-relaxed text-paper/65">{cz(f.answer)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
