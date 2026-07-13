import { ArrowUpRight, Check, Copy } from "lucide-react";
import { CATEGORY_LABELS, type Template } from "@/data/templates";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";

export function TemplateCard({ template, onOpenPrompt }: { template: Template; onOpenPrompt: (t: Template) => void }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] transition-all duration-500 hover:-translate-y-2 hover:border-cyan/40 hover:shadow-[0_8px_32px_rgba(0,229,255,0.08)]">
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onOpenPrompt(template)}
        className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-deep text-left"
        aria-label={`View prompt for ${template.title}`}
      >
        <img
          src={template.thumb}
          alt={template.title}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <span className="absolute bottom-4 left-4 flex translate-y-2 items-center gap-1.5 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View prompt <ArrowUpRight className="h-4 w-4" />
        </span>
      </button>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">{CATEGORY_LABELS[template.category]}</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">{template.date}</span>
        </div>
        <h3 className="mb-2 font-display text-xl font-bold leading-snug text-white">{template.title}</h3>
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-white/50">{template.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3">
          <a
            href={template.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.12]"
          >
            Open live <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => copy(template.prompt)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              copied
                ? "border border-cyan/50 bg-cyan/20 text-cyan"
                : "bg-cyan text-space shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:bg-cyan/90 hover:shadow-[0_0_25px_rgba(0,229,255,0.35)]"
            }`}
          >
            {copied ? (<><Check className="h-4 w-4" /> Copied</>) : (<><Copy className="h-4 w-4" /> Copy prompt</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
