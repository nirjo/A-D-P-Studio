import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const COLORS = ["#38bdf8", "#a855f7", "#ff2d9b", "#ff9a1e", "#2dd4bf"];

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let scale = 1;
    let targetScale = 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const spawn = (count: number, spread: number) => {
      if (reduced) return;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * spread;
        particles.push({
          x: mx,
          y: my,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      spawn(1, 1.2);
      const el = e.target as HTMLElement | null;
      targetScale = el?.closest("a,button,[data-cursor='splash']") ? 2.6 : 1;
    };
    const onDown = () => spawn(26, 7);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      dx += (mx - dx) * 0.18;
      dy += (my - dy) * 0.18;
      scale += (targetScale - scale) * 0.15;
      dot.style.transform = `translate3d(${dx - 10}px, ${dy - 10}px, 0) scale(${scale})`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life *= 0.92;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.life * 5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={dotRef}
        className="bg-brand-gradient absolute top-0 left-0 h-5 w-5 rounded-full mix-blend-screen"
      />
    </div>
  );
}
