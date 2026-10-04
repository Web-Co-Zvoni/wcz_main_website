import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll reveal — rise + un-blur, once */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Small signal label: red dot + sentence-case text */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[13px] font-medium text-mute md:text-[14.5px]", className)}>
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 rounded-full bg-accent text-accent">
          <span className="pulse-ring" />
        </span>
      </span>
      {children}
    </span>
  );
}

export function SectionHead({
  kicker,
  title,
  desc,
  className,
}: {
  kicker: string;
  title: ReactNode;
  desc?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto flex max-w-3xl flex-col items-center text-center", className)}>
      <Reveal>
        <Kicker>{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display mt-5 text-[clamp(2rem,4.8vw,4rem)]">{typeof title === "string" ? cz(title) : title}</h2>
      </Reveal>
      {desc && (
        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-md text-[16.5px] leading-relaxed text-mute">{cz(desc)}</p>
        </Reveal>
      )}
    </div>
  );
}

/**
 * Animated light running around an element's border.
 * Adapted from Magic UI's ShineBorder (MIT) — brand reds, no shadcn deps.
 */
export function ShineBorder({
  width = 2,
  duration = 6,
  colors = ["rgba(255,255,255,0.85)"],
  className,
}: {
  width?: number;
  duration?: number;
  colors?: string[];
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] will-change-[background-position] motion-safe:animate-[shine-border_var(--shine-duration)_linear_infinite]",
        className
      )}
      style={
        {
          "--shine-duration": `${duration}s`,
          padding: width,
          backgroundImage: `radial-gradient(transparent, transparent, ${colors.join(", ")}, transparent, transparent)`,
          backgroundSize: "300% 300%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
    />
  );
}

type ButtonProps = Omit<ComponentProps<typeof motion.a>, "children"> & {
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  /** a faint white light that keeps running round the border */
  shine?: boolean;
  children: ReactNode;
};

/** CTA with lift, glow and a light sweep across the face on hover */
export function Button({ variant = "primary", size = "md", shine = false, className, children, ...rest }: ButtonProps) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-semibold tracking-tight transition-[box-shadow,background-color,border-color,color] duration-300",
        size === "lg" ? "px-7 py-4 text-[15.5px]" : "px-5 py-3 text-[14px]",
        variant === "primary"
          ? "bg-signal text-ink shadow-[0_0_0_1px_rgba(255,214,10,0.5),0_10px_40px_-12px_rgba(255,214,10,0.8)] hover:bg-accent hover:shadow-[0_0_0_1px_rgba(255,214,10,0.8),0_14px_56px_-10px_rgba(255,214,10,1)]"
          : "border border-paper/15 bg-card text-paper hover:border-accent/60 hover:bg-[#262012]",
        className
      )}
      {...rest}
    >
      {shine && <ShineBorder width={1.5} duration={8} />}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-[shine_0.9s_ease]"
      />
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </motion.a>
  );
}

/** Monoline swinging bell — the same drawing ElectricLogo traces (src/assets/brand/bell.svg) */
export const BELL_PATHS = [
  "M50 22C37.5 22 31.5 32.5 31.5 45.5V57C31.5 63 27.5 67 21.5 71H78.5C72.5 67 68.5 63 68.5 57V45.5C68.5 32.5 62.5 22 50 22Z",
  "M43.2 79.5a6.8 6.8 0 0 0 13.6 0",
  "M50 22V16.5",
  "M16.74 30.78A37 37 0 0 1 34.95 13.2",
  "M11.84 23.15A45 45 0 0 1 27.5 8.03",
  "M82.67 29.63A37 37 0 0 1 85.9 55.95",
  "M92.29 31.61A45 45 0 0 1 94.56 53.26",
  "M101.84 35.98A53 53 0 0 1 102.97 48.85",
];

/** bell, clapper, crown and the inner wave on each side — reads at icon sizes */
const BELL_COMPACT = [0, 1, 2, 3, 5].map((i) => BELL_PATHS[i]);

export function BellMark({
  className,
  strokeWidth = 7,
  compact = false,
}: {
  className?: string;
  strokeWidth?: number;
  /** drop the outer waves for small sizes (header, favicon, separators) */
  compact?: boolean;
}) {
  return (
    <svg viewBox={compact ? "6 2 94 94" : "-3.6 -6.9 120.9 113.2"} className={className} aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(20 50 47)"
      >
        {(compact ? BELL_COMPACT : BELL_PATHS).map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
