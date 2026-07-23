import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NeuralBackgroundProps {
  className?: string;
  color?: string;
  colors?: string[];
  trailOpacity?: number;
  fadeRgb?: string;
  particleCount?: number;
  speed?: number;
  /** Enable the Trionn-style "hold to blast": pressing pushes particles out hard. */
  blastOnHold?: boolean;
}

export default function NeuralBackground({
  className,
  color = "#ececec",
  colors,
  trailOpacity = 0.08,
  fadeRgb = "10,10,10",
  particleCount = 600,
  speed = 1,
  blastOnHold = false,
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = colors && colors.length > 0 ? colors : [color];

    let width = container.clientWidth;
    let height = container.clientHeight;
    let particles: Particle[] = [];
    let animationFrameId = 0;
    const mouse = { x: -1000, y: -1000, pressed: false };

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; age = 0; life = 0; color = palette[0];
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0; this.vy = 0;
        this.age = initial ? Math.random() * 100 : 0;
        this.life = Math.random() * 220 + 120;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
        this.vx += Math.cos(angle) * 0.2 * speed;
        this.vy += Math.sin(angle) * 0.2 * speed;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = mouse.pressed ? 320 : 160;
        const push = mouse.pressed ? 0.24 : 0.05;
        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          this.vx -= dx * force * push;
          this.vy -= dy * force * push;
        }

        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.95; this.vy *= 0.95;
        this.age++;
        if (this.age > this.life) this.reset();
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw(c: CanvasRenderingContext2D) {
        const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
        c.globalAlpha = Math.max(0, alpha);
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, 1.5, 1.5);
      }
    }

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(${fadeRgb}, ${trailOpacity})`;
      ctx.fillRect(0, 0, width, height);
      for (const p of particles) { p.update(); p.draw(ctx); }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      init();
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; mouse.pressed = false; };
    const handleDown = (e: PointerEvent) => {
      if (blastOnHold) mouse.pressed = true;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleUp = () => { mouse.pressed = false; };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    init();
    if (!reduce) animate();
    else {
      for (const p of particles) p.draw(ctx);
    }

    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, colors, trailOpacity, fadeRgb, particleCount, speed, blastOnHold]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
