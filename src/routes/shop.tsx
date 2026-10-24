import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowLeft, RotateCcw, Filter, Sparkles, Check, Package } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts, type DatabaseProduct } from "@/lib/products-service";
import { PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Custom Merchandise & Apparel Catalog — Aiel Studio, Puducherry" },
      {
        name: "description",
        content:
          "Browse live dynamic custom print catalog: T-shirts, GSM variations, Mugs, Keychains, Tote Bags, and UV Gifts. 48h rush turnaround across India.",
      },
      { property: "og:title", content: "Custom Merchandise Catalog — Aiel Studio" },
      {
        property: "og:description",
        content: "Explore live custom printed apparel, drinkware & personalized merchandise with instant price, color & GSM filters.",
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

const GSM_OPTIONS = ["All GSM", "180 GSM", "220 GSM", "240 GSM", "280 GSM"];

function ShopPage() {
  const { data: allProducts = PRODUCTS, isLoading } = useProducts();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGsm, setSelectedGsm] = useState("All GSM");
  const [selectedAvailability, setSelectedAvailability] = useState<"all" | "in-stock">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    return allProducts.filter((p: DatabaseProduct) => {
      // 1. Category filter
      const matchCat =
        activeCategory === "All" ||
        p.categoryLabel.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === "Combo Packs" && p.category === "combos");

      // 2. GSM filter (specifically for apparel & t-shirts)
      const matchGsm =
        selectedGsm === "All GSM" ||
        (p.gsm && String(p.gsm).includes(selectedGsm.replace(" GSM", ""))) ||
        p.name.toLowerCase().includes(selectedGsm.toLowerCase()) ||
        p.description.toLowerCase().includes(selectedGsm.toLowerCase());

      // 3. Availability filter
      const matchStock =
        selectedAvailability === "all" || (!p.isSoldOut && p.inStock !== false);

      // 4. Search query
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.printTypes.some((pt) => pt.toLowerCase().includes(q)) ||
        (p.sizes && p.sizes.some((s) => s.toLowerCase().includes(q))) ||
        (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(q)));

      return matchCat && matchGsm && matchStock && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [allProducts, activeCategory, selectedGsm, selectedAvailability, search, sortBy]);

  const hasActiveFilters =
    activeCategory !== "All" || selectedGsm !== "All GSM" || selectedAvailability !== "all" || Boolean(search);

  const resetFilters = () => {
    setActiveCategory("All");
    setSelectedGsm("All GSM");
    setSelectedAvailability("all");
    setSearch("");
    setSortBy("featured");
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
        <div className="mb-8 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink mb-4 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Studio Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink font-semibold">
                Live Supabase Inventory
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-foreground mt-1">
                Custom Print <span className="text-gradient">Catalog</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 max-w-xl">
                Explore oversized tees, high-density DTF prints, custom ceramic mugs, acrylic gifts, and promotional merchandise.
              </p>
            </div>

            {/* Live Count Indicator */}
            <div className="flex items-center gap-2 bg-secondary/60 border border-border px-3.5 py-1.5 rounded-full text-xs font-display">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-muted-foreground">Showing:</span>
              <strong className="text-foreground">{filtered.length} products</strong>
            </div>
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <section className="mb-8 relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product, size, GSM, print type or color..."
                className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Controls: GSM, Stock, Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* GSM Selector */}
              <select
                value={selectedGsm}
                onChange={(e) => setSelectedGsm(e.target.value)}
                aria-label="Filter by GSM Fabric Weight"
                className="bg-secondary/70 border border-border text-foreground font-display text-xs rounded-full px-3.5 py-2.5 focus:outline-none focus:border-splash-pink"
              >
                {GSM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-foreground">
                    {opt}
                  </option>
                ))}
              </select>

              {/* Stock Toggle */}
              <button
                type="button"
                onClick={() => setSelectedAvailability((prev) => (prev === "all" ? "in-stock" : "all"))}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-display uppercase tracking-wider border transition-colors ${
                  selectedAvailability === "in-stock"
                    ? "bg-splash-pink/15 border-splash-pink text-splash-pink font-bold"
                    : "bg-secondary/70 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package size={13} />
                <span>In Stock Only</span>
              </button>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="bg-secondary/70 border border-border text-foreground font-display text-xs rounded-full px-3.5 py-2.5 focus:outline-none focus:border-splash-pink"
              >
                <option value="featured" className="bg-card text-foreground">Featured</option>
                <option value="price-asc" className="bg-card text-foreground">Price: Low to High</option>
                <option value="price-desc" className="bg-card text-foreground">Price: High to Low</option>
                <option value="rating" className="bg-card text-foreground">Customer Rating</option>
              </select>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-splash-pink px-2.5 py-2 transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs Pill Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all border ${
                    active
                      ? "bg-brand-gradient text-primary-foreground font-bold border-transparent shadow-md shadow-splash-pink/20"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground border-border/80 hover:border-splash-pink/30"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Product Grid */}
        <section className="relative z-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-card/40 border border-border rounded-3xl p-8 max-w-md mx-auto">
              <span className="text-5xl block mb-3">🔍</span>
              <h3 className="font-display font-bold text-lg text-foreground mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                We couldn't find any products matching your selected search or GSM criteria.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-secondary border border-border text-foreground font-display text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:border-splash-pink"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
