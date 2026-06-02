import { projects } from "@/data/projects";
import { VideoTile } from "@/components/VideoTile";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GradientShimmer } from "@/components/motion/GradientShimmer";

export function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                01 · Selected reels
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
              <AnimatedText as="span" className="block" stagger={80}>
                Short clips.
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={80} delay={220}>
                <GradientShimmer delay={1000}>Long memory.</GradientShimmer>
              </AnimatedText>
            </h2>
          </div>
          <RevealOnView as="p" delay={400} className="max-w-sm text-sm text-white/55">
            Five to ten second loops, framed in 3:2. Each one is the opening moment of a site we
            shipped. The full builds live one click away.
          </RevealOnView>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-24 md:grid-cols-2">
          {projects.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <VideoTile project={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
