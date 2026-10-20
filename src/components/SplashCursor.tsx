import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

// CMYK + Neon Studio Palette
// Cyan: #00e5ff, Magenta: #ff2a85, Yellow: #ffe600, Purple: #9d4edd, Orange: #ff6b35
const CMYK_COLORS = [
  "#00e5ff", // Pure Cyan
  "#ff2a85", // Hot Magenta
  "#ffe600", // Process Yellow
  "#9d4edd", // Deep Neon Violet
  "#ff6b35", // Vibrant Orange
];

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let isHovering = false;
    let colorIndex = 0;

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
        const c = CMYK_COLORS[colorIndex % CMYK_COLORS.length]!;
        colorIndex++;
        particles.push({
          x: mx,
          y: my,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color: c,
          size: Math.random() * 3 + 1.5,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      spawn(1, 1.2);

      const el = e.target as HTMLElement | null;
      isHovering = !!el?.closest("a, button, input, select, textarea, [data-cursor='splash'], [role='button']");
    };

    const onDown = () => spawn(24, 7);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      // Smooth interpolation for primary dot
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;

      // Trailing spring for outer ring
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;

      const scale = isHovering ? 1.7 : 1;
      const ringScale = isHovering ? 1.4 : 1;

      dot.style.transform = `translate3d(${dx - 6}px, ${dy - 6}px, 0) scale(${scale})`;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(${ringScale})`;

      if (isHovering) {
        ring.style.borderColor = "#00e5ff";
        ring.style.backgroundColor = "rgba(0, 229, 255, 0.08)";
      } else {
        ring.style.borderColor = "rgba(255, 42, 133, 0.5)";
        ring.style.backgroundColor = "transparent";
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0.02);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life *= 0.91;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.life * p.size), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
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
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Outer CMYK Glowing Trail Ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full border border-splash-pink/60 transition-[border-color,background-color] duration-200 shadow-[0_0_15px_rgba(255,42,133,0.35)]"
      />

      {/* Center Vivid CMYK Laser Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-3 h-3 rounded-full bg-gradient-to-tr from-[#00e5ff] via-[#ff2a85] to-[#ffe600] shadow-[0_0_12px_#00e5ff,0_0_20px_#ff2a85]"
      />
    </div>
  );
}
