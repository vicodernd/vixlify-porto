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
      note: "6 builds · all live",
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
    engagements: {
      eyebrow: "Client engagements",
      headingLead: "Proof we can't",
      headingEmph: "show you.",
      intro:
        "Some of the most demanding work never makes it into a portfolio. These are full systems built for real practices and companies. Some run under a confidentiality agreement, no name, no real data. Others are shown openly, screenshots and all, when the client is fine with it. Either way: the scope and the outcome it targets, honestly.",
      fields: {
        client: "Client",
        sector: "Sector",
        scope: "Scope",
        status: "Status",
      },
      ctaLine: "Running a similar process on spreadsheets and gut feel?",
      cta: "Chat on WhatsApp",
      list: [
        {
          id: "sop-cockpit",
          confidential: true,
          sectorValue: "Supply chain & operations planning",
          scopeValue: "Forecasting engine port, full UI rebuild",
          statusValue: "Confidential, delivered",
          stats: [
            { value: "7", label: "forecasting models ported and unit tested" },
            { value: "19", label: "operational screens computing in real time" },
            { value: "599+", label: "automated tests guarding the business math" },
            { value: "4", label: "data states: live, shadow, awaiting, quarantined" },
          ],
          values: [
            {
              index: "01",
              title: "Lower working capital",
              desc: "Every purchase ties back to real demand instead of a gut call, so less cash sits parked in inventory that isn't moving.",
            },
            {
              index: "02",
              title: "Less dead stock, same service level",
              desc: "Overstock and near-stockouts surface on the same screen, so slow movers get cleared without service level paying for it.",
            },
            {
              index: "03",
              title: "Lower warehouse cost",
              desc: "Buying the amount the data actually calls for, not a safety margin, means paying to store less of it.",
            },
          ],
          screens: [
            { src: "/engagement/sop-overview.jpg", label: "Executive summary" },
            { src: "/engagement/sop-decisions.jpg", label: "Decisions & signals" },
          ],
          screensCaption: "Real screens from the build, running on the demo dataset. Client identity redacted.",
          highlight:
            "What used to mean pulling numbers from a dozen spreadsheets before every monthly planning meeting now recomputes the moment new data lands.",
          benchmark:
            "Mature sales and operations planning programs are widely reported (Gartner, APICS) to cut inventory carrying cost by 10 to 20 percent while holding service levels flat. Published industry benchmark, not a measured result for this engagement.",
        },
        {
          id: "padel-schedule",
          confidential: false,
          clientValue: "Padel Coach (solo practice)",
          sectorValue: "Sports coaching & personal business ops",
          scopeValue: "Scheduling, revenue dashboard, AI auto-logging",
          statusValue: "Delivered, in daily use",
          stats: [
            { value: "2", label: "ways to log a booking: type it, or forward a screenshot" },
            { value: "3", label: "modules: schedule, revenue, expenses" },
            { value: "1", label: "AI agent that reads either input and files it itself" },
            { value: "Daily", label: "actually used to run a real coaching calendar" },
          ],
          values: [
            {
              index: "01",
              title: "Zero manual bookkeeping",
              desc: "No more copying bookings into a spreadsheet after every session. Type it or forward a screenshot, and it's already in the schedule and the revenue numbers.",
            },
            {
              index: "02",
              title: "Always know the real number",
              desc: "Revenue, unpaid sessions, and per-venue breakdowns stay current the moment a booking lands, not at the end of the month.",
            },
            {
              index: "03",
              title: "Logging takes seconds, not minutes",
              desc: "A coach between sessions doesn't have time for data entry. Text or photo in, structured record out, in the time it takes to send a message.",
            },
          ],
          screens: [
            { src: "/engagement/padel-jadwal.jpg", label: "Schedule" },
            { src: "/engagement/padel-omset.jpg", label: "Revenue dashboard" },
          ],
          screensCaption: "Real screens from the actual app, running on demo data for this preview.",
          highlight:
            "Built because a full coaching calendar had outgrown a spreadsheet. Now every booking, typed or photographed, updates itself.",
          benchmark:
            "Figures shown here are illustrative demo data, not real income. In daily use, this runs on the coach's own real schedule.",
        },
      ],
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
      vixwispr: {
        tag: "Free · Windows",
        title: "VixWispr",
        desc: "Voice dictation for Windows. Hold a hotkey, speak, and it types the cleaned-up result at your cursor.",
        cta: "Get VixWispr",
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
      note: "6 build · semua live",
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
    engagements: {
      eyebrow: "Kerja sama klien",
      headingLead: "Bukti yang tidak bisa",
      headingEmph: "kami tunjukkan.",
      intro:
        "Sebagian kerja paling menantang tidak pernah masuk portofolio. Ini sistem-sistem lengkap yang dibangun untuk praktik dan perusahaan sungguhan. Sebagian berjalan di bawah perjanjian kerahasiaan, tanpa nama, tanpa data asli. Sebagian lagi ditampilkan terang-terangan, lengkap dengan screenshot aslinya, kalau kliennya mengizinkan. Yang pasti: cakupan kerja dan hasil yang ditargetkan, apa adanya.",
      fields: {
        client: "Klien",
        sector: "Sektor",
        scope: "Cakupan",
        status: "Status",
      },
      ctaLine: "Masih menjalankan proses serupa lewat spreadsheet dan perkiraan?",
      cta: "Chat via WhatsApp",
      list: [
        {
          id: "sop-cockpit",
          confidential: true,
          sectorValue: "Perencanaan rantai pasok & operasi",
          scopeValue: "Port mesin forecasting, rebuild UI penuh",
          statusValue: "Rahasia, sudah diserahkan",
          stats: [
            { value: "7", label: "model forecasting yang di-port dan diuji unit" },
            { value: "19", label: "layar operasional yang menghitung real-time" },
            { value: "599+", label: "automated test yang menjaga logika bisnis" },
            { value: "4", label: "status data: live, shadow, awaiting, quarantined" },
          ],
          values: [
            {
              index: "01",
              title: "Modal kerja lebih rendah",
              desc: "Setiap pembelian mengacu pada permintaan nyata, bukan perkiraan kasar, jadi lebih sedikit uang tertahan di inventory yang tidak bergerak.",
            },
            {
              index: "02",
              title: "Dead stock lebih rendah, service level tetap terjaga",
              desc: "Overstock dan barang yang hampir habis muncul di layar yang sama, jadi barang lambat bisa dibersihkan tanpa mengorbankan service level.",
            },
            {
              index: "03",
              title: "Biaya gudang lebih rendah",
              desc: "Membeli sesuai jumlah yang benar-benar dibutuhkan data, bukan margin aman, berarti membayar lebih sedikit untuk menyimpannya.",
            },
          ],
          screens: [
            { src: "/engagement/sop-overview.jpg", label: "Ringkasan eksekutif" },
            { src: "/engagement/sop-decisions.jpg", label: "Keputusan & sinyal" },
          ],
          screensCaption: "Layar asli dari build ini, berjalan di atas dataset demo. Identitas klien disensor.",
          highlight:
            "Yang dulu berarti menarik angka dari belasan spreadsheet sebelum setiap rapat perencanaan bulanan, sekarang terhitung ulang saat data baru masuk.",
          benchmark:
            "Program sales and operations planning yang matang banyak dilaporkan (Gartner, APICS) memangkas biaya penyimpanan inventory 10 sampai 20 persen sambil menjaga service level tetap. Ini benchmark industri yang dipublikasikan, bukan hasil terukur dari kerja sama ini.",
        },
        {
          id: "padel-schedule",
          confidential: false,
          clientValue: "Padel Coach (praktik solo)",
          sectorValue: "Coaching olahraga & operasional bisnis pribadi",
          scopeValue: "Jadwal, dashboard omset, AI auto-log",
          statusValue: "Sudah diserahkan, dipakai tiap hari",
          stats: [
            { value: "2", label: "cara log booking: ketik teks atau kirim screenshot" },
            { value: "3", label: "modul: jadwal, omset, pengeluaran" },
            { value: "1", label: "AI agent yang membaca dua jenis input itu dan menyimpannya sendiri" },
            { value: "Harian", label: "benar-benar dipakai untuk jadwal coaching sungguhan" },
          ],
          values: [
            {
              index: "01",
              title: "Tidak ada lagi catat manual",
              desc: "Tidak perlu lagi menyalin booking ke spreadsheet setiap habis sesi. Ketik atau kirim screenshot-nya, langsung masuk ke jadwal dan angka omset.",
            },
            {
              index: "02",
              title: "Selalu tahu angka yang sebenarnya",
              desc: "Omset, sesi yang belum dibayar, dan rincian per venue selalu terkini seketika booking masuk, bukan menunggu akhir bulan.",
            },
            {
              index: "03",
              title: "Catat cuma hitungan detik",
              desc: "Coach di sela-sela sesi tidak punya waktu untuk input data. Teks atau foto masuk, catatan terstruktur keluar, secepat kirim pesan.",
            },
          ],
          screens: [
            { src: "/engagement/padel-jadwal.jpg", label: "Jadwal" },
            { src: "/engagement/padel-omset.jpg", label: "Dashboard omset" },
          ],
          screensCaption: "Layar asli dari app yang sungguhan, berjalan di atas data demo khusus untuk preview ini.",
          highlight:
            "Dibangun karena jadwal coaching yang penuh sudah lebih besar dari kapasitas spreadsheet. Sekarang setiap booking, diketik atau difoto, memperbarui dirinya sendiri.",
          benchmark:
            "Angka yang ditampilkan di sini adalah data demo ilustratif, bukan omset asli. Dalam pemakaian sehari-hari, ini berjalan di atas jadwal asli sang coach sendiri.",
        },
      ],
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
      vixwispr: {
        tag: "Gratis · Windows",
        title: "VixWispr",
        desc: "Dikte suara untuk Windows. Tahan satu hotkey, bicara, dan hasil yang sudah rapi langsung diketik di kursor.",
        cta: "Ambil VixWispr",
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
