/**
 * The shipped overlay pill, as numbers.
 *
 * VixWispr's overlay is the only UI the app has, so every re-creation of it on
 * this page has to agree with the real thing. These constants are transcribed
 * from the app's own `src/renderer/src/theme.css` and are imported by BOTH the
 * hero demo and the mechanic section, for the same reason `meta.ts` exists: two
 * copies of one fact drift the moment one of them is edited.
 *
 * If the app's overlay changes, change it here once.
 */

/** Per-bar weights of the 7-bar meter, straight from the app. */
export const WEIGHTS = [0.5, 0.8, 1, 0.7, 1, 0.85, 0.55] as const;

/** Bar height in px for a 0..1 input level — the app's own curve. */
export function barHeight(level: number, i: number): number {
  return 4 + level * 14 * WEIGHTS[i];
}

/**
 * A speech-like amplitude envelope for a given time in seconds.
 *
 * Two detuned sinusoids rather than one, so the meter reads as someone talking
 * (uneven, with natural dips between phrases) instead of as a decorative
 * equaliser bouncing on a loop.
 */
export function speechLevel(tSec: number): number {
  return 0.35 + 0.65 * Math.abs(Math.sin(tSec * 1.15) * Math.cos(tSec * 0.43 + 0.7));
}

export const PILL_BG = "rgba(10,10,10,0.92)";
export const PILL_BORDER = "rgba(255,255,255,0.14)";
export const EMBER = "#ff6a2b";

/** The site's motion curve (brand rule: 0.4 to 0.6s, this easing). */
export const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
