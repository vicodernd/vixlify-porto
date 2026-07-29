import { Rise, BlurReveal, LineGrow } from "@/components/motion/reveal";
import { EMBER, PILL_BG, PILL_BORDER, WEIGHTS, barHeight } from "./pillSpec";
import { SPACE, DEEP, LINE, LINE_2, MIST, MUTED, MUTED_2, SIGNAL } from "./appTheme";

/**
 * Section 3 — Real screens (LIGHT flip after the dark mechanic section).
 *
 * The hero and "the mechanic" both PLAY the overlay pill, but neither has shown
 * the Settings window, and neither has shown the pill in the one context that
 * proves "no main window": floating over something else. This section covers
 * both, honestly, as a REDRAW rather than a screenshot.
 *
 * Why a redraw and not a raster capture: this session's Browser pane could not
 * render a screenshot (a client-side display issue, not a code issue), and a
 * pixel-transcribed recreation is what sections 1 and 2 already do for the
 * overlay via pillSpec.ts — same method, same honesty bar, and it stays crisp
 * at any resolution instead of risking the "must never look pixelated" rule.
 * Every value here (copy, colours, spacing, control states) is transcribed
 * straight from the shipped `Settings.tsx` / `theme.css`, not invented.
 */

/** Native-window chrome: same dot-plus-label family as the templates' browser
 *  chrome elsewhere on the site, but a window TITLE instead of a URL, since
 *  this is a desktop window, not a web page. */
function WindowChrome({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/12 bg-white shadow-[0_50px_110px_-55px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-3 border-b border-black/10 bg-[#f2f1ef] px-4 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6a2b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-black/[0.05] px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-[#6b6b68]">
          <svg viewBox="0 0 64 64" width="10" height="10" aria-hidden="true">
            <path d="M32 14 L54 50 L42 50 L32 33 L22 50 L10 50 Z" fill="#6b6b68" />
            <path d="M32 33 L42 50 L32 50 Z" fill="#ff6a2b" />
          </svg>
          <span className="truncate">{title}</span>
        </span>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[#6b6b68]">
          real ui
        </span>
      </div>
      {children}
    </div>
  );
}

/** One settings row, matching `.row` in the app's theme.css. */
function Row({
  label,
  sub,
  children,
  tight,
}: {
  label: string;
  sub?: string;
  children?: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4"
      style={{ padding: tight ? "0 0 15px" : "15px 0", borderTop: tight ? "none" : `1px solid ${LINE}` }}
    >
      <div>
        <div style={{ fontSize: "13.5px", color: MIST }}>{label}</div>
        {sub && (
          <div className="mt-[3px] max-w-[230px]" style={{ fontSize: "11.5px", color: MUTED, lineHeight: 1.4 }}>
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/** Segmented control, matching `.seg` / `.seg button.on`. */
function Seg<T extends string>({ options, active }: { options: { value: T; label: string }[]; active: T }) {
  return (
    <div className="flex overflow-hidden rounded-lg" style={{ border: `1px solid ${LINE_2}` }}>
      {options.map((o) => (
        <span
          key={o.value}
          className="px-3.5 py-[7px] font-body text-[12px]"
          style={
            o.value === active
              ? { background: SIGNAL, color: SPACE, fontWeight: 600 }
              : { color: MUTED }
          }
        >
          {o.label}
        </span>
      ))}
    </div>
  );
}

/** Toggle pill, matching `.toggle` / `.toggle.on`. */
function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative inline-block h-6 w-[42px] rounded-full"
      style={{ background: on ? EMBER : LINE_2 }}
    >
      <span
        className="absolute top-[3px] h-[18px] w-[18px] rounded-full"
        style={{ left: on ? 21 : 3, background: MIST }}
      />
    </span>
  );
}

/** The real Settings window content, transcribed field for field from
 *  `Settings.tsx`. Illustrative values only (a real key can't be shown), but
 *  every label, default, and layout choice is the shipped one. */
function SettingsRecreation() {
  return (
    <div style={{ background: SPACE }}>
      {/* titlebar — the app draws this itself, inside the window */}
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: `1px solid ${LINE}` }}>
        <svg viewBox="0 0 64 64" width="20" height="20" aria-hidden="true">
          <path d="M32 14 L54 50 L42 50 L32 33 L22 50 L10 50 Z" fill={MIST} />
          <path d="M32 33 L42 50 L32 50 Z" fill={EMBER} />
        </svg>
        <span className="font-display text-[15px] font-semibold tracking-[0.14em]" style={{ color: MIST }}>
          VIXWISPR
        </span>
        <span className="ml-auto font-mono text-[11px]" style={{ color: MUTED_2 }}>
          v0.1
        </span>
      </div>

      <div className="px-5 pb-[22px] pt-1.5">
        <Row label="Groq API key">
          <span />
        </Row>
        <div className="pb-[15px]" style={{ fontSize: "11.5px", color: MUTED, marginTop: "-15px" }}>
          Stored encrypted on this device, never shared.{" "}
          <span style={{ color: EMBER }}>Key saved.</span>
        </div>
        <div className="flex items-center gap-2 pb-3">
          <span
            className="flex-1 rounded-lg px-[11px] py-2 font-body text-[12.5px]"
            style={{ background: DEEP, border: `1px solid ${LINE_2}`, color: MUTED_2 }}
          >
            •••••••• (saved)
          </span>
          <span
            className="rounded-lg px-3.5 py-2 font-body text-[12.5px]"
            style={{ border: `1px solid ${LINE_2}`, color: MIST, opacity: 0.5 }}
          >
            Test
          </span>
          <span
            className="rounded-lg px-3.5 py-2 font-body text-[12.5px] font-semibold"
            style={{ background: SIGNAL, color: SPACE, opacity: 0.5 }}
          >
            Save
          </span>
        </div>
        <div className="pb-1" style={{ fontSize: "11.5px", color: MUTED }}>
          Get a free key at{" "}
          <span style={{ color: EMBER }}>console.groq.com/keys</span>
        </div>

        <Row label="Dictation hotkey" sub="The key you press to dictate.">
          <span
            className="rounded-lg px-[11px] py-2 text-center font-body text-[12.5px]"
            style={{ width: 130, background: DEEP, border: `1px solid ${LINE_2}`, color: MIST }}
          >
            Ctrl+Space
          </span>
        </Row>

        <Row label="Hotkey mode">
          <Seg
            options={[
              { value: "hold", label: "Hold" },
              { value: "toggle", label: "Toggle" },
            ]}
            active="hold"
          />
        </Row>

        <Row label="Language">
          <Seg
            options={[
              { value: "auto", label: "Auto" },
              { value: "id", label: "ID" },
              { value: "en", label: "EN" },
            ]}
            active="auto"
          />
        </Row>

        <Row label="Transcription model">
          <span
            className="rounded-lg px-[11px] py-2 font-mono text-[11.5px]"
            style={{ width: 190, background: DEEP, border: `1px solid ${LINE_2}`, color: MIST }}
          >
            whisper-large-v3-turbo
          </span>
        </Row>

        <Row label="Clean up text with AI" sub="Fix punctuation and casing, remove fillers.">
          <Toggle on />
        </Row>

        <Row label="Launch at startup" tight>
          <Toggle on />
        </Row>
      </div>
    </div>
  );
}

/** The pill floating over a deliberately generic, unfocused "something else"
 *  behind it. The point is the claim itself: no window to switch to, no app
 *  to open, it just sits on top of whatever you were already doing. */
function FloatingInContext() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-black/12 bg-[#f2f1ef] p-10 shadow-[0_50px_110px_-55px_rgba(0,0,0,0.55)] sm:p-16">
      {/* an abstract, unfocused "whatever app you're using" — no logos, no
          specific product, on purpose: the claim is that it does not matter */}
      <div className="mx-auto max-w-sm rounded-lg border border-black/10 bg-white/80 p-6 opacity-70">
        <div className="h-2 w-20 rounded-full bg-black/12" />
        <div className="mt-5 space-y-2.5">
          <div className="h-1.5 rounded-full bg-black/10" style={{ width: "88%" }} />
          <div className="h-1.5 rounded-full bg-black/10" style={{ width: "95%" }} />
          <div className="h-1.5 rounded-full bg-black/10" style={{ width: "72%" }} />
          <div className="h-1.5 rounded-full bg-black/10" style={{ width: "82%" }} />
        </div>
      </div>

      {/* the real pill, faithful to pillSpec.ts, floating above it */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 sm:top-10">
        <div
          className="inline-flex items-center gap-[11px] whitespace-nowrap rounded-full border px-[18px] py-[10px] font-mono text-[12.5px] backdrop-blur-[8px]"
          style={{ background: PILL_BG, borderColor: EMBER, color: MIST }}
        >
          <div className="flex h-[18px] items-center gap-[2px]">
            {WEIGHTS.map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-[2px]"
                style={{ height: `${barHeight(0.5, i)}px`, background: EMBER }}
              />
            ))}
          </div>
          <span>Listening…</span>
          <span className="font-medium uppercase tracking-[0.04em]" style={{ color: EMBER, fontSize: "11px" }}>
            EN
          </span>
        </div>
      </div>
    </div>
  );
}

export function RealScreens() {
  return (
    <section className="relative bg-[#e8e8e6] text-[#111111]">
      {/* dark → light boundary, matching the site's section-divider language */}
      <div aria-hidden="true" className="relative h-px w-full bg-black/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-black/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
            03 / real screens
          </span>
          <LineGrow className="max-w-16 bg-black/20" />
        </div>

        <h2 className="mt-6 max-w-[20ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.25rem,6.5vw,5rem)]">
          <BlurReveal text="This is the whole app." />
          <BlurReveal
            text="Nothing else."
            delay={0.12}
            className="[-webkit-text-stroke:1.5px_#111111] text-transparent"
          />
        </h2>

        <Rise as="p" delay={0.15} className="mt-7 max-w-lg text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem]">
          No dashboard, no history browser, no onboarding flow. One settings window you open
          maybe once, and one pill that appears only while you are talking. Redrawn pixel-for-pixel
          from the shipped app&apos;s own CSS below, not a screenshot.
        </Rise>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 sm:mt-24">
          <div className="lg:col-span-7">
            <Rise>
              <WindowChrome title="VixWispr">
                <SettingsRecreation />
              </WindowChrome>
            </Rise>
            <p className="mt-5 text-[13.5px] leading-relaxed text-[#3a3a38]">
              Everything you can configure, in one 480×620 window: your own Groq key, the hotkey,
              hold vs. toggle, dictation language, the model, AI cleanup, and launch at startup.
              Opened from the tray. Never opens itself.
            </p>
          </div>

          <div className="lg:col-span-5">
            <Rise delay={0.1}>
              <FloatingInContext />
            </Rise>
            <p className="mt-5 text-[13.5px] leading-relaxed text-[#3a3a38]">
              This is the entire interface while you dictate: no window border, no taskbar entry,
              just the pill, on top of whatever you were already doing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
