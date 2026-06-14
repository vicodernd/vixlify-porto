import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import {
  OPEN_INQUIRY_EVENT,
  submitInquiry,
  type InquiryInput,
} from "@/lib/inquiry";

const PROJECT_TYPES = [
  "Marketing website",
  "Brand / portfolio site",
  "SaaS landing page",
  "Web app",
  "Other",
];

const BUDGET_RANGES = [
  "Under $3k",
  "$3k to $6k",
  "$6k to $12k",
  "$12k+",
  "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "Ready to start now",
  "Within 2 weeks",
  "This month",
  "Just exploring",
];

type Variant = "default" | "founding";

const VARIANTS: Record<
  Variant,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    submitLabel: string;
    successTitle: string;
    successBody: string;
    messageLabel: string;
    messagePlaceholder: string;
    /** The second dropdown — budget for general, timeline for founding. */
    qualifier: { label: string; key: "budget_range" | "timeline"; options: string[] };
    showWebsite: boolean;
    showConsent: boolean;
  }
> = {
  default: {
    eyebrow: "Start a project",
    title: "Tell me what you're building.",
    subtitle:
      "A few details so I can give you a thoughtful reply. I take on a limited number of projects at a time.",
    submitLabel: "Send inquiry",
    successTitle: "Thanks, it's landed.",
    successBody:
      "I personally read every inquiry and reply within 1 to 2 business days. If it's a fit, we'll find a time to talk.",
    messageLabel: "Tell me about it",
    messagePlaceholder: "Goals, timeline, what success looks like…",
    qualifier: { label: "Budget", key: "budget_range", options: BUDGET_RANGES },
    showWebsite: false,
    showConsent: false,
  },
  founding: {
    eyebrow: "Founding Client Program · 2 slots",
    title: "Apply for a founding slot.",
    subtitle:
      "Two brands, one founding rate, in exchange for a testimonial and the right to feature the work. I'd rather leave a slot open than fill it with the wrong fit, so tell me a little about you.",
    submitLabel: "Apply for a slot",
    successTitle: "Application in.",
    successBody:
      "I read every founding application myself and reply within 1 to 2 business days. If it's a fit, we'll lock a slot and set real dates.",
    messageLabel: "What are you building, and why now?",
    messagePlaceholder: "Your brand, the goal, and why the timing is right…",
    qualifier: {
      label: "How soon could you start?",
      key: "timeline",
      options: TIMELINE_OPTIONS,
    },
    showWebsite: true,
    showConsent: true,
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

const emptyForm: InquiryInput = {
  name: "",
  email: "",
  company: "",
  project_type: "",
  budget_range: "",
  website: "",
  timeline: "",
  case_study_consent: false,
  message: "",
  company_website: "",
};

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#00E5FF]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#00E5FF]/20";

export function InquiryModal({ variant = "default" }: { variant?: Variant }) {
  const cfg = VARIANTS[variant];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<InquiryInput>(emptyForm);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Open via the global event dispatched by any CTA.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_INQUIRY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_INQUIRY_EVENT, onOpen);
  }, []);

  // Lock scroll, handle Esc, focus first field while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    // Reset back to a clean form shortly after the exit animation.
    setTimeout(() => {
      setStatus("idle");
      setError("");
      setForm(emptyForm);
    }, 300);
  }

  function update<K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please share your name.");
    if (!EMAIL_RE.test(form.email)) return setError("Please enter a valid email.");
    if (form.message.trim().length < 10)
      return setError("Tell me a little more about the project.");
    if (cfg.showConsent && !form.case_study_consent)
      return setError("Please acknowledge the founding exchange to apply.");

    setStatus("submitting");
    try {
      await submitInquiry(form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="dark fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="inquiry-title"
        >
          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 -z-10 cursor-default bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0a0d18] shadow-2xl"
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-24 h-48"
              style={{
                background:
                  "radial-gradient(50% 100% at 50% 0%, rgba(0,229,255,0.16) 0%, rgba(139,92,246,0.10) 40%, transparent 70%)",
              }}
            />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.1] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 sm:p-8">
              {status === "success" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 glow-cyan">
                    <Check className="h-6 w-6 text-[#00E5FF]" />
                  </div>
                  <h3
                    id="inquiry-title"
                    className="mt-6 font-display text-2xl font-semibold tracking-tight text-white"
                  >
                    {cfg.successTitle}
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                    {cfg.successBody}
                  </p>
                  <p className="mt-5 text-xs text-white/40">
                    Prefer email?{" "}
                    <a
                      href="mailto:hello@vixlify.com"
                      className="text-white/70 underline-offset-4 hover:text-white hover:underline"
                    >
                      hello@vixlify.com
                    </a>
                  </p>
                  <button
                    onClick={close}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/45">
                    {cfg.eyebrow}
                  </span>
                  <h3
                    id="inquiry-title"
                    className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  >
                    {cfg.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    {cfg.subtitle}
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                    {/* Honeypot — visually hidden, off-screen */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={form.company_website}
                      onChange={(e) => update("company_website", e.target.value)}
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Name
                        </label>
                        <input
                          ref={firstFieldRef}
                          type="text"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Your name"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Email
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@company.com"
                          className={fieldClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-white/50">
                        Brand / company{" "}
                        <span className="text-white/30">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="What should I look up?"
                        className={fieldClass}
                      />
                    </div>

                    {cfg.showWebsite && (
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Current site or social{" "}
                          <span className="text-white/30">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={form.website}
                          onChange={(e) => update("website", e.target.value)}
                          placeholder="A link so I can see what you're working with"
                          className={fieldClass}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          Project type
                        </label>
                        <Select
                          value={form.project_type || ""}
                          onChange={(v) => update("project_type", v)}
                          placeholder="Select"
                          options={PROJECT_TYPES}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-white/50">
                          {cfg.qualifier.label}
                        </label>
                        <Select
                          value={(form[cfg.qualifier.key] as string) || ""}
                          onChange={(v) => update(cfg.qualifier.key, v)}
                          placeholder="Select"
                          options={cfg.qualifier.options}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-white/50">
                        {cfg.messageLabel}
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder={cfg.messagePlaceholder}
                        rows={4}
                        className={`${fieldClass} resize-none`}
                      />
                    </div>

                    {cfg.showConsent && (
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition hover:bg-white/[0.05]">
                        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={!!form.case_study_consent}
                            onChange={(e) =>
                              update("case_study_consent", e.target.checked)
                            }
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/[0.04] outline-none transition checked:border-[#00E5FF] checked:bg-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/30"
                          />
                          <Check className="pointer-events-none absolute h-3.5 w-3.5 text-[#05070f] opacity-0 peer-checked:opacity-100" />
                        </span>
                        <span className="text-xs leading-relaxed text-white/60">
                          I understand the founding rate is an exchange: an honest
                          testimonial after launch and the right to feature my
                          project as a public case study.
                        </span>
                      </label>
                    )}

                    {error && <p className="text-sm text-[#FF2D95]">{error}</p>}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#05070f] glow-cyan transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {status === "submitting" ? (
                        "Sending…"
                      ) : (
                        <>
                          {cfg.submitLabel}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-white/35">
                      Or email{" "}
                      <a
                        href="mailto:hello@vixlify.com"
                        className="text-white/55 underline-offset-4 hover:text-white hover:underline"
                      >
                        hello@vixlify.com
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Styled native select with a dark menu and a chevron. */
function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} cursor-pointer appearance-none pr-9 ${
          value ? "text-white" : "text-white/30"
        }`}
      >
        <option value="" disabled className="bg-[#0a0d18] text-white/40">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0a0d18] text-white">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
    </div>
  );
}
