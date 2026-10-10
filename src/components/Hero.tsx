import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, lazy, useLayoutEffect, useRef, useState } from "react";
import { HERO, PORTFOLIO } from "../content";
import { remScale } from "../utils/remScale";
import { cz } from "../utils/typo";
import ChargedLogo from "./ChargedLogo";
import { PrimaryCta, SecondaryCta } from "./HeroCtas";
import BeamParticles from "./fx/BeamParticles";
import CloudLayer from "./fx/CloudLayer";
import logoWcz from "../assets/brand/logo-wcz.svg";
import { EASE, Kicker, Reveal } from "./ui";

// three.js is heavy — let the page paint first, the beam fades in on its own
const LaserFlow = lazy(() => import("./fx/LaserFlow"));

/** night sky above the card; the card itself is the page colour, so it flows on */
const SKY = "#0f0d10";
const DPR = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

type Layout = {
  /** beam x as a fraction of hero width */
  beamX: number;
  /** LaserFlow's vertical offset: fraction-from-center, + is up */
  beamY: number;
  /** vertical radius of the card's arched top edge, px */
  arch: number;
  /** distance from hero top to the impact point, px */
  hitPx: number;
  /** logo centre x as a fraction of hero width */
  logoX: number;
  /** vertical centre for the logo: level with the middle of the copy block, px */
  logoY: number;
  /** rough radius of the logo mark, px (0 when the logo is hidden) — the clouds pile up over it */
  logoR: number;
};

const HEADER_H = 92;

// photo the secondary CTA turns into on hover — a wide crop of the first concept
const CTA_PHOTO = PORTFOLIO.items[0].src.replace("h=1000&w=800", "h=160&w=520");

/** each layer: width px, rgb, peak alpha, alpha it already has at the very top (0–1), x offset */
const BEAM_LAYERS = [
  // outer haze → inner core; inner layers are lit from the top so the beam has body all the way up
  { w: 440, rgb: "110,8,22", a: 0.5, top: 0.06, dx: 0 },
  { w: 220, rgb: "230,30,50", a: 0.34, top: 0.16, dx: 0 },
  { w: 96, rgb: "255,90,110", a: 0.4, top: 0.55, dx: 0 },
  // the beam's body: full strength from the very top so it never thins to a hairline
  { w: 54, rgb: "255,70,92", a: 0.5, top: 1, dx: 0 },
  { w: 20, rgb: "255,196,192", a: 0.75, top: 1, dx: 0 },
  // off-centre tints: cool magenta on one flank, warm orange on the other — reads as a lit cylinder
  { w: 80, rgb: "255,56,150", a: 0.34, top: 0.22, dx: -16 },
  { w: 80, rgb: "255,126,64", a: 0.3, top: 0.22, dx: 16 },
  { w: 34, rgb: "255,170,165", a: 0.55, top: 0.85, dx: 0 },
  { w: 12, rgb: "255,226,218", a: 0.85, top: 0.8, dx: 0 },
  { w: 3, rgb: "255,250,246", a: 1, top: 0.92, dx: 0 },
];

/** bands of light travelling down the beam — darker and slower on the outside, bright and quick in the core */
const FLOW_LAYERS = [
  { w: 230, rgb: "120,8,24", a: 0.55, len: 300, dur: 3.2 },
  { w: 150, rgb: "190,18,38", a: 0.45, len: 230, dur: 2.4 },
  { w: 90, rgb: "235,40,60", a: 0.42, len: 170, dur: 1.8 },
  { w: 44, rgb: "255,130,140", a: 0.4, len: 120, dur: 1.2 },
];

/** bell-curve cross-section, so a layer has no visible edge */
const softProfile = (rgb: string, a: number) =>
  `linear-gradient(to right, rgba(${rgb},0) 0%, rgba(${rgb},${a * 0.08}) 18%, rgba(${rgb},${a * 0.35}) 32%, rgba(${rgb},${a * 0.8}) 44%, rgba(${rgb},${a}) 50%, rgba(${rgb},${a * 0.8}) 56%, rgba(${rgb},${a * 0.35}) 68%, rgba(${rgb},${a * 0.08}) 82%, rgba(${rgb},0) 100%)`;
/** same bell curve as an alpha mask */
const SOFT_MASK =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 18%, rgba(0,0,0,0.35) 32%, rgba(0,0,0,0.8) 44%, #000 50%, rgba(0,0,0,0.8) 56%, rgba(0,0,0,0.35) 68%, rgba(0,0,0,0.08) 82%, transparent 100%)";

/** design px → rem, so the beam's layers shrink with the rest of the desktop layout */
const rem = (px: number) => `${px / 16}rem`;

const masks = (...layers: string[]): React.CSSProperties => ({
  maskImage: layers.join(", "),
  WebkitMaskImage: layers.join(", "),
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
});

function BeamLayers({ left, height }: { left: string; height: number }) {
  return (
    <>
      {BEAM_LAYERS.map((l, i) => {
        const mid = (l.top + 1) / 2;
        const fade = `linear-gradient(to bottom, rgba(0,0,0,${l.top}) 0%, rgba(0,0,0,${mid}) 45%, #000 90%, rgba(0,0,0,0.6) 100%)`;
        return (
          <motion.span
            key={`${l.w}-${l.dx}`}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.25 + i * 0.06, ease: EASE }}
            className="absolute top-0 origin-top -translate-x-1/2 mix-blend-screen"
            style={{
              left,
              marginLeft: rem(l.dx),
              width: rem(l.w),
              height: height + 6,
              background: l.w <= 3 ? `rgba(${l.rgb},${l.a})` : softProfile(l.rgb, l.a),
              maskImage: fade,
              WebkitMaskImage: fade,
            }}
          />
        );
      })}

      {/* flow: bands sliding down inside the beam, each colour at its own pace */}
      {FLOW_LAYERS.map((f) => (
        <span
          key={f.w}
          className="absolute top-0 -translate-x-1/2 mix-blend-screen motion-safe:animate-[beam-flow_var(--flow-dur)_linear_infinite]"
          style={
            {
              left,
              width: rem(f.w),
              height,
              "--flow-len": rem(f.len),
              "--flow-dur": `${f.dur}s`,
              backgroundImage: `linear-gradient(to bottom, rgba(${f.rgb},0) 0%, rgba(${f.rgb},${f.a}) 38%, rgba(${f.rgb},${f.a * 0.25}) 62%, rgba(${f.rgb},0) 100%)`,
              backgroundSize: `100% ${rem(f.len)}`,
              ...masks(SOFT_MASK, "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 30%, #000 85%, #000 100%)"),
            } as React.CSSProperties
          }
        />
      ))}

      {/* edge highlights of the cylinder, strongest near the impact */}
      {[-24, 24].map((dx) => (
        <motion.span
          key={dx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
          className="absolute top-0 w-px -translate-x-1/2 mix-blend-screen"
          style={{
            left,
            marginLeft: rem(dx),
            height,
            background: "linear-gradient(to bottom, transparent 30%, rgba(255,170,170,0.18) 70%, rgba(255,205,200,0.45) 100%)",
          }}
        />
      ))}

      {/* the skirt: the beam fanning out just before it lands — white heart, pink, red, deep crimson */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.9, ease: EASE }}
        className="absolute -translate-x-1/2 -translate-y-full mix-blend-screen"
        style={{
          left,
          top: height + 4,
          width: rem(900),
          height: rem(320),
          background:
            "radial-gradient(ellipse 5% 100% at 50% 100%, rgba(255,246,240,0.85), transparent 100%), radial-gradient(ellipse 13% 80% at 50% 100%, rgba(255,150,150,0.45), transparent 100%), radial-gradient(ellipse 30% 60% at 50% 100%, rgba(225,24,42,0.4), transparent 100%), radial-gradient(ellipse 50% 42% at 50% 100%, rgba(130,10,28,0.5), transparent 100%)",
        }}
      />

      {/* light running off the impact along the card edge, both ways */}
      {(["left", "right"] as const).map((side) => (
        <span
          key={side}
          className={`absolute mix-blend-screen ${side === "left" ? "-translate-x-full motion-safe:animate-[edge-flow-left_var(--flow-dur)_linear_infinite]" : "motion-safe:animate-[edge-flow-right_var(--flow-dur)_linear_infinite]"}`}
          style={
            {
              left,
              top: `calc(${height}px - ${rem(44)})`,
              width: rem(620),
              height: rem(50),
              "--flow-len": rem(220),
              "--flow-dur": "2.2s",
              backgroundImage: `linear-gradient(to ${side === "left" ? "left" : "right"}, rgba(255,90,100,0) 0%, rgba(255,120,128,0.55) 30%, rgba(200,20,40,0.3) 60%, rgba(255,90,100,0) 100%)`,
              backgroundSize: `${rem(220)} 100%`,
              ...masks(
                `linear-gradient(to ${side}, #000 0%, rgba(0,0,0,0.6) 35%, transparent 100%)`,
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, #000 85%, rgba(0,0,0,0.4) 100%)"
              ),
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ beamX: 0.62, beamY: -0.25, arch: 64, hitPx: 0, logoX: 0.81, logoY: 0, logoR: 0 });

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const card = cardRef.current;
    if (!hero || !card) return;
    const measure = () => {
      const w = hero.clientWidth || 1;
      const s = remScale();
      const h = hero.clientHeight || 1;
      const wide = w >= 768;
      // drop the beam through the open gap between the nav and the header actions, so it never crosses a link
      let beamX = wide ? 0.62 : 0.86;
      const nav = document.querySelector("header nav");
      const actions = document.querySelector("header [data-header-actions]");
      if (wide && nav && actions && nav.getBoundingClientRect().width > 0) {
        const gapMid = (nav.getBoundingClientRect().right + actions.getBoundingClientRect().left) / 2;
        beamX = Math.min(0.7, Math.max(0.58, gapMid / w));
      }
      const arch = (wide ? 64 : 28) * s;
      // the arch is half an ellipse across the full width — find its height under the beam
      const dx = (beamX - 0.5) * 2;
      const drop = arch * (1 - Math.sqrt(Math.max(0, 1 - dx * dx)));
      // offsetTop ignores the entrance transform, so the hit point is exact
      const top = card.offsetTop + drop;
      // copy block is a direct child of the stage, which starts at the top of the hero
      const copy = copyRef.current;
      const copyTop = copy ? copy.offsetTop : HEADER_H * s;
      const copyBottom = copy ? copy.offsetTop + copy.offsetHeight : h / 2;
      // matches the logo box, w-[clamp(18.75rem,30vw,32.5rem)]; the mark fills a bit under half of it
      const logoBox = Math.min(520 * s, Math.max(300 * s, window.innerWidth * 0.3));
      const logoR = wide ? logoBox * 0.42 : 0;
      // a touch left of midway between the beam and the right edge, but never crowding the beam
      const markHalf = logoBox * 0.28;
      const logoX = Math.max(((beamX + 1) / 2) * w - 80 * s, beamX * w + markHalf + 60 * s) / w;
      setLayout({ beamX, beamY: 0.5 - top / h, arch, hitPx: top, logoX, logoY: (copyTop + copyBottom) / 2, logoR });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    ro.observe(card);
    if (copyRef.current) ro.observe(copyRef.current);
    // nav width changes once the web font lands
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const laserOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  // red dot-grid that shows up under the cursor, like light catching a blueprint
  const onMove = (e: React.MouseEvent) => {
    const el = gridRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    gridRef.current?.style.setProperty("--mx", "-9999px");
    gridRef.current?.style.setProperty("--my", "-9999px");
  };

  const beamPct = `${layout.beamX * 100}%`;
  const bellPct = `${layout.logoX * 100}%`;

  return (
    <section
      id="top"
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden"
      style={{ backgroundColor: SKY }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: laserOpacity, backgroundColor: SKY }}
      >
        {/* red dot-grid lit by the cursor — sits under the beam, so it only shows in the haze */}
        <div
          ref={gridRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={
            {
              "--mx": "-9999px",
              "--my": "-9999px",
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,59,71,0.5) 1px, transparent 1.6px)",
              backgroundSize: `${rem(22)} ${rem(22)}`,
              maskImage: "radial-gradient(circle 13.75rem at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle 13.75rem at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
            } as React.CSSProperties
          }
        />

        <Suspense fallback={null}>
          <LaserFlow
            color="#FF3B47"
            deepColor="#9E0F1E"
            coreColor="#FFF1E8"
            coreStrength={0.9}
            arch={layout.arch}
            backgroundColor="transparent"
            horizontalBeamOffset={layout.beamX - 0.5}
            verticalBeamOffset={layout.beamY}
            horizontalSizing={1.5}
            fogSpread={2.6}
            verticalSizing={2}
            wispDensity={1.2}
            wispIntensity={7}
            wispSpeed={14}
            flowSpeed={0.35}
            flowStrength={0.3}
            fogIntensity={0.9}
            fogScale={0.24}
            fogFallSpeed={0.5}
            decay={1.15}
            dpr={DPR}
          />
        </Suspense>

        {/* dims the sky behind the clouds, so it stays dark even where the cursor has parted them.
            Spares the beam and its glow, and the wide flare where it lands on the card. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: SKY,
            opacity: 0.4,
            ...masks(
              `linear-gradient(to right, #000 calc(${beamPct} - ${rem(240)}), transparent calc(${beamPct} - ${rem(80)}), transparent calc(${beamPct} + ${rem(80)}), #000 calc(${beamPct} + ${rem(240)}))`,
              `radial-gradient(ellipse ${rem(760)} ${rem(420)} at ${beamPct} ${layout.hitPx || 0}px, transparent 0%, transparent 30%, #000 100%)`
            ),
          }}
        />

        {/* logo sits behind the clouds: it glows faintly through and shows in full where the cursor parts them */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: EASE }}
          className="pointer-events-auto absolute hidden w-[clamp(18.75rem,30vw,32.5rem)] -translate-x-1/2 -translate-y-1/2 md:block"
          // the mark sits high in its box — drop the box so the mark itself is level with the copy
          style={{ left: bellPct, top: layout.logoY ? `calc(${layout.logoY}px + clamp(1.75rem,2.8vw,3rem))` : "50%" }}
        >
          <ChargedLogo src={logoWcz} scale={0.68} className="relative aspect-[5/6] w-full cursor-pointer" />
        </motion.div>

        {/* clouds drifting round the beam; the cursor parts them to show the grid, beam and logo behind */}
        <CloudLayer
          beamX={layout.beamX}
          floorPx={layout.hitPx}
          logo={layout.logoR > 0 ? { x: layout.logoX, y: layout.logoY, r: layout.logoR } : undefined}
          className="absolute inset-0"
        />

        {/* layered beam in front of the clouds: crimson haze → red glow → pink halo → white core, plus a flared skirt */}
        {layout.hitPx > 0 && <BeamLayers left={beamPct} height={layout.hitPx} />}
        {/* sparks riding the beam down into the card */}
        {layout.hitPx > 0 && <BeamParticles left={beamPct} height={layout.hitPx} />}
      </motion.div>

      {/* stage: copy left of the beam (the bell lives behind the clouds) — lets the cursor through to the logo */}
      <div className="pointer-events-none relative z-10">
        <div className="mx-auto flex min-h-[clamp(40rem,82svh,57.5rem)] max-w-[88rem] flex-col justify-center px-4 pb-28 pt-[8.75rem] [@media(max-width:400px)_and_(max-height:650px)]:pt-[6.25rem] md:min-h-[max(30rem,calc(100svh-16.625rem))] md:px-8 md:pb-[clamp(1.5rem,4vh,3.5rem)] min-[1224px]:pb-[clamp(1.25rem,3.4vh,3.5rem)] md:pt-[clamp(6.25rem,13vh,7.75rem)] min-[1224px]:pt-[clamp(7.625rem,13vh,8.25rem)]">
          <div ref={copyRef} className="pointer-events-auto max-w-[80%] md:max-w-[min(48rem,52vw)]">
            <Reveal delay={0.45}>
              <Kicker className="xl:text-[clamp(0.9375rem,2vh,1.0938rem)]">{HERO.kicker}</Kicker>
            </Reveal>

            <h1 className="display mt-6 text-[clamp(3rem,min(5.8vw,10.4vh),6.5rem)] xl:text-[clamp(3rem,max(min(5.8vw,10.4vh),min(7.4vw,calc(17vh-3.25rem))),8.5rem)] max-md:text-[clamp(2.5rem,11vw,3.8rem)]">
              {HERO.titleLines.map((line, i) => (
                // descenders (the y, the comma) hang below the tight line box: the mask and the text fill reach
                // down to cover them, and a negative margin keeps the lines exactly where they were
                <span key={line} className="-mb-[0.18em] block overflow-hidden pb-[0.24em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.45 + i * 0.12, ease: EASE }}
                    // white on top shading to grey at the foot of the letters, for a little depth
                    className="-mb-[0.24em] block bg-[linear-gradient(180deg,#ffffff_8%,#f6f2f0_30%,#c4bdbf_50%,#8f878b_64%,#7d7579_84%)] bg-clip-text pb-[0.24em] text-transparent"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <Reveal delay={0.75}>
              <p className="mt-6 max-w-[40rem] text-[1.0625rem] leading-relaxed text-paper/70 md:text-[1.3125rem] xl:max-w-[44rem] xl:text-[clamp(1.3125rem,2.9vh,1.625rem)]">
                {cz(HERO.description)}
              </p>
            </Reveal>

            <Reveal delay={0.85}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <PrimaryCta href="#kontakt">{HERO.primaryCta}</PrimaryCta>
                <SecondaryCta href="#koncepty" photo={CTA_PHOTO}>
                  {HERO.secondaryCta}
                </SecondaryCta>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* the card the beam lands on — edge to edge, arched so it melts into the sides */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
        className="relative z-10 shadow-[0_-30px_120px_-50px_rgba(255,59,71,0.65)]"
        style={{
          borderTopLeftRadius: `50% ${layout.arch}px`,
          borderTopRightRadius: `50% ${layout.arch}px`,
        }}
      >
        {/* card surface: solid and dark, the beam doesn't light it — it only catches on the rim */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: "linear-gradient(to bottom, #09080a 0%, #09080a 55%, #141215 100%)" }}
        />
        {/* rim catching the light — a top border on the same arch, so it can't drift off the edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border-t border-[#ffe9e2]/45"
          style={{
            maskImage: `radial-gradient(ellipse 48% 140% at ${beamPct} 0%, #000 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse 48% 140% at ${beamPct} 0%, #000 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`,
          }}
        />

        <Reveal delay={1} y={16}>
          <dl className="relative mx-auto grid max-w-[88rem] grid-cols-2 px-4 pb-10 pt-14 md:grid-cols-4 md:px-8 md:pb-[clamp(0.75rem,2.5vh,1.5rem)] md:pt-[clamp(1.5rem,4.5vh,3rem)]">
            {HERO.stats.map((s, i) => (
              <div
                key={s.label}
                className={`group flex flex-col items-center gap-2 px-3 py-8 text-center md:py-[clamp(0.75rem,2.5vh,1.5rem)] ${i % 2 === 1 ? "border-l border-paper/10" : ""} ${i > 1 ? "border-t border-paper/10 md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <dt className="order-2 text-[0.9375rem] text-mute md:text-[1.125rem] xl:text-[clamp(1.125rem,2vh,1.25rem)]">{s.label}</dt>
                <dd className="display order-1 text-[clamp(2.4rem,min(5.4vw,9.6vh),5.4rem)] transition-colors duration-500 group-hover:text-accent">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </motion.div>
    </section>
  );
}
