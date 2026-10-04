import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQ, SITE } from "../content";
import { cn } from "../utils/cn";
import { EASE, Reveal, SectionHead } from "./ui";
import { cz } from "../utils/typo";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <SectionHead kicker={FAQ.kicker} title={FAQ.title} />

        <div className="mt-14 flex flex-col gap-3">
          {FAQ.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.question} delay={i * 0.05} y={16}>
                <div
                  className={cn(
                    "rounded-2xl border transition-[border-color,background-color,box-shadow] duration-500",
                    isOpen
                      ? "border-accent/35 bg-card/70 shadow-[0_20px_60px_-30px_rgba(61,245,140,0.45)]"
                      : "border-paper/[0.08] bg-coal/40 hover:border-paper/20"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group relative flex w-full items-center justify-center gap-4 px-14 py-6 text-center"
                  >
                    <span
                      className={cn(
                        "display-soft text-[16.5px] leading-snug transition-colors duration-300 md:text-[19px]",
                        isOpen ? "text-paper" : "text-paper/85 group-hover:text-paper"
                      )}
                    >
                      {cz(f.question)}
                    </span>
                    <span
                      className={cn(
                        "absolute right-5 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500",
                        isOpen
                          ? "rotate-45 border-accent bg-accent text-white shadow-[0_0_20px_-2px_var(--color-accent)]"
                          : "border-paper/15 text-mute group-hover:border-accent/60 group-hover:text-accent"
                      )}
                    >
                      <Plus className="size-4" strokeWidth={2.5} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="mx-auto max-w-xl px-6 pb-7 text-center text-[15.5px] leading-relaxed text-mute">
                          {cz(f.answer)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center text-[15px] text-mute">
            {FAQ.more}{" "}
            <a href={`tel:${SITE.phoneLink}`} className="font-semibold text-paper tabular-nums underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent">
              {SITE.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
