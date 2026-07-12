import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { CATEGORY_LABELS, type Template } from "@/data/templates";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";

export function PromptModal({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = template ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [template]);

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-deep shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:max-w-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/8 bg-deep/95 p-6 pb-4 backdrop-blur-md sm:p-8">
              <div>
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">{CATEGORY_LABELS[template.category]}</span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">{template.title}</h3>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-white/60 transition-colors hover:bg-white/[0.12] hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 pt-5 sm:p-8">
              <p className="mb-6 leading-relaxed text-white/60">{template.description}</p>

              <div className="mb-6 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/50">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prompt block */}
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2.5">
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Free prompt</span>
                  <button
                    type="button"
                    onClick={() => copy(template.prompt)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                      copied ? "bg-cyan/20 text-cyan" : "bg-cyan text-space hover:bg-cyan/90"
                    }`}
                  >
                    {copied ? (<><Check className="h-3.5 w-3.5" /> Copied</>) : (<><Copy className="h-3.5 w-3.5" /> Copy</>)}
                  </button>
                </div>
                <pre className="max-h-[38dvh] overflow-y-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-white/70 sm:p-5">{template.prompt}</pre>
              </div>

              <a
                href={template.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.12]"
              >
                Open live demo <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
