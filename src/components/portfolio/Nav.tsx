export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-5">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <a href="#top" className="flex items-center gap-2">
            <span className="relative inline-flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-md bg-gradient-to-br from-[#00E5FF] via-[#8B5CF6] to-[#FF2D95]" />
              <span className="absolute inset-[3px] rounded-[5px] bg-[#05070f]" />
              <span className="relative font-display text-[11px] font-bold text-white">V</span>
            </span>
            <span className="font-display text-sm font-semibold tracking-[0.18em] text-white">
              VIXLIFY
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#approach" className="hover:text-white transition-colors">Approach</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#05070f] transition-transform hover:scale-[1.03]"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
