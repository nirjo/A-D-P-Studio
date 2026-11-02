import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Search,
  Package,
  Ruler,
  SlidersHorizontal,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { SizeChartModal } from "@/components/SizeChartModal";
import { useProducts, type DatabaseProduct } from "@/lib/products-service";
import {
  APPAREL_SUBCATEGORIES,
  APPAREL_COLORS,
  APPAREL_SIZES,
  type ApparelSubcategory,
} from "@/lib/apparel-service";

export const Route = createFileRoute("/tshirts")({
  head: () => ({
    meta: [
      { title: "Custom T-Shirts & Apparel Catalogue — AIEL Studio Puducherry" },
      {
        name: "description",
        content:
          "Explore custom Round Neck T-Shirts, Polos, Streetwear Oversized Tees, Fleece Hoodies, Sweatshirts & Sports Jerseys. Japanese DTF, Sublimation & Embroidery.",
      },
      { property: "og:title", content: "T-Shirts & Apparel — AIEL Design & Printing Studio" },
      {
        property: "og:description",
        content:
          "High GSM French terry oversized drops, bio-wash crewnecks, pique corporate polos & sublimated team jerseys printed in Puducherry.",
      },
    ],
  }),
  component: ApparelCataloguePage,
});

const GSM_WEIGHTS = [
  "All GSM",
  "160 GSM",
  "180 GSM",
  "200 GSM",
  "220 GSM",
  "240 GSM",
  "260 GSM",
  "300 GSM",
  "320 GSM",
  "340 GSM",
  "360 GSM",
  "380 GSM",
];

const PRINT_TECHNIQUES = ["All", "DTF", "Sublimation", "Vinyl", "Embroidery", "Screen Print"];

function ApparelCataloguePage() {
  const { data: allProducts = [] } = useProducts();

  // Filter apparel products (category === "tshirts")
  const apparelProducts = useMemo(() => {
    return allProducts.filter((p) => p.category === "tshirts");
  }, [allProducts]);

  // States
  const [selectedSubcategory, setSelectedSubcategory] = useState<ApparelSubcategory>("all");
  const [selectedGsm, setSelectedGsm] = useState<string>("All GSM");
  const [selectedPrint, setSelectedPrint] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedStock, setSelectedStock] = useState<"all" | "in-stock">("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [search, setSearch] = useState<string>("");
  const [sizeChartOpen, setSizeChartOpen] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Subcategory mapping
  const activeSubcategoryLabel = useMemo(() => {
    const found = APPAREL_SUBCATEGORIES.find((s) => s.id === selectedSubcategory);
    return found ? found.label : "T-Shirts & Apparel";
  }, [selectedSubcategory]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return apparelProducts
      .filter((p: DatabaseProduct) => {
        // 1. Subcategory filter
        if (selectedSubcategory !== "all") {
          const catLabel = (p.categoryLabel || "").toLowerCase();
          const name = p.name.toLowerCase();
          const sub = (p.subcategory || "").toLowerCase();

          const matchesSub =
            (selectedSubcategory === "round-neck" && (catLabel.includes("round") || sub === "round-neck" || name.includes("crewneck") || name.includes("round neck"))) ||
            (selectedSubcategory === "polo" && (catLabel.includes("polo") || sub === "polo" || name.includes("polo"))) ||
            (selectedSubcategory === "oversized" && (catLabel.includes("oversized") || sub === "oversized" || name.includes("oversized") || name.includes("drop shoulder"))) ||
            (selectedSubcategory === "hoodie" && (catLabel.includes("hoodie") || sub === "hoodie" || name.includes("hoodie"))) ||
            (selectedSubcategory === "sweatshirt" && (catLabel.includes("sweatshirt") || sub === "sweatshirt" || name.includes("sweatshirt"))) ||
            (selectedSubcategory === "jersey" && (catLabel.includes("jersey") || sub === "jersey" || name.includes("jersey") || name.includes("singlet")));

          if (!matchesSub) return false;
        }

        // 2. GSM filter
        if (selectedGsm !== "All GSM") {
          const gsmVal = selectedGsm.replace(" GSM", "");
          const matchGsm =
            (p.gsm && String(p.gsm).includes(gsmVal)) ||
            p.name.includes(gsmVal) ||
            p.description.includes(gsmVal);
          if (!matchGsm) return false;
        }

        // 3. Print technique filter
        if (selectedPrint !== "All") {
          const hasPrint = p.printTypes.some((pt) =>
            pt.toLowerCase().includes(selectedPrint.toLowerCase())
          );
          if (!hasPrint) return false;
        }

        // 4. Color filter
        if (selectedColor !== "All") {
          const hasColor = p.colors.some(
            (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
          );
          if (!hasColor) return false;
        }

        // 5. Size filter
        if (selectedSize !== "All") {
          const hasSize = p.sizes.some(
            (s) => s.toUpperCase() === selectedSize.toUpperCase()
          );
          if (!hasSize) return false;
        }

        // 6. Stock filter
        if (selectedStock === "in-stock" && (p.isSoldOut || p.inStock === false)) {
          return false;
        }

        // 7. Search text
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.material && p.material.toLowerCase().includes(q)) ||
            (p.fabric && p.fabric.toLowerCase().includes(q)) ||
            p.printTypes.some((pt) => pt.toLowerCase().includes(q));
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "gsm-desc") return Number(b.gsm || 0) - Number(a.gsm || 0);
        return 0;
      });
  }, [
    apparelProducts,
    selectedSubcategory,
    selectedGsm,
    selectedPrint,
    selectedColor,
    selectedSize,
    selectedStock,
    search,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedSubcategory !== "all" ||
    selectedGsm !== "All GSM" ||
    selectedPrint !== "All" ||
    selectedColor !== "All" ||
    selectedSize !== "All" ||
    selectedStock !== "all" ||
    Boolean(search);

  const resetAllFilters = () => {
    setSelectedSubcategory("all");
    setSelectedGsm("All GSM");
    setSelectedPrint("All");
    setSelectedColor("All");
    setSelectedSize("All");
    setSelectedStock("all");
    setSearch("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 border-b border-border/80 bg-gradient-to-b from-secondary/40 via-card/30 to-background overflow-hidden">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-24 right-10 w-96 h-96 bg-splash-pink/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 w-80 h-80 bg-splash-purple/15 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink mb-4 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Studio Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary/80 border border-splash-pink/30 rounded-full px-3.5 py-1 mb-3">
                  <Sparkles size={11} className="text-splash-pink" />
                  <span className="text-[11px] font-display uppercase tracking-widest text-splash-pink font-semibold">
                    Custom Apparel Collection
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-foreground">
                  T-Shirts &amp; <span className="text-gradient">Apparel</span>
                </h1>
                <p className="text-muted-foreground font-sans text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
                  Explore heavy 240–380 GSM streetwear drops, bio-wash crewnecks, corporate pique polos,
                  warm fleece hoodies, cozy sweatshirts and full-bleed sublimated sports jerseys. Custom printed in
                  Puducherry with 48h rush turnaround.
                </p>
              </div>

              {/* Action pill: Size Guide modal button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary border border-border hover:border-splash-pink text-foreground font-display text-xs uppercase tracking-wider transition-all"
                >
                  <Ruler size={14} className="text-splash-teal" />
                  <span>Size Guide</span>
                </button>

                <div className="bg-card/80 border border-border/80 backdrop-blur-md rounded-2xl p-3 px-4 flex flex-col text-right">
                  <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                    Starting From
                  </span>
                  <span className="text-gradient font-display text-2xl font-extrabold leading-tight">
                    ₹349
                  </span>
                  <span className="text-[10px] text-muted-foreground">GST &amp; Proof Included</span>
                </div>
              </div>
            </div>

            {/* 6 Subcategory Tabs (Round Neck, Polo, Oversized, Hoodies, Sweatshirts, Sports Jerseys) */}
            <div className="mt-8 pt-4 border-t border-border/60">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {APPAREL_SUBCATEGORIES.map((sub) => {
                  const active = selectedSubcategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all border ${
                        active
                          ? "bg-brand-gradient text-primary-foreground font-bold border-transparent shadow-lg shadow-splash-pink/20 scale-105"
                          : "bg-secondary/70 text-foreground border-border/80 hover:border-splash-pink/40 hover:bg-secondary"
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10">
          {/* Controls Bar */}
          <div className="bg-card/70 border border-border/80 p-4 rounded-3xl mb-8 space-y-4 shadow-sm">
            {/* Top row: Search, Mobile toggle, Reset */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search box */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search fabric, GSM weight, print method or style..."
                  className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
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

              {/* Quick selectors: In-stock, Sort, Mobile filter toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                  className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider bg-secondary border border-border text-foreground"
                >
                  <SlidersHorizontal size={12} />
                  <span>Filters</span>
                </button>

                {/* In Stock toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedStock((prev) => (prev === "all" ? "in-stock" : "all"))
                  }
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-display uppercase tracking-wider border transition-colors ${
                    selectedStock === "in-stock"
                      ? "bg-splash-pink/15 border-splash-pink text-splash-pink font-bold"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package size={13} />
                  <span>In Stock</span>
                </button>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort apparel products"
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3.5 py-2 focus:outline-none focus:border-splash-pink"
                >
                  <option value="featured" className="bg-card text-foreground">
                    Featured Drops
                  </option>
                  <option value="price-asc" className="bg-card text-foreground">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-card text-foreground">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-card text-foreground">
                    Highest Customer Rating
                  </option>
                  <option value="gsm-desc" className="bg-card text-foreground">
                    Heaviest Fabric (GSM)
                  </option>
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-splash-pink px-2.5 py-1.5 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills Row (GSM, Print, Color, Size) */}
            <div
              className={`flex flex-wrap items-center gap-3 pt-3 border-t border-border/60 ${
                showFiltersMobile ? "block" : "hidden sm:flex"
              }`}
            >
              {/* GSM Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
                  GSM:
                </span>
                <select
                  value={selectedGsm}
                  onChange={(e) => setSelectedGsm(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1 focus:outline-none focus:border-splash-pink"
                >
                  {GSM_WEIGHTS.map((opt) => (
                    <option key={opt} value={opt} className="bg-card text-foreground">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Print Technique */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
                  Print:
                </span>
                <select
                  value={selectedPrint}
                  onChange={(e) => setSelectedPrint(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1 focus:outline-none focus:border-splash-pink"
                >
                  {PRINT_TECHNIQUES.map((pt) => (
                    <option key={pt} value={pt} className="bg-card text-foreground">
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
                  Color:
                </span>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1 focus:outline-none focus:border-splash-pink"
                >
                  <option value="All" className="bg-card text-foreground">
                    All Colours
                  </option>
                  {APPAREL_COLORS.map((c) => (
                    <option key={c.name} value={c.name} className="bg-card text-foreground">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
                  Size:
                </span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3 py-1 focus:outline-none focus:border-splash-pink"
                >
                  <option value="All" className="bg-card text-foreground">
                    All Sizes
                  </option>
                  {APPAREL_SIZES.map((s) => (
                    <option key={s} value={s} className="bg-card text-foreground">
                      Size {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Showing count indicator */}
              <div className="ml-auto text-xs text-muted-foreground font-display">
                Showing <strong className="text-foreground">{filteredProducts.length}</strong> items
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-card/40 border border-border rounded-3xl p-8 max-w-md mx-auto">
              <span className="text-5xl block mb-2">👕</span>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                No apparel matches this filter
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Try resetting your GSM, size, or color choices.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
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

      {/* Interactive Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        categoryLabel={activeSubcategoryLabel}
      />
    </div>
  );
}
