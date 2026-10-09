import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useContext, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { EASE, InstantReveal } from "./ui";

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
  edge = "soft",
  dots,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "signal" gives the tile a red-tinted border — for the one tile in a grid that carries the promise */
  tone?: "plain" | "signal";
  /** render as a list item when the tiles form a list */
  as?: "div" | "li";
  /** how strongly the border lights up under the cursor */
  edge?: "soft" | "bright";
  /** a dot grid over the face, at this opacity */
  dots?: number;
}) {
  const Tile = as === "li" ? motion.li : motion.div;
  const instant = useContext(InstantReveal);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spot = useMotionTemplate`radial-gradient(28.75rem circle at ${mx}px ${my}px, rgba(255,59,71,0.13), transparent 70%)`;
  const softEdge = useMotionTemplate`radial-gradient(17.5rem circle at ${mx}px ${my}px, rgba(255,90,100,0.85), transparent 70%)`;
  // a white-hot core under the cursor, fading through full red
  const brightEdge = useMotionTemplate`radial-gradient(24rem circle at ${mx}px ${my}px, rgba(255,236,234,1), rgba(255,70,82,1) 22%, rgba(255,59,71,0.5) 48%, transparent 72%)`;

  return (
    <Tile
      initial={instant ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={cn(
        "group/tile relative isolate overflow-hidden rounded-[1.75rem] border",
        tone === "signal"
          ? "border-accent/25 bg-[linear-gradient(180deg,#0f0d10,#0a090b)]"
          : "border-paper/[0.08] bg-[linear-gradient(180deg,#0f0d10,#0a090b)]",
        className
      )}
    >
      {dots ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(244_239_236/var(--dot-a))_1px,transparent_1.5px)] [background-size:14px_14px]"
          style={{ "--dot-a": dots } as React.CSSProperties}
        />
      ) : null}
      <motion.span
        aria-hidden
        style={{ background: spot }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
      />
      <motion.span
        aria-hidden
        style={{
          background: edge === "bright" ? brightEdge : softEdge,
          padding: edge === "bright" ? "1.5px" : 1,
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
