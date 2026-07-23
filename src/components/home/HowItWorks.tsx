import { motion, useReducedMotion } from "framer-motion";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy } from "@/i18n";

/**
 * Section 5 — How it works (LIGHT "paper", continues the light act after
 * Selected Work). A 3-step method (Scope / Build / Launch & handover) that
 * lowers the risk for cold Meta-Ads traffic: the visitor sees the plan and the
 * price before anything is built.
 *
 * v3 Trionn devices: a self-drawing timeline hairline threading three node dots
 * (horizontal on desktop, vertical on mobile), giant ghost indices, mono STEP
 * labels, BlurReveal titles, one restrained ember touch (the node cores). No
 * Higgsfield — pure type + line work. Reuses the v3 motion system (reveal.tsx),
 * NOT the retired Kinetics/RevealOnView. id="approach" keeps the nav anchor.
 *
 * The closing line reinforces the locked two-independent-pillars rule: the same
 * three steps apply whether the client takes a website, an automation, or both.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function HowItWorks() {
  const { lang } = useLang();
  const t = copy[lang].how;
  const reduce = useReducedMotion();

  return (
    <section id="approach" className="relative bg-[#e8e8e6] text-[#111111]">
      {/* section divider: hairline + centered crosshair */}
      <div aria-hidden="true" className="relative h-px w-full bg-black/10">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-black/25">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        {/* HEADER — heading left, intro right (variety vs Selected Work's stacked header) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
                {t.eyebrow}
              </span>
              <LineGrow className="max-w-16 bg-black/20" />
            </div>

            <h2 className="mt-6 max-w-[14ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,8vw,6.5rem)]">
              <BlurReveal text={t.headingLead} />
              <BlurReveal
                text={t.headingEmph}
                delay={0.15}
                className="[-webkit-text-stroke:1.5px_#111111] text-transparent"
              />
            </h2>
          </div>

          <Rise
            as="p"
            delay={0.15}
            className="max-w-sm text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem] lg:col-span-4"
          >
            {t.intro}
          </Rise>
        </div>

        {/* STEPS with a self-drawing timeline */}
        <div className="relative mt-20 sm:mt-28 lg:mt-36">
          {/* desktop: horizontal timeline drawing left → right */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-black/15 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.2, ease: EASE }}
            />
          )}
          {/* mobile: vertical timeline drawing top → bottom */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-[7px] top-[7px] w-px origin-top bg-black/15 md:hidden"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.2, ease: EASE }}
            />
          )}

          <ol className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} className="group relative pl-8 md:pl-0">
                {/* node dot on the timeline: ink ring + ember core (the one accent) */}
                <span className="absolute left-0 top-0 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-black/30 bg-[#e8e8e6] md:static">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] transition-transform duration-500 group-hover:scale-[1.35]" />
                </span>

                {/* giant ghost index */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-8 right-0 font-display text-[6rem] font-bold leading-none text-black/[0.055] sm:text-[8rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative mt-0 md:mt-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
                    {s.label}
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                    <BlurReveal text={s.title} />
                  </h3>
                  <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#3a3a38]">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* closing bridge — reinforces the two-independent-pillars rule */}
          <div className="mt-20 flex items-center gap-3 sm:mt-28">
            <span aria-hidden="true" className="font-mono text-[11px] text-[#ff6a2b]">
              ✦
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b6b68]">
              {t.applies}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
