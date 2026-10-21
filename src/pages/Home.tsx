import { Suspense, type ReactNode } from "react";
import Booking from "../components/Booking";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import Hero from "../components/Hero";
import Niches from "../components/Niches";
import Portfolio from "../components/Portfolio";
import Pricing from "../components/Pricing";
import Process from "../components/Process";
import Services from "../components/Services";
import { useDocumentTitle } from "./shared";

/**
 * Each section is its own Suspense boundary, so when the browser takes the prerendered page over,
 * React does it a section at a time and lets the page breathe in between — instead of one long block
 * of script. Nothing ever suspends here: the fallback is never shown.
 */
const Part = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function Home() {
  useDocumentTitle(null);
  return (
    <>
      <Hero />
      <Part>
        <Niches />
      </Part>
      <Part>
        <Services />
      </Part>
      <Part>
        <Process />
      </Part>
      <Part>
        <Portfolio />
      </Part>
      <Part>
        <Pricing />
      </Part>
      <Part>
        <Faq />
      </Part>
      <Part>
        <Booking />
      </Part>
      <Part>
        <Contact />
      </Part>
    </>
  );
}
