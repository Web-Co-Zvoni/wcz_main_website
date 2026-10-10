import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Lenis from "lenis";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTACT, SETTINGS } from "./content";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { InstantReveal } from "./components/ui";
import { MorphProvider } from "./lib/morph";
import { go, parseRoute, useEntry } from "./lib/router";
import { setLenis } from "./lib/scroll";
import ConceptPage from "./pages/ConceptPage";
import Home from "./pages/Home";
import NichePage from "./pages/NichePage";
import NotFound from "./pages/NotFound";

/** Butter-smooth scrolling, anchored navigation, and links between the site's pages without reloads */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: SETTINGS.smoothScrollLerp, smoothWheel: true });
    setLenis(lenis);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const glide = (el: Element) =>
      lenis.scrollTo(el as HTMLElement, {
        offset: SETTINGS.smoothScrollOffset,
        duration: SETTINGS.smoothScrollDuration,
      });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      if (href.startsWith("#")) {
        e.preventDefault();
        const el = document.querySelector(href);
        // not on this page: it's a section of the home page
        if (el) glide(el);
        else go("/" + href);
        return;
      }

      const url = new URL(a.href);
      if (url.origin !== location.origin || parseRoute(url.pathname).page === "missing") return;
      e.preventDefault();
      const el = url.pathname === location.pathname && url.hash ? document.querySelector(url.hash) : null;
      if (el) glide(el);
      else go(url.pathname + url.hash);
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
      document.removeEventListener("click", onClick);
    };
  }, []);
}

/** Floating shortcut to the enquiry form — steps aside once the form itself is on screen */
function FloatingEnquiry() {
  const [scrolled, setScrolled] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SETTINGS.floatingCallScrollThreshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const form = document.getElementById("kontakt");
    const io = form ? new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 }) : null;
    if (form && io) io.observe(form);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = scrolled && !atForm;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#kontakt"
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-label={CONTACT.formTitle}
          className="group fixed z-40 flex items-center gap-3 rounded-2xl bg-signal p-2.5 text-white shadow-[0_0_0_1px_rgba(255,59,71,0.6),0_16px_44px_-10px_rgba(255,59,71,0.8)] transition-colors hover:bg-accent sm:py-2.5 sm:pl-2.5 sm:pr-5"
          style={{ right: "calc(1.25rem + env(safe-area-inset-right))", bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        >
          <span className="relative grid size-9 place-items-center rounded-xl bg-ink/25 text-white">
            <span className="pulse-ring" />
            <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </span>
          <span className="hidden text-[1rem] font-bold tracking-tight sm:inline">{CONTACT.formTitle}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  useSmoothScroll();
  const entry = useEntry();
  const route = parseRoute(entry.path);

  return (
    <MotionConfig reducedMotion="user">
      <MorphProvider>
        <div className="relative min-h-screen">
          <div className="grain" />
          <Header />
          {/* a page brought back with Back is shown as it was left, without its entrance */}
          <InstantReveal.Provider value={entry.restored}>
            <main key={entry.path}>
              {route.page === "home" ? (
                <Home />
              ) : route.page === "niche" ? (
                <NichePage slug={route.slug} />
              ) : route.page === "concept" ? (
                <ConceptPage slug={route.slug} />
              ) : (
                <NotFound />
              )}
            </main>
          </InstantReveal.Provider>
          <Footer />
          <FloatingEnquiry key={entry.path} />
        </div>
      </MorphProvider>
    </MotionConfig>
  );
}
