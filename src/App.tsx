import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Marquee } from "@/components/portfolio/Marquee";
import { Work } from "@/components/portfolio/Work";
import { Approach } from "@/components/portfolio/Approach";
import { Contact, Footer } from "@/components/portfolio/Contact";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div
        className="dark min-h-screen bg-[#05070f] text-white antialiased"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      >
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Work />
          <Approach />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
