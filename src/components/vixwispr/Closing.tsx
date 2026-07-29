import { ArrowDown, Github } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { RELEASE_URL, REPO_URL, SPEC } from "./meta";

/**
 * Section 6 — Download (DARK), the closing CTA before the shared SiteFooter.
 * Mirrors the hero's CTA row and spec readout on purpose (same buttons, same
 * facts) so the page opens and closes on the same honest promise instead of
 * introducing new claims at the very end.
 */
export function Closing() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      <div aria-hidden="true" className="relative h-px w-full bg-white/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-white/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-28 text-center sm:px-8 sm:py-40">
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            06 / download
          </span>
          <LineGrow className="max-w-16 bg-white/20" />
        </div>

        <h2 className="mx-auto mt-6 max-w-[18ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.75rem,9vw,6.5rem)]">
          <BlurReveal text="Free, and yours" />
          <BlurReveal
            text="in under a minute."
            delay={0.12}
            className="[-webkit-text-stroke:1.5px_#ececec] text-transparent"
          />
        </h2>

        <Rise
          as="p"
          delay={0.18}
          className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/55 sm:text-[1rem]"
        >
          Windows only for now. Built for macOS too, but unsigned apps hit a hard Gatekeeper wall
          there, so the public download stays Windows until that's solved properly.
        </Rise>

        <Rise delay={0.24} className="mt-11 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href={RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] transition-colors duration-500 hover:bg-[#ff6a2b] hover:text-white"
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
            Download for Windows
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/18 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors duration-500 hover:border-white/40 hover:text-white"
          >
            <Github className="h-4 w-4" />
            View source
          </a>
        </Rise>

        <Rise delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {SPEC.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-white/20" />}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {s}
              </span>
            </span>
          ))}
        </Rise>
      </div>
    </section>
  );
}
