import { useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import { useLang, copy, waLink, LangToggle } from "@/i18n";

/**
 * Section 7 — Footer / final CTA (DARK). Closes the page back to dark after the
 * long light act (How it works + Free resources). One last conversion moment
 * (WhatsApp-first, matching the whole site) plus the signature brand sign-off:
 * the giant VIXLIFY wordmark over a hover-reactive EQ line-field — bars idle in
 * a slow wave and rise + warm to ember under the cursor, so the brand reads as
 * something alive. rAF writes bar styles directly (no per-frame React render);
 * reduced motion and touch fall back to a still waveform.
 */

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/vixlifyy/" },
  { label: "Threads", href: "https://www.threads.com/@vixlifyy" },
  { label: "X", href: "https://x.com/vixlifyy" },
];

const TAGLINE = "Websites and automation, built with intent."; // brand line, always English

/** Live Jakarta time (WIB). */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>{time} WIB</span>;
}

/* ── interactive EQ line-field under the wordmark ──────────────────────── */

function BrandEQ() {
  const reduce = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseX = useRef<number>(-9999);
  const [n, setN] = useState(64);

  // bar count scales with width
  useEffect(() => {
    const calc = () => {
      const w = fieldRef.current?.clientWidth ?? window.innerWidth;
      setN(Math.max(28, Math.min(120, Math.floor(w / 15))));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const BASE = 6;
    const IDLE = 12;
    const BOOST = 150;
    const frame = (t: number) => {
      const field = fieldRef.current;
      const w = field?.clientWidth ?? 1;
      const sigma = Math.max(40, w * 0.05);
      const cx = mouseX.current;
      barRefs.current.forEach((el, i) => {
        if (!el) return;
        const bx = ((i + 0.5) / n) * w;
        const d = Math.abs(bx - cx);
        const boost = Math.exp(-(d * d) / (2 * sigma * sigma));
        const idle = (Math.sin(t / 720 + i * 0.34) + 1) / 2;
        const h = BASE + idle * IDLE + boost * BOOST;
        el.style.height = `${h}px`;
        el.style.backgroundColor = `rgba(255, ${Math.round(255 - 149 * boost)}, ${Math.round(
          255 - 212 * boost,
        )}, ${(0.16 + 0.64 * boost).toFixed(3)})`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [n, reduce]);

  return (
    <div
      ref={fieldRef}
      className="flex h-[120px] w-full items-end justify-between gap-[2px] sm:h-[168px]"
      onMouseMove={(e) => {
        const r = fieldRef.current?.getBoundingClientRect();
        if (r) mouseX.current = e.clientX - r.left;
      }}
      onMouseLeave={() => (mouseX.current = -9999)}
      aria-hidden="true"
    >
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="w-full flex-1 rounded-full will-change-[height]"
          style={{
            // still waveform for reduced-motion / first paint
            height: `${6 + ((Math.sin(i * 0.34) + 1) / 2) * 12}px`,
            backgroundColor: "rgba(255,255,255,0.16)",
          }}
        />
      ))}
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────────── */

export function SiteFooter() {
  const { lang } = useLang();
  const t = copy[lang].footer;
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0a0a0a] text-[#ececec]">
      {/* light → dark boundary: hairline + centered crosshair */}
      <div aria-hidden="true" className="relative h-px w-full bg-white/12">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-white/30">
          +
        </span>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pt-24 sm:px-8 sm:pt-32 lg:pt-40">
        {/* FINAL CTA */}
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
            {t.eyebrow}
          </span>
          <LineGrow className="max-w-16 bg-white/20" />
        </div>

        <h2 className="mt-6 max-w-[18ch] font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,8vw,6.5rem)]">
          <BlurReveal text={t.headingLead} />
          <BlurReveal
            text={t.headingEmph}
            delay={0.12}
            className="[-webkit-text-stroke:1.5px_#ececec] text-transparent"
          />
        </h2>

        <Rise as="p" delay={0.15} className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/55 sm:text-[1rem]">
          {t.sub}
        </Rise>

        <Rise delay={0.2} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href={waLink(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-[#f5f5f5] px-7 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" />
            {t.cta}
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-4 font-mono text-[12px] uppercase tracking-[0.16em] text-white/80 transition-colors hover:bg-white/[0.07]"
          >
            {t.secondary}
          </a>
          <span className="font-mono text-[12px] text-white/40">
            {t.email}{" "}
            <a
              href="mailto:hello@vixlify.com"
              className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              hello@vixlify.com
            </a>
          </span>
        </Rise>

        {/* META ROW */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 sm:mt-24 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-white/70">Jakarta</span>
            <LiveClock />
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] shadow-[0_0_8px_rgba(255,106,43,0.9)]" />
              {t.status}
            </span>
          </div>
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white"
              >
                {s.label}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
            <LangToggle />
          </div>
        </div>
      </div>

      {/* BRAND SIGN-OFF — giant wordmark + interactive EQ line-field */}
      <div className="mt-10 px-5 sm:mt-16 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <BrandEQ />
          <h2
            aria-label="Vixlify"
            className="mt-3 select-none font-display font-black leading-[0.8] tracking-[-0.04em] text-[#ececec] text-[clamp(3.5rem,20vw,20rem)]"
          >
            VIXLIFY
          </h2>
        </div>
      </div>

      {/* fine print */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {year} Vixlify Studio</span>
          <span>{TAGLINE}</span>
        </div>
      </div>
    </footer>
  );
}
