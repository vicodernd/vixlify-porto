import { useState } from "react";
import { ChevronDown, Lock, MessageCircle } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, waLink } from "@/i18n";

/**
 * Client Engagements (DARK, plural). Sits right after Selected Work: where
 * that section proves craft through live demos, this one proves it through
 * real engagements that go deeper than a landing-page demo. Visual language
 * is a "case file": a mono dossier strip, stat facts, value framed as outcomes.
 * Confidentiality is PER ENTRY, not a section-wide rule (Vico, 2026-07-29):
 * some engagements are under NDA (client name redacted, a Lock badge on the
 * status pill) and some are named openly with real screenshots, depending on
 * what that client allows. Numbers asserted here are either facts about the
 * build itself (screens, tests, models) or clearly labeled external
 * benchmarks, never a fabricated outcome for any engagement.
 *
 * ACCORDION, one case open at a time (Vico's call, 2026-07-29, since more
 * engagements are coming and a full case-file per entry would make the page
 * grow without bound). Add a new engagement by appending to
 * `copy.<lang>.engagements.list` in src/i18n.tsx; nothing else has to change.
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
      <div className="flex max-h-[420px] items-start justify-center overflow-hidden bg-black/20">
        <img src={src} alt="" aria-hidden="true" className="block w-auto max-h-[420px]" loading="lazy" />
      </div>
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

type Engagement = {
  id: string;
  confidential: boolean;
  clientValue?: string;
  sectorValue: string;
  scopeValue: string;
  statusValue: string;
  stats: readonly { value: string; label: string }[];
  values: readonly { index: string; title: string; desc: string }[];
  screens: readonly { src: string; label: string }[];
  screensCaption: string;
  highlight: string;
  benchmark: string;
};

function EngagementItem({
  item,
  index,
  open,
  onToggle,
  fields,
}: {
  item: Engagement;
  index: number;
  open: boolean;
  onToggle: () => void;
  fields: { client: string; sector: string; scope: string; status: string };
}) {
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-white/15 first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`group -mx-5 flex w-[calc(100%+2.5rem)] items-center gap-4 rounded-2xl px-5 py-7 text-left transition-colors duration-300 hover:bg-white/[0.04] sm:-mx-8 sm:w-[calc(100%+4rem)] sm:gap-6 sm:px-8 sm:py-9 ${
          open ? "bg-white/[0.04]" : ""
        }`}
      >
        <span
          className={`font-display text-xl font-bold transition-colors duration-300 sm:text-2xl ${
            open ? "text-[#ff6a2b]" : "text-white/30 group-hover:text-[#ff6a2b]/70"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl font-bold tracking-[-0.01em] text-[#ececec] sm:text-3xl">
            {item.sectorValue}
          </span>
          <span className="mt-1.5 block truncate font-mono text-[11px] uppercase tracking-[0.1em] text-white/45 sm:text-[12px]">
            {item.scopeValue}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 sm:inline-flex">
          {item.confidential && <Lock className="h-2.5 w-2.5" aria-hidden="true" />}
          {item.statusValue}
        </span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            open
              ? "border-[#ff6a2b] bg-[#ff6a2b]/10 text-[#ff6a2b]"
              : "border-white/20 text-white/60 group-hover:border-[#ff6a2b]/50 group-hover:text-[#ff6a2b]"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: reduce ? "none" : "grid-template-rows 480ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-14 sm:pb-16">
            {/* dossier meta strip */}
            <div className="grid grid-cols-2 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              <div className="px-1 py-6 sm:px-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {fields.client}
                </div>
                <div className="mt-2">
                  {item.confidential ? (
                    <RedactedBar />
                  ) : (
                    <span className="text-[13px] font-medium text-white/80">{item.clientValue}</span>
                  )}
                </div>
              </div>
              <div className="px-1 py-6 sm:px-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {fields.sector}
                </div>
                <div className="mt-2 text-[13px] font-medium text-white/80">{item.sectorValue}</div>
              </div>
              <div className="px-1 py-6 sm:px-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {fields.scope}
                </div>
                <div className="mt-2 text-[13px] font-medium text-white/80">{item.scopeValue}</div>
              </div>
              <div className="px-1 py-6 sm:px-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {fields.status}
                </div>
                <div className="mt-2 text-[13px] font-medium text-white/80">{item.statusValue}</div>
              </div>
            </div>

            {/* stat strip */}
            <div className="mt-10 grid grid-cols-2 gap-y-8 sm:mt-12 lg:grid-cols-4 lg:gap-x-6">
              {item.stats.map((s) => (
                <div key={s.label} className="px-1 sm:px-6 lg:border-l lg:border-white/10 lg:first:border-l-0 lg:first:pl-0">
                  <div className="font-display text-4xl font-semibold tracking-[-0.02em] text-[#ececec] sm:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 max-w-[20ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-white/45">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* value grid */}
            <div className="mt-12 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:mt-14 md:grid-cols-3 md:divide-x md:divide-y-0">
              {item.values.map((v) => (
                <div key={v.index} className="group relative px-1 py-10 sm:px-6 md:px-8">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-3 font-display text-[4rem] font-bold leading-none text-white/[0.04] sm:left-2 sm:text-[5.5rem]"
                  >
                    {v.index}
                  </span>
                  <div className="relative pt-14 sm:pt-16">
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-[#ececec] sm:text-2xl">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/55">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* screenshots */}
            {item.screens.length > 0 && (
              <>
                <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 lg:grid-cols-2">
                  {item.screens.map((s) => (
                    <Screenshot key={s.src} src={s.src} label={s.label} />
                  ))}
                </div>
                <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-white/35">
                  {item.screensCaption}
                </p>
              </>
            )}

            {/* highlight + benchmark */}
            <p className="mt-12 max-w-3xl font-display text-lg font-medium leading-snug tracking-[-0.01em] text-white/85 sm:mt-14 sm:text-xl">
              {item.highlight}
            </p>
            <p className="mt-5 max-w-2xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-white/35">
              {item.benchmark}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientEngagement() {
  const { lang } = useLang();
  const t = copy[lang].engagements;
  const ctaHref = waLink(lang);
  const [openId, setOpenId] = useState<string | null>(null);

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
      </div>

      {/* accordion list */}
      <div className="mx-auto mt-14 max-w-[1500px] px-5 sm:mt-20 sm:px-8">
        {t.list.map((item, i) => (
          <EngagementItem
            key={item.id}
            item={item}
            index={i}
            open={openId === item.id}
            onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
            fields={t.fields}
          />
        ))}
      </div>

      {/* shared cta */}
      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-16 sm:px-8 sm:pb-32 lg:pb-40">
        <Rise delay={0.15} className="flex flex-wrap items-center gap-6">
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
