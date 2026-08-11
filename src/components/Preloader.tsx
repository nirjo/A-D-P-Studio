import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    const id = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / duration);
      setProgress((1 - Math.pow(1 - t, 3)) * 100);
      if (t >= 1) {
        window.clearInterval(id);
        window.setTimeout(() => {
          setGone(true);
          onDone();
        }, 350);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [onDone]);



  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="glow-orb pointer-events-none absolute h-[42vw] w-[42vw] opacity-40" />
          <div className="relative overflow-hidden">
            <motion.span
              className="text-gradient gradient-pan font-display text-6xl font-extrabold tracking-tight md:text-8xl"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Aiel
            </motion.span>
          </div>
          <p className="mt-4 font-display text-[0.65rem] tracking-[0.55em] text-muted-foreground uppercase">
            Design &amp; Printing Studio
          </p>
          <div className="relative mt-10 h-px w-56 overflow-hidden bg-border md:w-80">
            <div
              className="bg-brand-gradient absolute inset-y-0 left-0"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 font-display text-sm tabular-nums text-muted-foreground">
            {Math.round(progress).toString().padStart(3, "0")}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
