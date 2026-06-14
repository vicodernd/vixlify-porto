import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "We spend a week deep inside your product, audience, and edges. No deck theater, just sharp questions.",
    dot: "#00E5FF",
  },
  {
    n: "02",
    title: "Direct",
    body: "Two or three art directions, each a complete world. We pick one together and commit.",
    dot: "#8B5CF6",
  },
  {
    n: "03",
    title: "Deliver",
    body: "Pixel-true builds, hand-tuned motion, and a system your team can extend without us.",
    dot: "#FF2D95",
  },
];

export function Approach() {
  return (
    <section id="approach" className="relative py-24 sm:py-32 border-t border-white/8">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <RevealOnView className="flex items-center gap-3">
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
            03 · Approach
          </span>
          <span className="hairline w-16" />
        </RevealOnView>
        <h2 className="mt-4 font-display text-balance text-5xl sm:text-6xl font-semibold tracking-tight text-white max-w-3xl">
          <AnimatedText as="span" className="block" stagger={70}>
            A studio that ships.
          </AnimatedText>
          <AnimatedText as="span" className="block" stagger={70} delay={220}>
            Not a deck that lingers.
          </AnimatedText>
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <RevealOnView
              key={s.n}
              delay={i * 140}
              className="relative bg-[#0a0d1a] p-7 sm:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xs uppercase tracking-[0.28em] text-white/40">
                  Step {s.n}
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.dot, boxShadow: `0 0 16px ${s.dot}` }}
                />
              </div>
              <h3 className="mt-8 font-display text-3xl font-semibold tracking-tight text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{s.body}</p>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
