const items = [
  { label: "Brand Sites", dot: "#00E5FF" },
  { label: "Product UI", dot: "#8B5CF6" },
  { label: "Design Systems", dot: "#FF2D95" },
  { label: "Motion & Reels", dot: "#00E5FF" },
  { label: "Mobile Apps", dot: "#8B5CF6" },
  { label: "Landing Pages", dot: "#FF2D95" },
  { label: "Art Direction", dot: "#00E5FF" },
];

export function Marquee() {
  const loop = [...items, ...items];
  return (
    <section aria-label="What we do" className="relative border-y border-white/8 bg-[#080a14] py-6">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {loop.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: it.dot, boxShadow: `0 0 12px ${it.dot}` }}
              />
              <span className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white/85">
                {it.label}
              </span>
              <span className="text-white/20">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
