import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Eye, Check } from "lucide-react";
import type { Product, ProductColor } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductImageWithColor } from "@/components/ProductImageWithColor";
import { ProductColorSwatches } from "@/components/ProductColorSwatches";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: "Standard", hex: "#18181B" }
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: selectedColor.name,
      selectedPrintType: product.printTypes[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const badgeColor = {
    "Best Seller": "bg-splash-pink text-primary-foreground",
    "48h Rush": "bg-splash-orange text-primary-foreground",
    "Made to order": "bg-splash-purple text-primary-foreground",
    "Hot Deal": "bg-destructive text-destructive-foreground",
    "Combo Deal": "bg-splash-teal text-background font-bold",
    "New": "bg-splash-blue text-primary-foreground",
    "Bulk Fav": "bg-accent text-accent-foreground",
  }[product.badge ?? "Best Seller"] ?? "bg-secondary text-foreground";

  return (
    <div className="group relative bg-card border border-border/70 hover:border-splash-pink/50 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-splash-pink/10">
      {/* Top Image & Badge */}
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 mb-3">
          <ProductImageWithColor
            image={product.image}
            alt={product.name}
            selectedColor={selectedColor}
            category={product.category}
            className="group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10 ${badgeColor}`}
            >
              {product.badge}
            </span>
          )}

          {/* Quick Customise View Overlay button */}
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            search={{ color: selectedColor.name }}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-splash-pink z-10"
            aria-label={`Customise ${product.name}`}
          >
            <Eye size={15} />
          </Link>
        </div>

        {/* Colour Swatches Row */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-2">
            <ProductColorSwatches
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              size="sm"
            />
          </div>
        )}

        {/* Info */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-[11px] font-display uppercase tracking-widest text-muted-foreground">
            <span>{product.categoryLabel}</span>
            <span className="text-[10px] text-splash-teal font-sans">{product.turnaround}</span>
          </div>

          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            search={{ color: selectedColor.name }}
          >
            <h3 className="font-display font-bold text-sm text-foreground hover:text-splash-pink transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.printTypes.slice(0, 2).join(" • ")}
          </p>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[11px] text-muted-foreground font-sans">From</span>
          <span className="font-display text-lg sm:text-xl font-extrabold text-gradient">
            ₹{product.price}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            search={{ color: selectedColor.name }}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-full text-[11px] font-display font-semibold uppercase tracking-wider bg-secondary border border-border text-foreground hover:border-splash-pink hover:text-splash-pink transition-colors text-center"
          >
            Customise
          </Link>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex items-center justify-center gap-1 py-2 px-3 rounded-full text-[11px] font-display font-bold uppercase tracking-wider transition-all ${
              added
                ? "bg-splash-orange text-primary-foreground"
                : "bg-brand-gradient gradient-pan text-primary-foreground hover:opacity-95 shadow-md shadow-splash-pink/20"
            }`}
          >
            {added ? (
              <>
                <Check size={13} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
