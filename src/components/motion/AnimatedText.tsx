import { useEffect, useRef, useState, type ElementType, type ReactNode, Fragment } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  split?: "words" | "lines";
  delay?: number;
  stagger?: number;
  threshold?: number;
};

export function AnimatedText({
  as,
  children,
  className = "",
  split = "words",
  delay = 0,
  stagger = 40,
  threshold = 0.25,
}: Props) {
  const Tag = (as ?? "span") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  const nodes: ReactNode[] = Array.isArray(children) ? children : [children];
  let tokenIndex = 0;

  const renderString = (str: string) => {
    const parts = str.split(/(\s+)/);
    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) return <Fragment key={`s-${i}`}> </Fragment>;
      if (part === "") return null;
      const idx = tokenIndex++;
      return (
        <span key={`w-${i}-${idx}`} className="at-mask">
          <span
            className="at-inner"
            style={{
              transitionDelay: `${delay + idx * stagger}ms`,
              animationDelay: `${delay + idx * stagger}ms`,
            }}
          >
            {part}
          </span>
        </span>
      );
    });
  };

  return (
    <Tag
      ref={ref as never}
      className={`at-root ${inView ? "in-view" : ""} ${split === "lines" ? "at-lines" : "at-words"} ${className}`}
    >
      {nodes.map((n, i) =>
        typeof n === "string" ? <Fragment key={i}>{renderString(n)}</Fragment> : <Fragment key={i}>{n}</Fragment>,
      )}
    </Tag>
  );
}
