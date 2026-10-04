import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { PROCESS } from "../content";
import { Button, EASE, Reveal, SectionHead } from "./ui";
import { cz } from "../utils/typo";

export default function Process() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="postup" className="relative px-4 py-24 md:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHead kicker={PROCESS.kicker} title={PROCESS.title} />

        <ol ref={trackRef} className="relative mx-auto mt-20 flex max-w-xl flex-col items-center gap-20 md:gap-24">
          {/* the wire, and the current running through it */}
          <span aria-hidden className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-paper/10" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-6 left-1/2 top-6 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-accent via-accent to-flame shadow-[0_0_14px_var(--color-accent)]"
          />

          {PROCESS.steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial="off"
              whileInView="on"
              viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
              className="relative flex flex-col items-center bg-ink px-6 py-2 text-center"
            >
              <motion.span
                variants={{
                  off: { borderColor: "rgba(244,239,236,0.15)", color: "#a39a9d", boxShadow: "0 0 0 0 rgba(61,245,140,0)" },
                  on: { borderColor: "rgba(61,245,140,0.9)", color: "#ffffff", boxShadow: "0 0 36px -4px rgba(61,245,140,0.75)" },
                }}
                transition={{ duration: 0.6, ease: EASE }}
                className="display grid size-16 place-items-center rounded-full border-2 bg-ink text-2xl"
              >
                {i + 1}
              </motion.span>
              <motion.div
                variants={{ off: { opacity: 0.25, y: 16 }, on: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <p className="mt-5 text-[13px] font-medium text-accent">{s.meta}</p>
                <h3 className="display mt-2 text-[clamp(1.5rem,3.2vw,2.25rem)]">{s.title}</h3>
                <p className="mt-3 text-[16px] text-mute">{cz(s.text)}</p>
              </motion.div>
            </motion.li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-24 flex flex-col items-center gap-7 text-center">
            <p className="display-soft max-w-2xl text-[clamp(1.3rem,2.6vw,1.9rem)] leading-tight">{cz(PROCESS.guarantee)}</p>
            <Button href="#kontakt" size="lg">
              {PROCESS.guaranteeCta}
              <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
