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

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  opacity: number;
  lineWidth: number;
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
    let ripples: Ripple[] = [];
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let isHovering = false;
    let isMouseDown = false;
    let colorIndex = 0;
    let hasMoved = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawnParticles = (x: number, y: number, count: number, spread: number, baseSize = 2) => {
      if (reduced) return;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = (Math.random() * 0.75 + 0.25) * spread;
        const c = CMYK_COLORS[colorIndex % CMYK_COLORS.length]!;
        colorIndex++;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          color: c,
          size: Math.random() * baseSize + 1.2,
        });
      }
    };

    const spawnRipple = (x: number, y: number) => {
      if (reduced) return;
      const primaryColor = CMYK_COLORS[colorIndex % CMYK_COLORS.length]!;
      const secondaryColor = CMYK_COLORS[(colorIndex + 1) % CMYK_COLORS.length]!;
      colorIndex += 2;

      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 42,
        color: primaryColor,
        opacity: 0.9,
        lineWidth: 2.5,
      });

      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 26,
        color: secondaryColor,
        opacity: 0.7,
        lineWidth: 1.5,
      });
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        dx = mx;
        dy = my;
        rx = mx;
        ry = my;
      }

      spawnParticles(mx, my, 1, 1.2, 1.8);

      const el = e.target as HTMLElement | null;
      isHovering = !!el?.closest(
        "a, button, input, select, textarea, [data-cursor='splash'], [role='button'], [role='radio'], label, [tabindex]"
      );
    };

    const onDown = (e: MouseEvent) => {
      isMouseDown = true;
      mx = e.clientX;
      my = e.clientY;
      // High energy click events: ripple shockwave + particle splash
      spawnRipple(mx, my);
      spawnParticles(mx, my, 28, 6.5, 3.2);
    };

    const onUp = () => {
      isMouseDown = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      // Smooth interpolation for primary dot
      dx += (mx - dx) * 0.38;
      dy += (my - dy) * 0.38;

      // Trailing spring for outer ring
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      // Dynamic scales for hover and click states
      let scale = isHovering ? 1.6 : 1;
      let ringScale = isHovering ? 1.45 : 1;

      if (isMouseDown) {
        scale *= 0.7;
        ringScale *= 0.8;
      }

      dot.style.transform = `translate3d(${dx - 6}px, ${dy - 6}px, 0) scale(${scale})`;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(${ringScale})`;

      if (isMouseDown) {
        ring.style.borderColor = "#ff2a85";
        ring.style.backgroundColor = "rgba(255, 42, 133, 0.22)";
        ring.style.boxShadow = "0 0 25px rgba(255, 42, 133, 0.7)";
      } else if (isHovering) {
        ring.style.borderColor = "#00e5ff";
        ring.style.backgroundColor = "rgba(0, 229, 255, 0.12)";
        ring.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.5)";
      } else {
        ring.style.borderColor = "rgba(255, 42, 133, 0.5)";
        ring.style.backgroundColor = "transparent";
        ring.style.boxShadow = "0 0 15px rgba(255, 42, 133, 0.25)";
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Render expanding click ripples (shockwaves)
      ripples = ripples.filter((r) => r.opacity > 0.02 && r.radius < r.maxRadius);
      for (const r of ripples) {
        r.radius += (r.maxRadius - r.radius) * 0.18 + 0.8;
        r.opacity *= 0.9;
        ctx.save();
        ctx.globalAlpha = r.opacity;
        ctx.strokeStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.lineWidth = r.lineWidth;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render flying CMYK particles
      particles = particles.filter((p) => p.life > 0.02);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.life *= 0.91;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.life * p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] hidden md:block overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Outer CMYK Glowing Trail Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute top-0 left-0 w-8 h-8 rounded-full border border-splash-pink/60 transition-[border-color,background-color,box-shadow] duration-150 will-change-transform"
      />

      {/* Center Vivid CMYK Laser Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute top-0 left-0 w-3 h-3 rounded-full bg-gradient-to-tr from-[#00e5ff] via-[#ff2a85] to-[#ffe600] shadow-[0_0_12px_#00e5ff,0_0_20px_#ff2a85] will-change-transform"
      />
    </div>
  );
}
