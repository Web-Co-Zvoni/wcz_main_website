/**
 * The wide metric tile closing the Services bento: a made-up business's enquiries climbing
 * month by month, after the ProgressMetricCard pattern — headline number on the left, a chart
 * filling the right of the card, a crosshair and tooltip that follow the pointer, a curve/bars
 * toggle and a period switch. The data is an illustration and the tile says so.
 */
import { animate, AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUp, ChartColumn, ChartSpline } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { GROWTH as G } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { BentoCard } from "./Bento";
import { EASE } from "./ui";

type View = "curve" | "bars";

/* chart space is 0–100 on both axes; the svg stretches it, strokes stay crisp */
const X0 = 6;
const X1 = 94;
const Y_TOP = 16;
const Y_BASE = 90;

/** Catmull-Rom through the points, written as cubic Béziers */
function curvePath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/** a number that counts to its value whenever the value changes */
function useCount(target: number, run: boolean) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!run) return;
    if (reduce) {
      from.current = target;
      return setN(target);
    }
    const c = animate(from.current, target, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => {
        from.current = v;
        setN(Math.round(v));
      },
    });
    return () => c.stop();
  }, [target, run, reduce]);
  return n;
}

export default function GrowthTile({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [periodIdx, setPeriodIdx] = useState(G.periods.length - 1);
  const [view, setView] = useState<View>("curve");
  const [hover, setHover] = useState<number | null>(null);

  const period = G.periods[periodIdx];
  const offset = G.data.length - period.points;

  const s = useMemo(() => {
    const vals = G.data.slice(offset);
    const sum = vals.reduce((a, b) => a + b, 0);
    const first = vals[0];
    const last = vals[vals.length - 1];
    const peak = Math.max(...vals);
    const max = peak * 1.12;
    const pts = vals.map((v, i) => [X0 + (i / (vals.length - 1)) * (X1 - X0), Y_BASE - (v / max) * (Y_BASE - Y_TOP)] as [number, number]);
    return {
      vals,
      sum,
      pct: Math.round(((last - first) / first) * 100),
      step: last - (vals[vals.length - 2] ?? first),
      peak,
      low: Math.min(...vals),
      avg: Math.round((sum / vals.length) * 10) / 10,
      pts,
      line: curvePath(pts),
    };
  }, [offset]);

  const total = useCount(s.sum, inView);
  const active = hover ?? s.vals.length - 1;
  const [ax, ay] = s.pts[active];
  const barW = ((X1 - X0) / s.vals.length) * 0.5;

  const onMove = (e: React.PointerEvent) => {
    const r = plotRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    let best = 0;
    for (let i = 1; i < s.pts.length; i++) if (Math.abs(s.pts[i][0] - x) < Math.abs(s.pts[best][0] - x)) best = i;
    setHover(best);
  };

  return (
    <BentoCard className={className}>
      <div ref={ref} className="relative flex min-h-[440px] flex-col">
        {/* ---- chart, filling the right of the card behind the copy ---- */}
        <div className="absolute inset-y-0 right-0 w-[64%]">
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(255,59,71,0.12),transparent_75%)]" />
          <div className="absolute inset-0 text-paper/[0.12] [mask-image:linear-gradient(to_right,transparent,#000_55%)]">
            <svg className="size-full" aria-hidden>
              <defs>
                <pattern id={`dots-${gid}`} width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dots-${gid})`} />
            </svg>
          </div>

          <div
            ref={plotRef}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            className="absolute inset-x-0 bottom-[60px] top-[84px] cursor-crosshair"
            role="img"
            aria-label={`${G.metric} (${G.sample}): ${s.vals.join(", ")}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${view}-${periodIdx}`}
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
                animate={inView ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : undefined}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible" aria-hidden>
                  <defs>
                    <linearGradient id={`area-${gid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ff3b47" stopOpacity="0.38" />
                      <stop offset="1" stopColor="#ff3b47" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={`bar-${gid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ff3b47" />
                      <stop offset="1" stopColor="#ff3b47" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  {view === "curve" ? (
                    <>
                      <path d={`${s.line} L${X1},100 L${X0},100 Z`} fill={`url(#area-${gid})`} />
                      <path
                        d={s.line}
                        fill="none"
                        stroke="#ff3b47"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: "drop-shadow(0 0 8px rgba(255,59,71,0.7))" }}
                      />
                    </>
                  ) : (
                    s.pts.map(([x, y], i) => (
                      <rect
                        key={i}
                        x={x - barW / 2}
                        y={y}
                        width={barW}
                        height={100 - y}
                        rx="0.8"
                        fill={`url(#bar-${gid})`}
                        opacity={i === active ? 1 : 0.45}
                        className="transition-opacity duration-300"
                      />
                    ))
                  )}
                </svg>
              </motion.div>
            </AnimatePresence>

            {/* crosshair, dot and tooltip (beside the dot, never under the controls) — HTML, so they don't stretch with the svg */}
            {inView && (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-[-60px] top-0 w-px bg-gradient-to-b from-paper/0 via-paper/25 to-paper/0 transition-[left] duration-300 ease-out"
                  style={{ left: `${ax}%` }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent shadow-[0_0_0_6px_rgba(255,59,71,0.2),0_0_18px_rgba(255,59,71,0.9)] transition-[left,top] duration-300 ease-out"
                  style={{ left: `${ax}%`, top: `${ay}%` }}
                />
                <div
                  className="pointer-events-none absolute w-max whitespace-nowrap rounded-xl border border-paper/10 bg-[#0f0d10]/95 px-3.5 py-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)] transition-[left,top] duration-300 ease-out"
                  style={{ left: `${ax}%`, top: `${ay}%`, translate: ax > 60 ? "calc(-100% - 20px) -50%" : "20px -50%" }}
                >
                  <p className="text-[15px] font-bold tabular-nums text-paper">
                    {s.vals[active]} {G.unit}
                  </p>
                  <p className="mt-0.5 text-[12px] text-mute">{G.pointLabel(offset + active + 1)}</p>
                </div>
              </>
            )}
          </div>

          {/* controls over the chart */}
          <div className="absolute right-6 top-6 z-10 flex items-center gap-2.5 xl:right-8 xl:top-8">
            <div className="flex rounded-full border border-paper/10 bg-ink/70 p-1" role="group" aria-label="Období">
              {G.periods.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPeriodIdx(i)}
                  aria-pressed={i === periodIdx}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300",
                    i === periodIdx ? "text-white" : "text-paper/60 hover:text-paper"
                  )}
                >
                  {i === periodIdx && (
                    <motion.span layoutId={`period-${gid}`} className="absolute inset-0 rounded-full bg-signal" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{p.label}</span>
                </button>
              ))}
            </div>
            <div className="flex rounded-full border border-paper/10 bg-ink/70 p-1" role="group" aria-label="Zobrazení">
              {(["curve", "bars"] as const).map((v) => {
                const Icon = v === "curve" ? ChartSpline : ChartColumn;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    aria-label={G.views[v]}
                    className={cn(
                      "grid size-8 place-items-center rounded-full transition-colors duration-300",
                      view === v ? "bg-paper/12 text-paper" : "text-paper/50 hover:text-paper"
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---- the message and the number ---- */}
        <div className="pointer-events-none relative z-10 flex max-w-[42%] flex-1 flex-col p-8 xl:p-11">
          <h3 className="display text-[clamp(2rem,3vw,3.2rem)] leading-[1]">{cz(G.title)}</h3>
          <p className="mt-4 max-w-[34ch] text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-paper/65">{cz(G.lead)}</p>

          <div className="mt-auto pt-10">
            <p className="flex items-center gap-2.5 text-[14px] font-medium text-paper/80">
              {G.metric}
              <span className="rounded-full border border-paper/10 px-2 py-0.5 text-[11.5px] font-normal text-mute">{G.sample}</span>
            </p>
            <div className="mt-3 flex items-end gap-5">
              <span className="display text-[clamp(4rem,6.4vw,6.6rem)] leading-[0.85] tabular-nums">{total}</span>
              <span className="mb-2 flex items-center gap-1 text-[17px] font-semibold text-accent">
                <ArrowUp className="size-4.5" strokeWidth={2.6} />
                {s.pct}&nbsp;%
              </span>
            </div>
          </div>
        </div>

        {/* ---- footer ---- */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-t border-paper/[0.07] bg-[#19171a] px-8 py-4 text-[14px] xl:px-11">
          <p>
            <span className="font-semibold text-accent">
              {s.step >= 0 ? "+" : "−"}
              {Math.abs(s.step)}
            </span>{" "}
            <span className="text-mute">{G.deltaLabel}</span>
          </p>
          <p className="flex items-center gap-2.5 text-[13px] text-mute">
            <span>
              <span className="font-semibold text-paper/85">{s.peak}</span> {G.stats.peak}
            </span>
            <span className="opacity-40">·</span>
            <span>
              <span className="font-semibold text-paper/85">{s.low}</span> {G.stats.low}
            </span>
            <span className="opacity-40">·</span>
            <span>
              <span className="font-semibold text-paper/85">{String(s.avg).replace(".", ",")}</span> {G.stats.avg}
            </span>
          </p>
        </div>
      </div>
    </BentoCard>
  );
}
