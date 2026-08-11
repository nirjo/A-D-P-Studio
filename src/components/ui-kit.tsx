import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const WHATSAPP = "https://wa.me/919150234277";
export const INSTAGRAM = "https://instagram.com/aieldesignstudio";

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };

  const base =
    "relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-display text-sm font-semibold tracking-wide uppercase transition-colors";
  const styles =
    variant === "primary"
      ? "bg-brand-gradient gradient-pan text-primary-foreground"
      : "border border-border text-foreground hover:bg-secondary";

  const inner = (
    <motion.span whileTap={{ scale: 0.94 }} className={`${base} ${styles}`}>
      {children}
    </motion.span>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
      data-cursor="splash"
    >
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setT({
          rx: ((e.clientY - r.top) / r.height - 0.5) * -14,
          ry: ((e.clientX - r.left) / r.width - 0.5) * 14,
        });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      style={{
        transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
        transition: "transform 220ms ease-out",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-display text-xs tracking-[0.4em] text-muted-foreground">{index}</span>
      <span className="bg-brand-gradient h-px w-16" />
      <span className="font-display text-xs tracking-[0.4em] text-muted-foreground uppercase">
        {title}
      </span>
    </div>
  );
}

export function useWebGLSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setSupported(ok && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}
