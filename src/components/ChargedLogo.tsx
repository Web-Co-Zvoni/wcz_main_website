import type { CSSProperties } from "react";
import ElectricLogo from "./fx/ElectricLogo";

// fade only the outer band of the canvas (both axes), so the glow dissolves into the page
// while the mark itself stays at full strength
const FADE = "linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)";
const EDGE_FADE: CSSProperties = {
  maskImage: FADE,
  WebkitMaskImage: FADE,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/**
 * Brand-tuned ElectricLogo. The mark stays put: passing the cursor over it drags
 * the outline locally like liquid, which wobbles back into shape after a moment.
 * Clicking fires ElectricLogo's own ripple + arc burst.
 */
export default function ChargedLogo({
  src,
  scale = 0.7,
  className,
}: {
  src: string;
  scale?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* soft radial mask hides the canvas edge so the glow just fades into the page */}
      <div className="h-full w-full" style={EDGE_FADE}>
        <ElectricLogo
          src={src}
          color="#effff4"
          glowColor="#3df58c"
          scale={scale}
          strands={3}
          bend={0.32}
          crackle={0.9}
          arcs={0.9}
          flicker={0.45}
          fill={0.3}
          glow={0.5}
          thickness={1.7}
          speed={2.2}
          cursorIntensity={0.9}
          cursorRadius={110}
          liquid={1}
          interactive
        />
      </div>
    </div>
  );
}
