import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { EASE, EMBER, PILL_BG, PILL_BORDER, WEIGHTS, barHeight, speechLevel } from "./pillSpec";

/**
 * Section 2 — The mechanic (DARK, closes the dark act).
 *
 * The hero above already PLAYS the full pipeline on a loop. Repeating that here
 * would be a rerun, so this section changes who is driving: the visitor holds the
 * key themselves and watches the app's real states answer. That is the Anime.js
 * lesson from the design library taken literally — the page is the product demo —
 * and it is the one claim a static screenshot can never make, because the whole
 * point of VixWispr is that it is a HOLD, not a click.
 *
 * Honesty rules applied here (the site's standing bar):
 *  - Nothing is recorded. No microphone is requested, and the panel says so in
 *    plain sight rather than in a footnote.
 *  - A tap that is too short does NOT fake a transcript. It says "hold it a
 *    little longer", which is exactly what the real hotkey does.
 *  - The pill is the shipped overlay's own spec, imported from ./pillSpec.
 *
 * Motion discipline matches the hero: ONE rAF drives the bars and every phase
 * transition (no competing timers, nothing can drift), React state only changes
 * on discrete phase boundaries, and prefers-reduced-motion keeps the interaction
 * working while dropping the animation.
 */

type Phase = "idle" | "listening" | "working" | "done";

/** How long "Transcribing…" is held before the text lands. */
const WORKING_MS = 900;
/** Delay between words appearing, ms. */
const WORD_STAGGER = 90;
/** Shorter than this is a tap, not a hold — the real hotkey ignores it too. */
const HOLD_MIN_MS = 260;
/** How long the finished line rests before the panel returns to idle. */
const DONE_REST_MS = 2800;

/** Deliberately NOT the hero's sentence, so this reads as a second take.
 *  Two languages, chosen before the hold, so the demo can show the exact
 *  claim the copy makes ("Indonesian or English") instead of only asserting it. */
const SENTENCES: Record<"EN" | "ID", string[]> = {
  EN: ["Reply", "to", "Andi", "and", "confirm", "the", "meeting", "at", "four."],
  ID: ["Balas", "ke", "Andi,", "dan", "konfirmasi", "rapatnya", "jam", "empat."],
};

const BEATS = [
  {
    idx: "01",
    title: "Hold",
    body:
      "Press and hold Ctrl + Space in whatever you are already typing in. The pill appears over your work. No window to open, no tab to switch to.",
    shows: "Hold to speak",
  },
  {
    idx: "02",
    title: "Speak",
    body:
      "Talk the way you actually talk, in Indonesian or English. The meter is the app hearing your voice, not a decoration bouncing on a timer.",
    shows: "Listening…",
  },
  {
    idx: "03",
    title: "Release",
    body:
      "Let go. Whisper transcribes, the AI strips the filler words and fixes the punctuation, and the finished text lands at your cursor.",
    shows: "Pasted",
  },
] as const;

const PHASE_LABEL: Record<Phase, string> = {
  idle: "IDLE",
  listening: "LISTENING",
  working: "TRANSCRIBING",
  done: "PASTED",
};

/** One physical keycap. Unlit it sits proud (a light top edge, a dark inner
 *  bottom); lit it presses down 2px and goes ember. */
function Keycap({ label, lit }: { label: string; lit: boolean }) {
  return (
    <span
      className="rounded-lg border px-3.5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] transition-all duration-200 sm:px-5 sm:py-3 sm:text-[13px]"
      style={{
        borderColor: lit ? EMBER : "rgba(255,255,255,0.2)",
        color: lit ? EMBER : "rgba(236,236,236,0.9)",
        boxShadow: lit
          ? "0 0 0 3px rgba(255,106,43,0.13), inset 0 -1px 0 rgba(255,255,255,0.08)"
          : "0 2px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.4)",
        transform: lit ? "translateY(2px)" : "none",
        transitionTimingFunction: EASE,
      }}
    >
      {label}
    </span>
  );
}

export function TheLoop() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [tooShort, setTooShort] = useState(false);
  const [everHeld, setEverHeld] = useState(false);
  /** Chosen before the hold; locked in via activeLang once a hold starts, so
   *  a demo in progress can never change language under itself. */
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const [activeLang, setActiveLang] = useState<"EN" | "ID">("EN");
  const [heldTenths, setHeldTenths] = useState(0);

  // Refs mirror state for the rAF loop, which must read the current phase
  // without being re-created on every render.
  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);
  const shownRef = useRef(0);
  const heldTenthsRef = useRef(0);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const goto = useCallback((next: Phase) => {
    phaseRef.current = next;
    startRef.current = performance.now();
    setPhase(next);
  }, []);

  const start = useCallback(() => {
    if (phaseRef.current === "listening") return; // already holding
    setTooShort(false);
    setEverHeld(true);
    setActiveLang(lang);
    shownRef.current = 0;
    setShown(0);
    heldTenthsRef.current = 0;
    setHeldTenths(0);
    goto("listening");
  }, [goto, lang]);

  const end = useCallback(() => {
    if (phaseRef.current !== "listening") return;
    const held = performance.now() - startRef.current;
    if (held < HOLD_MIN_MS) {
      // A tap is not a hold. Say so instead of inventing a transcript.
      setTooShort(true);
      goto("idle");
      return;
    }
    goto("working");
  }, [goto]);

  /* Releasing outside the button (or with the window losing focus) still has to
     end the hold, or the panel would sit in LISTENING forever. */
  useEffect(() => {
    if (phase !== "listening") return;
    const onUp = () => end();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [phase, end]);

  /* ONE loop: bar heights every frame, phase transitions on their boundaries. */
  useEffect(() => {
    if (phase === "idle") {
      barsRef.current.forEach((el) => {
        if (el) el.style.height = "4px";
      });
      return;
    }

    // Reduced motion: hold the states, drop the animation and the word stagger.
    if (reduce) {
      barsRef.current.forEach((el, i) => {
        if (el) el.style.height = `${barHeight(0.6, i)}px`;
      });
      if (phase === "working") {
        const t = window.setTimeout(() => {
          shownRef.current = SENTENCES[activeLang].length;
          setShown(SENTENCES[activeLang].length);
          goto("done");
        }, WORKING_MS);
        return () => window.clearTimeout(t);
      }
      if (phase === "done") {
        const t = window.setTimeout(() => goto("idle"), DONE_REST_MS);
        return () => window.clearTimeout(t);
      }
      return;
    }

    const tick = (now: number) => {
      const p = phaseRef.current;
      const elapsed = now - startRef.current;

      if (p === "listening") {
        const s = now / 1000;
        const env = speechLevel(s);
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const v = Math.abs(Math.sin(s * (3.1 + i * 0.7) + i * 1.9));
          el.style.height = `${barHeight(env * (0.25 + 0.75 * v), i)}px`;
        });
        // Live, so the on-panel timer proves the meter is reacting to the
        // actual hold rather than replaying a fixed decorative curve.
        const tenths = Math.floor(elapsed / 100);
        if (tenths !== heldTenthsRef.current) {
          heldTenthsRef.current = tenths;
          setHeldTenths(tenths);
        }
      } else {
        // Working / done: the meter settles rather than snapping to nothing.
        const q = Math.min(1, elapsed / 320);
        barsRef.current.forEach((el, i) => {
          if (el) el.style.height = `${barHeight((1 - q) * 0.5, i)}px`;
        });
      }

      if (p === "working" && elapsed >= WORKING_MS) {
        goto("done");
      } else if (p === "done") {
        const total = SENTENCES[activeLang].length;
        const n = Math.min(total, Math.floor(elapsed / WORD_STAGGER));
        if (n !== shownRef.current) {
          shownRef.current = n;
          setShown(n);
        }
        if (elapsed >= total * WORD_STAGGER + DONE_REST_MS) {
          goto("idle");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [phase, reduce, goto, activeLang]);

  const listening = phase === "listening";
  const held = phase !== "idle";

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      {/* dark-act divider, mirroring the light act's hairline + crosshair */}
      <div aria-hidden="true" className="relative h-px w-full bg-white/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-white/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        {/* HEADER — intro left, heading right: the mirror of the hero above, so
            two dark sections in a row do not repeat the same composition. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <Rise className="order-2 lg:order-1 lg:col-span-5">
            <p className="max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[1rem]">
              VixWispr has no main window. It sits in the tray, and the only interface
              it ever shows you is a small pill that appears while you are talking.
              Three actions, always the same three, in every app on your machine.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                02 / the mechanic
              </span>
              <LineGrow className="max-w-16 bg-white/20" />
            </div>
          </Rise>

          <h2 className="order-1 font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.25rem,6.5vw,5rem)] lg:order-2 lg:col-span-7">
            <BlurReveal text="Hold. Speak." />
            <BlurReveal
              text="Release."
              delay={0.12}
              className="[-webkit-text-stroke:1.5px_#ececec] text-transparent"
            />
          </h2>
        </div>

        {/* ── THE INTERACTIVE PANEL ─────────────────────────────────────────
            The visitor drives it. Everything here is a simulation of the app's
            states and says so on the panel itself. */}
        <Rise delay={0.1} className="mt-16 sm:mt-20">
          <div className="relative rounded-2xl border border-white/12 bg-white/[0.02] p-6 sm:p-9">

            <div className="relative grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-12">
              {/* LEFT: the hold affordance */}
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Try the hold
                  </span>
                  <div
                    role="group"
                    aria-label="Choose the language to demo"
                    className="inline-flex items-center gap-0.5 rounded-full border border-white/12 bg-white/[0.03] p-0.5"
                  >
                    {(["EN", "ID"] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        disabled={phase !== "idle"}
                        aria-pressed={lang === l}
                        onClick={() => setLang(l)}
                        className="rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{
                          background: lang === l ? EMBER : "transparent",
                          color: lang === l ? "#0a0a0a" : "rgba(236,236,236,0.55)",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Press and hold to simulate dictating"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    start();
                  }}
                  onPointerUp={end}
                  onPointerLeave={end}
                  onContextMenu={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.repeat) return;
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault(); // Space would scroll the page away
                      start();
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === " " || e.key === "Enter") end();
                  }}
                  className="group relative mt-4 flex w-full touch-none select-none items-center justify-center gap-3 overflow-hidden rounded-xl border px-5 py-7 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#ff6a2b]/60 active:scale-[0.985] sm:gap-4 sm:py-8"
                  style={{
                    borderColor: listening ? EMBER : "rgba(255,255,255,0.14)",
                    background: listening ? "rgba(255,106,43,0.045)" : "rgba(255,255,255,0.02)",
                    transform: listening ? "translateY(1px)" : "none",
                    transitionTimingFunction: EASE,
                  }}
                >
                  {/* A tight glow directly behind the caps while held, instead of a
                      wide section bloom: a big soft wash reads as a smudge on a
                      near-black ground, this reads as the keys lighting up. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[36px] transition-opacity duration-500"
                    style={{ background: EMBER, opacity: listening ? 0.16 : 0 }}
                  />

                  {/* One flat row, so the pair is genuinely centred (nesting the
                      plus inside the second cap shifted the optical centre right). */}
                  <span className="relative flex items-center gap-3 sm:gap-4">
                    <Keycap label="Ctrl" lit={listening} />
                    <span className="font-mono text-[13px] text-white/30">+</span>
                    <Keycap label="Space" lit={listening} />
                  </span>
                </button>

                <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-white/30">
                  {tooShort
                    ? "TOO QUICK — HOLD IT A LITTLE LONGER, LIKE THE REAL HOTKEY"
                    : listening
                      ? `LISTENING${reduce ? "" : ` — ${(heldTenths / 10).toFixed(1)}S`} — LET GO WHEN YOU ARE DONE`
                      : everHeld
                        ? "HOLD AGAIN TO REPLAY"
                        : "PRESS AND HOLD — OR FOCUS IT AND HOLD SPACE"}
                </p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-white/35">
                  Simulated on this page. No microphone is requested and nothing is
                  recorded here; the states and the pill are the real app&apos;s.
                </p>
              </div>

              {/* RIGHT: what the app shows back */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                    What the app shows
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300"
                    style={{ color: held ? EMBER : "rgba(255,255,255,0.3)" }}
                  >
                    {PHASE_LABEL[phase]}
                  </span>
                </div>

                {/* the pill, faithful to the shipped overlay */}
                <div className="mt-5 flex min-h-[52px] items-center">
                  <div
                    className="inline-flex items-center gap-[11px] whitespace-nowrap rounded-full border px-[18px] py-[10px] font-mono text-[12.5px] text-[#ececec] backdrop-blur-[8px] transition-all duration-[400ms]"
                    style={{
                      background: PILL_BG,
                      borderColor: listening ? EMBER : PILL_BORDER,
                      transitionTimingFunction: EASE,
                    }}
                  >
                    {phase === "idle" && (
                      <>
                        <span className="h-2 w-2 flex-none rounded-full bg-[#5c5c5c]" />
                        <span>Hold to speak</span>
                      </>
                    )}
                    {(phase === "listening" || phase === "working") && (
                      <>
                        <div className="flex h-[18px] items-center gap-[2px]">
                          {WEIGHTS.map((_, i) => (
                            <span
                              key={i}
                              ref={(el) => {
                                barsRef.current[i] = el;
                              }}
                              className="w-[3px] rounded-[2px]"
                              style={{
                                height: "4px",
                                background: EMBER,
                                transition: "height 90ms linear",
                              }}
                            />
                          ))}
                        </div>
                        <span>{listening ? "Listening…" : "Transcribing…"}</span>
                        {listening && (
                          <span
                            className="font-mono text-[11px] font-medium uppercase tracking-[0.04em]"
                            style={{ color: EMBER }}
                          >
                            {activeLang}
                          </span>
                        )}
                      </>
                    )}
                    {phase === "done" && (
                      <>
                        <span
                          className="h-2 w-2 flex-none rounded-full"
                          style={{ background: EMBER }}
                        />
                        <span>Pasted</span>
                      </>
                    )}
                  </div>
                </div>

                {/* where the text lands */}
                <div
                  className="mt-6 rounded-xl border px-5 py-5 transition-colors duration-500 sm:px-6 sm:py-6"
                  style={{
                    borderColor: phase === "done" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)",
                    transitionTimingFunction: EASE,
                  }}
                >
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/25">
                    your cursor, in any app
                  </span>

                  {/* An empty field would read as a broken panel before the first
                      hold, so it rests with a ghosted prompt and a still caret.
                      It says what is about to happen instead of showing nothing. */}
                  {phase !== "done" && (
                    <p className="mt-3 flex min-h-[3.5rem] items-start gap-1 font-display text-[1.15rem] leading-snug tracking-[-0.01em] text-white/18 sm:min-h-[4rem] sm:text-[1.5rem]">
                      <span
                        aria-hidden="true"
                        className="mt-[0.3em] inline-block h-[1.05em] w-[2px] bg-white/25"
                      />
                      <span>Your sentence lands here, already cleaned up.</span>
                    </p>
                  )}

                  <p
                    aria-hidden="true"
                    className={`mt-3 min-h-[3.5rem] font-display text-[1.15rem] leading-snug tracking-[-0.01em] text-[#ececec] sm:min-h-[4rem] sm:text-[1.5rem] ${
                      phase === "done" ? "" : "hidden"
                    }`}
                  >
                    {SENTENCES[activeLang].map((w, i) => (
                      <span
                        key={i}
                        className="inline-block transition-all duration-300"
                        style={{
                          opacity: phase === "done" && i < shown ? 1 : 0,
                          filter: phase === "done" && i < shown ? "blur(0px)" : "blur(6px)",
                          transform:
                            phase === "done" && i < shown ? "translateY(0)" : "translateY(4px)",
                          transitionTimingFunction: EASE,
                        }}
                      >
                        {w}
                        {i < SENTENCES[activeLang].length - 1 ? " " : ""}
                      </span>
                    ))}
                    {phase === "done" && shown >= SENTENCES[activeLang].length && (
                      <span
                        className="animate-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.14em]"
                        style={{ background: EMBER }}
                      />
                    )}
                  </p>

                  {/* One plain-language description for screen readers, since the
                      animated line above is assembled from per-word fragments. */}
                  <p className="sr-only">
                    When you release the hotkey, VixWispr types the cleaned-up sentence at
                    your cursor. In this {activeLang === "ID" ? "Indonesian" : "English"} example
                    it types: {SENTENCES[activeLang].join(" ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Rise>

        {/* ── THE THREE BEATS ───────────────────────────────────────────────
            The written contract under the live one, threaded by the same
            self-drawing timeline the light act's method section uses. */}
        <div className="mt-20 sm:mt-24">
          <div aria-hidden="true" className="relative mb-9 hidden lg:block">
            <LineGrow className="bg-white/12" delay={0.1} />
          </div>

          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:grid-cols-3">
            {BEATS.map((b, i) => (
              <li key={b.idx} className="bg-[#0a0a0a] p-7 sm:p-8">
                <Rise delay={0.08 * i}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-[#ff6a2b]">
                      {b.idx}
                    </span>
                    <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] sm:text-[1.9rem]">
                      {b.title}
                    </h3>
                  </div>

                  <p className="mt-4 text-[13.5px] leading-relaxed text-white/55 sm:text-[14px]">
                    {b.body}
                  </p>

                  {/* what the pill reads at this exact moment, so the written
                      beat and the live panel above are visibly the same thing */}
                  <div className="mt-6 flex items-center gap-2.5">
                    <span
                      className="h-1.5 w-1.5 flex-none rounded-full"
                      style={{ background: i === 0 ? "#5c5c5c" : EMBER }}
                    />
                    <span className="font-mono text-[10.5px] tracking-[0.06em] text-white/40">
                      {b.shows}
                    </span>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
