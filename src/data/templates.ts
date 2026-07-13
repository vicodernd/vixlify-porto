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
    slug: 'linehaul-ops',
    title: 'Linehaul — 3D Freight Ops Landing',
    category: 'landing',
    tags: ['three.js', 'GSAP', 'ScrollTrigger', 'Low-poly'],
    description:
      'A full landing page for a freight operations brand, built around a procedural low-poly 3D port. A fixed hero floats over the world, then scroll flies the camera along a coral route through four dispatch waypoints, synced to a step accordion.',
    prompt: `You are a principal designer at a high-end studio, building an award-grade landing page for a fictional freight operations company called "Linehaul" (AI-driven dispatch of verified drivers and dock crews). The output is a single self-contained HTML file with all CSS and JS inline (three.js, GSAP and ScrollTrigger from CDN allowed). Quality bar is Awwwards, not a template.

ART DIRECTION
Mood: industrial minimal, precise B2B, cool and calm. A monochrome powder-blue world with exactly one accent color (coral) reserved for the route, beacons and small functional marks. Think logistics control room meets Scandinavian print, nothing decorative for its own sake.

PALETTE (CSS custom properties)
--mist: #d6e4ec (page and 3D sky background)
--mist-deep: #c3d6e2 (surfaces in the mist family)
--ink: #06081f (text, dark sections, solid buttons)
--ink-soft: #5a5c6b (secondary text)
--paper: #fcfcfc (light sections)
--coral: #ff4d3d (single accent: route line, beacons, open-state marks)
--hair: rgba(6,8,31,0.12) and --hair-dark: rgba(214,228,236,0.16) (hairlines)

TYPE
Display and UI: Archivo (Google Fonts), weight 500 for headlines with letter-spacing -0.02em; 600/700 for buttons and the wordmark. H1 at clamp(46px, 7.6vw, 100px), section headlines at clamp(34px, 4.6vw, 64px).
Meta: IBM Plex Mono, uppercase, 11.5px, letter-spacing 0.16em, for nav links, stat labels and the scroll cue.

THREE.JS SCENE (fixed full-viewport canvas, z-index -1, behind everything)
A procedural low-poly intermodal port built only from primitives (BoxGeometry, CylinderGeometry, SphereGeometry) with MeshLambertMaterial in 5 tints of the mist family (#e6eef5, #d3e2ed, #bfd4e3, #f2f7fa, #aecadf). Scene background and fog in --mist (fog from 75 to 215) so distance melts into the page color. Hemisphere light plus one directional light with PCFSoft shadows (2048 map, wide shadow camera). Content: an 8x5 container yard with stacks 1 to 3 high where every container gets two darker end frames so it reads as a real intermodal box, two gantry cranes in a deeper steel tint with a coral trolley, a quay with a container ship (darker hull, pale deck, dark bridge windows) on a darker water plane, a gate house with a dark window band and a coral barrier arm, detailed trucks (trailer with rear frame, white cab with a dark windshield band, six dark wheel blocks), a warehouse with five dark dock doors, an HQ hub building with a dark glass band, an entrance door and a coral roof beacon, light poles, tiny people as dark indigo silhouettes, service road planes, and two dashed elliptical orbit lines floating in the sky. Give object families distinct tonal ranges (deep steel blues for cargo, near-white for buildings, dark accents for glass and wheels) so everything stays readable against the pale ground.
The narrative device: a coral route line (TubeGeometry along a CatmullRomCurve3, radius 0.09) that threads gate, then yard, then cranes, then hub. The route is hidden at load (setDrawRange 0) and draws itself in as the user scrolls, with the reveal mapped piecewise to the camera waypoints (gate 25% of scroll reveals ~10% of the route, yard 50% ~35%, cranes 75% ~67%, hub by the finale) so the drawn head always sits just ahead of what the camera is flying over, never racing ahead of the story. A small coral pulse sphere rides only the revealed portion. Objects near the route's path step aside at build time (skip any yard stack within ~2.3 units of the sampled curve) so the lane runs through a clear corridor.
Camera: a follow-cam locked to the route's drawing head so the coral line always stays center-screen and is never scrolled past (this is the key move from the reference). Each frame: take the head point at the current reveal, take a point slightly ahead to get the forward tangent in the xz plane, then place the camera behind the head along that tangent (about 21 units back, 9 units to the side for a three-quarter isometric feel, 19 units up) and lookAt the head (aimed 2.5 units below it so it rides just above center, clear of the step panel). Because the camera trails the head along the tangent, the already-drawn line runs from the foreground up to the head at center while the trail recedes into the distance, regardless of how the route curves. Blend from a fixed hero overview into the follow-cam over the first 16% of scroll; at the finale (p > 0.85) increase the back distance and height so the camera lifts and pulls back to reveal the whole port with the full route drawn. Guard the render loop clock: initialize the start time from the first requestAnimationFrame timestamp (never performance.now at script time, which can exceed the first frame timestamp and feed negative time into curve lookups).

STRUCTURE
1) Fixed header, 3-column grid: two mono nav links left, centered brand (inline SVG mark of three forward chevrons, first one coral, plus the wordmark LINEHAUL letter-spaced 0.22em), two pill buttons right (radius 156px, height 46px): a ghost pill with backdrop blur "Apply to Drive" and a solid ink pill "Request Capacity". Over the dark CTA band and footer the header inverts to paper via a ScrollTrigger class toggle.
2) Fixed hero (100svh, pointer-events none) that later content scrolls over: centered H1 "A New Tempo / in Freight Ops" in two overflow-hidden lines, subcopy in two blocks (first ink, second ink-soft, max-width 640px), and a bottom scroll cue in mono "SCROLL TO FOLLOW THE ROUTE" with a 1.5px underline that draws in from the left and collapses to the right in a loop.
3) Journey: a 100svh spacer then a 430svh process section with a sticky 100svh stage. Bottom-left, a step accordion inside a frosted panel (background rgba(214,228,236,0.55), backdrop blur 14px, radius 20px) with four steps: 01 Dispatch, simplified / 02 Cleared to roll / 03 Matched to the lane / 04 On time, every relay. Each step: a mono number chip (48px, radius 12px, ink when active), a title that grows from 15px gray to 24px ink when active, and a body that opens via grid-template-rows 0fr to 1fr with a 2px vertical progress rail that fills with the segment progress. Scroll scrub divides the process into 4 equal segments driving the active step, while the same scroll drives the camera flight from overview through gate, yard and cranes to the finale.
4) Capabilities section on paper (sticky stage inside a 280vh section on desktop): headline "Built for live freight, / beyond legacy brokerage." then 4 stat columns with 2px left borders: 4h median time to dispatch, 98% on-time arrival, 12k verified drivers and dock hands, 240+ active lanes. Numbers count up as the scrub reveals each column. On mobile the pin is dropped and columns reveal individually.
5) Split section: a 16/10 photo (radius 24px, slight scroll parallax on the image) of a freight terminal at dawn next to "Terminal-grade discipline on every dock.", one short paragraph, and an ink pill CTA. Stacks vertically below 1080px.
6) FAQ with 2px top and bottom borders: sticky headline left "How we work, and how freight keeps moving.", a 2px divider, and 4 accordion items right. Each question row has a 44x26px ink chevron pill that rotates 180deg and turns coral when open. Bodies open via grid-template-rows. One item open at a time, first open by default.
7) Dark CTA band on ink: two-line headline at clamp(36px, 5.4vw, 82px), second line at 55% opacity, lines reveal from overflow-hidden wrappers, then a paper pill "Request Capacity".
8) Footer on ink: a 200px row of three equal links (Our Lanes, Our Mission, Apply to Drive) separated by dark hairlines; on hover a paper panel scales up from the bottom (transform-origin bottom) while label and arrow flip to ink and a double-chevron arrow slides through an overflow-hidden window. Then the wordmark LINEHAUL at 15.2vw filling the width, then a mono legal row. Below 900px the links stack vertically.

MOTION RULES
Ease: cubic-bezier(0.32, 0.72, 0, 1) for UI transitions, power4.out for reveals, ease none for all scrubs. Intro: camera glides in from farther out while the H1 lines rise from overflow-hidden wrappers with a 0.12s stagger, then subcopy, header and cue fade in. If the user scrolls before the intro finishes, complete it instantly (guard the scrub with an onUpdate that sets the intro timeline progress to 1). Hero text fades and drifts up over the first spacer. The camera scrub uses scrub 0.9; render loop always runs (do not gate anything behind prefers-reduced-motion) with the route pulse advancing and gently breathing. Buttons scale to 0.97 on press. Never animate layout properties, only transform and opacity, except the accordion grid-template-rows trick.

IMAGERY
One real photograph for the split section: a documentary editorial shot inside an intermodal freight terminal at dawn, two workers in navy workwear with hi-vis vests walking between container stacks, cool blue haze, muted desaturated palette that sits inside the page's mist family, no visible logos. Serve at 2K or wider.

QUALITY BAR
No AI-slop tells: no purple gradients, no three identical feature cards, no emoji, no lorem ipsum, at most one marquee (this page has none). Copy is specific to freight operations. The page must open by double-click as one file, run at 60fps on a mid laptop (cap devicePixelRatio at 2), be fully responsive down to 375px with no horizontal overflow, and read as an operations engine, precise and quiet, with coral used only where it means something.`,
    thumb: '/templates/linehaul-ops/thumb.webp',
    demoUrl: '/templates/linehaul-ops/index.html',
    date: '2026-07-12',
  },
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
