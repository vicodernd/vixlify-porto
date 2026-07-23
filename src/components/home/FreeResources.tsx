import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Lock } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, type Lang } from "@/i18n";

/**
 * Section 6 — Free resources / "Design in motion" (LIGHT "paper", the last
 * light section before the dark footer). Bridges the paid ID-facing site to the
 * free global layer: a growing library of production-grade templates (live) and
 * automations (honestly marked coming soon, since /automations is Stage 5 and
 * does not exist yet — no dead link, no fabricated claim).
 *
 * Signature moment = a curved COVER-FLOW carousel of real live-template
 * thumbnails: cards flow across an arc, the centre card upright and forward, the
 * side cards rotated back and dimmed, drifting continuously ("design in
 * motion"). rAF writes each card's transform directly (no per-frame React
 * re-render). Hover pauses; every card is a real live-demo link. Reduced motion
 * and mobile fall back to a native horizontal snap-scroll row.
 *
 * Two destination cards below mirror the two pillars: Templates (live → the
 * working /templates route) and Automations (coming soon).
 */

type Card = { slug: string; title: string };

// Real templates from the live library (public/templates/<slug>/), picked for
// visual variety. Each links to its own live demo.
const cards: Card[] = [
  { slug: "fathom", title: "Fathom" },
  { slug: "utsuwa", title: "Utsuwa" },
  { slug: "arus-coffee", title: "Arus" },
  { slug: "meridian-atelier", title: "Meridian" },
  { slug: "seve", title: "Sève" },
  { slug: "spectra", title: "Spectra" },
  { slug: "resonance", title: "Resonance" },
  { slug: "nexus-architecture", title: "Nexus" },
];

const N = cards.length;

/* ── one carousel card (a framed live-demo thumbnail) ──────────────────── */

function DemoCard({
  card,
  lang,
  liveLabel,
  innerRef,
  className = "",
}: {
  card: Card;
  lang: Lang;
  liveLabel: string;
  innerRef?: (el: HTMLAnchorElement | null) => void;
  className?: string;
}) {
  return (
    <a
      ref={innerRef}
      href={`/templates/${card.slug}/index.html`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${card.title} — ${liveLabel}`}
      className={`group block overflow-hidden rounded-xl border border-black/12 bg-white shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* mini browser bar */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-[#f2f1ef] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff6a2b]" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="ml-1 flex flex-1 items-center gap-1 truncate rounded bg-black/[0.05] px-2 py-0.5 font-mono text-[9px] tracking-[0.04em] text-[#6b6b68]">
          <Lock className="h-2 w-2 shrink-0 opacity-60" />
          <span className="truncate">vixlify.studio/templates/{card.slug}</span>
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={`/templates/${card.slug}/thumb.webp`}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {/* title + live chip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-8">
          <span className="font-display text-lg font-semibold text-white">{card.title}</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] shadow-[0_0_8px_rgba(255,106,43,0.9)]" />
            {liveLabel}
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── the curved cover-flow carousel (desktop) ──────────────────────────── */

function CoverFlow({ lang, liveLabel }: { lang: Lang; liveLabel: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const SPACING = 320; // px between neighbours along the arc
    const DEPTH = 200; // how far side cards recede
    const ANGLE = 38; // rotateY of the nearest neighbours (deg)
    const SPEED = 0.28; // cards advanced per second

    const frame = (t: number) => {
      if (!last) last = t;
      const dt = (t - last) / 1000;
      last = t;
      if (!pausedRef.current) posRef.current += SPEED * dt;

      const pos = posRef.current;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        // signed distance from centre, wrapped so cards recycle seamlessly
        let rel = i - pos;
        rel = ((rel % N) + N) % N;
        if (rel > N / 2) rel -= N;

        const a = Math.abs(rel);
        const visible = a <= 3.2;
        const scale = Math.max(0.55, 1 - a * 0.11);
        el.style.transform =
          `translate(-50%, -50%) translateX(${rel * SPACING}px) ` +
          `translateZ(${-a * DEPTH}px) rotateY(${-rel * ANGLE}deg) scale(${scale})`;
        el.style.opacity = visible ? String(Math.max(0, 1 - a * 0.26)) : "0";
        el.style.zIndex = String(200 - Math.round(a * 10));
        // Every visible card is clickable (not just the dead-centre one). The
        // 3D preserve-3d order + z-index means the front card wins wherever
        // cards overlap, so a click always lands on whatever is visually on top.
        el.style.pointerEvents = visible ? "auto" : "none";
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto hidden h-[440px] w-full select-none md:block"
      style={{ perspective: "1800px" }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* The preserve-3d stage sits on the z=0 plane; cards are translated
          behind it, so a hit-testable container would intercept every click
          before it reaches a card. Keep the container click-transparent and let
          each card opt back in via its own pointer-events (set in the rAF loop);
          an explicit pointer-events on the child overrides none on the parent. */}
      <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {cards.map((card, i) => (
          <div
            key={card.slug}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-[clamp(340px,32vw,440px)] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <DemoCard card={card} lang={lang} liveLabel={liveLabel} />
          </div>
        ))}
      </div>
      {/* edge fades to sell the arc receding into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#e8e8e6] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#e8e8e6] to-transparent"
      />
    </div>
  );
}

/* ── mobile / reduced-motion fallback: native horizontal snap row ──────── */

function ScrollRow({ lang, liveLabel }: { lang: Lang; liveLabel: string }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map((card) => (
        <DemoCard
          key={card.slug}
          card={card}
          lang={lang}
          liveLabel={liveLabel}
          className="w-[80vw] shrink-0 snap-center"
        />
      ))}
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────────── */

export function FreeResources() {
  const { lang } = useLang();
  const t = copy[lang].resources;
  const liveLabel = copy[lang].work.view; // "Live" / "Live"
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const useFlow = !reduce && !mobile;

  return (
    <section id="resources" className="relative overflow-hidden bg-[#e8e8e6] text-[#111111]">
      {/* section divider */}
      <div aria-hidden="true" className="relative h-px w-full bg-black/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-black/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        {/* HEADER — split giant type */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
            {t.eyebrow}
          </span>
          <LineGrow className="max-w-16 bg-black/20" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="font-display font-semibold leading-[0.9] tracking-[-0.035em] text-[clamp(3rem,11vw,9rem)] lg:col-span-7">
            <BlurReveal text={t.headingLead} />
            <BlurReveal
              text={t.headingEmph}
              delay={0.12}
              className="italic [-webkit-text-stroke:1.5px_#111111] text-transparent"
            />
          </h2>
          <Rise
            as="p"
            delay={0.15}
            className="max-w-md text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem] lg:col-span-5"
          >
            {t.intro}
          </Rise>
        </div>

        {/* CAROUSEL */}
        <div className="mt-16 sm:mt-24">
          {useFlow ? (
            <CoverFlow lang={lang} liveLabel={liveLabel} />
          ) : (
            <ScrollRow lang={lang} liveLabel={liveLabel} />
          )}
          <p className="mt-6 hidden text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#6b6b68] md:block">
            {t.hint}
          </p>
        </div>

        {/* DESTINATION CARDS — mirror the two pillars */}
        <div className="mt-20 grid grid-cols-1 border-t border-black/12 sm:mt-28 md:grid-cols-2 md:divide-x md:divide-black/12">
          {/* Templates — live */}
          <Rise className="group py-10 md:pr-12 md:py-12">
            <a href="/templates" className="block">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
                  {t.templates.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.templates.title}
              </h3>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#3a3a38]">
                {t.templates.desc}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#111111]">
                <span className="relative">
                  {t.templates.cta}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#111111] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Rise>

          {/* Automations — honestly coming soon (no link, /automations is Stage 5) */}
          <Rise delay={0.1} className="py-10 md:pl-12 md:py-12">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full border border-black/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
                {t.automations.tag}
              </span>
            </div>
            <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-0.02em] text-[#6b6b68] sm:text-5xl">
              {t.automations.title}
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#3a3a38]">
              {t.automations.desc}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/35">
              {t.automations.cta}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Rise>
        </div>
      </div>
    </section>
  );
}
