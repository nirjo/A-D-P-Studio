import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Star,
  Check,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Zap,
  Layers,
  Ruler,
  CheckCircle2,
  XCircle,
  Palette,
  Package,
  Printer,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { ProductColorSwatches } from "@/components/ProductColorSwatches";
import { SizeChartModal } from "@/components/SizeChartModal";
import { CustomPrintingModule } from "@/components/CustomPrintingModule";
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
        { title: `${p?.name || "Custom Apparel"} — AIEL Design & Printing Studio` },
        {
          name: "description",
          content:
            p?.description ||
            "Custom apparel & printing by AIEL Design & Printing Studio, Puducherry.",
        },
        { property: "og:title", content: `${p?.name} — AIEL Studio Puducherry` },
        { property: "og:description", content: p?.description },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { fallbackProduct, slug } = Route.useLoaderData();
  const { data: product = fallbackProduct } = useProduct(
    slug,
    fallbackProduct as DatabaseProduct | null
  );

  if (!product) {
    throw notFound();
  }

  const { data: variants = [] } = useProductVariants(product.id);
  const related = getRelatedProducts(product.id, product.category, 4);
  const { addItem } = useCart();

  // Initial color
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return product.colors[0] || { name: "Standard", hex: "#18181B" };
  });

  // Check URL query param for color
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

  // Dynamic gallery based on selected color
  const colorGallery = useMemo(() => {
    const imgs: string[] = [];
    if (selectedColor.frontImage) imgs.push(selectedColor.frontImage);
    if (selectedColor.backImage) imgs.push(selectedColor.backImage);
    product.gallery.forEach((g) => {
      if (!imgs.includes(g)) imgs.push(g);
    });
    return imgs.length > 0 ? imgs : [product.image];
  }, [selectedColor, product.gallery, product.image]);

  // Active image state (auto-updates when color changes)
  const [activeImage, setActiveImage] = useState<string>(
    selectedColor.frontImage || product.gallery[0] || product.image
  );

  useEffect(() => {
    if (selectedColor.frontImage) {
      setActiveImage(selectedColor.frontImage);
    } else if (product.gallery[0]) {
      setActiveImage(product.gallery[0]);
    }
  }, [selectedColor, product.gallery]);

  // Size selection
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product.sizes[0] || "M";
  });

  // Print style
  const [selectedPrintType, setSelectedPrintType] = useState<string>(() => {
    return product.printTypes[0] || "DTF (Direct to Film)";
  });

  const [qty, setQty] = useState<number>(1);
  const [customText, setCustomText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [added, setAdded] = useState<boolean>(false);
  const [sizeChartOpen, setSizeChartOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"front" | "back">("front");

  // Variant matching
  const matchedVariant = useMemo(() => {
    return variants.find(
      (v) =>
        (!v.size || v.size === selectedSize) &&
        (!v.colorName || v.colorName.toLowerCase() === selectedColor.name.toLowerCase())
    );
  }, [variants, selectedSize, selectedColor]);

  // Size upcharge for XXL (+₹40) and XXXL (+₹80) if not explicitly set in variant
  const sizeUpcharge = useMemo(() => {
    if (matchedVariant?.additionalPrice) return matchedVariant.additionalPrice;
    if (selectedSize === "XXL") return 40;
    if (selectedSize === "XXXL") return 80;
    return 0;
  }, [matchedVariant, selectedSize]);

  const activeUnitPrice = product.price + sizeUpcharge;
  const isAvailable = matchedVariant ? matchedVariant.isAvailable : !product.isSoldOut;
  const stockCount = matchedVariant?.stockQuantity || 120;

  // View switch handler (front vs back)
  const handleViewSwitch = (view: "front" | "back") => {
    setActiveView(view);
    if (view === "front" && selectedColor.frontImage) {
      setActiveImage(selectedColor.frontImage);
    } else if (view === "back" && selectedColor.backImage) {
      setActiveImage(selectedColor.backImage);
    }
  };

  const handleAddToCart = () => {
    addItem({
      product: {
        ...product,
        price: activeUnitPrice,
      },
      quantity: qty,
      selectedSize,
      selectedColor: selectedColor.name,
      selectedPrintType,
      customText: customText.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // WhatsApp order text
  const waProductText = `*ORDER INQUIRY — AIEL STUDIO*
═══════════════════════════
*Product:* ${product.name}
*Category:* ${product.categoryLabel}
*Size / Model:* ${selectedSize}
*Colour:* ${selectedColor.name}
*Print Technique:* ${selectedPrintType}
*Quantity:* ${qty} pcs
*Unit Price:* ₹${activeUnitPrice}
*Total:* ₹${activeUnitPrice * qty}
${customText ? `*Custom Text:* "${customText}"\n` : ""}${notes ? `*Notes:* ${notes}\n` : ""}
Hi Aiel Studio, I want to order this product and discuss artwork mockups!`;

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
          <Link to="/tshirts" className="hover:text-splash-pink transition-colors">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[240px]">{product.name}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Left: Interactive Image Gallery & Views */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-card border border-border shadow-2xl group">
              <img
                src={activeImage}
                alt={`${product.name} in ${selectedColor.name}`}
                className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              />

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-splash-pink text-primary-foreground font-display text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}

              {/* Front / Back Toggle Pill (if back image available) */}
              {selectedColor.backImage && (
                <div className="absolute bottom-4 left-4 bg-background/85 backdrop-blur-md border border-border/80 rounded-full p-1 flex items-center gap-1 text-xs font-display z-20">
                  <button
                    type="button"
                    onClick={() => handleViewSwitch("front")}
                    className={`px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${
                      activeView === "front"
                        ? "bg-splash-pink text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewSwitch("back")}
                    className={`px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${
                      activeView === "back"
                        ? "bg-splash-pink text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Back View
                  </button>
                </div>
              )}

              {/* Stock status indicator pill */}
              <div className="absolute top-4 right-4 bg-background/85 backdrop-blur-md border border-border/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-display">
                {isAvailable ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      In Stock ({stockCount} units)
                    </span>
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
            {colorGallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {colorGallery.map((img, idx) => (
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
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specification Grid (Fabric, GSM, Fit, Turnaround) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Fabric Weight
                </span>
                <span className="font-display font-bold text-sm text-foreground mt-0.5 block">
                  {product.gsm ? `${product.gsm} GSM` : "240 GSM"}
                </span>
              </div>

              <div className="bg-card border border-border rounded-2xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-display tracking-widest text-muted-foreground block">
                  Garment Fit
                </span>
                <span className="font-display font-bold text-sm text-foreground mt-0.5 block truncate">
                  {product.fit || "Street Drop Shoulder"}
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
                  Customer Rating
                </span>
                <span className="font-display font-bold text-sm text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star size={13} className="fill-current text-amber-400" /> {product.rating} (
                  {product.reviewsCount})
                </span>
              </div>
            </div>

            {/* Fabric Material Details Callout */}
            {product.material && (
              <div className="bg-secondary/40 border border-border/80 rounded-2xl p-4 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2 text-foreground font-display font-bold text-xs uppercase tracking-wider">
                  <Palette size={13} className="text-splash-pink" />
                  <span>Fabric &amp; Composition</span>
                </div>
                <p className="leading-relaxed">{product.material}</p>
                {product.careInstructions && (
                  <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <strong>Care:</strong> {product.careInstructions}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Customization Controls & Add To Cart */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <span className="text-xs font-display uppercase tracking-[0.25em] text-splash-pink font-semibold">
                  {product.categoryLabel}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground mt-1 tracking-tight">
                  {product.name}
                </h1>

                {/* Pricing & SKU */}
                <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                  <span className="text-gradient font-display text-3xl font-extrabold">
                    ₹{activeUnitPrice}
                  </span>
                  {product.originalPrice > activeUnitPrice && (
                    <span className="text-sm font-display text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">
                    SKU: {product.sku || "AIEL-APP"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Includes GST, digital pre-print proof, and high-density printing.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Colour Swatches (Automatic image switching) */}
              {product.colors.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                      Selected Colour: <strong className="text-foreground">{selectedColor.name}</strong>
                    </span>
                    <span className="text-[11px] text-splash-pink font-display">
                      Auto Image Switch
                    </span>
                  </div>
                  <ProductColorSwatches
                    colors={product.colors}
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                    size="lg"
                  />
                </div>
              )}

              {/* Size Selector with Size Chart trigger */}
              {product.sizes.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                      Garment Size: <strong className="text-foreground">{selectedSize}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-splash-teal hover:underline font-display uppercase tracking-wider"
                    >
                      <Ruler size={13} /> Size Chart
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      const upcharge = size === "XXL" ? "+₹40" : size === "XXXL" ? "+₹80" : null;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-display uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-splash-pink text-primary-foreground font-bold border-splash-pink shadow-md shadow-splash-pink/20 scale-105"
                              : "bg-secondary/60 text-foreground border-border hover:border-splash-pink/50"
                          }`}
                        >
                          <span>{size}</span>
                          {upcharge && (
                            <span className="text-[10px] opacity-80 font-mono">{upcharge}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Printing Technique Selector */}
              {product.printTypes.length > 0 && (
                <div className="border-t border-border/80 pt-4">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-2">
                    Printing Technique
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.printTypes.map((pt) => {
                      const isSelected = selectedPrintType === pt;
                      return (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setSelectedPrintType(pt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
                            isSelected
                              ? "bg-secondary text-splash-pink font-bold border-splash-pink"
                              : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground"
                          }`}
                        >
                          {pt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Printing Compatibility Badges */}
              {product.printingCompatibility && product.printingCompatibility.length > 0 && (
                <div className="flex items-center gap-2 pt-2 flex-wrap text-xs text-muted-foreground">
                  <Printer size={13} className="text-splash-teal" />
                  <span className="font-display uppercase text-[10px] tracking-wider">
                    Compatible with:
                  </span>
                  {product.printingCompatibility.map((pc) => (
                    <span
                      key={pc}
                      className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono border border-border"
                    >
                      {pc}
                    </span>
                  ))}
                </div>
              )}

              {/* Optional Quick Text Customization Input */}
              <div className="border-t border-border/80 pt-4 space-y-2">
                <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Quick Name / Text Embroidery (Optional)
                </span>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter name, monogram initials, or team squad number..."
                  className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                />
              </div>

              {/* Quantity Picker & Add to Cart */}
              <div className="border-t border-border/80 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-secondary border border-border rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-card text-sm"
                    >
                      -
                    </button>
                    <span className="font-display font-bold text-xs px-3">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-card text-sm"
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
                        <ShoppingBag size={16} /> Add to Cart • ₹{activeUnitPrice * qty}
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
                  <MessageCircle size={15} /> Chat on WhatsApp (+91 91502 34277)
                </a>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground">
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

        {/* ============================================================== */}
        {/* CUSTOMIZE THIS PRODUCT MODULE (Front/Back/Sleeves, DTF/Sub/Vinyl) */}
        {/* ============================================================== */}
        <CustomPrintingModule
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={qty}
        />

        {/* Tiered Bulk Wholesale Pricing */}
        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <section className="mt-16 bg-card border border-border rounded-3xl p-6 sm:p-8 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-splash-pink" />
              <h3 className="font-display font-bold text-lg text-foreground">
                Tiered Wholesale Bulk Rates
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Discounts apply automatically at checkout for batch orders, college batches, and corporate events.
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

      {/* Interactive Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        categoryLabel={product.categoryLabel}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />
    </>
  );
}
