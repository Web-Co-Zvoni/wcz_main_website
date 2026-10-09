import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { EASE } from "./ui";

type Step = { title: string; text: string; meta: string };

/** the drawing's own units; the SVG stretches to the row, the nodes sit at the same fractions in CSS */
const W = 1200;
const H = 460;
const TOP = 170;
const LOW = 290;

/** a smooth wire through the points, level at each of them */
function wire(points: [number, number][]) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const dx = (x1 - x0) / 2;
    d += ` C${x0 + dx} ${y0} ${x1 - dx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

/**
 * Milestones strung on one curved wire instead of a row of boxes. The wire draws itself as the
 * row climbs the screen and each milestone lights up when the light reaches it; words sit above
 * the high nodes and below the low ones. Below lg it falls back to a plain vertical list.
 */
export default function CurvedSteps({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const nodes = steps.map((_, i) => [((i + 0.5) / n) * W, i % 2 === 0 ? TOP : LOW] as [number, number]);
  const path = wire([[0, (TOP + LOW) / 2 + 30], ...nodes, [W, (TOP + LOW) / 2 - 30]]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const drawn = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const [lit, setLit] = useState(0);
  // the wire runs left to right, so its drawn share is close enough to the x it has reached
  useMotionValueEvent(drawn, "change", (v) => setLit(nodes.filter(([x]) => v >= x / W - 0.015).length));

  return (
    <div ref={ref}>
      {/* desktop: the wire */}
      <div className="relative hidden h-[38rem] lg:block">
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <path d={path} fill="none" stroke="rgba(244,239,236,0.1)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <motion.path
            d={path}
            fill="none"
            stroke="#ff3b47"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: drawn, filter: "drop-shadow(0 0 6px rgba(255,59,71,0.9))" }}
          />
        </svg>

        {steps.map((s, i) => {
          const [x, y] = nodes[i];
          const on = i < lit;
          const above = y === TOP;
          return (
            <div key={s.title} className="absolute" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>
              {/* the node */}
              <span
                className={cn(
                  "absolute left-0 top-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-500",
                  on ? "border-accent bg-accent text-accent shadow-[0_0_0_6px_rgba(255,59,71,0.15),0_0_26px_rgba(255,59,71,0.9)]" : "border-paper/25 bg-ink"
                )}
              >
                {on && <span className="pulse-ring rounded-full" />}
              </span>

              {/* its words, above or below */}
              <motion.div
                animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : above ? 10 : -10 }}
                transition={{ duration: 0.7, ease: EASE }}
                className={cn("absolute left-0 w-[18rem] -translate-x-1/2 text-center xl:w-[20rem]", above ? "bottom-8" : "top-8")}
              >
                <p className={cn("display text-[clamp(2.2rem,3.2vw,3.4rem)] leading-none tracking-[-0.04em] transition-colors duration-500", on ? (i === n - 1 ? "text-accent" : "text-paper") : "text-paper/30")}>
                  {s.meta}
                </p>
                <h3 className="display-soft mt-3 text-[clamp(1.3rem,1.6vw,1.65rem)] leading-tight">{s.title}</h3>
                <p className="mt-1.5 text-[1.0938rem] leading-relaxed text-paper/65">{cz(s.text)}</p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* below lg: the same steps down a straight line */}
      <ol className="relative ml-2 border-l border-accent/30 pl-8 lg:hidden">
        {steps.map((s) => (
          <li key={s.title} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[2.45rem] top-2 size-3.5 rounded-full border-2 border-accent bg-ink" />
            <p className="display text-[2.4rem] leading-none tracking-[-0.04em]">{s.meta}</p>
            <h3 className="display-soft mt-2 text-[1.25rem]">{s.title}</h3>
            <p className="mt-1.5 text-[1rem] leading-relaxed text-paper/65">{cz(s.text)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
