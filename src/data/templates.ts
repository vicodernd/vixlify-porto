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
    slug: 'clara-cyber-security',
    title: 'Clara — Offensive Security Portfolio',
    category: 'interactive',
    tags: ['GSAP', 'three.js', 'Bento grid', 'Custom cursor'],
    description:
      'A personal portfolio for a fictional offensive-security specialist: a magnetic-cursor hero with a pointer-revealed unmasked photo, a bento grid of five animated capability schematics, a stacking "case file" dossier deck for past engagements, a live 3D attack globe, and a redacted-file contact form.',
    prompt: `You are a principal designer and creative developer at a high-end studio, building an award-grade personal portfolio for a fictional offensive-security specialist called "Clara" (red-team engagements, threat hunting, zero-trust cloud architecture, incident response). Build it as a React + Tailwind app: motion with framer-motion, a custom cursor and lightweight three.js for a single 3D globe. Quality bar is Awwwards, not a template.

INTERPRETATION NOTE: the live result generated from this prompt is an interpretation of the demo, not a pixel-exact copy. Keep the full quality; do not simplify the interaction to make it easier to reproduce.

ART DIRECTION
Mood: black-ops tech, dossier-and-terminal, never cartoonish "hacker". Near-black ground so a single hot accent reads as a warning light, not decoration.
Palette (CSS custom properties / Tailwind tokens): --bg #0A0A0A (page ground), --surface #0C0C0C (cards), --surface-2 #141414 (chips, pills), --border #222222 (hairlines), --ink #F5F5F5 (primary text), --ink-dim #888888 (secondary/meta text), --accent #FF4500 (the one warning-light orange, used for kickers, CTAs, active nav pill, glows and hover states), --accent-hot #FF8A3D (secondary blip/glow tone used only inside the schematics). A soft radial accent glow (rgba(255,69,0,0.16-0.18)) sits behind the hero and the contact footer, nowhere else.
Type: Bebas Neue (display, condensed, uppercase, all headlines) at fontWeight 400 with tight or negative letter-spacing; Space Grotesk (400-700) for body and UI labels; IBM Plex Mono (400-500) for every kicker, meta label, stat caption and form label, always uppercase with wide letter-spacing (0.15-0.25em).

STRUCTURE (one page, five sections after a fixed nav)
NAV: fixed top bar, three columns. Left a square icon-button "home" mark; center a pill-shaped segmented nav (Main / Services / Work / Contact) where the active section's pill fills solid accent-orange; right a light pill "Hire Me" button. Bar gains a translucent blurred dark background once scrolled.

1) HERO. Full viewport. A three-column grid: left column a small accent kicker ("Cyber Security Specialist"), a short mono promise line, two CTAs (a solid orange pill "Book a call" and an outline pill "See case files", both magnetic — they nudge toward the cursor within a small radius), a hairline-framed "Est. 2018 / 7 Yrs" row, and a pulsing green dot "Available for projects". Center column: a portrait photo masked to a soft vertical fade, with a SECOND hidden version of the same portrait (subtly unmasked/different lighting) revealed only inside a small circle that follows the cursor when hovering the photo, like a torch revealing a second read. Behind everything, a faint field of thin connecting lines and small square nodes (a constellation of dots joined by hairline strokes) drifting almost imperceptibly. Right column: a short bio paragraph under an "/ Bio" kicker, plus two stat cards (e.g. "120+ Audits shipped", "0 Breaches on watch"). A massive condensed headline ("CLARA / SECURE.", the slash in accent orange) is pinned along the bottom of the hero, sized with clamp() to nearly full width, entrance-animated as masked units sliding up line by line. A bottom meta strip lists the five specialties in mono caps separated by middots. Entrance choreography: photo fades/scales in first, side columns rise and fade in, then the headline units slide up staggered, then the bottom strip fades up — all chained, no scroll needed.

2) CAPABILITIES ("What I Do"). A kicker + huge condensed heading, plus a short mono line ("Five live modules, one operator."). Below, an asymmetric bento grid (one large 2x2 tile, two medium tiles, two small tiles, one wide accent-filled CTA tile) of capability cards: Offensive Security (a rotating targeting-reticle SVG with concentric dashed rings and corner brackets), Threat Hunting (a radar sweep conic-gradient with random blipping dots), Zero-Trust Cloud (three expanding pulse rings behind a small shield-check glyph), Incident Response (an animated EKG waveform line that continuously draws and redraws), Security Audits (fake redacted text bars with a vertical scanline sweeping down). Each card has a number, title, one-line description, and small tag pills; hovering intensifies its schematic's animation speed and lifts the card slightly with a warmer border. The final tile is solid accent-orange, inviting an off-menu request, and is itself a CTA to the contact section. Cards fade/rise in staggered as the grid scrolls into view.

3) CASE FILES ("Work"). A kicker + heading, then a vertical stack of "declassified dossier" cards for 3 past engagements (e.g. codenames like GLASS FORTRESS / QUIET STORM / BLACK TIDE), each styled as a redacted case file: a classification header bar ("Case File — 001", "Top Secret // NOFORN" in accent orange, fiscal year), a grayscale evidence photo that colorizes and zooms slightly on hover with a scanline overlay and a rotated "DECLASSIFIED" stamp that fades in on hover, and a body with a client name that appears to "redact-reveal" on hover (a solid orange bar retracts to reveal the text), sector, a one-paragraph summary, three big stat numbers with mono captions, and technique tag pills. As the user scrolls, each card sticks and the next card scales/dims the previous one slightly before covering it (a subtle stacked-deck depth effect, desktop only). Close with a centered heading ("Your stack could be next.") and an outline CTA pill that inverts to solid orange on hover.

4) LIVE THREAT MAP (interlude band). A very faint, heavily subdued ambient video/texture background. Left: a pulsing "Live Threat Map" kicker, a two-line headline ("The world is the perimeter.", the last word in accent orange), a short paragraph, then a small stats row: a continuously ticking-up live counter ("events analyzed today", incrementing only while the section is in view) and a static "24/7 coverage" stat, plus four small region pills (AMER/EMEA/APAC/LATAM). Right: a rotating 3D wireframe/dotted globe (Fibonacci-sphere point cloud in accent orange with a soft fresnel atmosphere glow) with a handful of animated arcing "attack" lines connecting real city coordinates across its surface, auto-rotating slowly. Below the whole band, a continuous horizontal marquee of security tool names (Burp Suite, Metasploit, Wireshark, Splunk, CrowdStrike, Terraform, Kubernetes, MITRE ATT&CK, Ghidra, Nmap) in huge condensed type, pausing on hover.

5) CONTACT / FOOTER. Left: a kicker, a two-line huge headline ("Secure by design.", second line in accent orange), a short paragraph, and a solid-orange magnetic email pill CTA. Right: a minimal form (name, email, a "what do you need secured" textarea) with underline-only inputs that light up orange on focus, and a submit button whose label swaps through idle to "Encrypting & sending…" doing "✓ Received" states. Below the form, a meta row of four columns (a live local-time clock, location, availability status, response time). A social link row and copyright line follow. The footer closes with a giant edge-to-edge outlined wordmark marquee ("CLARA SECURE · AVAILABLE FOR WORK · ZERO BREACHES · BOOK A CALL") in huge condensed hollow (stroke-only) type that fills solid accent-orange on hover, separated by a diamond glyph.

INTERACTION DETAILS
Custom cursor: replace the system cursor with a small dot plus a trailing ring that expands and shows a short mono label ("reveal", "work", "hire", "hover to declassify") whenever it passes over an interactive element; shrinks slightly on click.
Magnetic buttons: primary CTAs and nav icons pull a few pixels toward the cursor within a small radius and spring back on leave.
All section headings animate in as masked character/word units sliding up from below (not simple fades).

MOTION RULES
Ease power3/power4-out for entrances, linear for marquees and scrubs. Stagger related elements (grid tiles, headline units, tags) rather than animating them together. Scroll-triggered reveals fire once per element the first time they cross roughly 75-80% of the viewport. Do not gate any motion behind prefers-reduced-motion (this audience expects a live, restless interface). Keep every animation at 60fps; only animate transform/opacity plus the schematic SVGs and canvas globe.

IMAGERY
One portrait subject in two lighting/reveal states for the hero torch effect, and three moody evidence-style photographs (a zero-trust network diagram or server room, a red-team operations shot, a forensics/incident-response scene) desaturated by default. Serve full-bleed imagery at 2K.

QUALITY BAR
No AI-slop tells: no three identical feature cards (the bento grid must be genuinely asymmetric), no emoji, no gradient-blob hero, no lorem ipsum, no em dashes anywhere. Copy is specific to real security work (real tool names, real frameworks like MITRE ATT&CK, SOC 2, ISO 27001, CIS). Must run at 60fps on a mid laptop, be fully responsive down to 375px, and read like a specialist who is quietly, seriously good rather than performing "hacker aesthetic".`,
    thumb: '/templates/clara-cyber-security/thumb.webp',
    demoUrl: '/templates/clara-cyber-security/index.html',
    date: '2026-07-14',
  },
  {
    slug: 'nexus-architecture',
    title: 'Nexus — Architecture Studio Landing',
    category: 'landing',
    tags: ['GSAP', 'ScrollTrigger', 'three.js', 'Lenis'],
    description:
      'A cinematic one-page site for a fictional architecture studio: a video hero with kinetic typography and WebGL embers, a scroll-and-cursor-reactive 3D wireframe tower, a pinned horizontal project gallery, and a floating-image-preview services list.',
    prompt: `You are a principal designer and creative developer at a high-end studio, building an award-grade one-page website for a fictional architecture studio called "Nexus" (a collective of architects, engineers and dreamers, est. 2012, based in Jakarta). Build it as a React + Tailwind app: motion with framer-motion, smooth scrolling, and three.js for two lightweight WebGL moments (hero embers, a wireframe tower). Quality bar is Awwwards, not a template.

INTERPRETATION NOTE: the live result generated from this prompt is an interpretation of the demo, not a pixel-exact copy. Keep the full quality; do not simplify the interaction to make it easier to reproduce.

ART DIRECTION
Mood: quiet architectural confidence, warm and grounded rather than cold-corporate. A near-black ground with a warm bronze accent used sparingly, like light through a window.
Palette (CSS custom properties / Tailwind tokens): --bg #0B0B0A (ground), --bg-2 #121110 (raised panels, previews), --ink #E9E4DA (primary text, warm off-white not pure white), --ink-dim #8A857C (secondary/meta text), --accent #D98E4A (warm bronze/amber, used only for the section-tag dash, one outlined headline word per section, and hover states), --line rgba(233,228,218,0.14) (hairlines).
Type: Clash Display (Fontshare) for every headline, condensed and confident, occasionally rendered as outline-only (stroke, transparent fill) for a second contrasting word in a heading; Archivo (300-600) for body copy and UI labels; JetBrains Mono (300-400) uppercase with wide letter-spacing for section tags ("01 — Studio"), navigation meta, stat labels and footer columns.

STRUCTURE (one page, fixed header + full-screen menu overlay + six sections)
HEADER: fixed, transparent over the hero, three-part: left a small wordmark ("NEXUS" with a superscript registration mark) that is itself a magnetic link home; center a live local-time readout ("JAKARTA — HH:MM"); right a "MENU" button with two short lines that morph into an X. Clicking it opens a full-screen dark menu overlay: a large numbered link list (01 Home, 02 Studio, 03 Works, 04 Expertise, 05 Contact) with big hover-underline links, and a footer row of three columns (studio address, inquiries email/phone, social links).

1) HERO. Full-bleed looping background video (a moody architectural exterior at dusk) with a dark gradient overlay, plus a canvas of drifting ember/dust particles reacting subtly to the mouse. Content: a small eyebrow line revealed via a sliding line-mask ("Architecture & Spatial Design Studio — Est. 2012"), a huge kinetic wordmark "NEXUS" built from individually animated characters that rise into place, a two-line tagline (also line-masked) at the bottom, and a magnetic "SCROLL" indicator with an animated downward arrow. All text is choreographed in with staggered masked reveals right after a brief preloader (a curtain with a climbing 0 to 100 counter and progress bar over the studio wordmark) finishes.

2) MANIFESTO. A short, centered editorial paragraph (word-by-word scroll-scrubbed opacity, each word brightening as it passes a scroll threshold) stating the studio's philosophy, with a section tag ("02 — Studio") and a circular magnetic "OUR WORK" button beside it.

3) 3D STRUCTURE (pinned). The section pins full-height while a procedural wireframe tower or lattice structure rendered in three.js twists and responds live to cursor position and scroll progress (drag/scroll and it visibly "listens"). Overlaid: a three-line stacked headline ("FORM / FOLLOWS / VISION", the middle word rendered outline-only) and a small hint line ("— drag your cursor, the structure listens").

4) WORKS (pinned horizontal gallery). The section pins while normal vertical scroll is translated into horizontal movement through a track of project cards (large image, index number, project name, one-line meta of type/city/year) for four fictional projects (a cultural pavilion, a forest retreat, a cliffside villa, a commercial tower), ending on a large circular "ALL PROJECTS" CTA. Cursor shows a "VIEW" label over any card.

5) PHILOSOPHY. A two-column split: a tall reveal-clipped photograph (a light-filled concrete atrium) on one side, and on the other a section tag, a two-line headline ("Light is our first material."), a short paragraph, and a row of three count-up stats (e.g. 140 Projects Completed, 27 Design Awards, 12 Countries) that animate their numbers up once scrolled into view.

6) SERVICES. A vertical list of four expertise rows (Architecture, Interior Design, Masterplanning, Research), each with a number, name and short descriptor; hovering any row swaps a floating image preview that follows the cursor near that row, cross-fading between each service's representative photo. A cursor arrow label appears while hovering the list.

MARQUEE + CONTACT/FOOTER. A full-bleed marquee band repeats the studio's mantra in huge type ("BUILD BEYOND — NEXUS —"), scrolling continuously. The footer/contact section: a section tag, a three-line huge headline ("LET'S BUILD / SOMETHING / TIMELESS", middle word outline-only), a large magnetic email link, then a three-column row (studio address, social links, copyright), closing with an enormous edge-to-edge clipped "NEXUS" wordmark as a graphic footer element.

INTERACTION DETAILS
Custom cursor: a small dot plus a labeled follower ring that shows short verbs ("VIEW", "→", "✉") over interactive elements, and grows/shrinks appropriately.
Magnetic elements: the menu toggle, scroll indicator, circular CTAs and social links all pull gently toward the cursor within a small radius.
Smooth scroll (Lenis-style inertia) drives every scroll-linked animation so parallax and pinning feel fluid rather than stepped.

MOTION RULES
Ease power3/power4 for entrances, linear for marquees, none/linear for scrubbed effects. Every heading reveals via an overflow-hidden line-mask sliding up, never a plain fade. Preloader must gate the hero choreography on first load only. Do not gate motion behind prefers-reduced-motion; scroll and cursor are the whole point. Keep pinned sections performant: only animate transform/opacity and the two three.js canvases, never layout properties.

IMAGERY
One moody dusk exterior for the hero video/poster, four project photographs (cultural pavilion, forest retreat, cliffside villa, commercial tower) in a warm architectural palette, and one light-filled interior atrium shot for the philosophy section. Serve full-bleed stills at 2K.

QUALITY BAR
No AI-slop tells: no three identical feature cards, no emoji, no gradient-blob hero, no lorem ipsum, no em dashes anywhere. Copy reads like a real studio (specific project types, cities, award counts), never generic corporate-speak. Must run at 60fps on a mid laptop, be fully responsive down to 375px (pinned/horizontal sections degrading gracefully to normal vertical flow on mobile), and read as quietly prestigious, not flashy for its own sake.`,
    thumb: '/templates/nexus-architecture/thumb.webp',
    demoUrl: '/templates/nexus-architecture/index.html',
    date: '2026-07-14',
  },
  {
    slug: 'spectra',
    title: 'Spectra — Interactive Generative Gallery',
    category: 'interactive',
    tags: ['framer-motion', 'Canvas', 'Generative', 'Scroll'],
    description:
      'A self-arranging gallery of twelve generative works, indexed along a single spectrum of light. Cards fly in from scatter to ring, unfold on scroll into a convex rainbow arc you can spin, light up under the cursor with a liquid brush reveal, and flip to their detail face on click.',
    prompt: `You are a principal designer and creative developer at a high-end studio, building an award-grade INTERACTIVE hero for a fictional generative-art gallery called "Spectra" (a curated collection of twelve generative works, indexed along a single spectrum of light). Build it as a React + Tailwind app: motion with framer-motion, generative card art on HTML canvas, no other UI libraries. Quality bar is Awwwards, not a template. The whole thing is one deliberate full-viewport "chapter" that hijacks scroll; it is the entire page.

INTERPRETATION NOTE: the live result generated from this prompt is an interpretation of the demo, not a pixel-exact copy. Keep the full quality; do not simplify the interaction to make it easier to reproduce.

ART DIRECTION
Mood: dark, cinematic, gallery-at-night. A near-black ground so the colour of the works does the talking. The organising idea (hold to it as the one controlling metaphor): the spectrum IS the structure. Every work has a position on a warm colour spectrum, and that single value drives its place on the arc, its tint, its wavelength label and its spot on the HUD. Nothing is decorative for its own sake. One warm "Solar Flare" gradient, used with restraint (the HUD track, the order of the cards, one headline word), never as a full-screen wash.

PALETTE (CSS custom properties / Tailwind theme tokens)
--bg: #0B0A0F (ground, near-black)
--surface: #16131E (lifted panels, card backs)
--surface-2: #0F0E15 (recessed, HUD track)
--fg: #F5F3F7 (primary text)
--muted: #9A93A6 (secondary text, mono labels)
--line: rgba(255,255,255,0.08) (hairlines)
Spectrum stops: --s1 #FFB020 (amber), --s2 #FF5A3C (coral), --s3 #FF2D6E (rose), --s4 #7C3AED (violet).
--spectrum: linear-gradient(90deg,#FFB020,#FF5A3C,#FF2D6E,#7C3AED). Add a faint fixed SVG film-grain overlay at ~4 percent and one large, very soft violet-to-rose radial glow behind everything.

TYPE
Display: Clash Display (Fontshare) 500/600/700, letter-spacing -0.02em; hero wordmark at clamp(3rem, 9vw, 7rem), the last syllable filled with the --spectrum gradient (background-clip: text).
Body: General Sans (Fontshare) 400/500 for the subline and card detail copy.
Meta: JetBrains Mono 400/500, uppercase, letter-spacing 0.2 to 0.34em, tiny (0.6 to 0.72rem) for chrome labels, index numbers, wavelength readouts and HUD ticks.

THE TWELVE WORKS (generative, drawn on canvas, no photos)
Twelve cards, each a distinct generative composition seeded by its index so it is stable across renders. For work i (t = i / 11): compute its hue by interpolating the four spectrum stops at t. Paint on a per-card canvas: a dark vertical base gradient, two or three soft additive radial glows in the hue and its neighbours, seven faint concentric arc strokes around the brightest glow, and ~70 fine particles scattered with slight hue variation. Add a subtle inner vignette. Each card also carries: an index (01 to 12), a wavelength label that runs 590nm at amber down to 410nm at violet (real visible-light order), and an authored name and one-line descriptor (for example: Ascent, "First light breaking the field."; Rose Static, "Signal caught mid-flare."; Violet Hour, "The edge of the visible."). Card is a rounded rectangle (~150x200 at desktop) with a hairline edge tinted by its hue.

THE SEQUENCE (this is the piece)
1) Intro loader: a full-screen panel over the ground with the SPECTRA wordmark and a zero-padded mono counter climbing 000 to 100 over ~1.3s (easeInOutCubic) with a thin gradient bar. When it finishes it slides up and off, and only then does the card choreography begin (gate every reveal behind a ready flag).
2) Self-staging: the twelve cards animate through timed phases with spring easing: scatter (random positions, rotations, faded) then a single horizontal line then a ring. On the ring each card is rotated tangentially (angle + 90) so it faces outward, with the intro copy centred inside the ring: an eyebrow ("A collection that arranges itself"), the "Spectra" wordmark, a one-line subline, and a mono hint "Scroll to unfold the arc".
3) Morph on scroll: hijack wheel and touch into a single clamped scroll value. As it climbs 0 to 1, morph the ring into a convex rainbow arc pinned toward the lower half by lerping each card between two fully computed coordinate sets (its ring position and its arc position, both from trigonometry). The arc is one big circle whose centre is pushed far below the viewport so only the crown shows; card i sits at angle -90deg + (t - 0.5) * spread, rotated tangentially. All twelve are visible and symmetric at full unfold, amber on the left to violet on the right. The intro copy fades and blurs out as the morph climbs; a destination heading ("The spectrum, unfolded") fades in past ~70 percent.
4) Spin: horizontal drag spins the arc a bounded amount (rotate every card's arc angle by a clamped pan value, spring-smoothed) so it feels alive but can never sweep off-screen. Axis-lock the drag: vertical intent unfolds, horizontal intent spins.
5) Hover a card: it eases up out of the arc (scale up ~17 percent, straighten its rotation, rise, pop above its neighbours) and a LIQUID REVEAL plays on it: paint a brighter "charged" render of the SAME work (same seed, intensified core, rings and particles) along the cursor trail on a mix-blend:screen canvas, using a soft radial brush stamped through source-in of the charged art, with a small per-frame destination-out decay so the reveal heals back. Use the card-local offset coordinates so the rotated card's canvas space stays correct. Run the reveal only for the hovered card.
6) Click a card: it flips in 3D (rotateY) to a detail back face showing its number, wavelength, name, descriptor, "Generative / canvas", three palette swatches and the hue hex. It flips back when the pointer leaves.
HUD: a fixed bottom scrubber whose track is the --spectrum gradient with a round thumb tracking the unfold progress, and mono end labels "590nm Amber" and "Violet 410nm". Fixed mono chrome in the corners (wordmark and volume, work count, an interaction hint).

MOTION RULES
Ease cubic-bezier(0.22,1,0.36,1); spring-smooth the scroll value, the pan and every per-card lift by lerping toward a target each frame. Nothing autoplays past the intro; scroll and pointer drive everything. Do not gate motion behind prefers-reduced-motion (scroll and hover are user-controlled). Push per-card transforms to the DOM every frame from the smoothed values; keep it at 60fps with twelve cards. Never animate layout properties, only transform, opacity and canvas.

LAYOUT AND RESPONSIVENESS
Root font fluid via clamp so the piece scales proportionally. On phones, keep the ring but tighten it, and make the arc a more curved, more compact fan whose ends clip off the screen edges (spin brings them in); shrink the headline. No horizontal page scroll at any width; disable text selection so dragging never highlights card text.

QUALITY BAR
No AI-slop tells: no three identical feature cards, no emoji, no gradient-blob hero, no lorem ipsum, no em dashes anywhere. The colour is meaningful (it is the index), the copy is specific and authored, and the interaction is the point. It must run at 60fps on a mid laptop, be responsive down to 375px, and read like a real generative-art gallery, quiet and expensive, that arranges itself.`,
    thumb: '/templates/spectra/thumb.webp',
    demoUrl: '/templates/spectra/index.html',
    date: '2026-07-14',
  },
  {
    slug: 'arus-coffee',
    title: 'Arus — Indonesian Roastery Site',
    category: 'site',
    tags: ['GSAP', 'Hash router', 'Canvas', 'Editorial'],
    description:
      'A four page site for a fictional Indonesian specialty roastery in one self-contained file: hash routed pages behind an ink curtain transition, a cursor brush that "roasts" green beans in the hero, an arced marquee, and warm editorial pages for beans, brew guides and the story.',
    prompt: `You are a principal designer at a high-end studio, building an award-grade multi page website for a fictional Indonesian specialty coffee roastery called "Arus" (arus means current; the brand story is shortening coffee's journey: single origins from Gayo, Kintamani and Toraja, roasted in Jakarta, shipped worldwide). The output is ONE self-contained HTML file with all CSS and JS inline (GSAP + ScrollTrigger from CDN allowed) containing four pages switched by a hash router. Quality bar is Awwwards, not a template.

ART DIRECTION
Mood: warm editorial with black-and-tan discipline. Cream paper ground, one true warm off-black for ink and full dark sections, and exactly one accent (a burnt ember orange) reserved for three jobs only: headline underlines and color-shifted words, the drawn route line and small markers, and button hover fills. Film grain overlay at 5% via a fixed SVG noise pseudo element. Nothing else gets color. The bean is the brand color; restraint is the whole strategy.

PALETTE (CSS custom properties)
--paper: #F2ECDF (page ground)
--tan: #E6D8C0 (tinted surfaces) and --tan-deep: #D9C6A6 (big ghost numerals)
--ink: #191210 (text, dark sections, curtain, footer)
--ember: #C14D24 (the single accent)
--hair: rgba(25,18,16,.14) and rgba(242,236,223,.18) for hairlines on light and dark

TYPE
Display: Bricolage Grotesque (Google Fonts) 700/800, letter-spacing -0.03em, line-height .95. Hero at ~7.2rem, section heads 3 to 4.6rem.
Body: Vollkorn serif 400/500, 1.06rem, line-height 1.62; italics for tasting notes and asides. The grotesque display plus serif body pairing is the editorial voice.
Meta: Space Mono, uppercase, 0.68rem, letter-spacing .18em, for nav links, spec labels, captions and the footer legal row.
Page shell: above 1024px set html font-size to 1.1111vw (a 1440 design base) and size EVERYTHING in rem so the whole layout scales as one proportional unit on any monitor; below 1024px fall back to 16px with clamp() display sizes and single column layouts.

STRUCTURE (four pages in one file, hash routed: #/ home, #/beans, #/brew, #/about)
Router: pages are sections toggled by a class. Every navigation runs an ink curtain transition: a fixed full screen ink panel with a 2.5rem top radius slides up from the bottom (power3.in, .55s) showing the destination page name in display type, the page swaps and scrolls to top underneath, then the panel continues off the top with its bottom corners rounded (power3.out, .65s). First load instead shows a loader: the ARUS wordmark and a Space Mono counter that climbs 0 to 205°C (a roast temperature) in ~1.4s, then the panel slides away and gates every hero reveal until it is gone.
Header: fixed, transparent at top. Wordmark ARUS letterspaced left; three mono nav links plus a "Shop beans" pill right. The pill is a fuse button: a pill and a detached circle with an arrow sitting 2px apart, and on hover the two facing corners square off so the shapes merge into one capsule while both flood ember. Header hides on scroll down, returns on scroll up with a blurred translucent backdrop, and swaps to cream text whenever it sits over a dark band (checked per frame against the dark sections' bounding boxes).

HOME
1) Hero, min-height 100dvh, two column grid: left, a stacked two line headline "Roasted where / it grows." with the second line in ember, a 18 word serif subline, a fuse button "Shop beans" and an underlined text link to the brew guides. Right, a double bezel frame (hairline outer shell, padded, 2rem radius) holding the signature device: a photo of RAW GREEN coffee beans with a canvas on top, and moving the cursor paints the SAME spread of beans ROASTED brown along the pointer trail with a soft radial brush (~120px), the trail slowly healing back to green via destination-out decay each frame. Cover-fit the roasted image to the canvas once, stamp it through a radial gradient mask per interpolated pointer point. A mono caption row underneath: "Move your cursor: green to roast" and a lot number.
2) An ink band with an ARCED marquee: an SVG path curving like a hill crest, display type on a textPath, "SINGLE ORIGIN · SMALL LOT · ROASTED IN JAKARTA · SHIPPED WORLDWIDE" repeated, with one phrase in ember; scroll scrubs the startOffset so the arc slides as you pass. Top corners of the band rounded 2.5rem so it docks into the hero like a tile.
3) Still on ink: "Three islands, three profiles." with an ember underline on two words, then three origin cards (4:5 images: Gayo highlands mist, Kintamani volcanic terraces, Toraja karst mountains) with staggered vertical offsets, image zoom on hover plus a gradient veil revealing italic tasting notes, and a mono meta line (masl, process) under each.
4) Back on paper: a wide roastery photo (16:8.5, 2rem radius) with a paper panel BITTEN into its bottom left corner, the concave joints drawn with radial-gradient corner pieces so the notch reads as one continuous carved shape. Inside the notch: "Short journeys make honest coffee." and a short direct trade paragraph.
5) Process: "From farm gate to your door." plus four steps (Source, Roast, Rest, Ship) sitting under an ember SVG line that draws itself across the section on scroll (strokeDashoffset scrub), an ember dot at each step, and an italic ember annotation per step (14 partner farms; first crack at 196°C; valve sealed at day 6; tracked, 3 to 8 days). Below, a two column beat: a rotated (-1.2deg) roasting photo and one short quality promise paragraph.
6) Testimonial: full bleed dark espresso pour photo with a slow vertical parallax, a centered 3 line italic serif quote in cream and a mono attribution (name, role, cafe, city).
7) CTA band on ink, rounded top corners: "Taste the short journey." with the key phrase in ember, one line of shipping copy, a cream fuse button. Then the footer: mono link row over a hairline, a giant ARUS wordmark at 19vw clipped by the legal row, and a two item mono legal line.

BEANS PAGE
Header block with an ember mono kicker (Current lots · month year), "Four lots, nothing hiding." and a two line lede about printing farm, altitude, process and roast date on every bag. Then three editorial rows separated by hairlines, image and copy alternating sides (max two consecutive splits), each with: origin name in display, an italic ember tasting note line, one specific paragraph naming the cooperative and process, a 2x2 mono spec grid (Altitude, Process, Varietal, Roast), and a price with a fuse button. Close with a tan "Seasonal" band (2rem radius) for a limited honey processed Flores lot with its own spec grid and a bags-left count.

BREW GUIDES PAGE
Head: "Brew it the way the farm intended." plus a wide pour over photo (16:7.2, rounded). Three methods (V60, French press, Espresso), each a two column block: LEFT STICKY summary with the method name, three big numerals (ratio, water or dose, time) over mono labels, and an italic line naming which lot it suits; RIGHT four numbered steps, the numbers set huge in the deep tan ghost tone, each step a short titled paragraph with real technique (bloom weights, drawdown reads, dial-in directions).

ABOUT PAGE
A full width statement headline whose words fade from 12% to full ink as you scroll (word by word, scrubbed). Then a two column block: a hands-sorting photo and three short story paragraphs (garage start, direct relationships, staying small on purpose). Close with an ink panel "What we hold to." holding three columns split by hairlines, each with a big ember mono numeral that counts up on scroll (14 producing families, 7 harvests, 12 kg batches) and a two line explanation.

MOTION RULES
Ease cubic-bezier(.22,1,.36,1) everywhere, scrubs ease none. Headlines rise out of overflow-hidden line masks; paragraphs fade up 1.6rem; both fired once by IntersectionObserver per page visit and gated behind the loader on first load. The canvas brush, curtain, arc scrub, line draw, parallax and count-ups are the only other motion; every one has a narrative job. Do not gate anything behind prefers-reduced-motion. Never animate layout properties.

IMAGERY
Nine warm photographs, all graded into the palette (cream and brown, terracotta undertone, matte film feel): raw green beans macro and roasted beans macro shot as matching top-down spreads (the hero pair), three origin landscapes (Gayo mist, Kintamani terraces with the volcano, Toraja karst valley), a morning roastery interior with a vintage drum roaster, hands pulling a sample trier, a dark moody espresso pour, and hands sorting green beans on a rattan tray. Serve the full bleed ones at 2K.

QUALITY BAR
No AI tells: no purple, no glassmorphism, no three identical feature cards, no emoji, no em dashes anywhere, no scroll cues, no fake dashboard. Copy is specific to Indonesian coffee (real place names, real process words like wet hulled and subak abian). The file must open by double click, run 60fps on a mid laptop, be fully responsive down to 375px with no horizontal overflow, and read like a small roastery that charges what it is worth.`,
    thumb: '/templates/arus-coffee/thumb.webp',
    demoUrl: '/templates/arus-coffee/index.html',
    date: '2026-07-14',
  },
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
