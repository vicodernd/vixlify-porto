import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { CATEGORY_LABELS, type Template } from "@/data/templates";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";

/**
 * Prompt modal, v3 "paper" redesign. A warm paper sheet holds the meta and the
 * free prompt; the prompt itself sits in a dark code panel for legibility (code
 * reads as code). Ember is the copy accent.
 */
export function PromptModal({
  template,
  onClose,
}: {
  template: Template | null;
  onClose: () => void;
}) {
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = template ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-2xl border border-black/10 bg-[#f4f2ee] text-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:max-w-2xl sm:rounded-2xl"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/10 bg-[#f4f2ee]/95 p-6 pb-4 backdrop-blur-md sm:p-8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff6a2b]">
                  {CATEGORY_LABELS[template.category]}
                </span>
                <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.01em]">
                  {template.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/15 p-2 text-black/50 transition-colors hover:bg-black/[0.05] hover:text-black"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 pt-5 sm:p-8">
              <p className="mb-6 leading-relaxed text-[#3a3a38]">{template.description}</p>

              <div className="mb-6 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#6b6b68]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* prompt block (dark code panel) */}
              <div className="mb-6 overflow-hidden rounded-xl border border-black/15 bg-[#0f0f0f]">
                <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                    Free prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(template.prompt)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                      copied
                        ? "bg-[#ff6a2b]/20 text-[#ff8a4c]"
                        : "bg-[#ff6a2b] text-[#0a0a0a] hover:brightness-110"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-[38dvh] overflow-y-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-white/70 sm:p-5">
                  {template.prompt}
                </pre>
              </div>

              <a
                href={template.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#f4f4f2] transition-colors hover:bg-[#000000]"
              >
                Open live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
