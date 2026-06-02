export type Project = {
  id: string;
  title: string;
  client: string;
  year: number;
  role: string;
  tags: string[];
  video: string;
  poster: string;
  accent: "cyan" | "purple" | "magenta";
  note?: string;
  duration?: string;
  href?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "nimbus-studio",
    title: "Nimbus Studio",
    client: "Nimbus",
    year: 2025,
    role: "Product site · launch motion",
    tags: ["AI", "Design Tool"],
    video: "/clips/shot-219.mp4",
    poster: "/posters/nimbus.jpg",
    accent: "purple",
    duration: "00:05",
    note: "A real-time generative canvas — sketch a shape, watch a production-ready render emerge.",
    featured: true,
  },
  {
    id: "doleme-studio",
    title: "Doleme Studio",
    client: "Doleme",
    year: 2025,
    role: "Agency site · editorial layout",
    tags: ["Agency", "Branding"],
    video: "/clips/shot-868.mp4",
    poster: "/posters/doleme.jpg",
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
    tags: ["Fintech", "AI"],
    video: "/clips/halo.mp4",
    poster: "/posters/halo.jpg",
    accent: "cyan",
    duration: "00:08",
    note: "An AI compute platform built for institutional-grade inference at market speed.",
  },
  {
    id: "kooaz",
    title: "Kooaz",
    client: "Kooaz",
    year: 2025,
    role: "Product site · hero motion",
    tags: ["Fintech", "AI"],
    video: "/clips/shot-323.mp4",
    poster: "/posters/kooaz.jpg",
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
    tags: ["IT Services", "B2B"],
    video: "/clips/shot-651.mp4",
    poster: "/posters/solutek.jpg",
    accent: "purple",
    duration: "01:00",
    note: "Trusted IT partner sejak 2019 — transformasi digital untuk bisnis Indonesia.",
  },
];
