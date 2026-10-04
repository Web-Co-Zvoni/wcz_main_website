import { motion } from "framer-motion";
import { PROBLEM } from "../content";
import { EASE, Kicker, Reveal } from "./ui";
import { cz } from "../utils/typo";

export default function Problem() {
  return (
    <section className="relative px-4 py-28 md:py-40">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <Reveal>
          <Kicker>{PROBLEM.kicker}</Kicker>
        </Reveal>

        <ul className="mt-10 flex flex-col items-center gap-3 md:gap-4">
          {PROBLEM.lines.map((line, i) => (
            <motion.li
              key={line}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: "-120px" }}
              className="relative"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
                  shown: { opacity: [0, 1, 0.38], y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 1.6, times: [0, 0.4, 1], delay: i * 0.12, ease: EASE }}
                className="display block text-[clamp(1.7rem,5vw,3.9rem)] leading-[1.12] text-paper"
              >
                {cz(line)}
              </motion.span>
              {/* red strike drawn through each excuse */}
              <motion.span
                aria-hidden
                variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                transition={{ duration: 0.7, delay: 0.55 + i * 0.12, ease: EASE }}
                className="absolute inset-x-[-4%] top-[52%] h-[3px] origin-left rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)] md:h-1"
              />
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.2} className="mt-16 md:mt-20">
          <p className="display-soft text-[clamp(1.35rem,2.8vw,2.1rem)] leading-tight">
            <span className="text-mute">{PROBLEM.answerLead}</span>
            <br />
            <span className="glow-text text-paper">{PROBLEM.answer}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
