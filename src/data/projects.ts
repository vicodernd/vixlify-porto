export type Project = {
  id: string;
  title: string;
  client: string;
  year: number;
  role: string;
  /** Short discipline label shown on the tile (e.g. "Fragrance", "Fintech"). */
  category: string;
  tags: string[];
  video: string;
  poster: string;
  accent: "cyan" | "purple" | "magenta";
  note?: string;
  duration?: string;
  href?: string;
  featured?: boolean;
  /**
   * "exploration" = self-directed concept study (no client, no live site).
   * "client" = real engagement. Drives the tile badge + whether it links out.
   * Defaults to "exploration" when omitted.
   */
  kind?: "exploration" | "client";
};

export const projects: Project[] = [
  {
    id: "nimbus-studio",
    title: "Nimbus Studio",
    client: "Nimbus",
    year: 2025,
    role: "Product site · launch motion",
    category: "AI design tool",
    kind: "exploration",
    tags: ["AI", "Design Tool"],
    video: "/clips/shot-219.mp4",
    poster: "/posters/nimbus.jpg",
    accent: "purple",
    duration: "00:05",
    note: "A real-time generative canvas. Sketch a shape, watch a production-ready render emerge.",
    featured: true,
  },
  {
    id: "clara-secure",
    title: "Clara Secure",
    client: "Clara",
    year: 2025,
    role: "Personal site · cybersecurity",
    category: "Cybersecurity",
    kind: "exploration",
    tags: ["Cyber Security", "Personal Brand"],
    video: "/clips/shots-so.mp4",
    poster: "/posters/shots-so.jpg",
    accent: "cyan",
    duration: "00:05",
    note: "Offensive testing, threat hunting, and zero-trust architecture for teams that can't afford a bad day.",
  },
  {
    id: "solenne-studio",
    title: "Solenne Studio",
    client: "Solenne",
    year: 2025,
    role: "Agency site · editorial layout",
    category: "Creative agency",
    kind: "exploration",
    tags: ["Agency", "Branding"],
    video: "/clips/shot-868.mp4",
    poster: "/posters/solenne.jpg",
    accent: "purple",
    duration: "00:28",
    note: "A boutique studio site where early-stage ideas become brands that feel inevitable.",
  },
  {
    id: "oreli-parfum",
    title: "Oreli",
    client: "Oreli Parfum",
    year: 2025,
    role: "Brand site · sensory motion",
    category: "Fragrance",
    kind: "exploration",
    tags: ["Luxury", "Fragrance"],
    video: "/clips/shot-52.mp4",
    poster: "/posters/oreli.jpg",
    accent: "magenta",
    duration: "00:04",
    note: "A perfume house that lets silence sell the scent. Bloom, slowly.",
  },
  {
    id: "halcyon-compute",
    title: "Halcyon Compute",
    client: "Halcyon",
    year: 2025,
    role: "Brand site · hero motion",
    category: "AI compute",
    kind: "exploration",
    tags: ["Fintech", "AI"],
    video: "/clips/halo.mp4",
    poster: "/posters/halo.jpg",
    accent: "cyan",
    duration: "00:08",
    note: "An AI compute platform built for institutional-grade inference at market speed.",
  },
  {
    id: "kodaz",
    title: "Kodaz",
    client: "Kodaz",
    year: 2025,
    role: "Product site · hero motion",
    category: "Fintech",
    kind: "exploration",
    tags: ["Fintech", "AI"],
    video: "/clips/shot-323.mp4",
    poster: "/posters/kodaz.jpg",
    accent: "cyan",
    duration: "00:18",
    note: "An AI-powered financial companion that makes finance finally feel personal.",
  },
  {
    id: "solutek-terpadu",
    title: "SoluTek Terpadu",
    client: "SoluTek",
    year: 2024,
    role: "Company site · digital transformation",
    category: "IT services",
    kind: "exploration",
    tags: ["IT Services", "B2B"],
    video: "/clips/shot-651.mp4",
    poster: "/posters/solutek.jpg",
    accent: "purple",
    duration: "01:00",
    note: "A digital-transformation partner for growing businesses. Enterprise trust, without the enterprise stiffness.",
  },
];
