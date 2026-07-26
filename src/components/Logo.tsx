interface LogoMarkProps {
  className?: string;
  theme?: "dark" | "light";
}

/**
 * Vixlify mark v3 — "Lift Arrow" (final, locked): one solid upward chevron,
 * flat fill (no outline), with a single ember wedge lit at the fold. Adapts
 * to a light ground (e.g. the /templates page) via `theme`.
 */
export function LogoMark({ className = "h-7 w-7", theme = "dark" }: LogoMarkProps) {
  const ink = theme === "light" ? "#111111" : "#ECECEC";
  const ember = theme === "light" ? "#E5501A" : "#FF6A2B";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      role="img"
      aria-label="Vixlify"
    >
      <path
        d="M32 14 L54 50 L42 50 L32 33 L22 50 L10 50 Z"
        fill={ink}
      />
      <path d="M32 33 L42 50 L32 50 Z" fill={ember} />
    </svg>
  );
}

interface LogoProps {
  href?: string;
  theme?: "dark" | "light";
}

/** Full nav lockup: Lift Mark + VIXLIFY wordmark. */
export function Logo({ href = "#top", theme = "dark" }: LogoProps) {
  return (
    <a href={href} className="flex items-center gap-2.5">
      <LogoMark className="h-7 w-7" theme={theme} />
      <span
        className={`font-display text-sm font-semibold tracking-[0.18em] ${
          theme === "light" ? "text-[#111111]" : "text-[#ececec]"
        }`}
      >
        VIXLIFY
      </span>
    </a>
  );
}
