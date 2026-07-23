import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, waLink } from "@/i18n";

/**
 * Section 3 — Two Pillars / Services (DARK, atmospheric). The closing beat of
 * the dark act (Hero → Kinetic → Pillars) before Selected Work flips to light.
 *
 * Trionn's dark services act: a textured object floating in fog per service,
 * giant service words, mono spec labels. Honest Vixlify version: two equal
 * pillars (Websites / AI Automation), each with its own material object
 * (Higgsfield, same dark-glossy + ember-rim + fog language as the Kinetic
 * mark), blended into the near-black ground via screen blend + radial mask so
 * no rectangle shows. Both fully visible (this is a conversion page) and the
 * copy keeps the two services independent.
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

type Pillar = {
  label: string;
  title: string;
  desc: string;
  points: readonly string[];
};

function PillarBlock({
  pillar,
  index,
  img,
  ctaHref,
  cta,
}: {
  pillar: Pillar;
  index: number;
  img: string;
  ctaHref: string;
  cta: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [1.08, 1, 1.08],
  );

  return (
    <div ref={ref} className="group relative px-5 py-16 sm:px-8 md:px-12 lg:px-16">
      {/* ember bloom anchored behind the object */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(45% 45% at 60% 35%, rgba(255,106,43,0.12) 0%, transparent 65%)",
        }}
      />

      {/* floating material object, blended into the ground */}
      <motion.img
        src={img}
        alt=""
        aria-hidden="true"
        style={{
          y,
          scale,
          WebkitMaskImage:
            "radial-gradient(58% 60% at 55% 42%, #000 30%, transparent 76%)",
          maskImage:
            "radial-gradient(58% 60% at 55% 42%, #000 30%, transparent 76%)",
        }}
        className="pointer-events-none absolute -top-6 right-2 z-0 w-[76%] max-w-[420px] opacity-80 mix-blend-screen sm:right-6 md:right-4 lg:right-8"
      />

      {/* giant ghost index */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-6 z-0 font-display text-[8rem] font-bold leading-none text-white/[0.04] transition-transform duration-500 group-hover:-translate-y-1 sm:text-[11rem] lg:left-8"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* content */}
      <div className="relative z-10 pt-[38vw] sm:pt-[30vw] md:pt-[22vw] lg:pt-[16vw]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
            {pillar.label}
          </span>
          <LineGrow className="max-w-16 bg-white/15" />
        </div>

        <h3 className="mt-5 font-display font-semibold leading-[0.95] tracking-[-0.03em] text-[clamp(2.5rem,5.5vw,4.5rem)] text-[#ececec]">
          <BlurReveal text={pillar.title} />
        </h3>

        <Rise as="p" delay={0.1} className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[1rem]">
          {pillar.desc}
        </Rise>

        <ul className="mt-10 space-y-4">
          {pillar.points.map((pt) => (
            <li
              key={pt}
              className="flex items-center gap-4 font-mono text-[13px] uppercase tracking-[0.06em] text-white/55 transition-colors hover:text-white/90"
            >
              <span
                aria-hidden="true"
                className="h-px w-6 shrink-0 bg-[#ff6a2b]/70 transition-all duration-300 group-hover:w-10"
              />
              {pt}
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cta mt-12 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#ececec]"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="relative">
            {cta}
            <span className="absolute inset-x-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#ececec] transition-transform duration-300 group-hover/cta:scale-x-100" />
          </span>
          <span aria-hidden="true" className="transition-transform group-hover/cta:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  );
}

export function Pillars() {
  const { lang } = useLang();
  const t = copy[lang].pillars;
  const ctaHref = waLink(lang);

  return (
    <section id="services" className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      <div className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32 lg:pt-40">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            {t.eyebrow}
          </span>
          <LineGrow className="max-w-16 bg-white/15" />
        </div>

        <h2 className="mt-6 max-w-[15ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.75rem,9vw,7.5rem)]">
          <BlurReveal text={`${t.headingLead} ${t.headingEmph}`} />
        </h2>
      </div>

      {/* two pillars, split by a hairline */}
      <div className="relative mx-auto mt-10 max-w-[1500px] sm:mt-16">
        {/* blueprint corner marks */}
        <Cross className="-top-4 left-4 text-sm lg:left-8" />
        <Cross className="-top-4 right-4 text-sm lg:right-8" />

        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
          <PillarBlock pillar={t.web} index={0} img="/pillars/web.png" ctaHref={ctaHref} cta={t.cta} />
          <PillarBlock pillar={t.auto} index={1} img="/pillars/auto.png" ctaHref={ctaHref} cta={t.cta} />
        </div>
      </div>

      {/* independence note */}
      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-16 sm:px-8 sm:pb-32 lg:pb-40">
        <Rise
          as="p"
          className="max-w-2xl font-mono text-[12px] uppercase leading-relaxed tracking-[0.14em] text-white/40"
        >
          {t.independence}
        </Rise>
      </div>
    </section>
  );
}
