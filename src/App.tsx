import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Lenis from "lenis";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import Problem from "./components/Problem";
import Process from "./components/Process";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

/** Butter-smooth scrolling + anchored navigation */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
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
        lenis.scrollTo(el as HTMLElement, { offset: -70, duration: 1.4 });
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

/** Custom cursor — dot + trailing ring, grows over interactive elements */
function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor], input, select, textarea, label"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent mix-blend-difference"
        style={{ x, y }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/50 mix-blend-difference"
        style={{ x: rx, y: ry }}
        animate={{ width: hover ? 52 : 30, height: hover ? 52 : 30, opacity: hover ? 1 : 0.55 }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}

/** Floating call button — the brand gesture */
function FloatingCall() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="tel:+420777284596"
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-accent py-3 pl-4 pr-5 text-ink shadow-[0_16px_40px_-10px_rgba(255,92,31,0.55)] transition-colors hover:bg-flame"
          aria-label="Zavolat webcozvoni.cz"
        >
          <span className="relative grid size-9 place-items-center rounded-full bg-ink text-accent">
            <span className="pulse-ring" />
            <Phone className="animate-ringshake size-4" fill="currentColor" />
          </span>
          <span className="stretch text-[15px] font-black tracking-tight">777 284 596</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  useSmoothScroll();

  return (
    <div className="relative min-h-screen">
      <div className="noise-layer" />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Services />
        <Process />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}
