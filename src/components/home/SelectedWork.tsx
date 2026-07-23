import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, type Lang } from "@/i18n";

/**
 * Section 4 — Selected Work (LIGHT "paper" flip). Direction A: STICKY INDEX +
 * LIVE PREVIEW PANE.
 *
 * A sticky numbered index on the left names all eight builds; the right column
 * is a stack of large "live screens" (browser-chrome frames around each demo
 * capture). As the previews scroll, the index highlights the build in focus and
 * the off-focus screens dim, so the whole thing reads like a live device with a
 * table of contents. Every screen is a real live-demo link: this is the
 * "proof you can click through" promise made literal.
 *
 * No scroll-jack (the v2 pinned-horizontal problem), no Higgsfield (the
 * thumbnails are the real /templates captures). Mobile drops the sticky index
 * and stacks the screens full-width.
 */

type Build = {
  slug: string;
  title: string;
  kind: { en: string; id: string };
  stack: string;
  year: string;
  blurb: { en: string; id: string };
};

const builds: Build[] = [
  {
    slug: "fathom",
    title: "Fathom",
    kind: { en: "Real-time SaaS landing", id: "Landing SaaS real-time" },
    stack: "WebGL · GSAP · Shader",
    year: "2026",
    blurb: {
      en: "One metaphor, the signal, runs the whole page in real time.",
      id: "Satu metafora, sinyal, menggerakkan seluruh halaman secara real-time.",
    },
  },
  {
    slug: "utsuwa",
    title: "Utsuwa",
    kind: { en: "3D product configurator", id: "Konfigurator produk 3D" },
    stack: "three.js · R3F · PBR",
    year: "2026",
    blurb: {
      en: "Turn it, morph it, glaze it. The product is the interaction.",
      id: "Putar, ubah bentuk, ganti glasir. Produknya adalah interaksinya.",
    },
  },
  {
    slug: "seve",
    title: "Sève",
    kind: { en: "DTC e-commerce landing", id: "Landing e-commerce DTC" },
    stack: "GSAP · ScrollTrigger · Lenis",
    year: "2026",
    blurb: {
      en: "One product, told like an editorial. One green world, one amber accent.",
      id: "Satu produk, dikisahkan seperti editorial. Satu dunia hijau, satu aksen amber.",
    },
  },
  {
    slug: "clara-cyber-security",
    title: "Clara",
    kind: { en: "Security portfolio", id: "Portfolio keamanan siber" },
    stack: "three.js · GSAP · Bento",
    year: "2026",
    blurb: {
      en: "A dossier-and-terminal portfolio with a live 3D attack globe.",
      id: "Portfolio bergaya berkas rahasia dengan globe serangan 3D yang hidup.",
    },
  },
  {
    slug: "nexus-architecture",
    title: "Nexus",
    kind: { en: "Architecture studio landing", id: "Landing studio arsitektur" },
    stack: "three.js · GSAP · Lenis",
    year: "2026",
    blurb: {
      en: "A cinematic scroll past a wireframe tower and a pinned gallery.",
      id: "Scroll sinematik melewati menara wireframe dan galeri yang di-pin.",
    },
  },
  {
    slug: "fjeld",
    title: "Fjeld",
    kind: { en: "Multi-page lodge site", id: "Situs lodge multi-halaman" },
    stack: "GSAP · React Router",
    year: "2026",
    blurb: {
      en: "A four-page lodge site that behaves like fog.",
      id: "Situs lodge empat halaman yang bergerak seperti kabut.",
    },
  },
  {
    slug: "resonance",
    title: "Resonance",
    kind: { en: "Kinetic type hero", id: "Hero tipografi kinetik" },
    stack: "Variable fonts · Canvas",
    year: "2026",
    blurb: {
      en: "The headline is the instrument. The cursor plays the name.",
      id: "Headline-nya adalah instrumen. Kursor memainkan namanya.",
    },
  },
  {
    slug: "linehaul-ops",
    title: "Linehaul",
    kind: { en: "3D freight ops landing", id: "Landing operasi logistik 3D" },
    stack: "three.js · GSAP · Low-poly",
    year: "2026",
    blurb: {
      en: "Scroll flies a camera along a coral route through a low-poly port.",
      id: "Scroll menerbangkan kamera menyusuri rute koral melintasi pelabuhan low-poly.",
    },
  },
];

/* ── the "live screen" (browser-chrome frame around a demo capture) ────── */

function Screen({
  build,
  index,
  lang,
  active,
  onActivate,
  frameRef,
}: {
  build: Build;
  index: number;
  lang: Lang;
  active: boolean;
  onActivate: () => void;
  frameRef: (el: HTMLDivElement | null) => void;
}) {
  const t = copy[lang].work;
  const reduce = useReducedMotion();
  const demo = `/templates/${build.slug}/index.html`;

  return (
    <div ref={frameRef} className="scroll-mt-28">
      <a
        href={demo}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onActivate}
        aria-label={`${build.title} — ${t.explore}`}
        className="group block"
      >
        {/* browser chrome frame */}
        <div
          className="relative overflow-hidden rounded-xl border border-black/12 bg-white transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform,filter]"
          style={{
            opacity: active ? 1 : 0.55,
            filter: active ? "grayscale(0)" : "grayscale(0.35)",
            transform: reduce ? "none" : active ? "scale(1)" : "scale(0.985)",
            boxShadow: active
              ? "0 60px 130px -50px rgba(0,0,0,0.6)"
              : "0 28px 80px -50px rgba(0,0,0,0.4)",
          }}
        >
          {/* top bar */}
          <div className="flex items-center gap-3 border-b border-black/10 bg-[#f2f1ef] px-4 py-2.5">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6a2b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            </span>
            <span className="flex flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-black/[0.05] px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-[#6b6b68]">
              <Lock className="h-2.5 w-2.5 shrink-0 opacity-60" />
              <span className="truncate">vixlify.studio/templates/{build.slug}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#6b6b68]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] shadow-[0_0_8px_rgba(255,106,43,0.9)]" />
              {t.view}
            </span>
          </div>

          {/* the capture */}
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={`/templates/${build.slug}/thumb.webp`}
              alt={`${build.title} — ${build.kind[lang]}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>

          {/* hover affordance */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 flex translate-y-2 items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f4f4f2] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {t.explore}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </a>

      {/* caption under the screen (mobile carries the metadata here) */}
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className="font-mono text-[11px] tracking-[0.14em] text-black/30">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#111111]">
            {build.title}
          </h3>
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b6b68]">
          {build.year}
        </span>
      </div>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[#3a3a38]">
        {build.blurb[lang]}
      </p>
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────────── */

export function SelectedWork() {
  const { lang } = useLang();
  const t = copy[lang].work;
  const [active, setActive] = useState(0);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [marker, setMarker] = useState<{ y: number; h: number }>({ y: 0, h: 0 });

  // Slide the ember progress marker to cover the active index row.
  useEffect(() => {
    const li = liRefs.current[active];
    if (li) setMarker({ y: li.offsetTop, h: li.offsetHeight });
  }, [active, lang]);

  // Sync the active build to whichever screen sits nearest the focus line.
  // rAF loop (robust with Lenis, which does not emit native scroll events for
  // programmatic/virtual scroll).
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const line = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      frames.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = Math.abs(center - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (i: number) => {
    frames.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="work" className="relative bg-[#e8e8e6] text-[#111111]">
      {/* dark → light boundary: hairline + centered crosshair */}
      <div aria-hidden="true" className="relative h-px w-full bg-black/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-black/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-32 lg:pt-40">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
            {t.eyebrow}
          </span>
          <LineGrow className="max-w-16 bg-black/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/30">
            {t.note}
          </span>
        </div>

        <h2 className="mt-6 max-w-[16ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,8vw,6.5rem)]">
          <BlurReveal text={t.headingLead} />
          <BlurReveal
            text={t.headingEmph}
            delay={0.15}
            className="[-webkit-text-stroke:1.5px_#111111] text-transparent"
          />
        </h2>

        <Rise as="p" delay={0.15} className="mt-7 max-w-lg text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem]">
          {t.intro}
        </Rise>

        {/* split: sticky index + live screens */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-14">
          {/* sticky index (desktop only) */}
          <nav className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <ul className="relative border-t border-l border-black/12">
                {/* ember progress marker */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 w-[2px] bg-[#ff6a2b] transition-[top,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ top: marker.y, height: marker.h }}
                />
                {builds.map((b, i) => {
                  const on = active === i;
                  return (
                    <li
                      key={b.slug}
                      ref={(el) => {
                        liRefs.current[i] = el;
                      }}
                      className="border-b border-black/12"
                    >
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        onMouseEnter={() => setActive(i)}
                        className="group flex w-full items-center gap-4 py-4 pl-5 text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ transform: on ? "translateX(6px)" : "translateX(0)" }}
                      >
                        <span
                          className="font-mono text-[11px] tracking-[0.14em] transition-colors"
                          style={{ color: on ? "#ff6a2b" : "rgba(0,0,0,0.3)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span
                            className="block font-display text-xl font-semibold tracking-[-0.02em] transition-colors"
                            style={{ color: on ? "#111111" : "rgba(17,17,17,0.4)" }}
                          >
                            {b.title}
                          </span>
                          <span
                            className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                            style={{ color: on ? "#6b6b68" : "rgba(0,0,0,0.25)" }}
                          >
                            {b.kind[lang]} · {b.stack}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 transition-all"
                          style={{
                            color: on ? "#111111" : "rgba(0,0,0,0.2)",
                            opacity: on ? 1 : 0,
                            transform: on ? "translateX(0)" : "translateX(-4px)",
                          }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* live screens */}
          <div className="lg:col-span-8">
            <div className="space-y-16 sm:space-y-24">
              {builds.map((b, i) => (
                <Screen
                  key={b.slug}
                  build={b}
                  index={i}
                  lang={lang}
                  active={active === i}
                  onActivate={() => setActive(i)}
                  frameRef={(el) => {
                    frames.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
