import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { VideoTile } from "@/components/VideoTile";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GradientShimmer } from "@/components/motion/GradientShimmer";

const ghostFrames = [
  { label: "Reserved", accent: "#00E5FF" },
  { label: "Your brand here", accent: "#8B5CF6" },
  { label: "Q2 2026", accent: "#FF2D95" },
];

export function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* ── A · Studio explorations ─────────────────────────────────── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                01 · Studio explorations
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
              <AnimatedText as="span" className="block" stagger={80}>
                Nobody briefed these.
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={80} delay={220}>
                <GradientShimmer delay={1000}>We built them anyway.</GradientShimmer>
              </AnimatedText>
            </h2>
          </div>
          <RevealOnView as="p" delay={400} className="max-w-sm text-sm text-white/55">
            Self-directed studies, not client work. Fictional brands we built to push the craft
            past the brief. No one signed off on a single frame. The same hands ship the real
            ones.
          </RevealOnView>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-24 md:grid-cols-2">
          {projects.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <VideoTile project={p} index={i} />
            </div>
          ))}
        </div>

        {/* ── divider ─────────────────────────────────────────────────── */}
        <div className="mt-28 flex items-center gap-4 sm:mt-36">
          <span className="hairline flex-1" />
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
            Next: the real ones
          </span>
          <span className="hairline flex-1" />
        </div>

        {/* ── B · Founding projects ───────────────────────────────────── */}
        <RevealOnView
          delay={120}
          className="relative mt-16 overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0d1a] p-8 sm:p-12 lg:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 80% at 80% 10%, rgba(139,92,246,0.16) 0%, transparent 60%), radial-gradient(50% 70% at 10% 90%, rgba(0,229,255,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Header — one left-aligned block: eyebrow → headline → copy → slot → CTA. */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                02 · Founding projects
              </span>
              <span className="hairline w-16" />
            </div>
            <h2 className="mt-4 font-display text-balance text-5xl sm:text-6xl font-semibold tracking-tight text-white">
              <AnimatedText as="span" className="block" stagger={80}>
                Client work,
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={80} delay={220}>
                <GradientShimmer delay={1000}>loading.</GradientShimmer>
              </AnimatedText>
            </h2>
            <RevealOnView as="p" delay={300} className="mt-6 max-w-xl text-base text-white/60">
              Vixlify is new on purpose. Two founding clients get premium work at a founding
              rate, and their launch becomes the first real case study on this page. We're
              building with the first now. The next frame is open.
            </RevealOnView>

            <RevealOnView
              delay={450}
              className="mt-6 flex items-center gap-3 text-[11px] font-display uppercase tracking-[0.28em] text-white/45"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#8B5CF6", boxShadow: "0 0 10px #8B5CF6" }}
              />
              2 founding slots · case studies live Q2 2026
            </RevealOnView>

            <RevealOnView delay={600} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/founding"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#05070f] glow-cyan transition-transform hover:scale-[1.03]"
              >
                Claim a founding slot
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/founding"
                className="text-sm font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                How the program works
              </a>
            </RevealOnView>
          </div>

          {/* Ghost frames — open slots as a full-width row, echoing the reel grid above */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
            {ghostFrames.map((g, i) => (
              <RevealOnView
                key={g.label}
                delay={350 + i * 120}
                className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-white/15 bg-white/[0.02]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    background: `radial-gradient(70% 60% at 30% 20%, ${g.accent}1f 0%, transparent 65%)`,
                  }}
                />
                <span className="relative font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
                  {g.label}
                </span>
              </RevealOnView>
            ))}
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
