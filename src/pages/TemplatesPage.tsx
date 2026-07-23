import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LangProvider } from "@/i18n";
import { Nav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/home/Footer";
import { PromptModal } from "@/components/templates/PromptModal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { BlurReveal, Rise, LineGrow } from "@/components/motion/reveal";
import {
  CATEGORY_LABELS,
  templates,
  type Template,
  type TemplateCategory,
} from "@/data/templates";

type Filter = "all" | TemplateCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

/**
 * /templates — the free template library, v3 "paper" redesign. Global, English.
 * Light paper ground so it continues the free-layer world of the homepage Free
 * Resources teaser; the v3 chrome (theme-light Nav + shared dark SiteFooter) and
 * motion system carry over. Wrapped in its own LangProvider so the shared
 * bilingual chrome works when reached directly.
 */
export function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? templates : templates.filter((t) => t.category === filter)),
    [filter],
  );

  return (
    <LangProvider>
      <div className="min-h-screen bg-[#e8e8e6] text-[#111111] antialiased">
        <Nav theme="light" home={false} />

        <main className="px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
          <div className="mx-auto max-w-[1400px]">
            {/* HEADER */}
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a2b]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6b6b68]">
                  Free template library
                </span>
                <LineGrow className="max-w-16 bg-black/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/30">
                  {templates.length} live · free
                </span>
              </div>

              <h1 className="mt-6 font-display font-semibold leading-[0.92] tracking-[-0.035em] text-[clamp(2.75rem,9vw,7rem)]">
                <BlurReveal text="Steal the" />
                <BlurReveal
                  text="prompt."
                  delay={0.12}
                  className="[-webkit-text-stroke:1.5px_#111111] text-transparent"
                />
              </h1>

              <Rise
                as="p"
                delay={0.15}
                className="mt-7 max-w-xl text-[15px] leading-relaxed text-[#3a3a38] sm:text-[1rem]"
              >
                A new high-end template drops every day. Open the live demo, copy the generation
                prompt, and build it yourself. No signup, no paywall.
              </Rise>
            </div>

            {/* FILTERS */}
            <Rise delay={0.2} className="mt-12 flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                    filter === f.value
                      ? "border-[#111111] bg-[#111111] text-[#f4f4f2]"
                      : "border-black/15 text-[#3a3a38] hover:border-black/40 hover:text-[#111111]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </Rise>

            {/* GRID / EMPTY */}
            {visible.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((template, i) => (
                  <motion.div
                    key={template.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TemplateCard template={template} onOpenPrompt={setActiveTemplate} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02] py-28 text-center">
                <span className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff6a2b]">
                  Coming soon
                </span>
                <p className="mb-3 font-display text-2xl font-semibold text-[#111111]">
                  First drop is on the way
                </p>
                <p className="max-w-sm leading-relaxed text-[#6b6b68]">
                  {filter === "all"
                    ? "The first template lands here shortly. One new template every day after that."
                    : `No ${CATEGORY_LABELS[
                        filter as TemplateCategory
                      ].toLowerCase()} yet. Check back soon or browse all templates.`}
                </p>
              </div>
            )}
          </div>
        </main>

        <SiteFooter />
        <PromptModal template={activeTemplate} onClose={() => setActiveTemplate(null)} />
      </div>
    </LangProvider>
  );
}
