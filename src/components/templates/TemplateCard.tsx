import { ArrowUpRight, Check, Copy, Lock } from "lucide-react";
import { CATEGORY_LABELS, type Template } from "@/data/templates";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";

/**
 * Template library card, v3 "paper" redesign. A browser-chrome "live screen"
 * around each demo capture (same language as the homepage Selected Work / Free
 * Resources), then a meta block with the free-prompt actions. Ember is the one
 * accent (the live dot, the category label, the copy-prompt hover). Clicking the
 * screen opens the prompt modal; Open live and Copy prompt work inline.
 */
export function TemplateCard({
  template,
  onOpenPrompt,
}: {
  template: Template;
  onOpenPrompt: (t: Template) => void;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-black/12 bg-white shadow-[0_30px_70px_-45px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-black/10 bg-[#f2f1ef] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff6a2b]" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="h-2 w-2 rounded-full bg-black/15" />
        <span className="ml-1 flex flex-1 items-center gap-1 truncate rounded bg-black/[0.05] px-2 py-0.5 font-mono text-[9px] tracking-[0.04em] text-[#6b6b68]">
          <Lock className="h-2 w-2 shrink-0 opacity-60" />
          <span className="truncate">vixlify.studio/templates/{template.slug}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b6b68]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b] shadow-[0_0_8px_rgba(255,106,43,0.9)]" />
          Live
        </span>
      </div>

      {/* thumbnail → prompt modal */}
      <button
        type="button"
        onClick={() => onOpenPrompt(template)}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#e8e8e6] text-left"
        aria-label={`View prompt for ${template.title}`}
      >
        <img
          src={template.thumb}
          alt={template.title}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 rounded-full bg-[#111111] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f4f4f2] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View prompt <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* meta */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff6a2b]">
            {CATEGORY_LABELS[template.category]}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/30">
            {template.date}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-[#111111]">
          {template.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#3a3a38]">
          {template.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {template.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#6b6b68]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <a
            href={template.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors hover:bg-black/[0.05]"
          >
            Open live <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => copy(template.prompt)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
              copied
                ? "bg-[#ff6a2b]/15 text-[#c0531c]"
                : "bg-[#111111] text-[#f4f4f2] hover:bg-[#ff6a2b] hover:text-[#0a0a0a]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
