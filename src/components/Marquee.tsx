import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { MARQUEE_TRADES } from "../content";
import { cn } from "../utils/cn";
import { BellMark } from "./ui";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * One row of trades. Drifts on its own, speeds up with the scroll, flips direction when the
 * page scrolls back up, and leans into the motion.
 */
function Row({ speed, outline }: { speed: number; outline?: boolean }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2400, 0, 2400], [-5, 0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2400, 2400], [-7, 7]);
  const x = useMotionTemplate`${base}%`;
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    const move = dir.current * speed * (delta / 1000) * (1 + Math.abs(b));
    base.set(wrap(-50, 0, base.get() + move));
  });

  const items = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {MARQUEE_TRADES.map((t) => (
        <span key={t} className="flex items-center">
          <span
            className={cn(
              "display px-8 text-[clamp(2.4rem,5.2vw,5.4rem)] leading-none transition-colors duration-300 md:px-12",
              outline
                ? "text-transparent [-webkit-text-stroke:1.5px_rgba(244,239,236,0.28)] hover:text-accent hover:[-webkit-text-stroke:1.5px_transparent]"
                : "text-paper/90 hover:text-accent"
            )}
          >
            {t}
          </span>
          <BellMark
            className={cn("size-[clamp(1.6rem,2.6vw,2.6rem)] shrink-0", outline ? "text-paper/25" : "text-accent drop-shadow-[0_0_10px_var(--color-accent)]")}
            strokeWidth={9}
            compact
          />
        </span>
      ))}
    </div>
  );

  return (
    <motion.div style={{ x, skewX: reduce ? 0 : skew }} className="flex w-max will-change-transform">
      {items("a")}
      {items("b")}
    </motion.div>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label={`Děláme weby pro: ${MARQUEE_TRADES.join(", ")}`}
      className="relative flex flex-col gap-4 overflow-hidden py-16 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:gap-6 md:py-24"
    >
      <Row speed={-2.2} />
      <Row speed={1.6} outline />
    </section>
  );
}
