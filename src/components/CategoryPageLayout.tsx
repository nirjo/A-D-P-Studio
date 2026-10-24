import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Package, RotateCcw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { useProducts, type DatabaseProduct } from "@/lib/products-service";
import type { Product } from "@/data/products";

interface CategoryPageLayoutProps {
  categoryKey: string;
  categoryTitle: string;
  categorySubtitle: string;
  startingPrice: number;
  products: Product[];
}

const GSM_OPTIONS = ["All GSM", "180 GSM", "220 GSM", "240 GSM", "280 GSM"];

export function CategoryPageLayout({
  categoryKey,
  categoryTitle,
  categorySubtitle,
  startingPrice,
  products: fallbackProducts,
}: CategoryPageLayoutProps) {
  // Pull live products from Supabase
  const { data: allProducts = [] } = useProducts();

  // Filter category products from live DB or fallback
  const categoryProducts = useMemo(() => {
    const liveMatching = allProducts.filter((p) => p.category === categoryKey);
    return liveMatching.length > 0 ? liveMatching : fallbackProducts;
  }, [allProducts, categoryKey, fallbackProducts]);

  const [selectedPrintType, setSelectedPrintType] = useState<string>("All");
  const [selectedGsm, setSelectedGsm] = useState<string>("All GSM");
  const [selectedStock, setSelectedStock] = useState<"all" | "in-stock">("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const printTypes = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => p.printTypes.forEach((pt) => set.add(pt)));
    return ["All", ...Array.from(set)];
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((p: DatabaseProduct) => {
        // Print type filter
        if (selectedPrintType !== "All" && !p.printTypes.includes(selectedPrintType)) {
          return false;
        }

        // GSM filter (for T-shirts)
        if (selectedGsm !== "All GSM") {
          const gsmVal = selectedGsm.replace(" GSM", "");
          const matchGsm =
            (p.gsm && String(p.gsm).includes(gsmVal)) ||
            p.name.includes(gsmVal) ||
            p.description.includes(gsmVal);
          if (!matchGsm) return false;
        }

        // Stock filter
        if (selectedStock === "in-stock" && (p.isSoldOut || p.inStock === false)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [categoryProducts, selectedPrintType, selectedGsm, selectedStock, sortBy]);

  const isTshirtCategory = categoryKey === "tshirts";
  const hasActiveFilters =
    selectedPrintType !== "All" || selectedGsm !== "All GSM" || selectedStock !== "all";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Category Hero Banner */}
        <section className="relative py-14 sm:py-20 border-b border-border/60 bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink mb-4 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Studio Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary/80 border border-splash-pink/30 rounded-full px-3 py-1 mb-3">
                  <Sparkles size={11} className="text-splash-pink" />
                  <span className="text-[11px] font-display uppercase tracking-widest text-splash-pink font-semibold">
                    Custom Print Collection
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-foreground">
                  {categoryTitle}
                </h1>
                <p className="text-muted-foreground font-sans text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
                  {categorySubtitle}
                </p>
              </div>

              <div className="bg-card/70 border border-border/80 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 text-right flex-shrink-0">
                <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                  Starting Price
                </span>
                <span className="text-gradient font-display text-2xl font-extrabold">
                  ₹{startingPrice}
                </span>
                <span className="text-[10px] text-muted-foreground">48h Rush Turnaround</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-secondary/40 border border-border/70 p-3.5 rounded-2xl">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-display uppercase tracking-wider text-muted-foreground mr-1">
                Print Technique:
              </span>
              {printTypes.map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setSelectedPrintType(pt)}
                  className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider transition-colors border ${
                    selectedPrintType === pt
                      ? "bg-splash-pink text-primary-foreground font-bold border-splash-pink shadow-sm"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>

            {/* Quick selectors: GSM, In-stock, Sorting */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Optional GSM Filter for T-shirts */}
              {isTshirtCategory && (
                <select
                  value={selectedGsm}
                  onChange={(e) => setSelectedGsm(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-splash-pink"
                >
                  {GSM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-card text-foreground">
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* Stock Toggle */}
              <button
                type="button"
                onClick={() => setSelectedStock((prev) => (prev === "all" ? "in-stock" : "all"))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider border transition-colors ${
                  selectedStock === "in-stock"
                    ? "bg-splash-pink/15 border-splash-pink text-splash-pink font-bold"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package size={12} />
                <span>In Stock Only</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-splash-pink"
              >
                <option value="featured" className="bg-card text-foreground">Featured</option>
                <option value="price-asc" className="bg-card text-foreground">Price: Low to High</option>
                <option value="price-desc" className="bg-card text-foreground">Price: High to Low</option>
                <option value="rating" className="bg-card text-foreground">Highest Rated</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPrintType("All");
                    setSelectedGsm("All GSM");
                    setSelectedStock("all");
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-splash-pink px-2"
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-card/40 border border-border rounded-3xl p-8 max-w-md mx-auto">
              <span className="text-4xl block mb-2">👕</span>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                No products match this filter
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Try resetting your GSM or print technique selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedPrintType("All");
                  setSelectedGsm("All GSM");
                  setSelectedStock("all");
                }}
                className="bg-secondary border border-border px-4 py-2 rounded-full text-xs font-display uppercase tracking-wider text-foreground hover:border-splash-pink"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        <WhyAielStrip />
      </main>

      <Footer />
    </div>
  );
}
