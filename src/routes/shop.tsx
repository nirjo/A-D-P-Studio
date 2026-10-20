import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, ShoppingBag, MessageCircle, ArrowLeft, Check, Zap, Eye, RotateCcw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCTS, type Product } from "@/data/products";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "All Custom Printing Catalog — Aiel Design & Printing Studio, Puducherry" },
      {
        name: "description",
        content:
          "Browse all custom prints: T-shirts, mugs, keychains, tote bags, phone cases and combos. 48h rush delivery across India from Puducherry.",
      },
      { property: "og:title", content: "All Custom Prints — Aiel Studio Catalog" },
      {
        property: "og:description",
        content: "Explore 20+ custom printed apparel, drinkware, accessories & combos with instant personalization.",
      },
    ],
  }),
  component: ShopPage,
});

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Mugs",
  "Keychains",
  "Tote Bags",
  "Phone Cases",
  "Combo Packs",
];

function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addItem, items } = useCart();

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        p.categoryLabel.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === "Combo Packs" && p.category === "combos");

      const q = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.printTypes.some((pt) => pt.toLowerCase().includes(q));

      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, search, sortBy]);

  const handleQuickAdd = (p: Product) => {
    addItem({
      product: p,
      quantity: 1,
      selectedSize: p.sizes[0],
      selectedColor: p.colors[0]?.name,
      selectedPrintType: p.printTypes[0],
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <>
      <TopBar />
      <Header />

      <main className="grain-overlay min-h-screen bg-background text-foreground pt-10 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="glow-orb pointer-events-none fixed top-10 right-0 h-[60vw] w-[60vw] opacity-25" />
        <div className="glow-orb pointer-events-none fixed bottom-10 left-0 h-[45vw] w-[45vw] opacity-20" />

        {/* Back Link & Header Title */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-display tracking-widest text-muted-foreground hover:text-splash-pink transition-colors mb-3"
          >
            <ArrowLeft size={14} /> Back to Studio
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-display uppercase tracking-[0.3em] text-splash-pink font-bold">
                Puducherry Custom Print Atelier
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mt-1">
                All <span className="text-gradient">Custom Prints</span> &amp; Merch
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-display text-muted-foreground bg-secondary/80 border border-border px-4 py-2 rounded-full self-start md:self-auto">
              <Zap size={14} className="text-splash-orange animate-pulse" />
              <span>
                Turnaround: <strong className="text-foreground">48h Rush</strong> across India
              </span>
            </div>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search t-shirts, mugs, keychains, totes, cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-display uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border text-foreground text-xs font-display rounded-full px-4 py-3 focus:outline-none focus:border-splash-pink cursor-pointer"
              >
                <option value="featured">Featured Catalog</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-display tracking-wider uppercase whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-brand-gradient text-primary-foreground font-bold shadow-lg shadow-splash-pink/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Results Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-display tracking-wider mb-6">
          <span>Showing {filtered.length} custom products</span>
          {(activeCategory !== "All" || search !== "") && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearch("");
              }}
              className="text-splash-pink hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Reset filters
            </button>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <span className="text-5xl mb-4 block">🎨</span>
            <h3 className="font-display text-xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Try searching for something else or clear your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="bg-brand-gradient text-primary-foreground px-6 py-2.5 rounded-full text-xs font-display font-bold uppercase tracking-wider"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p, idx) => {
              const inCart = items.find((ci) => ci.product.id === p.id);
              const waText = encodeURIComponent(
                `Hello Aiel Studio, I want to order/customise ${p.name} (₹${p.price})`
              );

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative bg-card border border-border/70 hover:border-splash-pink/50 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-splash-pink/10"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 mb-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge */}
                      {p.badge && (
                        <span className="absolute top-3 left-3 bg-splash-pink text-primary-foreground font-display font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                          {p.badge}
                        </span>
                      )}

                      {/* Rating pill */}
                      <span className="absolute bottom-3 right-3 bg-background/85 backdrop-blur-md text-foreground/90 font-display text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                        ★ {p.rating}
                      </span>

                      {/* Quick detail link */}
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-splash-pink"
                        aria-label={`View ${p.name}`}
                      >
                        <Eye size={15} />
                      </Link>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-display uppercase tracking-widest">
                        <span>{p.categoryLabel}</span>
                        <span className="text-[10px] text-splash-teal">{p.turnaround}</span>
                      </div>

                      <Link to="/product/$slug" params={{ slug: p.slug }}>
                        <h3 className="font-display font-bold text-base text-foreground hover:text-splash-pink transition-colors leading-snug line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {p.printTypes.slice(0, 3).join(" • ")}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display text-xl font-extrabold text-gradient">
                        ₹{p.price}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{p.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(p)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${
                          addedId === p.id
                            ? "bg-splash-orange text-primary-foreground"
                            : "bg-brand-gradient text-primary-foreground hover:opacity-95 shadow-md shadow-splash-pink/20"
                        }`}
                      >
                        {addedId === p.id ? (
                          <>
                            <Check size={14} /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} /> {inCart ? `Add (${inCart.quantity})` : "Add"}
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-secondary border border-border text-foreground hover:border-splash-pink hover:text-splash-pink transition-colors"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
