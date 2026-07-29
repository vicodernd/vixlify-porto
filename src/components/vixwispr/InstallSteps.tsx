import { ArrowDown } from "lucide-react";
import { Rise, BlurReveal, LineGrow } from "@/components/motion/reveal";
import { RELEASE_URL, SIZE } from "./meta";

/**
 * Section 5 — Install in three steps (DARK flip after the light capabilities
 * act). Three steps, not a generic "how it works": download, the SmartScreen
 * warning explained honestly BEFORE the visitor hits it (so it reads as
 * expected, not as a red flag), then paste the Groq key.
 *
 * The SmartScreen copy quoted in step 02 is the actual, well-known Windows
 * dialog text (Microsoft's own OS UI strings), reproduced because showing
 * the exact words a visitor is about to see is more reassuring than a vague
 * "you might see a warning" — same "prove it, don't just describe it" rule
 * the rest of the page already runs on.
 */

const STEPS = [
  {
    n: "01",
    title: "Download",
    body: `Click the button below. It's a single ${SIZE} installer, nothing else to grab.`,
  },
  {
    n: "02",
    title: "Windows will warn you",
    body: "That's expected, not a red flag: VixWispr isn't code-signed yet. Click \"More info\", then \"Run anyway\".",
  },
  {
    n: "03",
    title: "Paste your Groq key",
    body: "Open Settings from the tray icon, paste a free key from console.groq.com/keys, and start dictating.",
  },
] as const;

function SmartScreenDialog() {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-white/12 bg-[#f2f1ef] text-[#111111] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-black/10 bg-white px-4 py-2.5">
        <div className="h-3.5 w-3.5 rounded-sm bg-[#0067c0]" aria-hidden="true" />
        <span className="font-body text-[12px] font-semibold text-[#111111]">
          Windows protected your PC
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[12px] leading-relaxed text-[#3a3a38]">
          Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this
          app might put your PC at risk.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b6b68]">
          App: VixWispr-Setup-0.1.0.exe
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <span className="rounded px-3.5 py-1.5 font-body text-[11.5px] text-[#3a3a38]">
            Don&apos;t run
          </span>
          <span className="rounded px-3.5 py-1.5 font-body text-[11.5px] font-semibold text-[#0067c0]">
            More info
          </span>
        </div>
      </div>
    </div>
  );
}

export function InstallSteps() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      <div aria-hidden="true" className="relative h-px w-full bg-white/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-white/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            05 / install
          </span>
          <LineGrow className="max-w-16 bg-white/20" />
        </div>

        <h2 className="mt-6 max-w-[16ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,7vw,5.5rem)]">
          <BlurReveal text="Three steps." />
          <BlurReveal
            text="Then just talk."
            delay={0.12}
            className="[-webkit-text-stroke:1.5px_#ececec] text-transparent"
          />
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-14 sm:mt-24 lg:grid-cols-3 lg:gap-12">
          {STEPS.map((s, i) => (
            <Rise key={s.n} delay={0.08 * i}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.16em] text-[#ff6a2b]">
                  {s.n}
                </span>
                <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] sm:text-[1.9rem]">
                  {s.title}
                </h3>
              </div>
              <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-white/55 sm:text-[14px]">
                {s.body}
              </p>

              {i === 1 && (
                <div className="mt-7">
                  <SmartScreenDialog />
                </div>
              )}
              {i === 0 && (
                <a
                  href={RELEASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f5] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] transition-colors duration-500 hover:bg-[#ff6a2b] hover:text-white"
                  style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                >
                  <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                  Download for Windows
                </a>
              )}
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
