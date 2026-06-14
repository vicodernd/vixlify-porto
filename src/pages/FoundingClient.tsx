import { useState } from "react";
import {
  ArrowRight,
  Check,
  X as XIcon,
  Sparkles,
  Layers,
  Gauge,
  PenTool,
  ChevronDown,
} from "lucide-react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { GradientShimmer } from "@/components/motion/GradientShimmer";
import { FoundingNav } from "@/components/founding/FoundingNav";
import { Footer } from "@/components/portfolio/Contact";
import { openInquiry } from "@/lib/inquiry";

/* ----------------------------------------------------------------------------
   Social handles mirror the main site. Project CTAs open the inquiry modal
   (see @/lib/inquiry + InquiryModal); the contact path is the form, not DMs.
---------------------------------------------------------------------------- */
const LINKS = {
  x: "https://x.com/vixlifyy",
  threads: "https://www.threads.com/@vixlifyy",
  instagram: "https://www.instagram.com/vixlifyy/",
};

const SLOTS_TOTAL = 2;

/* -------------------------------- The offer ------------------------------- */
const deliverables = [
  {
    icon: PenTool,
    title: "A site designed from zero",
    body: "No templates, no theme reskins. Original art direction built around your brand, your audience, and the way you actually sell.",
  },
  {
    icon: Layers,
    title: "Designed and built end to end",
    body: "Strategy, layout, copy polish, and a production build, handled by one person who owns the whole outcome.",
  },
  {
    icon: Sparkles,
    title: "Motion that earns its place",
    body: "Hand-tuned micro-interactions and reveals. Every animation has a job: guide the eye, build trust, close the gap to a yes.",
  },
  {
    icon: Gauge,
    title: "Fast, responsive, yours to keep",
    body: "Pixel-true on every screen, tuned for speed, and handed over clean, so it stays easy to extend long after launch.",
  },
];

/* -------------------------------- The fit --------------------------------- */
const goodFit = [
  "You're a founder or small team with a real product and real momentum.",
  "Your current site undersells you, and you know it's costing you deals.",
  "You can give honest feedback fast and make decisions without a committee.",
  "You're proud of what you do and happy to be featured publicly.",
];

const notFit = [
  "You want the cheapest option, full stop. Price is the only lever.",
  "You need ten rounds of stakeholder sign-off on every pixel.",
  "You're not sure what you're building yet, or who it's for.",
  "You'd rather stay anonymous and skip the testimonial.",
];

/* ------------------------------- The process ------------------------------ */
const steps = [
  {
    n: "01",
    title: "Intro call",
    body: "A 20-minute, no-pressure call (or a few DMs). We see if it's a fit, both ways. If it isn't, I'll tell you straight.",
    dot: "#00E5FF",
  },
  {
    n: "02",
    title: "Discover",
    body: "I go deep on your product, audience, and edges. You get sharp questions, not a slide deck. We agree on one clear direction.",
    dot: "#8B5CF6",
  },
  {
    n: "03",
    title: "Design + build",
    body: "I design and build the full site, share progress as it lands, and tune the details with you. Roughly two to three weeks.",
    dot: "#FF2D95",
  },
  {
    n: "04",
    title: "Launch",
    body: "We ship it live, hand over a clean build, and capture the win: a short testimonial and the right to feature the work.",
    dot: "#00E5FF",
  },
];

/* --------------------------------- The FAQ -------------------------------- */
const faqs = [
  {
    q: "Why is this so much cheaper than your normal rate?",
    a: "Because you're trading something I need. Vixlify is new, and I'm building the two public case studies that let me charge full international rates. You get premium work at a fraction of the price; I get proof. It's a straight exchange, not a discount I'm begging you to take.",
  },
  {
    q: "What's the catch on the founding rate?",
    a: "No catch, just a couple of conditions. I ask for an honest testimonial after launch and the right to feature the project as a case study (site, process, and results). That's the value I'm trading for. Everything else is a normal client engagement.",
  },
  {
    q: "Is the quality actually lower because of the price?",
    a: "No. The opposite, honestly. These two projects are my portfolio. They're how I win every client after you. I have every reason to make them the best work I've ever shipped.",
  },
  {
    q: "How long does it take?",
    a: "Most founding projects ship in two to three weeks once we start, depending on scope and how fast feedback comes back. We'll set real dates on the intro call.",
  },
  {
    q: "What do you need from me?",
    a: "Clarity on what you do, fast feedback, and any assets you already have (logo, copy, photos). I handle the rest. The better you show up, the faster we ship.",
  },
  {
    q: "What happens when the two slots are gone?",
    a: "The program closes and the rate goes back up to standard. Founding pricing exists once, for the first two brands. That's the whole point.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
      {children}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 text-left transition-colors hover:bg-white/[0.04]"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-base sm:text-lg font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-sm leading-relaxed text-white/60">{a}</p>
        </div>
      </div>
    </button>
  );
}

export function FoundingClient() {
  return (
    <div className="dark min-h-screen bg-[#05070f] text-white antialiased">
      <FoundingNav />

      <main>
        {/* =========================== HERO =========================== */}
        <section
          id="top"
          className="relative isolate overflow-hidden pt-36 sm:pt-44 pb-24 sm:pb-32 grain"
        >
          <NeuralBackground
            className="-z-10 opacity-40"
            colors={["#00E5FF", "#8B5CF6", "#FF2D95"]}
            trailOpacity={0.14}
            fadeRgb="5,7,15"
            particleCount={420}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aurora opacity-70" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -left-32 -z-10 h-[520px] w-[520px] rounded-full opacity-50 animate-float-slow"
            style={{ background: "radial-gradient(closest-side, rgba(0,229,255,0.30), transparent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 right-[-10%] -z-10 h-[480px] w-[480px] rounded-full opacity-50 animate-float-slow"
            style={{
              background: "radial-gradient(closest-side, rgba(255,45,149,0.28), transparent)",
              animationDelay: "-6s",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,15,0.65) 100%)" }}
          />

          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/[0.06] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse-ring" />
                <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/80">
                  Founding Client Program
                </span>
              </span>
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/40">
                Only {SLOTS_TOTAL} slots
              </span>
            </RevealOnView>

            <h1 className="mt-7 font-display text-balance text-[12vw] sm:text-[8vw] lg:text-[6.4rem] xl:text-[7.4rem] font-semibold leading-[0.94] tracking-[-0.04em] text-white max-w-5xl">
              <AnimatedText as="span" className="block" stagger={80} delay={120}>
                Two brands.
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={80} delay={320}>
                {"One "}
                <GradientShimmer delay={1100}>founding rate.</GradientShimmer>
              </AnimatedText>
            </h1>

            <div className="mt-10 grid gap-8 sm:grid-cols-[1.5fr_1fr] sm:items-end">
              <RevealOnView as="p" delay={800} className="max-w-xl text-base sm:text-lg text-white/65 leading-relaxed">
                Vixlify is a premium web design studio, newly launched. Before rates go to
                full international pricing, I'm taking on{" "}
                <span className="text-white">two founding clients</span> at a rate that won't
                exist again, in exchange for two case studies worth building a studio on.
              </RevealOnView>
              <RevealOnView delay={1000} className="flex flex-col gap-3 sm:items-end">
                <button
                  type="button"
                  onClick={openInquiry}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#05070f] glow-cyan transition-transform hover:scale-[1.03] sm:w-auto"
                >
                  Claim a slot
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#offer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors sm:w-auto"
                >
                  See what's included
                </a>
              </RevealOnView>
            </div>

            <RevealOnView delay={1200} className="mt-12 flex flex-wrap items-center gap-3">
              <Pill>Premium quality</Pill>
              <Pill>Founding-only rate</Pill>
              <Pill>Ships in 2 to 3 weeks</Pill>
              <Pill>Solo founder, fully accountable</Pill>
            </RevealOnView>
          </div>
        </section>

        {/* ========================= THE PREMISE ========================= */}
        <section className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                01 · The premise
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-4xl">
              <AnimatedText as="span" className="block" stagger={60}>
                I'm not discounting.
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={60} delay={200}>
                I'm trading.
              </AnimatedText>
            </h2>
            <RevealOnView as="p" delay={300} className="mt-6 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Every studio with a waitlist started with a first client. Right now Vixlify needs
              exactly two: real brands, real launches, real results I can point to. You get
              premium work for a fraction of what it'll cost in six months. I get the proof that
              lets me charge full rate. Nobody's doing anybody a favor. It's a fair swap, and
              the window closes after two.
            </RevealOnView>
          </div>
        </section>

        {/* ========================== THE OFFER ========================== */}
        <section id="offer" className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                02 · What you get
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl">
              A flagship site, at a price that ends with this program.
            </h2>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2">
              {deliverables.map((d, i) => (
                <RevealOnView key={d.title} delay={i * 120} className="relative bg-[#0a0d1a] p-7 sm:p-9">
                  <d.icon className="h-6 w-6 text-[#00E5FF]" strokeWidth={1.6} />
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-white">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">{d.body}</p>
                </RevealOnView>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= THE EXCHANGE ======================== */}
        <section className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                03 · The exchange
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl">
              Plain terms, both ways.
            </h2>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <RevealOnView className="rounded-2xl border border-[#00E5FF]/20 bg-gradient-to-b from-[#00E5FF]/[0.06] to-transparent p-8 sm:p-10">
                <h3 className="font-display text-sm uppercase tracking-[0.22em] text-[#00E5FF]">
                  You receive
                </h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "A fully custom, fully built website, designed and shipped by one accountable founder.",
                    "Founding pricing: a fraction of the standard rate, locked for this project only.",
                    "Priority attention. With two clients, you're never one of forty.",
                    "A clean handover you own outright, no lock-in, no monthly rent.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-white/75 leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]" strokeWidth={2.4} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnView>

              <RevealOnView delay={140} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
                <h3 className="font-display text-sm uppercase tracking-[0.22em] text-white/70">
                  In return
                </h3>
                <ul className="mt-6 space-y-4">
                  {[
                    "An honest testimonial once the site is live and you've seen the impact.",
                    "Permission to feature the project as a public case study.",
                    "Fast, decisive feedback so we can ship at founding speed.",
                    "An intro to one peer founder who'd value the same work, only if you'd genuinely recommend it.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnView>
            </div>
          </div>
        </section>

        {/* ============================ THE FIT ========================== */}
        <section id="fit" className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                04 · Who it's for
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl">
              <AnimatedText as="span" className="block" stagger={60}>
                Two slots means
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={60} delay={200}>
                I have to be picky.
              </AnimatedText>
            </h2>
            <RevealOnView as="p" delay={300} className="mt-6 max-w-2xl text-base text-white/60 leading-relaxed">
              These two projects set the tone for everything Vixlify does next. I'd rather leave
              a slot open than fill it with the wrong fit. Here's how to tell.
            </RevealOnView>

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <RevealOnView className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
                <h3 className="font-display text-lg font-semibold text-white">This is for you if</h3>
                <ul className="mt-6 space-y-4">
                  {goodFit.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-white/75 leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]" strokeWidth={2.4} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnView>

              <RevealOnView delay={140} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
                <h3 className="font-display text-lg font-semibold text-white">It's probably not if</h3>
                <ul className="mt-6 space-y-4">
                  {notFit.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-white/55 leading-relaxed">
                      <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2D95]" strokeWidth={2.4} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnView>
            </div>
          </div>
        </section>

        {/* ========================== THE PROCESS ======================== */}
        <section id="process" className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                05 · How it works
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl">
              From DM to live site, fast.
            </h2>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <RevealOnView key={s.n} delay={i * 120} className="relative bg-[#0a0d1a] p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs uppercase tracking-[0.28em] text-white/40">
                      Step {s.n}
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ background: s.dot, boxShadow: `0 0 16px ${s.dot}` }} />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">{s.body}</p>
                </RevealOnView>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= FAQ ============================= */}
        <section id="faq" className="relative border-t border-white/8 py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <RevealOnView className="flex items-center gap-3">
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                06 · Questions
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-4 font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-3xl">
              The honest answers.
            </h2>

            <div className="mt-12 grid gap-3 max-w-3xl">
              {faqs.map((f, i) => (
                <RevealOnView key={f.q} delay={i * 60}>
                  <FaqItem q={f.q} a={f.a} />
                </RevealOnView>
              ))}
            </div>
          </div>
        </section>

        {/* =========================== FINAL CTA ========================= */}
        <section id="apply" className="relative overflow-hidden py-28 sm:py-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(40% 40% at 20% 80%, rgba(0,229,255,0.15) 0%, transparent 60%), radial-gradient(40% 40% at 80% 20%, rgba(255,45,149,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 text-center">
            <RevealOnView className="flex items-center justify-center gap-3">
              <span className="hairline w-16" />
              <span className="font-display text-[11px] uppercase tracking-[0.28em] text-white/50">
                {SLOTS_TOTAL} of {SLOTS_TOTAL} slots open · then it closes
              </span>
              <span className="hairline w-16" />
            </RevealOnView>
            <h2 className="mt-6 font-display text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white">
              <AnimatedText as="span" className="block" stagger={70}>
                Want one of the two?
              </AnimatedText>
              <AnimatedText as="span" className="block" stagger={70} delay={240}>
                <GradientShimmer delay={1100}>Let's talk.</GradientShimmer>
              </AnimatedText>
            </h2>
            <RevealOnView as="p" delay={460} className="mx-auto mt-6 max-w-xl text-base text-white/60">
              Tell me what you're building. No pressure, no hard sell. If it's a fit, we
              start. If not, you'll get an honest read either way.
            </RevealOnView>

            <RevealOnView delay={640} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={openInquiry}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#05070f] glow-cyan transition-transform hover:scale-[1.03]"
              >
                Start a project
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </button>
              <a
                href="mailto:hello@vixlify.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white hover:bg-white/[0.08] transition-colors"
              >
                Email me instead
              </a>
            </RevealOnView>

            <RevealOnView delay={820} className="mt-8 flex items-center justify-center gap-5 text-xs text-white/50">
              <span className="text-white/40">Or reach out on</span>
              <a href={LINKS.x} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
              <a href={LINKS.threads} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Threads</a>
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            </RevealOnView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
