import { ArrowDown, Github } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { DictationDemo } from "./DictationDemo";
import { RELEASE_URL, REPO_URL, SPEC } from "./meta";

/**
 * Section 1 — VixWispr hero (DARK).
 *
 * Structure follows the Opacity lesson from the design library: keep the page
 * chrome near-monochrome, spend the whitespace, then let the product itself
 * carry the reveal. So the copy block sits left-aligned at the top at a
 * comfortable measure, and the motion-graphics stage gets the full width below
 * it rather than being squeezed into a side column (the transcript needs room to
 * breathe on one or two lines).
 *
 * The mono readout under the CTAs states the honest specs up front (platform,
 * version, size, licence) the way YLEM states material before it asks for
 * anything.
 */
export function VixwisprHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
        {/* eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] shadow-[0_0_10px_rgba(255,106,43,0.9)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            VixWispr · free desktop app
          </span>
          <LineGrow className="max-w-16 bg-white/20" />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          {/* headline: two-tone, second line outlined */}
          <h1 className="font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.75rem,8.5vw,7rem)] lg:col-span-7">
            <BlurReveal text="Speak. It types," />
            <BlurReveal
              text="anywhere on Windows."
              delay={0.12}
              className="[-webkit-text-stroke:1.5px_#ececec] text-transparent"
            />
          </h1>

          <Rise
            as="p"
            delay={0.15}
            className="max-w-lg text-[15px] leading-relaxed text-white/60 sm:text-[1rem] lg:col-span-5"
          >
            Hold one hotkey in any app, say what you mean, and VixWispr transcribes it with
            Whisper, strips the filler words, fixes the punctuation, and pastes it at your
            cursor. Indonesian and English. Free, open source, and it runs on your own API key.
          </Rise>
        </div>

        {/* CTAs */}
        <Rise delay={0.22} className="mt-11 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href={RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] transition-colors duration-500 hover:bg-[#ff6a2b] hover:text-white"
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
            Download for Windows
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/18 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors duration-500 hover:border-white/40 hover:text-white"
          >
            <Github className="h-4 w-4" />
            View source
          </a>
        </Rise>

        {/* honest spec readout */}
        <Rise delay={0.28} className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
          {SPEC.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-white/20" />}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {s}
              </span>
            </span>
          ))}
        </Rise>

        {/* the set-piece */}
        <div className="mt-16 sm:mt-20">
          <DictationDemo />
        </div>
      </div>
    </section>
  );
}
