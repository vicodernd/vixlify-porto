import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { LangProvider } from "@/i18n";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/home/Hero";
import { KineticBand } from "@/components/home/KineticBand";
import { Pillars } from "@/components/home/Pillars";
import { SelectedWork } from "@/components/home/SelectedWork";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FreeResources } from "@/components/home/FreeResources";
import { SiteFooter } from "@/components/home/Footer";

/**
 * Vixlify homepage — v3 Trionn-caliber rebuild.
 *
 * Built section by section (Vico reviews each before the next). Current:
 * Preloader (light) -> Hero (dark, ember field kept). Kinetic band, services,
 * selected work, how-it-works, free resources, and footer follow.
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Lenis smooth scroll for the immersive Trionn feel (off for reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <LangProvider>
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="dark min-h-screen bg-[#0a0a0a] text-[#ececec] antialiased">
        <Nav />
        <main>
          <Hero />
          <KineticBand />
          <Pillars />
          <SelectedWork />
          <HowItWorks />
          <FreeResources />
        </main>
        <SiteFooter />
      </div>
    </LangProvider>
  );
}
