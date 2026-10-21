import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, MessageCircle, Sun, Moon } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";
import { useTheme } from "@/lib/theme";
import { SearchModal } from "@/components/SearchModal";
import { CartDrawer } from "@/components/CartDrawer";

const NAV_LINKS = [
  { label: "T-Shirts", href: "/tshirts" },
  { label: "Mugs", href: "/mugs" },
  { label: "Keychains", href: "/keychains" },
  { label: "Tote Bags", href: "/tote-bags" },
  { label: "Phone Cases", href: "/phone-cases" },
  { label: "Combos", href: "/combos" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, toggleDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1.5px] shadow-lg shadow-splash-pink/20">
              <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center overflow-hidden">
                <img
                  src={mascot}
                  alt="Aiel Studio Mascot"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-foreground flex items-center gap-1 leading-none">
                AIEL <span className="text-gradient">STUDIO</span>
              </span>
              <span className="text-[10px] font-sans tracking-widest text-muted-foreground uppercase leading-none mt-1 hidden sm:block">
                Puducherry Custom Prints
              </span>
            </div>
          </Link>

          {/* Desktop Category Menu */}
          <nav className="hidden lg:flex items-center gap-6 font-display text-[0.72rem] tracking-[0.2em] uppercase">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors py-1 ${
                    active ? "text-splash-pink font-bold border-b border-splash-pink" : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, Theme Toggle, Cart, WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search custom print catalog"
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-splash-pink hover:border-splash-pink/40 transition-colors"
            >
              <Search size={16} />
            </button>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to daylight pale white theme"}
              title={theme === "light" ? "Switch to dark theme" : "Switch to daylight theme"}
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-splash-pink hover:border-splash-pink/40 transition-colors"
            >
              {theme === "light" ? <Moon size={16} className="text-splash-purple" /> : <Sun size={16} className="text-splash-orange" />}
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="Open cart"
              className="relative w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-splash-pink hover:border-splash-pink/40 transition-colors"
            >
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-splash-pink text-primary-foreground font-display text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-splash-pink/50 animate-pulse-glow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Aiel Studio, I want to discuss a custom design!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-brand-gradient gradient-pan text-primary-foreground font-display font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full shadow-md shadow-splash-pink/20 hover:opacity-95 transition-opacity"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-foreground"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-card/95 backdrop-blur-2xl border-b border-border px-6 py-6 flex flex-col gap-3 shadow-2xl">
            <span className="text-[11px] font-display uppercase tracking-widest text-muted-foreground pb-1 border-b border-border">
              Print Categories
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-sm tracking-wider uppercase text-foreground/85 hover:text-splash-pink py-1.5 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-muted-foreground">→</span>
              </Link>
            ))}

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-display font-bold text-xs uppercase tracking-wider py-2.5 rounded-full"
              >
                {theme === "light" ? <Moon size={15} className="text-splash-purple" /> : <Sun size={15} className="text-splash-orange" />}
                <span>{theme === "light" ? "Switch to Dark Theme" : "Switch to Daylight Theme"}</span>
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Aiel Studio, I want to place a custom order!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3 rounded-full"
              >
                <MessageCircle size={15} /> Chat on WhatsApp (+91 91502 34277)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
