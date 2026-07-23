interface LogoMarkProps {
  className?: string;
  theme?: "dark" | "light";
}

/**
 * Vixlify mark v2 — "Ascending Nodes" (Concept A): a flow of connected nodes
 * stepping upward, the final node lit as the outcome (build + automate). Pure
 * monochrome; adapts to a light ground (e.g. the /templates page) via `theme`.
 */
export function LogoMark({ className = "h-7 w-7", theme = "dark" }: LogoMarkProps) {
  const primary = theme === "light" ? "#111111" : "#ECECEC";
  const node = theme === "light" ? "#111111" : "#F5F5F5";
  const mid = theme === "light" ? "#6B6B68" : "#8C8C8C";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      role="img"
      aria-label="Vixlify"
    >
      <path
        d="M12 50 L32 34 L52 14"
        stroke={primary}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 34 L44 40"
        stroke={mid}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="52" cy="14" r="7" fill={node} />
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
