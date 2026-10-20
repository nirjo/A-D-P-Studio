import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Filter, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import type { Product } from "@/data/products";

interface CategoryPageLayoutProps {
  categoryKey: string;
  categoryTitle: string;
  categorySubtitle: string;
  startingPrice: number;
  products: Product[];
}

export function CategoryPageLayout({
  categoryKey,
  categoryTitle,
  categorySubtitle,
  startingPrice,
  products,
}: CategoryPageLayoutProps) {
  const [selectedPrintType, setSelectedPrintType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  const printTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.printTypes.forEach((pt) => set.add(pt)));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedPrintType === "All") return true;
        return p.printTypes.includes(selectedPrintType);
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedPrintType, sortBy]);

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
              <ArrowLeft size={13} /> Back to Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-splash-pink text-xs font-display uppercase tracking-widest font-bold mb-2">
                  <Sparkles size={13} /> Custom Print Department
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                  Custom <span className="text-gradient">{categoryTitle}</span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                  {categorySubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
                <div className="bg-card border border-border px-4 py-2 rounded-2xl text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-display block">Starting From</span>
                  <span className="font-display font-extrabold text-lg text-gradient">₹{startingPrice}</span>
                </div>
                <div className="bg-card border border-border px-4 py-2 rounded-2xl text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-display block">Turnaround</span>
                  <span className="font-display font-extrabold text-sm text-splash-orange flex items-center justify-center gap-1 mt-0.5">
                    <Zap size={12} /> 48 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-border/40 bg-card/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              <span className="text-xs text-muted-foreground font-display uppercase tracking-wider hidden md:inline flex-shrink-0">
                Print Technique:
              </span>
              {printTypes.map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setSelectedPrintType(pt)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-display tracking-wider whitespace-nowrap transition-all ${
                    selectedPrintType === pt
                      ? "bg-brand-gradient gradient-pan text-primary-foreground font-bold shadow-md shadow-splash-pink/20"
                      : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground font-sans focus:outline-none focus:border-splash-pink cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="flex items-center justify-between text-xs font-display text-muted-foreground uppercase tracking-widest mb-6">
              <span>Showing {filteredProducts.length} custom products</span>
              {selectedPrintType !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedPrintType("All")}
                  className="text-splash-pink hover:underline"
                >
                  Reset technique filter
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl border border-border">
                <span className="text-5xl mb-3 block">🎨</span>
                <h3 className="font-display font-bold text-lg mb-1">No products found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                  No products matched the selected printing technique.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPrintType("All")}
                  className="bg-brand-gradient text-primary-foreground font-display font-semibold text-xs uppercase px-6 py-2.5 rounded-full"
                >
                  Show All {categoryTitle}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        <WhyAielStrip />
      </main>

      <Footer />
    </div>
  );
}