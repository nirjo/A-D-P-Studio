import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Zap,
  Star,
  Check,
  Upload,
  FileText,
  Sparkles,
  Info,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { WhyAielStrip } from "@/components/WhyAielStrip";
import { getProductBySlug, getRelatedProducts, PRODUCTS } from "@/data/products";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
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
  const { product } = Route.useLoaderData();
  const related = getRelatedProducts(product.id, product.category, 4);
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(product.gallery[0] || product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Standard");
  const [selectedPrintType, setSelectedPrintType] = useState(product.printTypes[0] || "Standard");
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState("");
  const [notes, setNotes] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [added, setAdded] = useState(false);

  // Compute tier price based on quantity
  const activePrice = product.price;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: qty,
      selectedSize,
      selectedColor,
      selectedPrintType,
      customText: customText.trim() || undefined,
      notes: notes.trim() || undefined,
      artworkName: artworkFile?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const generateDirectWhatsApp = () => {
    let msg = `*CUSTOM PRINT INQUIRY — AIEL STUDIO*\n`;
    msg += `---------------------------------\n`;
    msg += `*Product:* ${product.name}\n`;
    msg += `*Quantity:* ${qty} units\n`;
    msg += `*Size/Spec:* ${selectedSize}\n`;
    msg += `*Colour:* ${selectedColor}\n`;
    msg += `*Print Style:* ${selectedPrintType}\n`;
    if (customText.trim()) msg += `*Custom Text:* "${customText.trim()}"\n`;
    if (notes.trim()) msg += `*Notes:* ${notes.trim()}\n`;
    if (artworkFile) msg += `*Attached Artwork:* ${artworkFile.name}\n`;
    msg += `*Estimated Rate:* ₹${activePrice} × ${qty} = ₹${activePrice * qty}\n`;
    msg += `---------------------------------\n`;
    msg += `Hi Aiel Studio, please confirm pre-print digital mockup and delivery to my location!`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-4">
          <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${product.category}`} className="hover:text-foreground transition-colors">{product.categoryLabel}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
        </div>

        {/* Product Customizer Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Gallery & Mockup Previews */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {product.badge && (
                  <span className="absolute top-4 left-4 text-xs font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-brand-gradient text-primary-foreground shadow-lg">
                    {product.badge}
                  </span>
                )}

                <div className="absolute bottom-4 left-4 bg-background/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-display text-splash-teal flex items-center gap-1.5 border border-border/60">
                  <Zap size={14} className="text-splash-orange" />
                  <span>48h Rush Dispatch from Puducherry</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? "border-splash-pink shadow-md shadow-splash-pink/20 scale-105" : "border-border hover:border-border/80"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Customization Engine & Form */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-display uppercase tracking-[0.3em] text-splash-pink font-bold">
                  {product.categoryLabel}
                </span>
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs font-sans text-muted-foreground">
                  <span className="flex items-center gap-1 text-splash-orange font-bold">
                    <Star size={14} fill="currentColor" /> {product.rating} ({product.reviewsCount} verified reviews)
                  </span>
                  <span>•</span>
                  <span className="text-splash-teal font-medium">In Stock for Custom Print</span>
                </div>
              </div>

              {/* Pricing & Savings */}
              <div className="flex items-baseline gap-3 p-4 bg-secondary/50 rounded-2xl border border-border/80">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-display uppercase">Single Unit Price</span>
                  <span className="font-display text-3xl font-extrabold text-gradient">
                    ₹{product.price}
                  </span>
                </div>
                <div className="text-muted-foreground line-through text-sm">
                  ₹{product.originalPrice}
                </div>
                <div className="ml-auto text-right">
                  <span className="bg-splash-pink/15 text-splash-pink text-[11px] font-display font-bold px-2.5 py-1 rounded-full uppercase">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Option 1: Sizes / Specifications */}
              <div className="space-y-2.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Select Size / Specification: <strong className="text-foreground">{selectedSize}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-display tracking-wider transition-all ${
                        selectedSize === s
                          ? "bg-splash-pink text-primary-foreground font-bold shadow-md shadow-splash-pink/30 border border-splash-pink"
                          : "bg-secondary border border-border text-foreground/80 hover:text-foreground hover:border-border/80"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Colour Swatches */}
              <div className="space-y-2.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Select Garment / Product Colour: <strong className="text-foreground">{selectedColor}</strong>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all ${
                        selectedColor === c.name
                          ? "bg-secondary border-splash-pink text-foreground font-bold shadow-sm"
                          : "bg-card border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Print Technique */}
              <div className="space-y-2.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Select Print Style / Technique: <strong className="text-foreground">{selectedPrintType}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.printTypes.map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setSelectedPrintType(pt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-display tracking-wider transition-all ${
                        selectedPrintType === pt
                          ? "bg-brand-gradient gradient-pan text-primary-foreground font-bold shadow-md shadow-splash-pink/20"
                          : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalisation Section */}
              <div className="p-5 bg-card border border-border/80 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-splash-pink" /> Personalisation &amp; Custom Artwork
                </h3>

                {/* Upload artwork */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-sans block">
                    Upload Logo / Design File (PNG, JPG, PDF, SVG):
                  </label>
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border hover:border-splash-pink/60 rounded-2xl cursor-pointer bg-secondary/40 hover:bg-secondary/70 transition-colors">
                    <Upload size={16} className="text-splash-pink" />
                    <span className="text-xs font-sans text-muted-foreground">
                      {artworkFile ? (
                        <strong className="text-splash-teal">{artworkFile.name} (Ready to print)</strong>
                      ) : (
                        "Click or drag design file here (or share directly on WhatsApp)"
                      )}
                    </span>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,.svg,.ai,.psd"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Custom text */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-sans block">
                    Custom Name, Number or Tagline (optional):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. AIEL CREW 2026 / Jersey #07"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink font-sans"
                  />
                </div>

                {/* Notes for designer */}
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-sans block">
                    Placement &amp; Designer Notes:
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Small chest crest + 12-inch back print"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink font-sans"
                  />
                </div>
              </div>

              {/* Bulk Pricing Tier Table */}
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                  Bulk Tier Wholesale Slabs (Auto-applied):
                </label>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {product.bulkPricing.map((tier) => (
                    <div
                      key={tier.qty}
                      className="bg-secondary/60 border border-border/80 rounded-2xl p-2.5"
                    >
                      <span className="text-[10px] text-muted-foreground font-display block uppercase">{tier.qty}</span>
                      <span className="font-display font-bold text-sm text-foreground">₹{tier.price}</span>
                      <span className="text-[9px] text-splash-teal block">/piece</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Final Total */}
              <div className="flex items-center justify-between p-4 bg-secondary/40 rounded-2xl border border-border">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">Quantity:</span>
                  <div className="flex items-center bg-card border border-border rounded-full px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-2.5 py-0.5 text-muted-foreground hover:text-foreground text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 font-display font-bold text-sm text-foreground">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="px-2.5 py-0.5 text-muted-foreground hover:text-foreground text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-display block">Estimated Total</span>
                  <span className="font-display text-xl font-extrabold text-gradient">
                    ₹{activePrice * qty}
                  </span>
                </div>
              </div>

              {/* Actions: Add to Cart & WhatsApp Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all ${
                    added
                      ? "bg-splash-orange text-primary-foreground"
                      : "bg-brand-gradient gradient-pan text-primary-foreground hover:opacity-95 shadow-xl shadow-splash-pink/25"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Cart
                    </>
                  )}
                </button>

                <a
                  href={generateDirectWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-card border border-border/90 text-foreground hover:border-splash-pink hover:text-splash-pink transition-colors"
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-splash-teal flex-shrink-0" />
                  <span>Pantone Proof Approval Before Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-splash-orange flex-shrink-0" />
                  <span>48h Rush Dispatch from Puducherry</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20 border-t border-border/60 bg-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-display uppercase tracking-widest text-splash-pink font-bold block mb-1">
                    Related Collection
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    You Might Also Like
                  </h3>
                </div>
                <Link
                  to={`/${product.category}`}
                  className="text-xs font-display font-semibold uppercase tracking-wider text-splash-pink hover:underline"
                >
                  View All {product.categoryLabel} →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <WhyAielStrip />
      </main>

      <Footer />
    </div>
  );
}
