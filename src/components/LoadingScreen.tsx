import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Design", "Develop", "Launch"];
const EASE = [0.4, 0, 0.2, 1] as const;

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (wordIndex >= WORDS.length - 1) return;
    const id = setTimeout(() => setWordIndex((i) => i + 1), 900);
    return () => clearTimeout(id);
  }, [wordIndex]);

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const DURATION = 2700;

    function tick(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const next = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(next);
      if (next < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onCompleteRef.current(), 400);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const counterValue = Math.round(progress).toString().padStart(3, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: "#05070f" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* Subtle radial glow — matches Hero section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Top-left label */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2.5"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#00E5FF", boxShadow: "0 0 6px #00E5FF" }}
        />
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Vixlify Studio
        </span>
      </motion.div>

      {/* Center — rotating words */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3rem, 9vw, 7rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 tabular-nums"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(4rem, 11vw, 9rem)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Glowing digit layer */}
        <span
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(139,92,246,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {counterValue}
        </span>
      </motion.div>

      {/* Progress bar — bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #00E5FF 0%, #8B5CF6 60%, #FF2D95 100%)",
            boxShadow: "0 0 12px rgba(0, 229, 255, 0.4)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
