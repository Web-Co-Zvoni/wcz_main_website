import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQ, SITE } from "../content";
import { cn } from "../utils/cn";
import { EASE, Reveal, SectionHead } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              index="07"
              eyebrow={FAQ.eyebrow}
              titleClassName="lg:text-[clamp(2rem,3.35vw,3.2rem)]"
              title={
                <>
                  {FAQ.titleLead}
                  <br />
                  <span className="text-accent">{FAQ.titleAccent}</span>
                </>
              }
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mute">
                {FAQ.intro}
              </p>
              <a
                href={`tel:${SITE.phoneLink}`}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-paper/15 px-6 py-3.5 text-[14px] font-bold transition-all duration-300 hover:border-accent/60 hover:text-accent"
              >
                {SITE.phone}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col divide-y divide-paper/10 border-y border-paper/10">
              {FAQ.items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={f.question} delay={i * 0.05}>
                    <div>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                          <span
                            className={cn(
                              "stretch text-lg font-extrabold tracking-tight transition-colors duration-300 md:text-xl",
                              isOpen ? "text-accent" : "text-paper group-hover:text-accent"
                            )}
                          >
                            {f.question}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-400",
                            isOpen
                              ? "rotate-45 border-accent bg-accent text-ink"
                              : "border-paper/15 text-mute group-hover:border-accent/50 group-hover:text-accent"
                          )}
                        >
                          <Plus className="size-4.5" strokeWidth={2.5} />
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
                            <p className="max-w-2xl pb-7 pl-8 text-[15px] leading-relaxed text-mute">
                              {f.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
