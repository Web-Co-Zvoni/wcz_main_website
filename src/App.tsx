import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Hero from "./components/Hero";
import Niches from "./components/Niches";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import Services from "./components/Services";
import Shell from "./components/Shell";

export default function App() {
  return (
    <Shell>
      <Hero />
      <Niches />
      <Services />
      <Process />
      <Portfolio />
      <Pricing />
      <Faq />
      <Contact />
    </Shell>
  );
}
