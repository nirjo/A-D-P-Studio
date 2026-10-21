import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowLeft, RotateCcw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";

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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-display tracking-[0.3em] uppercase text-splash-pink font-bold">
                Catalog &amp; Online Ordering
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 text-foreground">
                All Custom <span className="text-gradient">Prints</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              Explore 20+ custom printable products. Select colours, configure print techniques &amp; order direct on WhatsApp.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card/70 border border-border/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 mb-10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, materials, styles (e.g. DTF, hoodie, mug, MagSafe)..."
                className="w-full bg-secondary/60 border border-border rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink transition-colors font-sans"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary/60 border border-border rounded-full px-5 py-3 text-xs font-display tracking-wider uppercase text-foreground focus:outline-none focus:border-splash-pink transition-colors cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-display tracking-wider uppercase transition-all ${
                    active
                      ? "bg-brand-gradient text-primary-foreground font-bold shadow-md shadow-splash-pink/20"
                      : "bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between text-xs font-display uppercase tracking-widest text-muted-foreground mb-6">
          <span>
            Showing <strong className="text-foreground">{filtered.length}</strong> Products
          </span>
          {(activeCategory !== "All" || search) && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setSearch("");
              }}
              className="flex items-center gap-1.5 text-splash-pink hover:underline"
            >
              <RotateCcw size={12} /> Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-card/40 border border-border rounded-3xl p-8">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="font-display font-bold text-xl mb-2 text-foreground">No matches found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Try searching for something else or reset the category filters to browse all custom products.
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
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
