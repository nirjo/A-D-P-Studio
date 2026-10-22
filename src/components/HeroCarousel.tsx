import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import workTee from "@/assets/work-tee.jpg";
import workMug from "@/assets/work-mug.jpg";
import workBag from "@/assets/work-bag.jpg";
import workCorporate from "@/assets/work-corporate.jpg";
import splash from "@/assets/splash.jpg";

interface SlideItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  price: string;
  link: string;
  image: string;
  badge: string;
  accent: string;
}

const SLIDES: SlideItem[] = [
  {
    id: "tshirts",
    tag: "Custom Apparel",
    title: "Oversized & French Terry T-Shirts",
    subtitle: "240 GSM heavy cotton streetwear & premium DTF printed tees crafted for maximum durability.",
    price: "From ₹449",
    link: "/tshirts",
    image: workTee,
    badge: "Most Popular",
    accent: "from-purple-500/30 to-pink-500/20",
  },
  {
    id: "mugs",
    tag: "Drinkware Essentials",
    title: "Ceramic & Magic Photo Mugs",
    subtitle: "High-gloss vibrant sublimation prints that won't fade. Perfect for desks and personalized gifting.",
    price: "From ₹199",
    link: "/mugs",
    image: workMug,
    badge: "Instant Favorite",
    accent: "from-amber-500/30 to-orange-500/20",
  },
  {
    id: "tote-bags",
    tag: "Eco Streetwear",
    title: "Heavy Canvas Tote Bags",
    subtitle: "100% natural cotton canvas with high-definition DTF screen printing for everyday utility.",
    price: "From ₹249",
    link: "/tote-bags",
    image: workBag,
    badge: "Eco Friendly",
    accent: "from-emerald-500/30 to-teal-500/20",
  },
  {
    id: "uv-acrylic",
    tag: "UV Print Studio",
    title: "UV Acrylic Photo Frames",
    subtitle: "Ultra-sharp ultraviolet cured prints on high-clarity optical acrylic with optional LED base.",
    price: "From ₹349",
    link: "/uv-acrylic-photo-frame",
    image: splash,
    badge: "New Release",
    accent: "from-blue-500/30 to-purple-500/20",
  },
  {
    id: "uv-collection",
    tag: "Specialty Gifting",
    title: "UV Transfers, Magnets & Gifts",
    subtitle: "All-surface waterproof UV stickers, vibrant fridge magnets, and personalized MDF wooden plaques.",
    price: "From ₹49",
    link: "/uv-all",
    image: workCorporate,
    badge: "Trending",
    accent: "from-rose-500/30 to-orange-500/20",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play 3 seconds per slide
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section
      aria-label="Featured Collections Carousel"
      className="relative w-full overflow-hidden bg-background border-b border-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl h-[420px] sm:h-[460px] md:h-[500px]">
          {/* Slides Container */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className="min-w-full h-full relative flex items-center shrink-0 select-none"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30 sm:to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} mix-blend-overlay`} />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-xl flex flex-col justify-center h-full">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-md border border-splash-pink/30 rounded-full px-3 py-1 w-fit mb-3">
                    <Sparkles size={12} className="text-splash-pink animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-display uppercase tracking-widest text-splash-pink font-semibold">
                      {slide.tag} • {slide.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.1] mb-3">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-6 font-sans leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-display font-bold text-lg sm:text-xl text-foreground">
                      {slide.price}
                    </span>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg hover:shadow-splash-pink/40 hover:scale-105 transition-all"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/70 hover:bg-background border border-border/80 backdrop-blur-md text-foreground flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/70 hover:bg-background border border-border/80 backdrop-blur-md text-foreground flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator & Progress */}
          <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2.5">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "w-8 bg-splash-pink shadow-md shadow-splash-pink/50"
                    : "w-2 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Slide Timer Indicator */}
          <div className="absolute top-0 inset-x-0 h-1 bg-secondary z-30">
            <div
              key={current}
              className="h-full bg-brand-gradient animate-carousel-progress"
              style={{ animationDuration: "3000ms" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
