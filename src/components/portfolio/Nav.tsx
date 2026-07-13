import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { openInquiry } from "@/lib/inquiry";
import { Logo } from "@/components/Logo";

export function Nav() {
  const onHome = window.location.pathname.replace(/\/+$/, "") === "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: onHome ? "#work" : "/#work", label: "Work" },
    { href: onHome ? "#approach" : "/#approach", label: "Approach" },
    { href: "/templates", label: "Templates" },
    { href: onHome ? "#contact" : "/#contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-5">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
          <Logo href={onHome ? "#top" : "/"} />
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href={onHome ? "#work" : "/#work"} className="hover:text-white transition-colors">Work</a>
            <a href={onHome ? "#approach" : "/#approach"} className="hover:text-white transition-colors">Approach</a>
            <a href="/templates" className={`transition-colors ${onHome ? "hover:text-white" : "text-white"}`}>Templates</a>
            <a href={onHome ? "#contact" : "/#contact"} className="hover:text-white transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openInquiry}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#05070f] transition-transform hover:scale-[1.03]"
            >
              Start a project
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
              {links.map((link) => (
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
