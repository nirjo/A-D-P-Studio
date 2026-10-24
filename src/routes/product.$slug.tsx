import { useState, useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Star,
  Check,
  Upload,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Zap,
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { ProductImageWithColor } from "@/components/ProductImageWithColor";
import { ProductColorSwatches } from "@/components/ProductColorSwatches";
import { getProductBySlug, getRelatedProducts, type ProductColor } from "@/data/products";
import { useProduct, useProductVariants, type DatabaseProduct } from "@/lib/products-service";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const fallbackProduct = getProductBySlug(params.slug);
    return { fallbackProduct, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.fallbackProduct;
    return {
      meta: [
        { title: `${p?.name || "Custom Product"} — Aiel Studio Puducherry` },
        {
          name: "description",
          content: p?.description || "Custom printing by Aiel Design & Printing Studio, Puducherry.",
        },
        { property: "og:title", content: `${p?.name} — Custom Print by Aiel Studio` },
        { property: "og:description", content: p?.description },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { fallbackProduct, slug } = Route.useLoaderData();
  const { data: product = fallbackProduct } = useProduct(slug, fallbackProduct as DatabaseProduct | null);

  if (!product) {
    throw notFound();
  }

  const { data: variants = [] } = useProductVariants(product.id);
  const related = getRelatedProducts(product.id, product.category, 4);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    () => product.colors[0] || { name: "Standard", hex: "#18181B" }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("color");
      if (param) {
        const found = product.colors.find(
          (c) => c.name.toLowerCase() === param.toLowerCase()
        );
        if (found) setSelectedColor(found);
      }
    }
  }, [product.colors]);

  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard");
  const [selectedPrintType, setSelectedPrintType] = useState(product.printTypes[0] || "Standard");
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState("");
  const [notes, setNotes] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [added, setAdded] = useState(false);

  // Variant matching
  const matchedVariant = variants.find(
    (v) =>
      (!v.size || v.size === selectedSize) &&
      (!v.colorName || v.colorName.toLowerCase() === selectedColor.name.toLowerCase())
  );

  const isAvailable = matchedVariant ? matchedVariant.isAvailable : !product.isSoldOut;
  const activePrice = product.price + (matchedVariant?.additionalPrice || 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      product: {
        ...product,
        price: activePrice,
      },
      quantity: qty,
      selectedSize,
      selectedColor: selectedColor.name,
      selectedPrintType,
      customText: customText.trim() || undefined,
      notes: notes.trim() || undefined,
      artworkName: artworkFile?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // WhatsApp discussion prefilled link
  const waProductText = `*PRODUCT INQUIRY — AIEL STUDIO*\n═══════════════════════════\n*Product:* ${product.name}\n*Category:* ${product.categoryLabel}\n*Size/Variant:* ${selectedSize}\n*Color:* ${selectedColor.name}\n*Print Style:* ${selectedPrintType}\n*Quantity:* ${qty} pcs\n*Estimated Rate:* ₹${activePrice * qty}\n\nHi Aiel Studio, I want to discuss customized bulk printing and mockups for this product!`;
  const waProductUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waProductText)}`;

  return (
    <>
      <TopBar />
      <Header />

      <main className="grain-overlay min-h-screen bg-background text-foreground pt-10 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Glow orb */}
        <div className="glow-orb pointer-events-none fixed top-10 right-0 h-[60vw] w-[60vw] opacity-25" />

        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-muted-foreground relative z-10 flex-wrap">
          <Link to="/" className="hover:text-splash-pink transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-splash-pink transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <Link
            to={product.category === "combos" ? "/combos" : (`/${product.category}` as any)}
            className="hover:text-splash-pink transition-colors"
          >
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Left: Gallery & Color-tinted Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-card border border-border shadow-2xl">
              <ProductImageWithColor
                image={activeImage}
                alt={product.name}
                colorHex={selectedColor.hex}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-splash-pink text-primary-foreground font-display text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}

              {/* Stock status indicator pill */}
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-border/80 px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-display">
                {isAvailable ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">In Stock & Ready</span>
                  </>
                ) : (
                  <>
                    <XCircle size={12} className="text-destructive" />
                    <span className="text-destructive font-semibold">Sold Out</span>
                  </>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img
                        ? "border-splash-pink shadow-md shadow-splash-pink/30 scale-105"
                        : "border-border/70 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specification Grid (GSM, Fabric, Turnaround, Rating) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Fabric Weight
                </span>
                <span className="font-display font-bold text-sm text-foreground mt-0.5 block">
                  {product.gsm ? `${product.gsm} GSM` : product.name.includes("240 GSM") ? "240 GSM" : "Premium Standard"}
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Turnaround
                </span>
                <span className="font-display font-bold text-sm text-splash-orange mt-0.5 block">
                  {product.turnaround || "48h Rush"}
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Min. Order
                </span>
                <span className="font-display font-bold text-sm text-foreground mt-0.5 block">
                  {product.minOrder} Piece
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Rating
                </span>
                <span className="font-display font-bold text-sm text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star size={13} className="fill-current text-amber-400" /> {product.rating} ({product.reviewsCount})
                </span>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls & Add To Cart */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink font-semibold">
                  {product.categoryLabel}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground mt-1 tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-gradient font-display text-3xl font-extrabold">
                    ₹{activePrice}
                  </span>
                  {product.originalPrice > activePrice && (
                    <span className="text-sm font-display text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">GST &amp; Digital Proof Included</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatch Picker */}
              {product.colors.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                      Color: <strong className="text-foreground">{selectedColor.name}</strong>
                    </span>
                  </div>
                  <ProductColorSwatches
                    colors={product.colors}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                  />
                </div>
              )}

              {/* Size / Variant Selector */}
              {product.sizes.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-2">
                    Select Size / Model
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
                          selectedSize === size
                            ? "bg-splash-pink text-primary-foreground font-bold border-splash-pink shadow-md shadow-splash-pink/20"
                            : "bg-secondary/60 text-foreground border-border hover:border-splash-pink/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Print Style / Method */}
              {product.printTypes.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-2">
                    Print Technique
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.printTypes.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setSelectedPrintType(pt)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
                          selectedPrintType === pt
                            ? "bg-secondary text-splash-pink font-bold border-splash-pink"
                            : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Personalization Inputs */}
              <div className="border-t border-border/80 pt-4 space-y-3">
                <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Personalization (Optional)
                </span>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter name, text or initials to print..."
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                />

                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Placement notes, font preferences, or rush deadline instructions..."
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink resize-none"
                />

                {/* Upload Logo File */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40 border border-dashed border-border hover:border-splash-pink/50 cursor-pointer transition-colors text-xs text-muted-foreground">
                  <Upload size={14} className="text-splash-pink flex-shrink-0" />
                  <span className="truncate">
                    {artworkFile ? `Selected: ${artworkFile.name}` : "Upload logo / artwork file (PNG, PDF, SVG, AI)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.ai,.psd,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quantity Picker & Add to Cart */}
              <div className="border-t border-border/80 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-secondary border border-border rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-card"
                    >
                      -
                    </button>
                    <span className="font-display font-bold text-xs px-3">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-card"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all disabled:opacity-40"
                  >
                    {added ? (
                      <>
                        <Check size={16} /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add to Cart • ₹{activePrice * qty}
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp Discussion */}
                <a
                  href={waProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-secondary border border-border hover:border-splash-pink text-foreground font-display font-bold text-xs uppercase tracking-wider py-3 rounded-full transition-colors"
                >
                  <MessageCircle size={15} /> Discuss Bulk Custom Quote on WhatsApp
                </a>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-splash-teal" /> 100% Pre-print proof guarantee
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={13} className="text-splash-orange" /> 48-Hour rush dispatch
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Pricing Tier Table */}
        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <section className="mt-16 bg-card border border-border rounded-3xl p-6 sm:p-8 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-splash-pink" />
              <h3 className="font-display font-bold text-lg text-foreground">
                Tiered Bulk Wholesale Pricing
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Higher quantities automatically qualify for significant discounts. Ideal for events, corporate gifts &amp; retail brands.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.bulkPricing.map((tier) => (
                <div
                  key={tier.qty}
                  className="bg-secondary/60 border border-border/80 rounded-2xl p-4 text-center hover:border-splash-pink/50 transition-colors"
                >
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                    {tier.qty}
                  </span>
                  <span className="font-display font-extrabold text-xl text-gradient block mt-1">
                    ₹{tier.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">per unit</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 relative z-10">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-6">
              More Custom Prints in <span className="text-gradient">{product.categoryLabel}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <WhyAielStrip />
        </div>
      </main>

      <Footer />
    </>
  );
}
