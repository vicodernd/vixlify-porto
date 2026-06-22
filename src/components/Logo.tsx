interface LogoMarkProps {
  className?: string;
}

/**
 * Vixlify "Lift Mark" — three ascending chevrons (amplify / lift).
 * Refined two-stop cyan → violet gradient, no badge container.
 */
export function LogoMark({ className = "h-7 w-7" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      role="img"
      aria-label="Vixlify"
    >
      <defs>
        <linearGradient id="vixlify-lift" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#vixlify-lift)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 12 L44 24 M32 12 L20 24" />
        <path d="M32 30 L51 44 M32 30 L13 44" />
        <path d="M32 48 L56 61 M32 48 L8 61" />
      </g>
    </svg>
  );
}

interface LogoProps {
  href?: string;
}

/** Full nav lockup: Lift Mark + VIXLIFY wordmark. */
export function Logo({ href = "#top" }: LogoProps) {
  return (
    <a href={href} className="flex items-center gap-2.5">
      <LogoMark className="h-7 w-7" />
      <span className="font-display text-sm font-semibold tracking-[0.18em] text-white">
        VIXLIFY
      </span>
    </a>
  );
}
