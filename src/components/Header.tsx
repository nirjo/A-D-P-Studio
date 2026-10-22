import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, MessageCircle, Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { SearchModal } from "@/components/SearchModal";
import { CartDrawer } from "@/components/CartDrawer";
import { AuthModal } from "@/components/AuthModal";

const NAV_LINKS = [
  { label: "T-Shirts", href: "/tshirts" },
  { label: "Mugs", href: "/mugs" },
  { label: "Keychains", href: "/keychains" },
  { label: "Tote Bags", href: "/tote-bags" },
  { label: "Phone Cases", href: "/phone-cases" },
  { label: "Combos", href: "/combos" },
];

const UV_SUB_LINKS = [
  { label: "Add All UV printings", href: "/uv-all" },
  { label: "UV Acrylic Photo Frame", href: "/uv-acrylic-photo-frame" },
  { label: "UV Transfer Sticker", href: "/uv-transfer-sticker" },
  { label: "Acrylic Gifts", href: "/acrylic-gifts" },
  { label: "Fridge Magnets", href: "/fridge-magnets" },
  { label: "MDF Gifts", href: "/mdf-gifts" },
  { label: "Custom Gifts", href: "/custom-gifts" },
  { label: "Fusion Gifts", href: "/fusion-gifts" },
  { label: "Trendy Gifts", href: "/trendy-gifts" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUvOpen, setMobileUvOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [uvMenuOpen, setUvMenuOpen] = useState(false);
  const uvDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { totalItems, toggleDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (uvDropdownRef.current && !uvDropdownRef.current.contains(event.target as Node)) {
        setUvMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menus on location change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUvMenuOpen(false);
  }, [location.pathname]);

  const openAuth = (tab: "signin" | "signup") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const isUvActive = UV_SUB_LINKS.some((link) => location.pathname === link.href);

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
                    active
                      ? "text-splash-pink font-bold border-b border-splash-pink"
                      : "text-foreground/75 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* UV Printing Dropdown */}
            <div ref={uvDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setUvMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1 py-1 transition-colors ${
                  isUvActive
                    ? "text-splash-pink font-bold border-b border-splash-pink"
                    : "text-foreground/75 hover:text-foreground"
                }`}
                aria-haspopup="true"
                aria-expanded={uvMenuOpen}
              >
                UV Printing & Gifts{" "}
                <ChevronDown
                  size={12}
                  className={`stroke-current transition-transform duration-200 ${
                    uvMenuOpen ? "rotate-180 text-splash-pink" : ""
                  }`}
                />
              </button>

              {uvMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-display uppercase tracking-widest text-muted-foreground border-b border-border/60 mb-1">
                    Specialty Prints & Gifts
                  </div>
                  <div className="max-h-[380px] overflow-y-auto space-y-0.5">
                    {UV_SUB_LINKS.map((link) => {
                      const active = location.pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            active
                              ? "bg-splash-pink/15 text-splash-pink font-semibold"
                              : "text-foreground hover:bg-secondary/60 hover:text-splash-pink"
                          }`}
                          onClick={() => setUvMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Actions: Search, Theme Toggle, Cart, Auth, WhatsApp, Hamburger */}
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

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to daylight theme"}
              title={theme === "light" ? "Switch to dark theme" : "Switch to daylight theme"}
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-splash-pink hover:border-splash-pink/40 transition-colors"
            >
              {theme === "light"
                ? <Moon size={16} className="text-splash-purple" />
                : <Sun size={16} className="text-splash-orange" />}
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

            {/* User Auth */}
            {!user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuth("signin")}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-display uppercase tracking-wider font-semibold text-foreground/80 hover:text-splash-pink px-2.5 py-1.5 rounded-full hover:bg-secondary/60 transition-colors"
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="hidden sm:inline-flex items-center text-xs font-display uppercase tracking-wider font-bold text-foreground bg-secondary/80 border border-splash-pink/40 hover:border-splash-pink px-3 py-1.5 rounded-full shadow-sm hover:shadow-splash-pink/20 transition-all"
                >
                  Sign Up
                </button>
                {/* Mobile icon only */}
                <button
                  type="button"
                  onClick={() => openAuth("signin")}
                  aria-label="Sign In or Sign Up"
                  title="Sign In / Sign Up"
                  className="sm:hidden w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground/80 hover:text-splash-pink hover:border-splash-pink/40 transition-colors"
                >
                  <User size={16} />
                </button>
              </div>
            ) : (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User account menu"
                  className="flex items-center gap-2 bg-secondary border border-border hover:border-splash-pink/40 rounded-full pl-1.5 pr-2.5 py-1 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-splash-purple to-splash-pink text-primary-foreground font-display text-[10px] font-bold flex items-center justify-center uppercase">
                    {user.user_metadata?.["full_name"]
                      ? String(user.user_metadata["full_name"])[0]
                      : (user.email ? user.email[0] : "U")}
                  </div>
                  <span className="hidden md:inline text-xs font-display font-medium text-foreground max-w-[90px] truncate">
                    {String(user.user_metadata?.["full_name"] || user.email?.split("@")[0])}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/60">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {String(user.user_metadata?.["full_name"] || "Member")}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display uppercase tracking-wider text-destructive hover:bg-destructive/10 rounded-xl transition-colors mt-1"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp CTA */}
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
          <div className="lg:hidden bg-card/95 backdrop-blur-2xl border-b border-border px-6 py-6 flex flex-col gap-3 shadow-2xl max-h-[85vh] overflow-y-auto">
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

            {/* Mobile UV Printing & Gifts Collapsible Accordion */}
            <div className="py-2 border-t border-border/80">
              <button
                type="button"
                onClick={() => setMobileUvOpen((prev) => !prev)}
                className="w-full flex items-center justify-between font-display text-sm tracking-wider uppercase text-foreground/85 hover:text-splash-pink py-1.5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-splash-pink" />
                  UV Printing & Gifts
                </span>
                <ChevronDown
                  size={15}
                  className={`stroke-current transition-transform duration-200 ${
                    mobileUvOpen ? "rotate-180 text-splash-pink" : "text-muted-foreground"
                  }`}
                />
              </button>

              {mobileUvOpen && (
                <div className="mt-2 ml-3.5 pl-3 border-l-2 border-splash-pink/40 flex flex-col gap-2 py-1">
                  {UV_SUB_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-display text-xs tracking-wider text-muted-foreground hover:text-splash-pink py-1 transition-colors flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <span className="text-[10px] text-muted-foreground">↗</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuth("signin")}
                    className="flex items-center justify-center gap-1.5 bg-secondary border border-border text-foreground font-display font-bold text-xs uppercase tracking-wider py-2.5 rounded-full hover:border-splash-pink/60 transition-colors"
                  >
                    <User size={14} /> Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuth("signup")}
                    className="flex items-center justify-center gap-1.5 bg-secondary border border-splash-pink/40 text-foreground font-display font-bold text-xs uppercase tracking-wider py-2.5 rounded-full hover:border-splash-pink transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-secondary/60 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-splash-purple to-splash-pink text-primary-foreground font-display text-xs font-bold flex items-center justify-center uppercase">
                      {user.user_metadata?.["full_name"]
                        ? String(user.user_metadata["full_name"])[0]
                        : (user.email ? user.email[0] : "U")}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-foreground leading-tight">
                        {String(user.user_metadata?.["full_name"] || "Member")}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="text-[11px] font-display uppercase tracking-wider text-destructive font-semibold px-2 py-1 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-display font-bold text-xs uppercase tracking-wider py-2.5 rounded-full"
              >
                {theme === "light"
                  ? <Moon size={15} className="text-splash-purple" />
                  : <Sun size={15} className="text-splash-orange" />}
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
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </>
  );
}
