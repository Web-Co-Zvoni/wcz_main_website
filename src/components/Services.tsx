import { AnimatePresence, motion, useInView, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { SERVICES, SITE } from "../content";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";
import { SERVICE_DEMO_COMPONENTS } from "./ServiceDemos";
import { Button, EASE } from "./ui";

/** left edge of the content column, so the journey starts where the copy above starts */
const GUTTER = "pl-[max(1rem,calc((100vw-88rem)/2+2rem))]";

type Service = (typeof SERVICES.items)[number];

function ServicePanel({ s, i, active, wide }: { s: Service; i: number; active: boolean; wide: boolean }) {
  const Demo = SERVICE_DEMO_COMPONENTS[i];
  return (
    <article
      data-panel
      className={cn(
        "relative flex shrink-0 gap-[4vw]",
        wide ? "h-full w-[clamp(780px,66vw,1180px)] items-center border-l border-paper/[0.07] px-[4.5vw]" : "flex-col py-16"
      )}
    >
      <motion.div
        animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : 24 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="min-w-0 flex-1"
      >
        <h3 className="display text-[clamp(2.6rem,4.6vw,5.4rem)] leading-[0.98]">{s.title}</h3>
        <p className="mt-4 text-[clamp(1.1rem,1.35vw,1.4rem)] font-semibold text-accent">{s.subtitle}</p>
        <p className="mt-6 max-w-[34ch] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-paper/70">{cz(s.text)}</p>
        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
          {s.tags.map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-[15px] text-paper/80">
              <span className="size-1.5 rotate-45 bg-accent" />
              {t}
            </li>
          ))}
        </ul>
        <a
          href="#kontakt"
          tabIndex={active || !wide ? 0 : -1}
          className="group mt-10 inline-flex items-center gap-3.5 text-[17px] font-semibold text-paper transition-colors hover:text-accent"
        >
          {SERVICES.cta}
          <span className="grid size-11 place-items-center rounded-full border border-paper/20 transition-[background-color,border-color,transform] duration-300 group-hover:translate-x-1 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
            <ArrowRight className="size-4.5" strokeWidth={2.4} />
          </span>
        </a>
      </motion.div>

      <motion.div
        animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.94 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={cn("flex shrink-0 justify-center", wide ? "w-[clamp(300px,25vw,400px)]" : "w-full max-w-[400px]")}
      >
        <Demo active={active} />
      </motion.div>
    </article>
  );
}

/** stacked fallback for narrow screens: each demo runs while it's on screen */
function StackedPanel({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  return (
    <div ref={ref} className="border-t border-paper/[0.07]">
      <ServicePanel s={s} i={i} active={inView} wide={false} />
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const centers = useRef<number[]>([]);
  const distanceRef = useRef(0);
  const [wide, setWide] = useState(true);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const inView = useInView(stageRef, { amount: 0.5 });

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      setWide(mq.matches);
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceRef.current = d;
      setDistance(d);
      centers.current = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]")).map((el) => el.offsetLeft + el.offsetWidth / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [wide]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  // full-width rails slid with transform (compositor only): their right end sits at the current progress
  const rail = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const railX = useMotionTemplate`${rail}%`;

  // the panel nearest the middle of the screen is the live one
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = -p * distanceRef.current;
    const mid = window.innerWidth * 0.5;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < centers.current.length; i++) {
      const d = Math.abs(centers.current[i] + v - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    setActive(best);
  });

  const intro = (
    <div className={cn("flex shrink-0 flex-col justify-center", wide ? "h-full w-[min(44rem,40vw)] pr-[5vw]" : "pb-6")}>
      <h2 className="display text-[clamp(2.6rem,5vw,5.6rem)] leading-[0.98]">{cz(SERVICES.title)}</h2>
      <p className="mt-7 max-w-[26ch] text-[clamp(1.15rem,1.5vw,1.5rem)] leading-snug text-paper/70">{cz(SERVICES.description)}</p>
      {wide && (
        <p className="mt-12 flex items-center gap-3 text-[15px] text-mute">
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowRight className="size-5 text-accent" />
          </motion.span>
          {SERVICES.scrollHint}
        </p>
      )}
    </div>
  );

  if (!wide) {
    return (
      <section id="sluzby" ref={sectionRef} className="relative px-4 py-24">
        {intro}
        <div ref={trackRef}>
          {SERVICES.items.map((s, i) => (
            <StackedPanel key={s.title} s={s} i={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="sluzby" ref={sectionRef} className="relative" style={{ height: `calc(${distance}px + 100vh)` }}>
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        {/* a low red glow that travels with the journey */}
        <motion.div aria-hidden style={{ x: railX }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] will-change-transform">
          <div className="absolute bottom-0 right-0 h-full w-[70vw] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,59,71,0.13),transparent)]" />
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className={cn("relative flex h-full items-stretch pb-28 pt-[clamp(104px,13vh,140px)] will-change-transform", GUTTER)}
        >
          {intro}
          {SERVICES.items.map((s, i) => (
            <ServicePanel key={s.title} s={s} i={i} active={inView && active === i} wide />
          ))}
          {/* the road ends at the enquiry form */}
          <div className="flex h-full w-[min(40rem,42vw)] shrink-0 flex-col justify-center border-l border-paper/[0.07] px-[4.5vw]">
            <p className="display max-w-[14ch] text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.02]">{SERVICES.outroLead}</p>
            <Button href="#kontakt" size="lg" className="mt-9 self-start xl:px-9 xl:py-5 xl:text-[17px]">
              {SERVICES.outroCta}
              <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Button>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-flex items-center gap-2.5 self-start text-[16px] font-medium text-paper/75 transition-colors hover:text-accent">
              <Mail className="size-4.5 text-accent" />
              {SITE.email}
            </a>
          </div>
        </motion.div>

        {/* progress: where you are on the road */}
        <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 pb-9 pr-[max(1rem,calc((100vw-88rem)/2+2rem))]", GUTTER)}>
          <div className="flex items-baseline gap-4">
            <span className="display text-[26px] tabular-nums leading-none text-paper">{active + 1}</span>
            <span className="text-[15px] tabular-nums text-mute">/ {SERVICES.items.length}</span>
            <span className="relative h-6 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="block text-[15px] font-medium text-paper/80"
                >
                  {SERVICES.items[active]?.title}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <div className="relative mt-4 h-px bg-paper/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-signal via-accent to-[#ffb4b8] shadow-[0_0_14px_var(--color-accent)]"
            />
            <motion.div style={{ x: railX }} className="absolute inset-0 will-change-transform">
              <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,59,71,0.9),0_0_28px_8px_rgba(255,59,71,0.45)]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
