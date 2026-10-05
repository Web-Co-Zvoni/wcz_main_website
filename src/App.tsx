import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Lenis from "lenis";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTACT, SETTINGS } from "./content";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import Services from "./components/Services";

/** Butter-smooth scrolling + anchored navigation */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: SETTINGS.smoothScrollLerp, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, {
          offset: SETTINGS.smoothScrollOffset,
          duration: SETTINGS.smoothScrollDuration,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
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
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-2xl bg-signal py-2.5 pl-2.5 pr-5 text-white shadow-[0_0_0_1px_rgba(255,59,71,0.6),0_16px_44px_-10px_rgba(255,59,71,0.8)] transition-colors hover:bg-accent"
        >
          <span className="relative grid size-9 place-items-center rounded-xl bg-ink/25 text-white">
            <span className="pulse-ring" />
            <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </span>
          <span className="text-[16px] font-bold tracking-tight">{CONTACT.formTitle}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        <div className="grain" />
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <Process />
          <Portfolio />
          <Pricing />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <FloatingEnquiry />
      </div>
    </MotionConfig>
  );
}
