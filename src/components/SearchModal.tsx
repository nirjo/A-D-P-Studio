import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PRODUCTS, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.printTypes.some((pt) => pt.toLowerCase().includes(query.toLowerCase()))
      )
    : PRODUCTS.slice(0, 5);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product: p,
      quantity: 1,
      selectedSize: p.sizes[0],
      selectedColor: p.colors[0]?.name,
      selectedPrintType: p.printTypes[0],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input */}
            <div className="relative border-b border-border p-4 flex items-center gap-3">
              <Search size={20} className="text-splash-pink ml-2 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search t-shirts, mugs, keychains, tote bags, phone cases, combos..."
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 scrollbar-none">
              <div className="flex items-center justify-between text-[11px] font-display uppercase tracking-widest text-muted-foreground px-2 mb-2">
                <span>{query ? `Search Results (${results.length})` : "Popular Print Items"}</span>
                <span className="text-splash-pink">48h Rush Available</span>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="text-sm text-muted-foreground">
                    No custom printing products found matching &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for &quot;oversized&quot;, &quot;mug&quot;, &quot;acrylic&quot;, or &quot;tote&quot;.
                  </p>
                </div>
              ) : (
                results.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="group bg-secondary/40 hover:bg-secondary border border-border/40 hover:border-splash-pink/50 rounded-2xl p-3 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl border border-border/50 group-hover:scale-105 transition-transform flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">
                            {p.categoryLabel}
                          </span>
                          {p.badge && (
                            <span className="text-[9px] bg-splash-pink/15 text-splash-pink px-1.5 py-0.5 rounded font-display font-semibold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-xs sm:text-sm text-foreground group-hover:text-splash-pink transition-colors truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-gradient">₹{p.price}</span>
                          <span className="text-muted-foreground line-through text-[11px]">₹{p.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="flex items-center gap-1.5 bg-brand-gradient gradient-pan text-primary-foreground font-display font-semibold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full hover:opacity-95 transition-opacity flex-shrink-0"
                    >
                      <ShoppingBag size={12} /> Add
                    </button>
                  </Link>
                ))
              )}
            </div>

            {/* Bottom bar */}
            <div className="p-3 bg-secondary/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground px-4 font-sans">
              <span>Press <kbd className="bg-background px-1.5 py-0.5 rounded text-[10px] border border-border">ESC</kbd> to exit</span>
              <span className="text-splash-teal">Custom Prints • Puducherry</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}