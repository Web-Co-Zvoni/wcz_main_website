import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";

/** shared press feedback — a quick dip and a springy return */
const PRESS = { scale: 0.965 };
const SPRING = { type: "spring", stiffness: 380, damping: 24 } as const;

const RING_MASK = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
} as const;

/** a luminous line that draws itself all the way round the button edge, then holds as a white border */
function LaserOutline({ on }: { on: boolean }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="12"
        fill="none"
        stroke="rgba(255,244,240,0.95)"
        strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: on ? 0.75 : 0.45, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: on ? 0.15 : 0.45 },
        }}
        style={{ filter: "drop-shadow(0 0 4px rgba(255,236,230,0.7)) drop-shadow(0 0 10px rgba(255,59,71,0.35))" }}
      />
    </svg>
  );
}

/**
 * Primary hero CTA: light orbiting the border (speeds up on hover), a slow breath
 * every few seconds; on hover it grows a touch, glows, a laser traces a white edge and light runs through the label.
 */
export function PrimaryCta({ href, children }: { href: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const angle = useMotionValue(0);
  // orbit speed in deg/s, eased so the light accelerates and settles instead of jumping
  const speed = useSpring(64, { stiffness: 50, damping: 16 });
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    angle.set((angle.get() + (speed.get() * delta) / 1000) % 360);
  });
  const ring = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg, rgba(255,255,255,0.95) 28deg, rgba(255,214,210,0.55) 58deg, transparent 96deg, transparent 180deg, rgba(255,255,255,0.4) 212deg, transparent 248deg)`;

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.035 }}
      whileTap={PRESS}
      transition={SPRING}
      onHoverStart={() => {
        speed.set(300);
        setHover(true);
      }}
      onHoverEnd={() => {
        speed.set(64);
        setHover(false);
      }}
      className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-signal px-8 py-[18px] text-[16.5px] font-semibold tracking-tight text-white shadow-[0_0_0_1px_rgba(255,59,71,0.5),0_10px_40px_-12px_rgba(255,59,71,0.8)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(255,59,71,0.6),0_0_34px_-2px_rgba(255,59,71,0.75),0_18px_60px_-10px_rgba(255,59,71,1)]"
    >
      {/* breath: a soft halo swells out and dissolves every few seconds */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          initial={{ boxShadow: "0 0 0 0px rgba(255,59,71,0.5), 0 0 24px 0px rgba(255,59,71,0)" }}
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(255,59,71,0.5), 0 0 24px 0px rgba(255,59,71,0)",
              "0 0 0 9px rgba(255,59,71,0), 0 0 34px 4px rgba(255,59,71,0.35)",
              "0 0 0 9px rgba(255,59,71,0), 0 0 24px 0px rgba(255,59,71,0)",
            ],
          }}
          transition={{ duration: 2.2, times: [0, 0.55, 1], ease: "easeOut", repeat: Infinity, repeatDelay: 1.8 }}
        />
      )}

      {/* orbiting light on the border */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-[1.5px]"
        style={{ backgroundImage: ring, ...RING_MASK }}
      />

      <LaserOutline on={hover} />

      {/* glint across the face on hover */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shine_0.9s_ease]" />
      </span>

      {/* label: light pours through the letters left to right while hovered */}
      <span className="relative bg-[linear-gradient(110deg,rgba(255,255,255,0.8)_38%,#ffffff_47%,#fff4f2_50%,#ffffff_53%,rgba(255,255,255,0.8)_62%)] bg-[length:250%_100%] bg-[position:100%_0] bg-clip-text text-transparent group-hover:animate-[text-shimmer_1.6s_ease-in-out_infinite]">
        {children}
      </span>
      <ArrowRight
        className="relative size-4.5 transition-transform duration-500 ease-out group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </motion.a>
  );
}

/**
 * Secondary hero CTA: on hover the label warms to red, a laser traces the outline
 * and the face of the button turns into a darkened concept photo.
 */
export function SecondaryCta({ href, children, photo }: { href: string; children: ReactNode; photo: string }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={href}
      whileTap={PRESS}
      transition={SPRING}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-paper/15 bg-card px-8 py-[18px] text-[16.5px] font-semibold tracking-tight text-paper transition-[color,border-color] duration-700 ease-out hover:border-paper/5 hover:text-accent"
    >
      {/* the photo surfacing behind the label — dimmed so the text stays readable */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <motion.img
          src={photo}
          alt=""
          className="absolute inset-0 size-full object-cover"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={hover ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.12 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,15,0.82),rgba(14,12,15,0.62)_50%,rgba(14,12,15,0.82))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </span>

      <LaserOutline on={hover} />
      <span className="relative">{children}</span>
    </motion.a>
  );
}
