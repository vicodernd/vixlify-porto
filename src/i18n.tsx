import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Bilingual system for the Vixlify services site.
 *
 * Language is chosen on first load by GEO (Indonesia -> id, elsewhere -> en),
 * with navigator.language as an instant fallback so there is no flash, and a
 * manual toggle that always wins and is persisted to localStorage.
 *
 * The tagline "Websites and automation, built with intent." is ALWAYS English,
 * even on the Indonesian site (Vico's rule), so it lives in the components, not
 * in the dictionary.
 */

export type Lang = "en" | "id";

const STORAGE_KEY = "vix-lang";
export const WA_NUMBER = "6285121502426";

/** Prefilled WhatsApp deep link, message localized. */
export function waLink(lang: Lang): string {
  const msg =
    lang === "id"
      ? "Halo Vixlify, saya tertarik untuk diskusi soal sebuah proyek."
      : "Hi Vixlify, I'd like to talk about a project.";
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "id" ? v : null;
  } catch {
    return null;
  }
}

/** Instant, synchronous best guess (no network) so the first paint is correct. */
function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = readStored();
  if (stored) return stored;
  const nav = navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("id") ? "id" : "en";
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const Ctx = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // If the visitor has an explicit stored choice, never override it by geo.
  const [locked, setLocked] = useState<boolean>(() => readStored() !== null);

  // Best-effort geo refine (only when the visitor has not chosen manually).
  useEffect(() => {
    if (locked) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    fetch("https://get.geojs.io/v1/ip/country.json", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { country?: string } | null) => {
        if (!data?.country) return;
        setLangState(data.country.toUpperCase() === "ID" ? "id" : "en");
      })
      .catch(() => {
        /* offline or blocked: keep the navigator.language guess */
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [locked]);

  // Keep <html lang> in sync for a11y / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    setLocked(true);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => setLang(lang === "en" ? "id" : "en");

  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}

/** Small EN / ID segmented switch for the nav. Theme-aware for light grounds. */
export function LangToggle({
  className = "",
  theme = "dark",
}: {
  className?: string;
  theme?: "dark" | "light";
}) {
  const { lang, setLang } = useLang();
  const border = theme === "light" ? "border-black/15" : "border-white/10";
  const active = theme === "light" ? "bg-[#111111] text-[#f5f5f5]" : "bg-[#f5f5f5] text-[#0a0a0a]";
  const inactive =
    theme === "light" ? "text-black/45 hover:text-black" : "text-white/50 hover:text-white";
  return (
    <div
      className={`flex items-center rounded-full border ${border} p-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2 py-1 transition-colors ${lang === l ? active : inactive}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Copy dictionary. Grows as services-home sections are built. */
export const copy = {
  en: {
    nav: { work: "Work", approach: "Approach", templates: "Templates", contact: "Contact", cta: "Chat" },
    hero: {
      eyebrow: "Web + AI Automation Studio",
      sub: "Vixlify builds premium websites and AI automation, as two services you can take on their own or together. A website that sells, automation that clears the manual work, or both running as one system.",
      primary: "Chat on WhatsApp",
      secondary: "See the work",
      status: "Open for projects",
      hint: "Hold to blast",
      based: "Jakarta · Working worldwide",
    },
    pillars: {
      eyebrow: "What we do",
      headingLead: "Two services. Take one, or",
      headingEmph: "both.",
      independence:
        "Need just one? That's normal. Most clients start with a website or an automation, then add the other later.",
      cta: "Chat on WhatsApp",
      web: {
        label: "01 / Websites",
        title: "Websites",
        desc: "Premium sites that load fast, look sharp, and turn visitors into customers. Designed and built end to end.",
        points: [
          "Landing pages that convert",
          "Company & brand sites",
          "Web apps & dashboards",
          "Redesigns & rescues",
        ],
      },
      auto: {
        label: "02 / AI Automation",
        title: "AI Automation",
        desc: "Workflows that run themselves. We connect your tools and let AI handle the repetitive work, so your team stops copy-pasting.",
        points: [
          "Lead & inquiry handling",
          "Content & data pipelines",
          "Chatbots & assistants",
          "Tool-to-tool integrations",
        ],
      },
    },
    work: {
      eyebrow: "Selected work",
      headingLead: "Proof you can",
      headingEmph: "click through.",
      intro:
        "These are self-directed studio builds. Each one is live: open it, click through it, judge the craft. The same hands build yours.",
      view: "Live",
      explore: "Explore project",
      note: "8 builds · all live",
      dragHint: "Scroll to explore",
    },
    how: {
      eyebrow: "How it works",
      headingLead: "Three steps.",
      headingEmph: "No guesswork.",
      intro:
        "A clear path from first message to something live. You see the plan and the price before anything is built.",
      steps: [
        {
          label: "Step 01",
          title: "Scope",
          body: "We map the goal, the audience, and what success looks like. You get a clear plan and a fixed quote before a single pixel or workflow is built.",
        },
        {
          label: "Step 02",
          title: "Build",
          body: "Design and development in one hand. You see it come together in stages and steer as it goes. No black box, no surprises at the end.",
        },
        {
          label: "Step 03",
          title: "Launch & handover",
          body: "We ship it, measure it, and hand over something you can actually run. Automations keep doing their job long after we're done.",
        },
      ],
      applies: "Same three steps whether you take a website, an automation, or both.",
    },
    resources: {
      eyebrow: "Free resources",
      headingLead: "Design in",
      headingEmph: "motion.",
      intro:
        "Everything we build for clients, we also give away. A growing library of production-grade work: open the demo, copy the prompt, ship your own. No sign-up, no paywall.",
      hint: "Hover to pause · click any card to open its live demo",
      templates: {
        tag: "11 live · free",
        title: "Templates",
        desc: "Live web templates with the full generation prompt attached. Open, study, copy, build.",
        cta: "Browse templates",
      },
      automations: {
        tag: "Coming soon",
        title: "Automations",
        desc: "Ready-made AI workflows you can plug into your own tools. Launching next.",
        cta: "In the works",
      },
    },
    footer: {
      eyebrow: "Let's build",
      headingLead: "Ready to build",
      headingEmph: "something that works?",
      sub: "Tell us what you're making: a website, an automation, or both. First reply usually within a day.",
      cta: "Start on WhatsApp",
      secondary: "See the work",
      email: "or email",
      status: "Open for projects",
    },
  },
  id: {
    nav: { work: "Karya", approach: "Proses", templates: "Template", contact: "Kontak", cta: "Chat" },
    hero: {
      eyebrow: "Studio Web + AI Automation",
      sub: "Vixlify membangun website premium dan automation AI, sebagai dua layanan yang bisa kamu ambil terpisah atau sekaligus. Website yang menjual, automation yang memangkas kerja manual, atau keduanya berjalan sebagai satu sistem.",
      primary: "Chat via WhatsApp",
      secondary: "Lihat karya",
      status: "Terbuka untuk proyek",
      hint: "Tahan untuk meledakkan",
      based: "Jakarta · Melayani seluruh dunia",
    },
    pillars: {
      eyebrow: "Yang kami kerjakan",
      headingLead: "Dua layanan. Ambil satu, atau",
      headingEmph: "keduanya.",
      independence:
        "Cuma butuh satu? Wajar. Kebanyakan klien mulai dari website atau automation dulu, lalu menambah yang lain nanti.",
      cta: "Chat via WhatsApp",
      web: {
        label: "01 / Website",
        title: "Website",
        desc: "Website premium yang cepat, tampil tajam, dan mengubah pengunjung jadi pelanggan. Didesain dan dibangun dari awal sampai jadi.",
        points: [
          "Landing page yang convert",
          "Website perusahaan & brand",
          "Web app & dashboard",
          "Redesign & perbaikan",
        ],
      },
      auto: {
        label: "02 / AI Automation",
        title: "AI Automation",
        desc: "Alur kerja yang berjalan sendiri. Kami sambungkan tool-mu dan biarkan AI menangani pekerjaan berulang, supaya timmu berhenti copy-paste.",
        points: [
          "Menangani lead & pertanyaan masuk",
          "Pipeline konten & data",
          "Chatbot & asisten",
          "Integrasi antar-tool",
        ],
      },
    },
    work: {
      eyebrow: "Karya pilihan",
      headingLead: "Bukti yang bisa kamu",
      headingEmph: "klik langsung.",
      intro:
        "Ini karya studio yang kami bangun sendiri. Semuanya live: buka, klik, nilai kualitasnya. Tangan yang sama yang akan mengerjakan punyamu.",
      view: "Live",
      explore: "Lihat proyek",
      note: "8 build · semua live",
      dragHint: "Scroll untuk menjelajah",
    },
    how: {
      eyebrow: "Cara kerjanya",
      headingLead: "Tiga langkah.",
      headingEmph: "Tanpa tebak-tebakan.",
      intro:
        "Jalur yang jelas dari pesan pertama sampai sesuatu yang live. Kamu lihat rencana dan harganya sebelum apa pun dibangun.",
      steps: [
        {
          label: "Langkah 01",
          title: "Ruang lingkup",
          body: "Kami petakan tujuan, audiens, dan seperti apa keberhasilannya. Kamu dapat rencana jelas dan harga pasti sebelum satu pun piksel atau workflow dibangun.",
        },
        {
          label: "Langkah 02",
          title: "Bangun",
          body: "Desain dan pengembangan dalam satu tangan. Kamu lihat prosesnya bertahap dan bisa mengarahkan. Bukan kotak hitam, tanpa kejutan di akhir.",
        },
        {
          label: "Langkah 03",
          title: "Rilis & serah terima",
          body: "Kami rilis, ukur, dan serahkan sesuatu yang benar-benar bisa kamu jalankan. Automation tetap bekerja lama setelah kami selesai.",
        },
      ],
      applies: "Tiga langkah yang sama, baik kamu ambil website, automation, atau keduanya.",
    },
    resources: {
      eyebrow: "Sumber daya gratis",
      headingLead: "Desain yang",
      headingEmph: "bergerak.",
      intro:
        "Semua yang kami bangun untuk klien, kami bagikan juga. Perpustakaan karya kelas produksi yang terus bertambah: buka demonya, salin prompt-nya, bangun versimu sendiri. Tanpa daftar, tanpa bayar.",
      hint: "Arahkan kursor untuk jeda · klik kartu mana pun untuk buka demonya",
      templates: {
        tag: "11 live · gratis",
        title: "Template",
        desc: "Template web live lengkap dengan prompt pembuatannya. Buka, pelajari, salin, bangun.",
        cta: "Lihat template",
      },
      automations: {
        tag: "Segera hadir",
        title: "Automation",
        desc: "Workflow AI siap pakai yang tinggal kamu pasang ke tool-mu sendiri. Menyusul.",
        cta: "Sedang disiapkan",
      },
    },
    footer: {
      eyebrow: "Ayo bangun",
      headingLead: "Siap membangun",
      headingEmph: "sesuatu yang bekerja?",
      sub: "Ceritakan apa yang sedang kamu buat: website, automation, atau keduanya. Balasan pertama biasanya dalam sehari.",
      cta: "Mulai lewat WhatsApp",
      secondary: "Lihat karya",
      email: "atau email",
      status: "Terbuka untuk proyek",
    },
  },
} as const;
