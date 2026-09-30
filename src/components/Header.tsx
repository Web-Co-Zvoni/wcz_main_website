import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HEADER, NAV_LINKS, SITE } from "../content";
import { cn } from "../utils/cn";
import { EASE } from "./ui";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-accent text-ink transition-transform duration-500 group-hover:rotate-[15deg]">
        <Phone className="size-4.5 -rotate-12" strokeWidth={2.5} fill="currentColor" />
      </span>
      <span className="stretch text-[17px] font-extrabold tracking-tight">
        {SITE.name}
        <span className="text-accent">{SITE.brandSuffix}</span>
      </span>
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
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-paper/8 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-mono text-[11.5px] font-medium uppercase tracking-[0.18em] text-mute transition-colors hover:text-paper"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneLink}`}
              className="hidden items-center gap-2 font-mono text-[12px] tracking-wider text-mute transition-colors hover:text-paper md:flex"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-leaf" />
              </span>
              {SITE.phone}
            </a>
            <a
              href="#kontakt"
              className="hidden items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[13px] font-bold tracking-tight text-ink transition-all duration-300 hover:bg-flame hover:shadow-[0_0_32px_-6px_var(--color-accent)] sm:flex"
            >
              {HEADER.offerCta}
              <ArrowUpRight className="size-4" strokeWidth={2.5} />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label={HEADER.openMenu}
              className="grid size-10 place-items-center rounded-full border border-paper/15 text-paper lg:hidden"
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
            className="fixed inset-0 z-[60] flex flex-col bg-ink/97 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label={HEADER.closeMenu}
                className="grid size-10 place-items-center rounded-full border border-paper/15 text-paper"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
                  className="group flex items-baseline gap-4 border-b border-paper/8 py-4"
                >
                  <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                  <span className="stretch text-4xl font-extrabold uppercase tracking-tight transition-colors group-hover:text-accent">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="px-6 pb-10"
            >
              <a
                href={`tel:${SITE.phoneLink}`}
                className="flex items-center justify-between rounded-2xl bg-accent px-6 py-5 text-ink"
              >
                <span className="text-sm font-bold uppercase tracking-widest">{HEADER.callUs}</span>
                <span className="stretch text-2xl font-extrabold">{SITE.phone}</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
