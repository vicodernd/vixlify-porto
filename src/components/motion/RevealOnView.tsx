import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  style?: CSSProperties;
  once?: boolean;
};

export function RevealOnView({
  as,
  children,
  className = "",
  delay = 0,
  threshold = 0.2,
  style,
  once = true,
}: Props) {
  const Tag = (as ?? "div") as ElementType;
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
            if (once) obs.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "in-view" : ""} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
