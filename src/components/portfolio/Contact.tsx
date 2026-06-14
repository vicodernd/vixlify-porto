import { ArrowRight } from "lucide-react";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GradientShimmer } from "@/components/motion/GradientShimmer";
import { openInquiry } from "@/lib/inquiry";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 sm:py-40 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(40% 40% at 20% 80%, rgba(0,229,255,0.15) 0%, transparent 60%), radial-gradient(40% 40% at 80% 20%, rgba(255,45,149,0.15) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 text-center">
        <RevealOnView className="flex items-center justify-center gap-3">
          <span className="hairline w-16" />
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
            04 · Let's build
          </span>
          <span className="hairline w-16" />
        </RevealOnView>
        <h2 className="mt-6 font-display text-balance text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-white">
          <AnimatedText as="span" className="block" stagger={75}>
            Have a vision worth
          </AnimatedText>
          <AnimatedText as="span" className="block" stagger={75} delay={260}>
            <GradientShimmer delay={1100}>obsessing over?</GradientShimmer>
          </AnimatedText>
        </h2>
        <RevealOnView as="p" delay={500} className="mx-auto mt-6 max-w-xl text-base text-white/60">
          We take on a handful of projects each quarter. Tell us what you are building.
        </RevealOnView>
        <RevealOnView delay={700} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={openInquiry}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#05070f] glow-cyan transition-transform hover:scale-[1.03]"
          >
            Start a project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
          >
            Browse the reel again
          </a>
        </RevealOnView>
        <RevealOnView as="p" delay={850} className="mt-6 text-xs text-white/40">
          Or email{" "}
          <a
            href="mailto:hello@vixlify.com"
            className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            hello@vixlify.com
          </a>
        </RevealOnView>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center sm:px-8">
        <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
          © {new Date().getFullYear()} Vixlify Studio · Every Pixel Has a Purpose.
        </p>
        <div className="flex items-center gap-5 text-xs text-white/50">
          <a href="https://www.instagram.com/vixlifyy/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://www.threads.com/@vixlifyy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Threads</a>
          <a href="https://x.com/vixlifyy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
        </div>
      </div>
    </footer>
  );
}
