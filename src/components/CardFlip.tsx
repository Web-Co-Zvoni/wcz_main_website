/**
 * Card Flip — adapted from KokonutUI (MIT, @dorianbaffier, https://kokonutui.com)
 * Changes: brand colours, icon in the halo, tap/keyboard flipping, Vite (no styled-jsx).
 */
import { ArrowRight, Repeat2, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../utils/cn";
import { cz } from "../utils/typo";

export interface CardFlipProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  cta: string;
  href: string;
}

export default function CardFlip({ title, subtitle, description, features, icon: Icon, cta, href }: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const pointerType = useRef("mouse");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${title}: ${subtitle}`}
      className="group relative h-[340px] w-full max-w-[340px] cursor-pointer [perspective:2000px] focus-visible:outline-none"
      onPointerDown={(e) => (pointerType.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setIsFlipped(false)}
      onClick={() => pointerType.current !== "mouse" && setIsFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((f) => !f);
        }
      }}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-2xl",
          "[transform-style:preserve-3d]",
          "transition-[transform] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]",
          "motion-reduce:transition-none",
          "group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-ink",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* front */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden rounded-2xl",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "border border-paper/10 bg-gradient-to-b from-card to-ink",
            "transition-[border-color,box-shadow] duration-500 group-hover:border-accent/30 group-hover:shadow-[0_30px_70px_-30px_rgba(255,214,10,0.45)]"
          )}
        >
          <div aria-hidden className="absolute inset-0 flex items-start justify-center pt-20">
            <div className="relative flex h-[100px] w-[200px] items-center justify-center">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="animate-halo absolute size-[50px] rounded-full opacity-0 motion-reduce:hidden"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
              <Icon className="relative size-8 text-accent drop-shadow-[0_0_14px_var(--color-accent)]" strokeWidth={1.75} />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 p-6 text-center">
            <h3 className="display-soft text-[21px] leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-1">
              {title}
            </h3>
            <p className="text-[14px] text-mute transition-transform delay-[50ms] duration-500 ease-out group-hover:-translate-y-1">
              {subtitle}
            </p>
            <Repeat2 aria-hidden className="mt-3 size-4 text-accent/70" />
          </div>
        </div>

        {/* back */}
        <div
          className={cn(
            "absolute inset-0 flex h-full w-full flex-col items-center rounded-2xl p-7 text-center",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "border border-accent/30 bg-gradient-to-b from-card via-ink to-ink",
            "shadow-[0_30px_70px_-30px_rgba(255,214,10,0.5)]"
          )}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-[15%] -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <h3 className="display-soft text-[20px] leading-tight">{title}</h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{cz(description)}</p>

          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {features.map((feature, index) => (
              <li
                key={feature}
                className="rounded-md border border-paper/10 bg-paper/[0.04] px-2.5 py-1 text-[12.5px] text-paper/85 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  transform: isFlipped ? "translateY(0)" : "translateY(8px)",
                  opacity: isFlipped ? 1 : 0,
                  transitionDelay: `${index * 60 + 200}ms`,
                }}
              >
                {feature}
              </li>
            ))}
          </ul>

          <a
            href={href}
            tabIndex={isFlipped ? 0 : -1}
            onClick={(e) => e.stopPropagation()}
            className="group/cta mt-auto inline-flex items-center gap-2 rounded-xl bg-accent/10 px-5 py-3 text-[14px] font-semibold text-paper ring-1 ring-accent/30 transition-[background-color,box-shadow] duration-300 hover:bg-accent/20 hover:shadow-[0_0_30px_-6px_var(--color-accent)]"
          >
            {cta}
            <ArrowRight className="size-4 text-accent transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
