import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Contact";
import { PromptModal } from "@/components/templates/PromptModal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CATEGORY_LABELS, templates, type Template, type TemplateCategory } from "@/data/templates";

type Filter = "all" | TemplateCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][]).map(([value, label]) => ({ value, label })),
];

export function TemplatesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? templates : templates.filter((t) => t.category === filter)),
    [filter],
  );

  return (
    <div className="dark min-h-screen bg-space text-white antialiased">
      <Nav />
      <main className="relative overflow-hidden px-5 pb-32 pt-40 sm:px-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan/[0.07] blur-[160px]" aria-hidden></div>

        <div className="relative z-10 mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="mb-16 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-cyan"></div>
              <span className="text-sm font-medium text-white/80">Free Template Library</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 font-display text-[40px] leading-[1.05] tracking-tight sm:text-[56px] md:text-[64px]"
            >
              <span className="font-normal text-white">Steal our</span>{" "}
              <span className="font-bold text-cyan">prompts.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-lg leading-relaxed text-white/50"
            >
              A new high-end template drops every day. Open the live demo, copy the
              generation prompt, and build it yourself. No signup, no paywall.
            </motion.p>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex flex-wrap items-center gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  filter === f.value
                    ? "border-cyan bg-cyan text-space shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                    : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Grid / empty state */}
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((template, i) => (
                <motion.div
                  key={template.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TemplateCard template={template} onOpenPrompt={setActiveTemplate} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] py-28 text-center"
            >
              <span className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">Coming soon</span>
              <p className="mb-3 font-display text-2xl font-bold text-white">First drop is on the way</p>
              <p className="max-w-sm leading-relaxed text-white/40">
                {filter === "all"
                  ? "The first template lands here shortly. One new template every day after that."
                  : `No ${CATEGORY_LABELS[filter as TemplateCategory].toLowerCase()} yet. Check back soon or browse all templates.`}
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      <PromptModal template={activeTemplate} onClose={() => setActiveTemplate(null)} />
    </div>
  );
}
