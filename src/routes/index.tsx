import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import { SplashCursor } from "@/components/SplashCursor";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import {
  INSTAGRAM,
  MagneticButton,
  Reveal,
  SectionLabel,
  TiltCard,
  WHATSAPP,
  useWebGLSupport,
} from "@/components/ui-kit";
import type { ProductKey } from "@/components/ProductScene";
import mascot from "@/assets/mascot.png";
import splash from "@/assets/splash.jpg";
import workTee from "@/assets/work-tee.jpg";
import workMug from "@/assets/work-mug.jpg";
import workCap from "@/assets/work-cap.jpg";
import workBag from "@/assets/work-bag.jpg";
import workJersey from "@/assets/work-jersey.jpg";
import workCorporate from "@/assets/work-corporate.jpg";

const ProductScene = lazy(() => import("@/components/ProductScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aiel Design & Printing Studio — Custom Apparel & Merch" },
      {
        name: "description",
        content:
          "Custom t-shirts, jerseys, mugs, caps, bags and corporate gifts — designed and printed by Aiel Design & Printing Studio. Explore our interactive 3D product universe.",
      },
      { property: "og:title", content: "Aiel Design & Printing Studio" },
      {
        property: "og:description",
        content:
          "Custom apparel, corporate gifts & merch — designed and printed to move. Interactive 3D showcase by Aiel Design & Printing Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIES: { key: ProductKey; label: string; blurb: string }[] = [
  { key: "tshirt", label: "T-Shirts", blurb: "Soft-hand DTF & screen prints on premium cotton." },
  { key: "gifts", label: "Customized Gifts", blurb: "Personal moments, printed with precision." },
  { key: "mug", label: "Mugs", blurb: "Sublimation mugs with edge-to-edge colour." },
  { key: "cap", label: "Caps", blurb: "Embroidered and printed headwear." },
  { key: "keychain", label: "Keychains", blurb: "Acrylic & metal, full-colour finish." },
  { key: "bag", label: "Bags", blurb: "Totes and drawstrings built to be carried." },
  { key: "corporate", label: "Corporate Gifts", blurb: "Bulk kits with brand-perfect colour." },
];

const WORKS = [
  { src: workTee, title: "Splash Tee Drop" },
  { src: workJersey, title: "Team Jersey — Kit 13" },
  { src: workMug, title: "Studio Mug Series" },
  { src: workCap, title: "Snapback Embroidery" },
  { src: workBag, title: "Canvas Tote Edition" },
  { src: workCorporate, title: "Corporate Welcome Kit" },
];

const STEPS = [
  { n: "01", t: "Upload your design", d: "Send artwork or a rough idea on WhatsApp — we take it from there." },
  { n: "02", t: "We print & preview", d: "Colour-matched proof and a digital mockup before anything runs." },
  { n: "03", t: "You approve", d: "One tap approval. Revisions are free until the colour is right." },
  { n: "04", t: "Delivered", d: "Packed, quality checked and shipped anywhere in India." },
];

const TESTIMONIALS = [
  { q: "The jerseys came out sharper than the mockup. Whole team was stunned.", a: "Arun K. — Club Captain" },
  { q: "Our onboarding kits finally look like the brand deck. Zero colour drift.", a: "Divya S. — HR Lead" },
  { q: "Ordered 200 mugs in 4 days. Packaging alone made it feel premium.", a: "Rahul M. — Founder" },
];

function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 mix-blend-difference">
      <a href="#top" className="font-display text-2xl font-extrabold tracking-tight">
        Aiel
      </a>
      <nav className="hidden gap-8 font-display text-[0.7rem] tracking-[0.3em] uppercase md:flex">
        {["Studio", "Products", "Process", "Work", "Contact"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-60">
            {l}
          </a>
        ))}
      </nav>
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noreferrer"
        className="font-display text-[0.7rem] tracking-[0.3em] uppercase hover:opacity-60"
      >
        @aieldesignstudio
      </a>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMascot = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="grain-overlay relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <motion.div
        className="glow-orb absolute top-1/4 right-0 h-[70vw] w-[70vw] opacity-60"
        style={{ x: pointer.x * -40, y: pointer.y * -40 }}
      />
      <motion.img
        src={splash}
        alt=""
        aria-hidden
        className="absolute top-1/4 right-0 w-[70vw] max-w-2xl opacity-35 mix-blend-screen"
        style={{ x: pointer.x * 30, y: pointer.y * 20, scale }}
      />
      <motion.img
        src={mascot}
        alt="Aiel studio mascot wearing branded streetwear"
        width={1024}
        height={1280}
        className="pointer-events-none absolute right-[-14%] bottom-0 h-[60svh] w-auto opacity-40 drop-shadow-[0_40px_80px_rgba(255,45,155,0.25)] md:right-[-10%] md:h-[92svh] md:opacity-100"
        style={{ y: yMascot, x: pointer.x * -18 }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 md:px-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-gradient gradient-pan font-display text-[24vw] leading-[0.8] font-extrabold tracking-tighter md:text-[11rem]"
        >
          Aiel
        </motion.h1>
        <p className="mt-4 font-display text-[0.7rem] tracking-[0.5em] text-muted-foreground uppercase md:text-xs">
          Design &amp; Printing Studio
        </p>
        <p className="mt-6 max-w-sm text-balance text-muted-foreground">
          Custom apparel, corporate gifts &amp; merch — designed and printed to move.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton href={WHATSAPP}>Start Your Design</MagneticButton>
          <MagneticButton href="#products" variant="ghost">
            Explore Products
          </MagneticButton>
        </div>
      </motion.div>
    </section>

  );
}

function About() {
  return (
    <section id="studio" className="relative mx-auto max-w-7xl px-6 py-32 md:px-12">
      <SectionLabel index="01" title="Studio" />
      <div className="grid gap-14 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          {[
            "Aiel is a print studio built around one obsession: colour that survives the press. Every splash, gradient and halftone we lay down is proofed against the fabric it lands on.",
            "From a single custom gift to a 2,000-piece corporate rollout, the same hands check the first print and the last one.",
            "We design it, we print it, we stand behind it.",
          ].map((p, i) => (
            <Reveal key={p} delay={i * 0.1}>
              <p className="mb-8 text-2xl leading-snug text-balance md:text-4xl">
                <span className={i === 0 ? "text-foreground" : "text-muted-foreground"}>{p}</span>
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="relative">
          <div className="glow-orb absolute inset-0 opacity-50" />
          <img
            src={mascot}
            alt="Aiel mascot"
            loading="lazy"
            width={1024}
            height={1280}
            className="animate-float relative mx-auto h-[420px] w-auto"
          />
        </Reveal>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4">
        {[
          ["12k+", "Pieces printed"],
          ["300+", "Brands served"],
          ["48h", "Rush turnaround"],
          ["100%", "Colour proofed"],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 0.08}>
            <div className="text-gradient font-display text-4xl font-extrabold">{v}</div>
            <div className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductUniverse() {
  const [active, setActive] = useState<ProductKey>("tshirt");
  const webgl = useWebGLSupport();
  const current = CATEGORIES.find((c) => c.key === active)!;

  return (
    <section id="products" className="relative border-y border-border bg-card/30 py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionLabel index="02" title="Product Universe" />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-display text-5xl leading-[0.95] font-extrabold text-balance md:text-7xl">
              Drag it. Spin it.
              <br />
              <span className="text-gradient">Print it.</span>
            </h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
                className="mt-6 max-w-md text-muted-foreground"
              >
                {current.blurb}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  data-cursor="splash"
                  onClick={() => setActive(c.key)}
                  className={`rounded-full border px-5 py-2.5 font-display text-xs tracking-widest uppercase transition-all ${
                    active === c.key
                      ? "bg-brand-gradient border-transparent text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="mt-10">
              <MagneticButton href={WHATSAPP}>Customise {current.label}</MagneticButton>
            </div>
          </div>

          <div className="relative h-[440px] overflow-hidden rounded-3xl border border-border bg-background md:h-[560px]">
            <div className="glow-orb absolute inset-x-10 top-1/4 h-1/2 opacity-60" />
            <ClientOnly
              fallback={<div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Loading studio…</div>}
            >
              {webgl ? (
                <Suspense
                  fallback={
                    <div className="absolute inset-0 grid place-items-center font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
                      Rendering…
                    </div>
                  }
                >
                  <ProductScene product={active} />
                </Suspense>
              ) : (
                <div className="absolute inset-0 grid place-items-center p-8 text-center">
                  <div>
                    <img src={splash} alt="" aria-hidden className="mx-auto w-56 opacity-80" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      3D preview is disabled on this device. Message us for full product mockups.
                    </p>
                  </div>
                </div>
              )}
            </ClientOnly>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[0.6rem] tracking-[0.4em] text-muted-foreground uppercase">
              Drag to rotate
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="mx-auto max-w-7xl px-6 py-32 md:px-12">
      <SectionLabel index="03" title="How it works" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <TiltCard className="grain-overlay relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8">
              <div
                className="glow-orb absolute -top-10 -right-10 h-40 w-40 opacity-70"
                style={{ filter: "blur(50px)" }}
              />
              <div className="text-gradient font-display text-5xl font-extrabold">{s.n}</div>
              <h3 className="mt-6 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    void (async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 768) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !wrap.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const distance = track.current!.scrollWidth - window.innerWidth + 96;
        gsap.to(track.current, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, wrap);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="work" ref={wrap} className="relative overflow-hidden border-y border-border py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionLabel index="04" title="Selected work" />
      </div>
      <div ref={track} className="flex gap-6 px-6 md:px-12">
        {WORKS.map((w, i) => (
          <motion.figure
            key={w.title}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-border md:w-[34vw]"
          >
            <img
              src={w.src}
              alt={w.title}
              loading="lazy"
              width={900}
              height={1100}
              className="h-[52vh] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-6 font-display text-sm tracking-widest uppercase">
              {w.title}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Corporate() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 md:px-12">
      <SectionLabel index="05" title="Corporate & bulk" />
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-4xl leading-tight font-extrabold text-balance md:text-6xl">
            Kitting out a team of <span className="text-gradient">50 or 5,000?</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Jerseys, onboarding kits, event merch and client gifting — one colour standard across
            every unit, delivered on a schedule you can plan around.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {["Dedicated account contact", "Pantone-matched proofing", "Staggered bulk delivery", "GST invoicing"].map(
              (li) => (
                <li key={li} className="flex items-center gap-3">
                  <span className="bg-brand-gradient h-1.5 w-6 rounded-full" />
                  {li}
                </li>
              ),
            )}
          </ul>
          <div className="mt-10">
            <MagneticButton href={WHATSAPP}>Request Bulk Quote</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <TiltCard className="overflow-hidden rounded-3xl border border-border">
            <img
              src={workCorporate}
              alt="Corporate gifting kit printed by Aiel"
              loading="lazy"
              width={900}
              height={1100}
              className="h-full w-full object-cover"
            />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5200);
    return () => window.clearInterval(id);
  }, []);
  const t = TESTIMONIALS[i]!;

  return (
    <section className="border-y border-border bg-card/30 py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionLabel index="06" title="Clients" />
        <div className="relative h-56 [perspective:1200px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, rotateX: 60, y: 40 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -60, y: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="font-display text-2xl leading-snug text-balance md:text-4xl">
                “{t.q}”
              </p>
              <footer className="mt-6 text-xs tracking-[0.3em] text-muted-foreground uppercase">
                {t.a}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Testimonial ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "bg-brand-gradient w-8" : "w-3 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="grain-overlay relative overflow-hidden px-6 py-36 text-center">
      <div className="glow-orb absolute inset-x-1/4 top-1/4 h-1/2 opacity-70" />
      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <h2 className="font-display text-[13vw] leading-[0.85] font-extrabold tracking-tighter md:text-[9rem]">
            Let’s <span className="text-gradient gradient-pan">print</span> it
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-muted-foreground">
            Send us a sketch, a logo, or just an idea. We’ll come back with a mockup and a price the
            same day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href={WHATSAPP}>WhatsApp +91 91502 34277</MagneticButton>
            <MagneticButton href={INSTAGRAM} variant="ghost">
              @aieldesignstudio
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-10 md:px-12">
      <div className="bg-brand-gradient gradient-pan h-px w-full" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 pt-8 text-xs tracking-[0.2em] text-muted-foreground uppercase md:flex-row">
        <span>Aiel Design &amp; Printing Studio</span>
        <div className="flex gap-6">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-foreground">
            Instagram
          </a>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-foreground">
            WhatsApp
          </a>
        </div>
        <span>© {new Date().getFullYear()} — Printed with colour</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      data-cursor="splash"
      aria-label="Chat on WhatsApp"
      className="bg-brand-gradient animate-pulse-glow fixed right-6 bottom-6 z-50 grid h-14 w-14 place-items-center rounded-full text-primary-foreground"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.25.7-1.44 1.33-1.99 1.38-.53.05-1.02.24-3.43-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.54-1.16-2.94s.74-2.09 1-2.37c.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.63.48.24.58.8 2 .87 2.14.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.16-.3.36-.43.48-.14.14-.29.29-.12.57.16.28.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.63-.14.25.1 1.63.77 1.9.91.28.14.47.21.53.33.07.11.07.66-.18 1.36Z" />
      </svg>
    </a>
  );
}

function Index() {
  const [ready, setReady] = useState(false);
  useSmoothScroll(ready);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <main className="relative">
      <ClientOnly fallback={null}>
        <Preloader onDone={onDone} />
        <SplashCursor />
      </ClientOnly>
      <Nav />
      <Hero />
      <About />
      <ProductUniverse />
      <Process />
      <Gallery />
      <Corporate />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
