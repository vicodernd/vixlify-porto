import { Rise, BlurReveal, LineGrow } from "@/components/motion/reveal";
import { REPO_URL } from "./meta";

/**
 * Section 4 — What it actually does (LIGHT, continues the paper act after
 * section 3's real screens). Folded in per Vico's call (2026-07-28): the
 * original plan had a separate section 5, "Your key, your audio" (the
 * objection killer), but he decided six spec rows plus the trust block was
 * fine as one section rather than two. So the page now runs six top-level
 * sections, not seven: hero, mechanic, real screens, this one, install,
 * download.
 *
 * The brief called for "real capabilities as a mono spec sheet... not three
 * identical cards." A three-card grid is the default AI-slop shape for this
 * kind of content, so this deliberately isn't one: a single-column, numbered
 * spec sheet, read top to bottom like a real datasheet, echoing the mono
 * readout already used in the hero (Windows 10/11 · v0.1.0 · 83 MB...).
 *
 * Every fact here matches what section 3's Settings recreation actually shows
 * (hold vs. toggle, the real model name, the tray-only claim) so the two
 * sections can never quietly contradict each other.
 *
 * The trust block below the spec sheet is a deliberate rhythm change (three
 * across on desktop instead of another full-width row list), so the objection
 * killer doesn't just read as rows 07-09 of the same list. Its three points go
 * a level deeper than spec row 06's "your own key" line rather than repeating
 * it: which storage API, which server actually sees the audio, and where to
 * verify both.
 */

type Spec = { n: string; label: string; body: string };

const SPECS: Spec[] = [
  {
    n: "01",
    label: "Dictation languages",
    body: "Indonesian and English. Auto-detected, or forced to one in Settings.",
  },
  {
    n: "02",
    label: "AI cleanup",
    body: "Strips filler words, fixes punctuation and casing, keeps whichever language you spoke. Toggleable, on by default.",
  },
  {
    n: "03",
    label: "Hotkey mode",
    body: "Hold to talk, or flip to toggle on and off. Same Ctrl + Space either way, your call in Settings.",
  },
  {
    n: "04",
    label: "Works in",
    body: "Any app with a text cursor: browser, editor, chat, terminal. VixWispr doesn't know or care which.",
  },
  {
    n: "05",
    label: "Interface",
    body: "A tray icon and nothing else. No dock icon, no main window, no history to scroll through.",
  },
  {
    n: "06",
    label: "Your own key",
    body: "One Groq key, entered once, in the Settings window above. Nothing passes through Vixlify's servers, because there aren't any.",
  },
];

type Trust = { label: string; body: string };

const TRUST: Trust[] = [
  {
    label: "Local encryption",
    body: "Your Groq key is stored on your own device via Electron's own safeStorage, encrypted at rest. Not on a Vixlify server, not in a database, because there isn't one.",
  },
  {
    label: "Straight to Groq",
    body: "Recorded audio goes straight from your machine to Groq for transcription. Vixlify never receives it, never stores it, and has no server sitting in between.",
  },
  {
    label: "Open source, MIT",
    body: "Every claim on this page is checkable in the same public repo the installer comes from, not taken on faith.",
  },
];

export function Capabilities() {
  return (
    <section className="relative bg-[#e8e8e6] text-[#111111]">
      <div aria-hidden="true" className="relative h-px w-full bg-black/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-black/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
            04 / what it does
          </span>
          <LineGrow className="max-w-16 bg-black/20" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,7vw,5.5rem)] lg:col-span-7">
            <BlurReveal text="Six things," />
            <BlurReveal
              text="done well."
              delay={0.12}
              className="[-webkit-text-stroke:1.5px_#111111] text-transparent"
            />
          </h2>
          <Rise
            as="p"
            delay={0.15}
            className="max-w-md text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem] lg:col-span-5"
          >
            No settings you'll never touch. Every row here matches the exact Settings window in
            section 03, read top to bottom instead of clicked through.
          </Rise>
        </div>

        <ol className="mt-16 border-t border-black/12 sm:mt-24">
          {SPECS.map((s, i) => (
            <Rise key={s.n} delay={0.04 * i}>
              <li className="grid grid-cols-1 gap-3 border-b border-black/12 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-8">
                <span className="font-mono text-[11px] tracking-[0.14em] text-black/30 sm:col-span-1">
                  {s.n}
                </span>
                <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.01em] sm:col-span-3 sm:text-[1.3rem]">
                  {s.label}
                </h3>
                <p className="max-w-2xl text-[14px] leading-relaxed text-[#3a3a38] sm:col-span-8">
                  {s.body}
                </p>
              </li>
            </Rise>
          ))}
        </ol>

        {/* folded-in objection killer: a deliberate rhythm change (three
            across on desktop) so it doesn't read as rows 07-09 of the same
            list above */}
        <div className="mt-20 border-t border-black/12 pt-14 sm:mt-28 sm:pt-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
              your key, your audio
            </span>
            <LineGrow className="max-w-16 bg-black/20" />
          </div>

          <Rise>
            <h3 className="mt-6 max-w-2xl font-display text-[1.7rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.2rem]">
              Nothing routes through Vixlify. There is nothing to route through.
            </h3>
          </Rise>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-8">
            {TRUST.map((t, i) => (
              <Rise key={t.label} delay={0.06 * i}>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#ff6a2b]" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#6b6b68]">
                    {t.label}
                  </span>
                </div>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#3a3a38]">{t.body}</p>
              </Rise>
            ))}
          </div>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-[#6b6b68] sm:mt-16">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-[#6b6b68]/40 pb-0.5 text-[#111111] transition-colors duration-300 hover:border-[#ff6a2b] hover:text-[#e5501a]"
            >
              Read the source
            </a>{" "}
            — safeStorage, the Groq call, and the licence, all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
