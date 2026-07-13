import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { openInquiry } from "@/lib/inquiry";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "#offer", label: "The offer" },
  { href: "#fit", label: "Who it's for" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export function FoundingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-5">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <Logo href="/" />
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#offer" className="hover:text-white transition-colors">The offer</a>
            <a href="#fit" className="hover:text-white transition-colors">Who it's for</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openInquiry}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#05070f] transition-transform hover:scale-[1.03]"
            >
              Claim a slot
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/80 px-5 py-4 text-sm text-white/70 backdrop-blur-md md:hidden"
            >
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2.5 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
