import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { EASE, WEIGHTS, barHeight, speechLevel } from "./pillSpec";

/**
 * The VixWispr hero set-piece: a motion-graphics loop that PERFORMS the product
 * instead of describing it. Five beats, each held long enough to read:
 *
 *   01 HOLD        Ctrl + Space light up and pulse an ember ripple
 *   02 SPEAK       the waveform rises out of the pill (the app's real meter spec)
 *   03 TRANSCRIBE  the bars stretch away and the words bloom in through blur
 *   04 CLEAN UP    the raw transcript edits ITSELF: fillers struck out and
 *                  collapsed away, casing corrected, punctuation snapped in
 *   05 PASTE       a hairline field draws itself around the text, caret blinks
 *
 * Beat 04 is the point of the whole piece. AI cleanup is what separates VixWispr
 * from plain dictation, and the only convincing way to sell it is to let the
 * viewer watch the text change.
 *
 * Build rules (Vico: "quality must hold, and don't run it too fast"):
 *  - Everything is real DOM text + CSS, so it is resolution independent and can
 *    never pixelate the way a recorded video would.
 *  - ONE rAF timeline drives the entire loop. Discrete beat changes go through
 *    React state (a handful of updates per 20s); only the waveform is written
 *    imperatively per frame. No competing timers, so nothing can drift or jank.
 *  - Every beat ends on a deliberate reading pause.
 *  - prefers-reduced-motion renders the finished state statically, no loop.
 *
 * The pill is a faithful re-creation of the real overlay: 7 ember bars 3px wide
 * with the app's own per-bar weights and `4 + level * 14 * weight` height curve,
 * JetBrains Mono at 12.5px, rgba(10,10,10,0.92) on a 1px rgba(255,255,255,0.14)
 * hairline, and the border going ember while listening.
 */

/* ── timeline ──────────────────────────────────────────────────────────── */

const BEATS = [
  { label: "01 / HOLD", hint: "Hold Ctrl + Space in whatever app you're already in.", dur: 2600 },
  { label: "02 / SPEAK", hint: "Say it the way you'd say it out loud.", dur: 4200 },
  { label: "03 / TRANSCRIBE", hint: "Groq Whisper turns the audio into words.", dur: 3800 },
  { label: "04 / CLEAN UP", hint: "Fillers out. Punctuation and casing in.", dur: 5200 },
  { label: "05 / PASTE", hint: "The clean text lands at your cursor.", dur: 4600 },
] as const;

const TOTAL = BEATS.reduce((s, b) => s + b.dur, 0);
const STARTS = BEATS.reduce<number[]>((acc, b, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + BEATS[i - 1].dur);
  return acc;
}, []);

/* cleanup beat sub-timings (ms into beat 04) */
const T_STRIKE = 700; // fillers get struck through
const T_COLLAPSE = 1600; // struck fillers collapse out of the line
const T_CASE = 2600; // lowercase words correct themselves
const T_PUNCT = 3400; // punctuation snaps in
/* paste beat sub-timings (ms into beat 05) */
const T_FIELD = 700; // the field frame draws itself
const T_CARET = 1500; // caret appears and starts blinking
const T_FADE = 4100; // gentle fade before the loop restarts

const WORD_STAGGER = 190; // ms between words blooming in

/* ── the sentence ──────────────────────────────────────────────────────────
   Raw:   "umm so the deadline is uh friday and i'll send the deck eh tonight"
   Clean: "So the deadline is Friday, and I'll send the deck tonight."
   Three fillers removed, three capitalisations fixed, two marks inserted. */

type Tok = {
  raw: string;
  clean?: string; // casing correction (crossfaded, never a hard text swap)
  filler?: boolean; // struck through, then collapsed away
  punct?: string; // inserted immediately after this word
};

const TOKENS: Tok[] = [
  { raw: "umm", filler: true },
  { raw: "so", clean: "So" },
  { raw: "the" },
  { raw: "deadline" },
  { raw: "is" },
  { raw: "uh", filler: true },
  { raw: "friday", clean: "Friday", punct: "," },
  { raw: "and" },
  { raw: "i'll", clean: "I'll" },
  { raw: "send" },
  { raw: "the" },
  { raw: "deck" },
  { raw: "eh", filler: true },
  { raw: "tonight", punct: "." },
];

const OVERSHOOT = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/* EASE, WEIGHTS, barHeight and speechLevel now live in ./pillSpec so this demo
   and the mechanic section below it can never disagree about the real overlay. */

type Phase = {
  beat: number;
  words: number;
  struck: boolean;
  collapsed: boolean;
  cased: boolean;
  punct: boolean;
  field: boolean;
  caret: boolean;
  fading: boolean;
};

const FINAL: Phase = {
  beat: 4,
  words: TOKENS.length,
  struck: true,
  collapsed: true,
  cased: true,
  punct: true,
  field: true,
  caret: true,
  fading: false,
};

const START: Phase = {
  beat: 0,
  words: 0,
  struck: false,
  collapsed: false,
  cased: false,
  punct: false,
  field: false,
  caret: false,
  fading: false,
};

export function DictationDemo() {
  const reduce = useReducedMotion();
  const [p, setP] = useState<Phase>(reduce ? FINAL : START);

  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const meterRef = useRef<HTMLDivElement | null>(null);
  const fillerRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const [widths, setWidths] = useState<Record<number, number>>({});

  /* Measure filler widths so they can collapse to exactly 0 with a smooth
     max-width transition. Gated on document.fonts.ready: measuring before the
     webfont lands gives fallback-font widths and the collapse would jump. */
  useEffect(() => {
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const next: Record<number, number> = {};
      for (const [k, el] of Object.entries(fillerRefs.current)) {
        if (el) next[Number(k)] = el.offsetWidth;
      }
      setWidths(next);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }
    return () => {
      alive = false;
    };
  }, []);

  /* One rAF drives the whole loop. */
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let t0 = 0;
    const prev = { ...START };

    const frame = (t: number) => {
      if (!t0) t0 = t;
      const e = (t - t0) % TOTAL;

      let beat = 0;
      for (let i = BEATS.length - 1; i >= 0; i--) {
        if (e >= STARTS[i]) {
          beat = i;
          break;
        }
      }
      const local = e - STARTS[beat];

      /* waveform: live while speaking, then stretched away during transcribe */
      const speaking = beat === 1;
      if (speaking || beat === 2) {
        const s = t / 1000;
        // A speech-like envelope (bursts and dips) modulating per-bar motion, so
        // the meter feels spoken rather than like a decorative equaliser.
        const env = speechLevel(s);
        barRefs.current.forEach((el, i) => {
          if (!el) return;
          const v = Math.abs(Math.sin(s * (3.1 + i * 0.7) + i * 1.9));
          const level = speaking ? env * (0.25 + 0.75 * v) : 0;
          el.style.height = `${barHeight(level, i)}px`;
        });
        if (meterRef.current) {
          // In beat 03 the bars stretch outward and blur away as the words form.
          const q = beat === 2 ? Math.min(1, local / 900) : 0;
          meterRef.current.style.transform = `scaleX(${1 + q * 5}) scaleY(${1 - q * 0.6})`;
          meterRef.current.style.opacity = String(1 - q);
          meterRef.current.style.filter = `blur(${q * 7}px)`;
        }
      }

      const next: Phase = {
        beat,
        words:
          beat < 2
            ? 0
            : beat === 2
              ? Math.min(TOKENS.length, Math.floor(local / WORD_STAGGER))
              : TOKENS.length,
        struck: beat > 3 || (beat === 3 && local >= T_STRIKE),
        collapsed: beat > 3 || (beat === 3 && local >= T_COLLAPSE),
        cased: beat > 3 || (beat === 3 && local >= T_CASE),
        punct: beat > 3 || (beat === 3 && local >= T_PUNCT),
        field: beat === 4 && local >= T_FIELD,
        caret: beat === 4 && local >= T_CARET,
        fading: beat === 4 && local >= T_FADE,
      };

      // Only re-render when something discrete actually changed, so the whole
      // 20s loop costs a handful of renders instead of one per frame.
      let changed = false;
      for (const k of Object.keys(next) as (keyof Phase)[]) {
        if (prev[k] !== next[k]) changed = true;
      }
      if (changed) {
        Object.assign(prev, next);
        setP(next);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const beat = BEATS[p.beat];
  const listening = p.beat === 1;
  const pressed = p.beat >= 1;
  const showPill = p.beat <= 2 || p.beat === 4;

  return (
    <div className="relative">
      {/* one ember bloom is the entire colour story behind the stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-16 -top-24 bottom-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 42%, rgba(255,106,43,0.20) 0%, rgba(255,106,43,0.06) 42%, transparent 72%)",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#0d0d0d]/90 shadow-[0_60px_140px_-70px_rgba(0,0,0,0.95)] backdrop-blur-sm">
        {/* ── HUD: step readout + progress rail ─────────────────────────── */}
        <div className="flex items-center gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
          <span className="font-mono text-[10px] tracking-[0.24em] text-[#ff6a2b]">
            {beat.label}
          </span>
          <div className="flex flex-1 items-center gap-1.5">
            {BEATS.map((_, i) => (
              <span
                key={i}
                className="h-px flex-1 origin-left transition-colors duration-500"
                style={{
                  background: i <= p.beat ? "#ff6a2b" : "rgba(255,255,255,0.14)",
                  transitionTimingFunction: EASE,
                }}
              />
            ))}
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/30 sm:inline">
            Live re-creation
          </span>
        </div>

        {/* ── stage ─────────────────────────────────────────────────────── */}
        <div className="relative flex min-h-[clamp(400px,50vh,520px)] flex-col items-center justify-center gap-10 px-5 py-14 sm:px-10 sm:py-16">
          {/* blueprint crosshairs */}
          {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute ${pos} font-mono text-[11px] leading-none text-white/12`}
            >
              +
            </span>
          ))}

          {/* KEYCAPS (beat 01) */}
          <div
            className="flex items-center gap-2.5 transition-all duration-700"
            style={{
              opacity: p.beat === 0 ? 1 : 0,
              transform: p.beat === 0 ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.94)",
              transitionTimingFunction: EASE,
            }}
          >
            {["Ctrl", "Space"].map((k) => (
              <span key={k} className="relative inline-flex">
                {/* ember ripple: a pure state-driven transition, so it replays
                    on every loop without needing a keyframe restart hack */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-lg border border-[#ff6a2b]"
                  style={{
                    opacity: pressed ? 0 : 0.85,
                    transform: pressed ? "scale(1.9)" : "scale(0.72)",
                    transition: `opacity 900ms ${EASE}, transform 900ms ${EASE}`,
                  }}
                />
                <span
                  className="rounded-lg border px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] transition-all duration-500"
                  style={{
                    borderColor: pressed ? "#ff6a2b" : "rgba(255,255,255,0.16)",
                    color: pressed ? "#ff6a2b" : "rgba(236,236,236,0.75)",
                    background: pressed ? "rgba(255,106,43,0.08)" : "rgba(255,255,255,0.03)",
                    transform: pressed ? "translateY(1.5px)" : "translateY(0)",
                    transitionTimingFunction: EASE,
                  }}
                >
                  {k}
                </span>
              </span>
            ))}
          </div>

          {/* THE PILL — faithful to the shipped overlay */}
          <div
            className="transition-all duration-500"
            style={{
              opacity: showPill ? 1 : 0,
              transform: showPill ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.96)",
              transitionTimingFunction: EASE,
            }}
          >
            <div
              className="inline-flex items-center gap-[11px] whitespace-nowrap rounded-full border px-[18px] py-[10px] font-mono text-[12.5px] text-[#ececec] backdrop-blur-[8px] transition-colors duration-[400ms]"
              style={{
                background: "rgba(10,10,10,0.92)",
                borderColor: listening ? "#ff6a2b" : "rgba(255,255,255,0.14)",
                transitionTimingFunction: EASE,
              }}
            >
              {p.beat === 0 && (
                <>
                  <span className="h-2 w-2 flex-none rounded-full bg-[#5c5c5c]" />
                  <span>Hold to speak</span>
                </>
              )}
              {(p.beat === 1 || p.beat === 2) && (
                <>
                  <div
                    ref={meterRef}
                    className="flex h-[18px] items-center gap-[2px] origin-left will-change-transform"
                  >
                    {WEIGHTS.map((_, i) => (
                      <span
                        key={i}
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        className="w-[3px] rounded-[2px] bg-[#ff6a2b]"
                        style={{ height: "4px", transition: "height 90ms linear" }}
                      />
                    ))}
                  </div>
                  <span>{p.beat === 1 ? "Listening…" : "Transcribing…"}</span>
                  {p.beat === 1 && (
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#ff6a2b]">
                      EN
                    </span>
                  )}
                </>
              )}
              {p.beat === 4 && (
                <>
                  <span className="h-2 w-2 flex-none rounded-full bg-[#ff6a2b]" />
                  <span>Pasted</span>
                </>
              )}
            </div>
          </div>

          {/* BEAM: pill → transcript, drawn as the words start to form */}
          <span
            aria-hidden="true"
            className="absolute h-10 w-px origin-top bg-gradient-to-b from-[#ff6a2b] to-transparent transition-transform duration-700"
            style={{
              top: "calc(50% - 2.5rem)",
              transform: `scaleY(${p.beat === 2 ? 1 : 0})`,
              transitionTimingFunction: EASE,
            }}
          />

          {/* TRANSCRIPT */}
          <div
            className="relative w-full max-w-3xl transition-opacity duration-500"
            style={{ opacity: p.fading ? 0 : 1, transitionTimingFunction: EASE }}
          >
            {/* the field frame draws itself around the text in beat 05 */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-5 -inset-y-5 rounded-lg border border-white/15 transition-all duration-700 sm:-inset-x-7"
              style={{
                opacity: p.field ? 1 : 0,
                transform: p.field ? "scale(1)" : "scale(0.97)",
                transitionTimingFunction: EASE,
              }}
            />
            <span
              className="pointer-events-none absolute -top-11 left-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 transition-opacity duration-700 sm:-top-12"
              style={{ opacity: p.field ? 1 : 0, transitionTimingFunction: EASE }}
            >
              Cursor · any app
            </span>

            {/* The animated line holds both spellings of every corrected word at
                once (stacked and crossfaded), so as a text source it reads as
                gibberish. It is decorative: hide it from assistive tech and state
                what the demo shows once, in plain language. */}
            <p className="sr-only">
              A demo of VixWispr: holding Ctrl and Space records your voice, Whisper transcribes
              it as “umm so the deadline is uh friday and i’ll send the deck eh tonight”, the
              cleanup pass rewrites it to “So the deadline is Friday, and I’ll send the deck
              tonight.”, and that clean sentence is pasted at your cursor.
            </p>

            <p
              aria-hidden="true"
              className="text-center font-display text-[clamp(1.35rem,3.4vw,2.5rem)] font-semibold leading-[1.32] tracking-[-0.02em] text-[#ececec]"
            >
              {TOKENS.map((tok, i) => {
                const shown = i < p.words;
                const gone = p.collapsed && tok.filler;
                const struck = p.struck && tok.filler;
                const w = widths[i];

                return (
                  <span
                    key={i}
                    ref={
                      tok.filler
                        ? (el) => {
                            fillerRefs.current[i] = el;
                          }
                        : undefined
                    }
                    // overflow-hidden ONLY on fillers, which are the only tokens
                    // that clip themselves shut. On an inline-block it also moves
                    // the baseline to the bottom edge, so it is not worth paying
                    // on the eleven tokens that never collapse.
                    className={`relative inline-block align-baseline whitespace-nowrap ${
                      tok.filler ? "overflow-hidden" : ""
                    }`}
                    style={{
                      opacity: gone ? 0 : shown ? 1 : 0,
                      filter: shown && !gone ? "blur(0px)" : "blur(11px)",
                      transform: shown ? "translateY(0)" : "translateY(0.3em)",
                      marginRight: gone ? 0 : "0.28em",
                      maxWidth: tok.filler && w ? (gone ? 0 : `${w}px`) : undefined,
                      transition: [
                        `opacity 620ms ${EASE}`,
                        `filter 620ms ${EASE}`,
                        `transform 620ms ${EASE}`,
                        `max-width 640ms ${EASE}`,
                        `margin-right 640ms ${EASE}`,
                      ].join(", "),
                    }}
                  >
                    {/* casing correction: the two spellings are stacked in one
                        grid cell and crossfaded, so the word is never swapped
                        out from under the reader */}
                    {tok.clean ? (
                      <span className="inline-grid">
                        <span
                          className="[grid-area:1/1] transition-all duration-500"
                          style={{
                            opacity: p.cased ? 0 : 1,
                            transform: p.cased ? "translateY(-0.14em)" : "translateY(0)",
                            transitionTimingFunction: EASE,
                          }}
                        >
                          {tok.raw}
                        </span>
                        <span
                          className="[grid-area:1/1] transition-all duration-500"
                          style={{
                            opacity: p.cased ? 1 : 0,
                            transform: p.cased ? "translateY(0)" : "translateY(0.14em)",
                            transitionTimingFunction: EASE,
                          }}
                        >
                          {tok.clean}
                        </span>
                      </span>
                    ) : (
                      tok.raw
                    )}

                    {/* inserted punctuation: ember while it is the AI's edit,
                        settling to ink once the text has landed */}
                    {tok.punct && (
                      <span
                        className="inline-block origin-bottom-left"
                        style={{
                          opacity: p.punct ? 1 : 0,
                          transform: p.punct ? "scale(1)" : "scale(0.2)",
                          color: p.field ? "inherit" : "#ff6a2b",
                          transition: `opacity 420ms ${EASE}, transform 520ms ${OVERSHOOT}, color 900ms ${EASE}`,
                        }}
                      >
                        {tok.punct}
                      </span>
                    )}

                    {/* strike-through drawn across a filler before it collapses */}
                    {tok.filler && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-[2px] w-full origin-left rounded-full bg-[#ff6a2b] transition-transform duration-[420ms]"
                        style={{
                          transform: `scaleX(${struck ? 1 : 0})`,
                          transitionTimingFunction: EASE,
                        }}
                      />
                    )}
                  </span>
                );
              })}

              {/* caret, once the text is sitting in the field */}
              <span
                aria-hidden="true"
                className={`ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.16em] bg-[#ff6a2b] ${
                  p.caret ? "animate-caret" : "opacity-0"
                }`}
              />
            </p>
          </div>

          {/* the beat's own caption, so every scene explains itself */}
          <p
            key={p.beat}
            className="absolute bottom-7 left-0 right-0 px-6 text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/35 sm:text-[10.5px]"
          >
            {beat.hint}
          </p>
        </div>
      </div>
    </div>
  );
}
