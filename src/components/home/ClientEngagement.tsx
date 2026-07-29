import { Lock, MessageCircle } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, waLink } from "@/i18n";

/**
 * Client Engagement (DARK). Sits right after Selected Work: where that
 * section proves craft through live demos, this one proves it through a real
 * paid engagement that can never be a live demo. Confidentiality is the whole
 * point, so the visual language is a "case file" instead of a "live screen":
 * a redacted client name, a mono dossier strip, and value framed as what this
 * class of system targets, not a specific claim about this client's results
 * (nothing is measured in production yet, the client's own team still has to
 * wire the live database). Numbers asserted here are either facts about the
 * build itself (screens, tests, models) or clearly labeled external
 * benchmarks, never a fabricated outcome for this engagement.
 */

function Cross({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-mono text-white/15 ${className}`}
    >
      +
    </span>
  );
}

function Screenshot({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff6a2b]/70" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
        <Lock className="ml-2 h-3 w-3 text-white/30" strokeWidth={2} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</span>
      </div>
      <img src={src} alt="" aria-hidden="true" className="block w-full" loading="lazy" />
    </div>
  );
}

function RedactedBar() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-[1.6em] w-32 items-center justify-center overflow-hidden rounded-[2px] bg-white/10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 6px, rgba(255,255,255,0.11) 6px 12px)",
      }}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">redacted</span>
    </span>
  );
}

export function ClientEngagement() {
  const { lang } = useLang();
  const t = copy[lang].engagements;
  const ctaHref = waLink(lang);

  return (
    <section id="engagements" className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      <div className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32 lg:pt-40">
        <Cross className="-top-4 left-4 text-sm lg:left-8" />
        <Cross className="-top-4 right-4 text-sm lg:right-8" />

        {/* header */}
        <div className="flex flex-wrap items-center gap-3">
          <Lock className="h-3.5 w-3.5 text-white/45" strokeWidth={1.75} aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            {t.eyebrow}
          </span>
          <LineGrow className="max-w-16 bg-white/15" />
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff6a2b]/80">
            {t.confidential}
          </span>
        </div>

        <h2 className="mt-6 max-w-[16ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.75rem,9vw,7.5rem)]">
          <BlurReveal text={`${t.headingLead} ${t.headingEmph}`} />
        </h2>

        <Rise
          as="p"
          delay={0.1}
          className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 sm:text-[1rem]"
        >
          {t.intro}
        </Rise>

        <Rise delay={0.12} className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2">
          <Screenshot src="/engagement/sop-overview.jpg" label={t.screens.overviewLabel} />
          <Screenshot src="/engagement/sop-decisions.jpg" label={t.screens.decisionsLabel} />
        </Rise>
        <Rise
          as="p"
          delay={0.16}
          className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-white/35"
        >
          {t.screens.caption}
        </Rise>

        {/* dossier meta strip */}
        <Rise
          delay={0.15}
          className="mt-14 grid grid-cols-2 divide-y divide-white/10 border-y border-white/10 sm:mt-20 lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        >
          <div className="px-1 py-6 sm:px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              {t.meta.client}
            </div>
            <div className="mt-2">
              <RedactedBar />
            </div>
          </div>
          <div className="px-1 py-6 sm:px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              {t.meta.sector}
            </div>
            <div className="mt-2 text-[13px] font-medium text-white/80">{t.meta.sectorValue}</div>
          </div>
          <div className="px-1 py-6 sm:px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              {t.meta.scope}
            </div>
            <div className="mt-2 text-[13px] font-medium text-white/80">{t.meta.scopeValue}</div>
          </div>
          <div className="px-1 py-6 sm:px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
              {t.meta.status}
            </div>
            <div className="mt-2 text-[13px] font-medium text-white/80">{t.meta.statusValue}</div>
          </div>
        </Rise>

        {/* engine stat strip */}
        <div className="mt-14 grid grid-cols-2 gap-y-8 sm:mt-16 lg:grid-cols-4 lg:gap-x-6">
          {t.stats.map((s, i) => (
            <Rise
              key={s.label}
              delay={0.05 * i}
              className="px-1 sm:px-6 lg:border-l lg:border-white/10 lg:first:border-l-0 lg:first:pl-0"
            >
              <div className="font-display text-4xl font-semibold tracking-[-0.02em] text-[#ececec] sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 max-w-[20ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-white/45">
                {s.label}
              </div>
            </Rise>
          ))}
        </div>
      </div>

      {/* value grid */}
      <div className="relative mx-auto mt-20 max-w-[1500px] sm:mt-28">
        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {t.values.map((v) => (
            <div key={v.index} className="group relative px-5 py-14 sm:px-8 md:px-10 lg:px-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-4 font-display text-[5.5rem] font-bold leading-none text-white/[0.04] transition-transform duration-500 group-hover:-translate-y-1 sm:text-[7rem] lg:left-6"
              >
                {v.index}
              </span>
              <div className="relative pt-20 sm:pt-24">
                <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#ececec] sm:text-[1.75rem]">
                  {v.title}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* highlight + benchmark + cta */}
      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-16 sm:px-8 sm:pb-32 lg:pb-40">
        <Rise
          as="p"
          className="max-w-3xl font-display text-xl font-medium leading-snug tracking-[-0.01em] text-white/85 sm:text-2xl"
        >
          {t.highlight}
        </Rise>

        <Rise
          delay={0.1}
          as="p"
          className="mt-6 max-w-2xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-white/35"
        >
          {t.benchmark}
        </Rise>

        <Rise delay={0.15} className="mt-12 flex flex-wrap items-center gap-6">
          <span className="text-[15px] text-white/60">{t.ctaLine}</span>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#ececec]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="relative">
              {t.cta}
              <span className="absolute inset-x-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#ececec] transition-transform duration-300 group-hover/cta:scale-x-100" />
            </span>
            <span aria-hidden="true" className="transition-transform group-hover/cta:translate-x-1">
              →
            </span>
          </a>
        </Rise>
      </div>
    </section>
  );
}
