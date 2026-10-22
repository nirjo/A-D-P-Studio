import { Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_PHONE } from "@/lib/cart";

interface UVPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  features: string[];
  useCases: string[];
  startingPrice?: string;
  whatsappMessage?: string;
  accentColor?: string;
}

export function UVPageLayout({
  title,
  subtitle,
  description,
  badge,
  features,
  useCases,
  startingPrice = "₹199",
  whatsappMessage = "Hello Aiel Studio! I'm interested in placing a custom order.",
}: UVPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-14 sm:py-20 border-b border-border/60 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-splash-purple/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-splash-pink/10 blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink mb-5 transition-colors"
            >
              <ArrowLeft size={13} /> Home
            </Link>

            <div className="inline-flex items-center gap-2 bg-secondary/80 border border-splash-pink/30 rounded-full px-3 py-1 mb-4">
              <Sparkles size={11} className="text-splash-pink" />
              <span className="text-[11px] font-display uppercase tracking-widest text-splash-pink">{badge}</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-foreground mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-xl leading-relaxed mb-3">
              {subtitle}
            </p>
            {startingPrice && (
              <p className="text-xl font-display font-bold text-foreground">
                Starting from <span className="text-gradient">{startingPrice}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={14} /> Order via WhatsApp
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-secondary border border-border text-foreground font-display font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full hover:border-splash-pink/40 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* About */}
            <div>
              <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink mb-3 block">About This Product</span>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{description}</p>
            </div>

            {/* Features */}
            <div>
              <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink mb-3 block">Key Features</span>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-splash-pink flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
            <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink mb-6 block text-center">Perfect For</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {useCases.map((u) => (
                <div
                  key={u}
                  className="bg-card border border-border rounded-xl px-4 py-3 text-center text-sm font-display text-foreground hover:border-splash-pink/40 transition-colors"
                >
                  {u}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
            Ready to order?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Chat with us on WhatsApp to get a quote, share your design, or ask any questions.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-sm uppercase tracking-wider px-10 py-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} /> Get a Free Quote
          </a>
        </section>

        <WhyAielStrip />
      </main>

      <Footer />
    </div>
  );
}
