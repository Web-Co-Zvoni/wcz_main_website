import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { EASE, Reveal, SectionHead } from "./ui";

const FAQS = [
  {
    q: "Kolik trvá výroba webu?",
    a: "Menší weby stíháme za 7–10 dní, ty větší za 2–3 týdny. Termín dostanete předem na papír — a když se zpozdíme z naší viny, máte slevu 10 %. Zpozdit se kvůli nám zkrátka nemůže stát vašeho času.",
  },
  {
    q: "Musím si něco připravit nebo vymyslet texty?",
    a: "Ne. Stačí telefon a půl hodina času na úvodní hovor. Texty napíšeme my, fotky použijeme vaše — nebo k vám přijedeme a dílnu, tým i hotové zakázky vyfotíme. Vy pak jen schválíte výsledek.",
  },
  {
    q: "Kolik mě web bude stát dohromady a do roka?",
    a: "Cenu návrhu a výroby víte předem a pevně. K tomu hosting a doména od 1 800 Kč ročně (první rok je od nás). Žádné skryté poplatky, žádné „měsíční paušály na nic“, o kterých se dozvíte až za půl roku.",
  },
  {
    q: "Co když se mi první návrh nebude líbit?",
    a: "První návrh děláme do 72 hodin zdarma a bez závazků. Upravujeme ho, dokud nesedne — a zaplatíte až po jeho schválení. Kdyby nesedl ani poté, rozejdeme se bez faktury a bez křiku.",
  },
  {
    q: "Zvládnu si web upravovat sám?",
    a: "Ano. Během 45 minut vás naučíme měnit texty, ceny i fotky — víc většinou není potřeba. A kdybyste si přesto nevěděli rady, stačí napsat; drobné úpravy pro klienty se správou děláme zdarma.",
  },
  {
    q: "Pomůžete i s Googlem, mapami a e-mailem?",
    a: "Jasně. Zřídíme a doladíme firemní profil na Google (mapy, recenze, fotky), e-maily na vaší doméně i propojení se sociálními sítěmi. Všechno okolo webu pod jednou střechou.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              index="07"
              eyebrow="Časté otázky"
              title={
                <>
                  Na rovinu
                  <br />
                  <span className="text-accent">odpovězeno.</span>
                </>
              }
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mute">
                Nenašli jste, co jste hledali? Zavolejte — raději odpovíme na hloupou otázku než na tu
                nezodpovězenou.
              </p>
              <a
                href="tel:+420777284596"
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-paper/15 px-6 py-3.5 text-[14px] font-bold transition-all duration-300 hover:border-accent/60 hover:text-accent"
              >
                777 284 596
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col divide-y divide-paper/10 border-y border-paper/10">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={f.q} delay={i * 0.05}>
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
                            {f.q}
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
                              {f.a}
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
