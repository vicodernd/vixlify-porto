import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { BlurReveal, Rise } from "@/components/motion/reveal";
import { useLang, copy, waLink } from "@/i18n";

/** Live Jakarta time (WIB), updates quietly. */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>{time} WIB</span>;
}

export function Hero() {
  const { lang } = useLang();
  const t = copy[lang].hero;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 grain"
    >
      {/* Ember particle flow-field — KEPT from v2 (Vico's explicit instruction) */}
      <NeuralBackground
        className="-z-10 opacity-70"
        colors={["#ff6a2b", "#ff8a4c", "#c9c9c9"]}
        trailOpacity={0.12}
        fadeRgb="10,10,10"
        particleCount={isMobile ? 200 : 460}
      />
      {/* Ember bloom, concentrated lower-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 55% at 78% 72%, rgba(255,106,43,0.16) 0%, transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.72) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        {/* eyebrow */}
        <Rise className="flex items-center gap-3" delay={0.1}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/60 sm:text-[11px]">
            {t.eyebrow}
          </span>
          <span className="hidden h-px w-16 bg-white/20 sm:inline-block" />
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.28em] text-white/35 sm:inline">
            Est. 2026
          </span>
        </Rise>

        {/* headline = the tagline, always English (brand rule), resolves from blur */}
        <h1 className="mt-6 font-display text-[13vw] font-semibold leading-[0.9] tracking-[-0.05em] text-[#e4e4e4] sm:mt-8 sm:text-[9vw] lg:text-[7.5rem] xl:text-[8.5rem]">
          <BlurReveal text="Websites and automation," className="block" stagger={0.07} delay={0.15} />
          <BlurReveal text="built with intent." className="block text-white" stagger={0.07} delay={0.5} />
        </h1>

        {/* sub + CTAs */}
        <div className="mt-9 grid gap-8 sm:mt-12 sm:grid-cols-[1.3fr_1fr] sm:items-end">
          <Rise as="p" delay={0.7} className="max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-lg">
            {t.sub}
          </Rise>

          <Rise delay={0.85} className="flex flex-col gap-4 sm:items-end">
            <a
              href={waLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-[#0a0a0a] transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              {t.primary}
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <span className="relative">
                {t.secondary}
                <span className="absolute inset-x-0 -bottom-1 h-px w-full origin-left scale-x-100 bg-white/30 transition-transform group-hover:scale-x-110" />
              </span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </Rise>
        </div>

        {/* systems readout */}
        <Rise
          delay={1}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:mt-16"
        >
          <span>Jakarta</span>
          <span className="text-white/25">/</span>
          <span className="text-white/70">
            <LiveClock />
          </span>
          <span className="text-white/25">/</span>
          <span className="flex items-center gap-2 text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5f5f5]" />
            {t.status}
          </span>
        </Rise>
      </div>

      {/* floating corner credibility card, Trionn-style (honest: no fake years) */}
      <div className="pointer-events-none absolute bottom-6 right-5 hidden sm:right-8 lg:block">
        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Est. 2026
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
            {t.based}
          </div>
        </div>
      </div>
    </section>
  );
}
