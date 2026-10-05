import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { PROCESS } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { Button, EASE, Reveal } from "./ui";

/** where along the road each milestone's node sits (0–1) — the left edge of each of the four columns */
const STOPS = [0, 0.25, 0.5, 0.75];

function Milestone({ s, lit, last }: { s: (typeof PROCESS.steps)[number]; lit: boolean; last: boolean }) {
  return (
    <li className="relative flex flex-col">
      {/* the day, big — it's the promise */}
      <motion.p
        animate={{ color: lit ? "#f4efec" : "rgba(244,239,236,0.12)", y: lit ? 0 : 10 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="display whitespace-nowrap text-[clamp(2.6rem,5.2vw,5.6rem)] leading-[0.9] tracking-[-0.04em]"
      >
        {s.meta}
      </motion.p>

      {/* the node on the road */}
      <div className="relative my-9 h-4">
        <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full">
        <motion.span
          animate={{
            backgroundColor: lit ? "#ff3b47" : "#141215",
            borderColor: lit ? "#ff3b47" : "rgba(244,239,236,0.22)",
            scale: lit ? 1 : 0.8,
            boxShadow: lit ? "0 0 0 6px rgba(255,59,71,0.14), 0 0 26px 4px rgba(255,59,71,0.6)" : "0 0 0 0 rgba(255,59,71,0)",
          }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0 rounded-full border-2"
        />
        {lit && last && <span className="pulse-ring text-accent" />}
        </span>
      </div>

      <motion.div
        animate={{ opacity: lit ? 1 : 0.3, y: lit ? 0 : 14, filter: lit ? "blur(0px)" : "blur(3px)" }}
        transition={{ duration: 0.8, ease: EASE, delay: lit ? 0.1 : 0 }}
        className="pr-6"
      >
        <h3 className="display-soft text-[clamp(1.35rem,1.9vw,1.9rem)] leading-tight">{s.title}</h3>
        <p className="mt-3 max-w-[26ch] text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed text-paper/65">{cz(s.text)}</p>
      </motion.div>
    </li>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(true);
  const [lit, setLit] = useState(0);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: wide ? ["start start", "end end"] : ["start 70%", "end 60%"] });
  // the current reaches the end a little before the pin releases, so the guarantee gets a beat
  const fill = useTransform(scrollYProgress, [0.04, 0.82], [0, 1], { clamp: true });
  const guarantee = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const guaranteeY = useTransform(scrollYProgress, [0.78, 0.92], [24, 0]);

  useMotionValueEvent(fill, "change", (v) => {
    let n = 0;
    for (let i = 0; i < STOPS.length; i++) if (v >= STOPS[i] - 0.01) n = i + 1;
    if (n !== lit) setLit(n);
    if (v >= 0.995 !== done) setDone(v >= 0.995);
  });

  const steps = PROCESS.steps;

  if (!wide) {
    return (
      <section id="postup" ref={sectionRef} className="relative px-4 py-24">
        <h2 className="display text-[clamp(2.4rem,9vw,3.6rem)] leading-[0.98]">{cz(PROCESS.title)}</h2>
        <ol className="mt-14 flex flex-col gap-12">
          {steps.map((s, i) => (
            <Reveal key={s.title}>
              <Milestone s={s} lit last={i === steps.length - 1} />
            </Reveal>
          ))}
        </ol>
        <p className="display-soft mt-16 text-[1.5rem] leading-tight">{cz(PROCESS.guarantee)}</p>
        <Button href="#kontakt" size="lg" className="mt-7">
          {PROCESS.guaranteeCta}
          <ArrowRight className="size-4.5" strokeWidth={2.5} />
        </Button>
      </section>
    );
  }

  return (
    <section id="postup" ref={sectionRef} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-[88rem] flex-1 flex-col px-8 pb-[clamp(32px,6vh,72px)] pt-[clamp(110px,14vh,150px)]">
          <h2 className="display max-w-[16ch] text-[clamp(2.6rem,5vw,5.6rem)] leading-[0.98]">{cz(PROCESS.title)}</h2>

          <div className="relative mt-auto">
            {/* the road: a dim wire, the current filling it, and an endless dashed run past the last stop */}
            <div aria-hidden className="absolute inset-x-0 top-[calc(clamp(2.6rem,5.2vw,5.6rem)*0.9+2.25rem+0.5rem)]">
              <div className="relative h-px w-full bg-paper/10">
                <motion.div
                  style={{ scaleX: fill }}
                  className="absolute inset-0 origin-left bg-gradient-to-r from-signal via-accent to-[#ffc2c5] shadow-[0_0_16px_var(--color-accent)]"
                />
                <div
                  className={cn(
                    "absolute inset-y-0 left-full w-[50vw] transition-opacity duration-700",
                    done ? "opacity-100" : "opacity-0"
                  )}
                  style={
                    {
                      backgroundImage: "linear-gradient(90deg, rgba(255,59,71,0.9) 0 10px, transparent 10px 22px)",
                      backgroundSize: "22px 1px",
                      "--flow-len": "22px",
                      animation: "edge-flow-right 0.8s linear infinite",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <ol className="relative grid grid-cols-4">
              {steps.map((s, i) => (
                <Milestone key={s.title} s={s} lit={lit > i} last={i === steps.length - 1} />
              ))}
            </ol>

            <motion.div
              style={{ opacity: guarantee, y: guaranteeY }}
              className="mt-[clamp(32px,6vh,64px)] flex items-center justify-between gap-8 border-t border-paper/[0.07] pt-[clamp(24px,4vh,40px)]"
            >
              <p className="display-soft max-w-[30ch] text-[clamp(1.3rem,2vw,2rem)] leading-tight">{cz(PROCESS.guarantee)}</p>
              <Button href="#kontakt" size="lg" className="shrink-0 xl:px-9 xl:py-5 xl:text-[17px]">
                {PROCESS.guaranteeCta}
                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
