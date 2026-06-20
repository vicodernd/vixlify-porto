import NeuralBackground from "@/components/ui/flow-field-background";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GradientShimmer } from "@/components/motion/GradientShimmer";
import { openInquiry } from "@/lib/inquiry";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 sm:pt-44 pb-24 sm:pb-32 grain">
      <NeuralBackground
        className="-z-10 opacity-50"
        colors={["#00E5FF", "#8B5CF6", "#FF2D95"]}
        trailOpacity={0.14}
        fadeRgb="5,7,15"
        particleCount={500}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 aurora opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 -z-10 h-[520px] w-[520px] rounded-full opacity-50 animate-float-slow"
        style={{ background: "radial-gradient(closest-side, rgba(0,229,255,0.30), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-[-10%] -z-10 h-[480px] w-[480px] rounded-full opacity-50 animate-float-slow"
        style={{
          background: "radial-gradient(closest-side, rgba(255,45,149,0.28), transparent)",
          animationDelay: "-6s",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,15,0.65) 100%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <RevealOnView className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse-ring" />
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/60">
            Web + App Design Studio
          </span>
          <span className="hidden sm:inline-block hairline w-24" />
          <span className="hidden sm:inline font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
            Est. 2026
          </span>
        </RevealOnView>

        <h1 className="mt-7 font-display text-balance text-[15vw] sm:text-[10vw] lg:text-[8.2rem] xl:text-[10rem] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
          <AnimatedText as="span" className="block" stagger={90} delay={120}>
            Every Pixel
          </AnimatedText>
          <AnimatedText as="span" className="block" stagger={90} delay={360}>
            {"Has a "}
            <GradientShimmer delay={1200}>Purpose.</GradientShimmer>
          </AnimatedText>
        </h1>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <RevealOnView as="p" delay={900} className="max-w-xl text-base sm:text-lg text-white/65 leading-relaxed">
            VIXLIFY is a small studio crafting premium websites and product interfaces for ambitious
            brands. We design with restraint, ship with rigor, and treat motion as part of the message.
          </RevealOnView>
          <RevealOnView delay={1100} className="flex flex-wrap items-center gap-6 sm:justify-end">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              <span className="relative">
                See the reel
                <span className="absolute inset-x-0 -bottom-1 h-px bg-white/40 transition-transform group-hover:scale-x-110" />
              </span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↓</span>
            </a>
            <button
              type="button"
              onClick={openInquiry}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
            >
              Start a project
            </button>
          </RevealOnView>
        </div>
      </div>
    </section>
  );
}
