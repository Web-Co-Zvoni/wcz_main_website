import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
  y = 32,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-mute",
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-accent animate-blink" />}
      {children}
    </span>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  desc,
  align = "left",
  className,
  titleClassName,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className
      )}
    >
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>
            <span className="text-accent">{index}</span> — {eyebrow}
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className={cn("mt-5 stretch font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.2rem,5vw,4.2rem)]", titleClassName)}>
            {title}
          </h2>
        </Reveal>
      </div>
      {desc && (
        <Reveal delay={0.16} className="max-w-sm">
          <p className="text-[15px] leading-relaxed text-mute">{desc}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-paper/12 bg-paper/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mute",
        className
      )}
    >
      {children}
    </span>
  );
}
