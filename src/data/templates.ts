export type TemplateCategory = 'hero' | 'landing' | 'site' | 'interactive';

export interface Template {
  slug: string;
  title: string;
  category: TemplateCategory;
  /** Tech and technique tags shown on the card, e.g. "GSAP", "three.js", "CSS only" */
  tags: string[];
  /** One or two sentences describing the concept, shown on the card and in the prompt modal */
  description: string;
  /** The free generation prompt visitors can copy */
  prompt: string;
  thumb: string;
  demoUrl: string;
  /** ISO date the template dropped, YYYY-MM-DD */
  date: string;
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  hero: 'Hero Sections',
  landing: 'Landing Pages',
  site: 'Full Sites',
  interactive: 'Interactive & 3D',
};

/**
 * One entry per template, newest first. Demos live at /templates/<slug>/index.html
 * and thumbnails at /templates/<slug>/thumb.webp inside public/.
 */
export const templates: Template[] = [
  {
    slug: 'meridian-atelier',
    title: 'Meridian Atelier — Cinematic Architecture Hero',
    category: 'hero',
    tags: ['GSAP', 'ScrollTrigger', 'Editorial', 'Quiet luxury'],
    description:
      'A pinned, scroll-driven hero for an architecture studio. A framed golden-hour photograph grows to full bleed while an oversized serif headline melts away, then lands on a slow editorial beat.',
    prompt: `You are a principal designer at a high-end studio, building an award-grade landing hero for a fictional architecture practice called "Meridian Atelier" (Oslo). The output is a single self-contained HTML file with all CSS and JS inline (GSAP + ScrollTrigger from CDN allowed). Quality bar is Awwwards, not a template.

ART DIRECTION
Mood: quiet luxury, editorial print, patient and warm. Think a high-end architecture magazine, not a tech site. Generous whitespace, film-grain overlay at 5% opacity, nothing loud.

PALETTE (CSS custom properties)
--ivory: #f0ece3 (page background)
--ink: #171410 (text)
--ink-soft: rgba(23,20,16,0.62) (secondary text)
--ink-faint: rgba(23,20,16,0.38) (meta text)
--bronze: #a97e4f (single accent: italic words, rules, details)
--line: rgba(23,20,16,0.14) (hairlines)

TYPE
Display: Fraunces (Google Fonts), weight ~340, tight leading (0.98), used at clamp(3.4rem, 11.5vw, 11rem) for the headline. Italic words in the headline are bronze.
UI/body: Instrument Sans. Meta text: Spline Sans Mono, uppercase, letter-spaced 0.08 to 0.26em, tiny (0.66 to 0.78rem).

STRUCTURE
1) Fixed top bar, mix-blend-mode difference: wordmark "MERIDIAN Atelier" (sans bold + serif italic), right nav (Projects, Studio, Journal, Contact) with underline-on-hover that animates scaleX from the left.
2) Pinned hero stage (100dvh): a three-line serif headline "Buildings / that hold / light." with the middle line indented and "hold" in bronze italic. A framed photograph (double bezel: outer shell with hairline border and padding, inner core) sits right of center at about 38vw wide, 16/10, overlapping the headline. Bottom meta row in mono: coordinates left, an animated scroll tick center, "Est. 2011 — 14 built works" right.
3) Scroll choreography (GSAP ScrollTrigger, pin the stage, scrub: 1, end +=160%): headline lines drift up, fade, and blur out with a slight stagger; the framed image grows to 100vw x 100dvh and its frame dissolves; the image itself scales 1.0 to 1.06 with a small vertical parallax; at around 45% a bottom gradient veil fades in; at around 62% a caption fades up over the photo ("Hillside House, Valdres" in serif italic plus a mono meta line).
4) After the pin: an editorial beat section on ivory. 12-column grid: a 4/5 framed detail photograph on columns 2 to 5 with a mono figcaption, and on columns 7 to 11 a serif headline "Few projects, taken slowly." (italic bronze on "slowly"), one short paragraph of specific copy about working slowly from the site outward, and a CTA "View the work" with the arrow inside its own 44px circular border that inverts to ink on hover. Masked line reveal on the headline, parallax on the image.
5) Footer strip: hairline top border, three mono items (copyright, street address, email link).

MOTION RULES
Ease: expo.out for entrances, none for scrubbed tweens. Entrance: headline lines rise out of overflow-hidden masks (yPercent 110 to 0, 1.4s, stagger 0.12), meta fades up, frame breathes in from scale 0.94. All motion is always active: the scrub is user-controlled by scroll and the entrance is part of the design, so do not gate any of it behind prefers-reduced-motion.

IMAGERY
Two photographs, warm and restrained: (1) wide golden-hour exterior of a minimalist concrete and glass hillside house, glowing amber interior, dry grasses; (2) vertical detail of sunlight raking a concrete staircase with a thin bronze handrail. Generate them or use similar licensed photos; the grade must stay warm ivory/charcoal with bronze light.

QUALITY BAR
No generic AI patterns: no centered-everything stack, no gradient blob, no emoji, no identical cards. Every animation has a job. Copy is specific and quiet. The page must be fully responsive (headline scales via clamp, frame widens on mobile, grid collapses to a single column) and must open correctly as a plain double-clicked HTML file.`,
    thumb: '/templates/meridian-atelier/thumb.webp',
    demoUrl: '/templates/meridian-atelier/index.html',
    date: '2026-07-12',
  },
];
