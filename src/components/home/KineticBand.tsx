import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Rise } from "@/components/motion/reveal";

/**
 * Section 2 — Kinetic keyword band (DARK). Trionn's frame-044 beat: a dark
 * glossy 3D object with an ember rim-light sits in fog behind a giant
 * horizontally-scrolling word band, framed by mono micro-labels. Words are the
 * honest positioning of the two pillars (Design / Build / Automate). The mark
 * render blends into the near-black ground via screen blend so only its lit
 * edges + haze glow through (no pasted rectangle).
 */

const WORDS = ["Design", "Build", "Automate"];

function Marquee() {
  // Two identical sequences so the -50% translate loops seamlessly.
  const seq = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-[0.18em] font-display text-[19vw] font-semibold uppercase leading-none tracking-[-0.03em] text-[#f3f3f3] lg:text-[15vw]">
            {w}
          </span>
          <span className="px-[0.1em] font-display text-[10vw] font-light leading-none text-white/25 lg:text-[7vw]">
            +
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 flex w-full select-none overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap will-change-transform">
        {seq}
        {seq}
      </div>
    </div>
  );
}

export function KineticBand() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle vertical drift + scale on the mark as the band passes through view.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a0a0a] py-24"
    >
      {/* dark glossy mark in fog, blended into the ground. Animated loop
          (Higgsfield img-to-video) so the object breathes: fog drifts, the
          ember rim-light pulses, slow rotation. Poster = the original still, so
          it looks identical before the video loads. Reduced-motion keeps the
          still. Same mask + screen blend so no rectangle shows. */}
      {reduce ? (
        <motion.img
          src="/kinetic/mark-3d.png"
          alt=""
          aria-hidden="true"
          style={{
            y,
            scale,
            WebkitMaskImage:
              "radial-gradient(60% 62% at 50% 50%, #000 34%, transparent 74%)",
            maskImage:
              "radial-gradient(60% 62% at 50% 50%, #000 34%, transparent 74%)",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(94vw,940px)] -translate-x-1/2 -translate-y-1/2 opacity-90 mix-blend-screen"
        />
      ) : (
        <motion.video
          src="/kinetic/mark-3d.mp4"
          poster="/kinetic/mark-3d.png"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{
            y,
            scale,
            WebkitMaskImage:
              "radial-gradient(60% 62% at 50% 50%, #000 34%, transparent 74%)",
            maskImage:
              "radial-gradient(60% 62% at 50% 50%, #000 34%, transparent 74%)",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(150vw,1500px)] -translate-x-1/2 -translate-y-1/2 object-cover opacity-90 mix-blend-screen"
        />
      )}
      {/* ember bloom anchored to the object */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(255,106,43,0.10) 0%, transparent 60%)",
        }}
      />

      {/* top-left mono label */}
      <Rise className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.3em] text-white/45 sm:text-[11px]">
          Design with intent.
          <br />
          Built to work.
        </p>
      </Rise>

      {/* the giant scrolling band */}
      <div className="my-10 sm:my-14">
        <Marquee />
      </div>

      {/* bottom ✦ line, brand tagline */}
      <Rise
        delay={0.15}
        className="mx-auto flex w-full max-w-[1400px] items-center justify-center px-5 sm:px-8"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 sm:text-[11px]">
          ✦ Every pixel has a purpose.
        </span>
      </Rise>
    </section>
  );
}
