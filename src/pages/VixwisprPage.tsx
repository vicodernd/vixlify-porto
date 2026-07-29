import { LangProvider } from "@/i18n";
import { Nav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/home/Footer";
import { VixwisprHero } from "@/components/vixwispr/Hero";
import { TheLoop } from "@/components/vixwispr/TheLoop";
import { RealScreens } from "@/components/vixwispr/RealScreens";
import { Capabilities } from "@/components/vixwispr/Capabilities";
import { InstallSteps } from "@/components/vixwispr/InstallSteps";
import { Closing } from "@/components/vixwispr/Closing";

/**
 * /vixwispr — the product page for VixWispr, Vico's free voice dictation app for
 * Windows. Part of the free global layer (like /templates), so the page body is
 * English only; the shared chrome stays bilingual, hence its own LangProvider so
 * the Nav and Footer work when the page is reached directly.
 *
 * This is Vixlify's OWN product, so using the Vixlify identity here is correct
 * (the client-prototype rule about never wearing the Vixlify brand applies to
 * client work, not to Vixlify's own releases).
 *
 * Sections are built one at a time per the website-build-workflow SOP.
 */
export function VixwisprPage() {
  return (
    <LangProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-[#ececec] antialiased">
        <Nav home={false} />
        <main>
          <VixwisprHero />
          <TheLoop />
          <RealScreens />
          <Capabilities />
          <InstallSteps />
          <Closing />
        </main>
        <SiteFooter />
      </div>
    </LangProvider>
  );
}
