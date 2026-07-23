import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLang, copy, waLink, LangToggle } from "@/i18n";

/**
 * Persistent, minimal nav (v3). Logo left; language toggle + inline links +
 * WhatsApp pill right, mirroring Trionn's logo / links / MENU chrome.
 * Transparent over the hero, gains a faint backdrop once scrolled. Mobile
 * collapses links into a full-screen overlay.
 *
 * `theme` adapts the chrome to a light ground (the /templates library page).
 * `home` toggles whether the section links are same-page anchors (homepage) or
 * cross-page links back to the homepage sections (a subpage like /templates).
 */

export function Nav({
  theme = "dark",
  home = true,
}: {
  theme?: "dark" | "light";
  home?: boolean;
}) {
  const { lang } = useLang();
  const t = copy[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const light = theme === "light";
  const base = home ? "" : "/";
  const links = [
    { key: "work" as const, href: `${base}#work` },
    { key: "approach" as const, href: `${base}#approach` },
    { key: "templates" as const, href: "/templates" },
  ];

  const scrolledBg = light
    ? "bg-[#e8e8e6]/80 backdrop-blur-md"
    : "bg-[#0a0a0a]/70 backdrop-blur-md";
  const linkColor = light ? "text-black/55 hover:text-black" : "text-white/55 hover:text-white";
  const underline = light ? "bg-black/50" : "bg-white/50";
  const menuColor = light ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white";
  const waPill = light ? "bg-[#111111] text-[#f5f5f5]" : "bg-[#f5f5f5] text-[#0a0a0a]";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? scrolledBg : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
          <Logo href={home ? "#top" : "/"} theme={theme} />

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                className={`group relative font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${linkColor}`}
              >
                {t[l.key]}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${underline}`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangToggle theme={theme} />
            <a
              href={waLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-transform hover:scale-[1.03] sm:inline-flex ${waPill}`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t.cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors lg:hidden ${menuColor}`}
            >
              Menu
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <span
                  className={`h-px w-full bg-current transition-transform duration-300 ${
                    open ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-transform duration-300 ${
                    open ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed inset-0 z-40 flex flex-col justify-between px-5 pb-8 pt-24 lg:hidden ${
              light ? "bg-[#e8e8e6]" : "bg-[#0a0a0a]"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.a
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                  className={`font-display text-5xl font-semibold tracking-[-0.02em] ${
                    light ? "text-[#111111]" : "text-[#ececec]"
                  }`}
                >
                  {t[l.key]}
                </motion.a>
              ))}
            </nav>
            <a
              href={waLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-wider ${waPill}`}
            >
              <MessageCircle className="h-4 w-4" />
              {t.cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
