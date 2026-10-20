import { Link } from "@tanstack/react-router";
import { Zap, ShoppingBag, Eye, ArrowRight, Sparkles } from "lucide-react";
import { getProductsByCategory } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export function CombosSection() {
  const combos = getProductsByCategory("combos");
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (p: typeof combos[0]) => {
    addItem({
      product: p,
      quantity: 1,
      selectedSize: p.sizes[0],
      selectedColor: p.colors[0]?.name,
      selectedPrintType: p.printTypes[0],
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background relative overflow-hidden">
      {/* Decorative Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] bg-splash-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-splash-orange text-xs font-display uppercase tracking-widest font-bold mb-2">
              <Zap size={14} className="animate-pulse" /> Studio Value Bundles
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Curated <span className="text-gradient">Combo Packs</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Coordinated print sets for creative drops, creator merch, and project teams. Save up to 33% on bundled prints.
            </p>
          </div>

          <Link
            to="/combos"
            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-splash-pink hover:text-foreground transition-colors self-start md:self-auto group"
          >
            <span>Explore All Bundles</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {combos.map((combo) => {
            const savingsPercent = Math.round(
              ((combo.originalPrice - combo.price) / combo.originalPrice) * 100
            );

            return (
              <div
                key={combo.id}
                className="group relative bg-card border-2 border-border/80 hover:border-splash-pink/60 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-splash-pink/15"
              >
                {/* Savings Pill */}
                <div className="absolute -top-3 right-4 z-20">
                  <span className="bg-brand-gradient gradient-pan text-primary-foreground text-[10px] font-display font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                    Save {savingsPercent}%
                  </span>
                </div>

                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/60 mb-4">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold text-splash-teal">
                      ★ {combo.rating} ({combo.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-foreground leading-snug mb-2 group-hover:text-splash-pink transition-colors">
                    <Link to="/product/$slug" params={{ slug: combo.slug }}>
                      {combo.name}
                    </Link>
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {combo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-muted-foreground block uppercase font-display">Combo Price</span>
                      <span className="font-display text-2xl font-black text-gradient">
                        ₹{combo.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block uppercase font-display">Individual Total</span>
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/product/$slug"
                      params={{ slug: combo.slug }}
                      className="flex items-center justify-center py-2.5 px-3 rounded-full text-xs font-display font-semibold uppercase tracking-wider bg-secondary border border-border text-foreground hover:border-splash-pink hover:text-splash-pink transition-colors text-center"
                    >
                      Customise
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(combo)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-brand-gradient gradient-pan text-primary-foreground hover:opacity-95 shadow-md shadow-splash-pink/20 transition-opacity"
                    >
                      <ShoppingBag size={13} /> {addedId === combo.id ? "Added!" : "Add Pack"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}