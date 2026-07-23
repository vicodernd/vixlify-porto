import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

/** Resolve a motion component for a tag/component without the deprecated
 *  motion() call: string tags map to motion.div/span/p/etc. Return type is
 *  `any` because @react-three/fiber's global JSX augmentation otherwise makes
 *  a polymorphic motion component infer `children: never` (same cast as
 *  AnimatedText / RevealOnView). */
function motionOf(as: ElementType): any {
  if (typeof as === "string") {
    return ((motion as unknown as Record<string, ElementType>)[as] ?? motion.div);
  }
  return motion.create(as);
}

/**
 * Motion layer for the v3 Trionn-caliber rebuild.
 *
 * Trionn's signature is not "fade in": headlines RESOLVE FROM BLUR. Words are
 * heavily motion-blurred and offset, then sharpen and settle in a staggered
 * sweep. Everything below is built around that one idea, plus quieter rise /
 * mono-label reveals for supporting copy. All gated behind
 * prefers-reduced-motion (renders instant + sharp when the user opts out).
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── BlurReveal ──────────────────────────────────────────────────────────
   The headline move. Splits text into words; each word sweeps in from a
   heavy horizontal blur + downward offset, staggered left-to-right. Use for
   display headlines. Preserves manual line breaks passed as "\n". */

export function BlurReveal({
  text,
  as = "span",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.08,
  once = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const M = motionOf(as);

  const lines = text.split("\n");

  if (reduce) {
    return <M className={className}>{text}</M>;
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, filter: "blur(16px)", y: "0.4em", x: -14 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: "0em",
      x: 0,
      transition: { duration: 1.05, ease: EASE },
    },
  };

  return (
    <M
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => (
            <span
              key={wi}
              className={`inline-block overflow-hidden align-baseline ${wordClassName}`}
              style={{ paddingBottom: "0.08em" }}
            >
              <motion.span variants={word} className="inline-block will-change-[filter,transform]">
                {w}
              </motion.span>
              {wi < line.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ))}
    </M>
  );
}

/* ── Rise ──────────────────────────────────────────────────────────────
   Quiet fade + upward settle for supporting copy, CTAs, cards. */

export function Rise({
  children,
  as = "div",
  className = "",
  delay = 0,
  y = 20,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const M = motionOf(as);
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/* ── LineGrow ────────────────────────────────────────────────────────────
   A hairline that draws itself in (scaleX 0 -> 1) on view. Trionn uses these
   as section dividers and under CTAs. */

export function LineGrow({
  className = "",
  delay = 0,
  origin = "left",
}: {
  className?: string;
  delay?: number;
  origin?: "left" | "center" | "right";
}) {
  const reduce = useReducedMotion();
  const originClass =
    origin === "center" ? "origin-center" : origin === "right" ? "origin-right" : "origin-left";
  if (reduce) return <span className={`block h-px w-full ${className}`} />;
  return (
    <motion.span
      className={`block h-px w-full ${originClass} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
}
