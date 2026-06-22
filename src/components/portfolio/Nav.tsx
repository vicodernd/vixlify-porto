import { openInquiry } from "@/lib/inquiry";
import { Logo } from "@/components/Logo";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-5">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <Logo href="#top" />
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#approach" className="hover:text-white transition-colors">Approach</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <button
            type="button"
            onClick={openInquiry}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#05070f] transition-transform hover:scale-[1.03]"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
