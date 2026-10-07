import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { EASE } from "./ui";

/**
 * One bento tile: rises into place once, and on hover a red spotlight and a lit border edge
 * follow the cursor. Position is kept in motion values, so moving the mouse never re-renders.
 */
export function BentoCard({
  children,
  className,
  delay = 0,
  tone = "plain",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "signal" warms the tile with a red wash — for the one tile in a grid that carries the promise */
  tone?: "plain" | "signal";
  /** render as a list item when the tiles form a list */
  as?: "div" | "li";
}) {
  const Tile = as === "li" ? motion.li : motion.div;
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spot = useMotionTemplate`radial-gradient(460px circle at ${mx}px ${my}px, rgba(255,59,71,0.13), transparent 70%)`;
  const edge = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, rgba(255,90,100,0.85), transparent 70%)`;

  return (
    <Tile
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={cn(
        "group/tile relative isolate overflow-hidden rounded-[28px] border",
        tone === "signal"
          ? "border-accent/25 bg-[radial-gradient(ellipse_90%_80%_at_100%_0%,rgba(255,59,71,0.22),transparent_65%),linear-gradient(180deg,#221a1e,#171418)]"
          : "border-paper/[0.08] bg-[linear-gradient(180deg,#1d1a1e,#171518)]",
        className
      )}
    >
      <motion.span
        aria-hidden
        style={{ background: spot }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
      />
      <motion.span
        aria-hidden
        style={{
          background: edge,
          padding: 1,
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
      />
      {children}
    </Tile>
  );
}
