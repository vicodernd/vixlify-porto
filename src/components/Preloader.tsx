import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";

/**
 * Trionn-style preloader (v3). LIGHT tone (Vico's call): a warm near-white
 * field framed by blueprint corner crosshairs, with a mono counter ticking to
 * 100. On completion the whole light panel lifts away upward to reveal the dark
 * hero beneath, giving the signature light -> dark opening.
 */

const EASE = [0.76, 0, 0.24, 1] as const;

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute text-[var(--color-paper-dim)] ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const DURATION = reduce ? 300 : 1700;
    let raf = 0;
    let start = 0;

    if (!reduce) {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / DURATION);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out; last digits slow
        setCount(Math.round(eased * 100));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    // Timer-driven failsafes so the preloader always finishes and lifts even if
    // rAF is throttled (e.g. the tab was backgrounded during load).
    const doneAt = setTimeout(() => {
      setCount(100);
      setDone(true);
    }, DURATION + 250);
    const completeAt = setTimeout(() => onComplete(), DURATION + 1300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneAt);
      clearTimeout(completeAt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[var(--color-paper)] px-5 py-5 text-[var(--color-paper-ink)] sm:px-8 sm:py-7"
      initial={{ y: 0 }}
      animate={done ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={() => done && onComplete()}
    >
      <Crosshair className="left-4 top-4 sm:left-7 sm:top-7" />
      <Crosshair className="right-4 top-4 sm:right-7 sm:top-7" />
      <Crosshair className="bottom-4 left-4 sm:bottom-7 sm:left-7" />
      <Crosshair className="bottom-4 right-4 sm:bottom-7 sm:right-7" />

      {/* top row: mark + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6 [&_path]:stroke-[#111] [&_circle]:fill-[#111]" />
          <span className="font-display text-xs font-semibold tracking-[0.22em]">
            VIXLIFY
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-paper-dim)]">
          Studio
        </span>
      </div>

      {/* the counter */}
      <div className="flex items-end justify-between">
        <span className="font-display text-[22vw] font-semibold leading-[0.8] tracking-[-0.04em] sm:text-[16vw] lg:text-[12rem]">
          {count}
        </span>
        <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-paper-dim)] sm:mb-6">
          Loading
        </span>
      </div>

      {/* bottom row: bilingual-agnostic tagline (always EN per brand rule) */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-paper-dim)]">
        <span>Websites + AI automation</span>
        <span className="hidden sm:inline">Jakarta</span>
      </div>
    </motion.div>
  );
}
