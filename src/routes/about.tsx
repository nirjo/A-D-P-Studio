import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { ArrowLeft, MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE } from "@/lib/cart";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aiel Studio — Custom Printing Puducherry" },
      { name: "description", content: "Learn about Aiel Design & Printing Studio — Puducherry's premier custom print shop for apparel, gifts, UV printing and more." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 border-b border-border/60 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-splash-purple/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-splash-pink/10 blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink mb-6 transition-colors"
            >
              <ArrowLeft size={13} /> Home
            </Link>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-foreground mb-4">
              About <span className="text-gradient">Aiel Studio</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Puducherry's home for high-quality custom printing — from premium apparel to UV-printed gifts, corporate merch, and everything in between.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink mb-3 block">Our Story</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground mb-5">
                Crafted with passion in Puducherry
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Aiel Studio was born from a simple belief — that great design deserves great printing. We combine state-of-the-art print technology with creative expertise to deliver products that make an impression.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                From custom T-shirts and mugs to UV-printed acrylic frames, fridge magnets, MDF gifts, and personalised keychains — we handle it all in-house for consistent quality and fast turnarounds.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Based in Puducherry, we serve customers across India with a 48-hour rush option and doorstep delivery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Products", value: "200+" },
                { label: "Happy Clients", value: "5000+" },
                { label: "Years Active", value: "5+" },
                { label: "Rush Turnaround", value: "48h" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm"
                >
                  <p className="font-display font-extrabold text-3xl text-gradient">{stat.value}</p>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-14 bg-secondary/30 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground mb-8 text-center">
              What We Offer
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Custom T-Shirts & Apparel",
                "Mugs & Drinkware",
                "Keychains & Accessories",
                "Tote Bags",
                "Phone Cases",
                "UV Acrylic Photo Frames",
                "UV Transfer Stickers",
                "Acrylic & MDF Gifts",
                "Fridge Magnets",
                "Fusion & Trendy Gifts",
                "Corporate Combos",
                "Custom Gifts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm font-display text-foreground">
                  <span className="w-2 h-2 rounded-full bg-splash-pink flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-10">
            <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink mb-3 block">Get In Touch</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
              We'd love to hear from you
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <MapPin size={20} />, label: "Location", value: "Puducherry, India" },
              { icon: <Phone size={20} />, label: "Phone", value: "+91 91502 34277" },
              { icon: <Mail size={20} />, label: "Email", value: "hello@aielstudio.in" },
              { icon: <Instagram size={20} />, label: "Instagram", value: "@aielstudio" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-splash-pink">
                  {item.icon}
                </div>
                <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Aiel Studio! I'd like to know more about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-display font-bold text-sm uppercase tracking-wider px-8 py-3 rounded-full hover:border-splash-pink/40 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </section>

        <WhyAielStrip />
      </main>

      <Footer />
    </div>
  );
}
