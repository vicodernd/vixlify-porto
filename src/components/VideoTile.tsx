import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

const accentMap = {
  cyan: {
    color: "#00E5FF",
    rgb: "0,229,255",
    shadow: "0 40px 120px -40px rgba(0,229,255,0.45)",
  },
  purple: {
    color: "#8B5CF6",
    rgb: "139,92,246",
    shadow: "0 40px 120px -40px rgba(139,92,246,0.45)",
  },
  magenta: {
    color: "#FF2D95",
    rgb: "255,45,149",
    shadow: "0 40px 120px -40px rgba(255,45,149,0.45)",
  },
} as const;

type Props = {
  project: Project;
  index: number;
  featured?: boolean;
};

export function VideoTile({ project, index, featured = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const accent = accentMap[project.accent];

  // Intersection observer — show/pause tile
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // When tile enters viewport: animate counter 0→95, trigger video load
  useEffect(() => {
    if (!visible || loaded) return;

    let rafId: number;
    let startTime: number | null = null;
    const DURATION = 2400;

    function tick(now: number) {
      if (!startTime) startTime = now;
      const p = Math.min(((now - startTime) / DURATION) * 95, 95);
      setLoadProgress(Math.round(p));
      if (p < 95) rafId = requestAnimationFrame(tick);
    }

    // Small delay so <video> mounts before play() is called
    const t = setTimeout(() => {
      videoRef.current?.play().catch(() => {});
      rafId = requestAnimationFrame(tick);
    }, 80);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
    };
  }, [visible, loaded]);

  return (
    <article
      ref={ref}
      className="group relative isolate"
      style={{
        animation: "fadeUp 0.9s ease-out both",
        animationDelay: `${index * 70}ms`,
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-white/15" />
          <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/55">
            {project.client} · {project.year}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-opacity ${playing ? "opacity-100 animate-pulse-ring" : "opacity-40"}`}
            style={{ background: accent.color, boxShadow: `0 0 10px ${accent.color}` }}
            aria-hidden="true"
          />
          <span className="font-display text-[10px] uppercase tracking-[0.28em] text-white/55">
            {playing ? "Live loop" : "Standby"}
            {project.duration ? ` · ${project.duration}` : ""}
          </span>
        </div>
      </div>

      <a
        href={project.href ?? "#"}
        className="block relative overflow-hidden rounded-[20px] bg-[#0b0f1f] ring-1 ring-white/10 transition-transform duration-700 ease-out will-change-transform group-hover:-translate-y-1"
        style={{ boxShadow: accent.shadow }}
      >
        <div className="relative p-2 sm:p-3">
          <div
            className="relative w-full overflow-hidden rounded-[14px]"
            style={{
              aspectRatio: "3 / 2",
              background: `radial-gradient(80% 60% at 30% 20%, rgba(${accent.rgb},0.18) 0%, transparent 60%), linear-gradient(135deg, #0a0d1a 0%, #131831 100%)`,
            }}
          >
            {/* Poster — shown until video loads */}
            <img
              src={project.poster}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                loaded ? "opacity-0" : "opacity-100"
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Percentage loading overlay */}
            {visible && !loaded && (
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
                {/* Subtle dark scrim so counter is readable over poster */}
                <div className="absolute inset-0 bg-[#05070f]/55" />

                {/* Counter */}
                <div className="relative flex items-end gap-1 leading-none tabular-nums">
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2.8rem, 7vw, 5rem)",
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      color: accent.color,
                      textShadow: `0 0 30px ${accent.color}70`,
                    }}
                  >
                    {loadProgress.toString().padStart(3, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 600,
                      fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
                      letterSpacing: "-0.02em",
                      paddingBottom: "0.2em",
                      color: accent.color,
                      opacity: 0.6,
                    }}
                  >
                    %
                  </span>
                </div>

                {/* Label */}
                <span
                  className="relative mt-2"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Loading
                </span>

                {/* Progress bar at bottom of frame */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                  <div
                    className="h-full origin-left transition-transform duration-100"
                    style={{
                      transform: `scaleX(${loadProgress / 100})`,
                      background: `linear-gradient(90deg, ${accent.color}cc, ${accent.color})`,
                      boxShadow: `0 0 8px ${accent.color}`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Video — only mounts when tile is visible */}
            {visible && (
              <video
                ref={videoRef}
                poster={project.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${project.title} preview reel`}
                onLoadedData={() => {
                  setLoadProgress(100);
                  setTimeout(() => {
                    setLoaded(true);
                    videoRef.current
                      ?.play()
                      .then(() => setPlaying(true))
                      .catch(() => {});
                  }, 300);
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={project.video.replace(".mp4", ".webm")} type="video/webm" />
                <source src={project.video} type="video/mp4" />
              </video>
            )}

            <Corner pos="tl" color={accent.color} />
            <Corner pos="tr" color={accent.color} />
            <Corner pos="bl" color={accent.color} />
            <Corner pos="br" color={accent.color} />

            <div
              className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: `inset 0 0 0 1px ${accent.color}66` }}
              aria-hidden="true"
            />
          </div>

          <div className="relative mt-2 h-px w-full overflow-hidden bg-white/10">
            <span
              className="absolute inset-y-0 left-0 w-1/3"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent.color}, transparent)`,
                animation: playing ? "scrub 6s linear infinite" : "none",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </a>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-xl">
          <h3
            className={`font-display font-semibold tracking-tight text-white ${
              featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm text-white/60">{project.role}</p>
          {project.note && (
            <p className="mt-3 max-w-md text-sm text-white/45">{project.note}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Corner({ pos, color }: { pos: "tl" | "tr" | "bl" | "br"; color: string }) {
  const base = "pointer-events-none absolute h-4 w-4 opacity-60";
  const map = {
    tl: "top-2 left-2 border-t border-l",
    tr: "top-2 right-2 border-t border-r",
    bl: "bottom-2 left-2 border-b border-l",
    br: "bottom-2 right-2 border-b border-r",
  } as const;
  return <span aria-hidden="true" className={`${base} ${map[pos]}`} style={{ borderColor: color }} />;
}
