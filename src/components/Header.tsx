import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HEADER, NAV_LINKS, SITE } from "../content";
import { cn } from "../utils/cn";
import { BellMark, Button, EASE } from "./ui";

/** `large` grows the mark on wide screens — the header's version; footer and menu keep the standard size */
export function Logo({ className, large = false }: { className?: string; large?: boolean }) {
  return (
    <a href="#top" className={cn("group flex items-center gap-2.5", large && "min-[1224px]:gap-3", className)} aria-label={SITE.domain}>
      <span
        className={cn(
          "relative grid size-11 place-items-center rounded-[0.75rem] bg-signal text-white shadow-[0_0_24px_-6px_var(--color-accent)] transition-shadow duration-500 group-hover:shadow-[0_0_32px_-2px_var(--color-accent)]",
          large && "min-[1224px]:size-[3.625rem] min-[1224px]:rounded-[1rem]"
        )}
      >
        <BellMark
          className={cn("size-[1.875rem] origin-top transition-transform duration-500 group-hover:animate-ringshake", large && "min-[1224px]:size-[2.5rem]")}
          strokeWidth={9}
          compact
        />
      </span>
      <span className={cn("display-soft text-[1.3125rem] leading-none", large && "min-[1224px]:text-[1.6562rem]")}>
        {SITE.name}
        <span className="text-accent">{SITE.brandSuffix}</span>
      </span>
    </a>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group relative px-1 py-2 text-[0.8438rem] font-medium text-mute transition-colors hover:text-paper lg:text-[0.9688rem] xl:text-[1.0625rem] min-[1224px]:text-[1.2188rem]">
      {label}
      <span className="absolute inset-x-1 -bottom-0.5 h-px origin-center scale-x-0 bg-accent shadow-[0_0_8px_var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "hairline bg-ink/80 backdrop-blur-xl" : "border-transparent bg-transparent"
        )}
      >
        {/* everything grows from 1224px up (1440 at the 85% desktop scale) — below that the row is already full and the beam needs its gap */}
        <div className="mx-auto flex h-[5.75rem] max-w-[88rem] items-center px-4 md:px-8 min-[1224px]:h-[6.875rem]">
          <Logo large />

          {/* nav sits left; the hero beam falls through the open space to its right */}
          <nav className="ml-8 hidden items-center gap-4 md:flex lg:ml-10 lg:gap-6 xl:ml-12 xl:gap-7 min-[1224px]:ml-10 min-[1224px]:gap-6">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </nav>

          <div data-header-actions className="ml-auto flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneLink}`}
              className="hidden items-center gap-2 text-[1rem] font-medium tabular-nums min-[1224px]:text-[1.125rem] text-mute transition-colors hover:text-paper xl:flex"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-volt" />
              </span>
              {SITE.phone}
            </a>
            <Button href="#kontakt" className="hidden px-6 py-3.5 text-[0.9375rem] lg:inline-flex min-[1224px]:px-8 min-[1224px]:py-[1.125rem] min-[1224px]:text-[1.0625rem]">
              {HEADER.offerCta}
            </Button>
            <button
              onClick={() => setOpen(true)}
              aria-label={HEADER.openMenu}
              className="grid size-11 place-items-center rounded-xl border border-paper/15 text-paper transition-colors hover:border-accent/60 md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/3 size-[26.25rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
            <div className="relative flex h-[5.75rem] items-center justify-between px-4">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label={HEADER.closeMenu}
                className="grid size-10 place-items-center rounded-xl border border-paper/15 text-paper"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col items-center justify-center gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
                  className="display py-2 text-4xl transition-colors hover:text-accent"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="relative px-4 pb-10"
            >
              <a
                href={`tel:${SITE.phoneLink}`}
                className="flex flex-col items-center gap-1 rounded-2xl bg-signal px-6 py-5 text-white shadow-[0_10px_40px_-12px_var(--color-accent)]"
              >
                <span className="flex items-center gap-2 text-sm font-medium opacity-85">
                  <Phone className="size-4" fill="currentColor" />
                  {HEADER.callUs}
                </span>
                <span className="text-3xl font-bold tabular-nums tracking-tight">{SITE.phone}</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
