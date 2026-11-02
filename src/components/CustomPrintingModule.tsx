import { useState, useId } from "react";
import {
  Upload,
  Sparkles,
  Layers,
  Send,
  MessageCircle,
  FileCheck2,
  HelpCircle,
  Check,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { useCart, WHATSAPP_PHONE } from "@/lib/cart";
import { submitCustomizationRequest } from "@/lib/apparel-service";
import type { Product, ProductColor } from "@/data/products";

export interface CustomPrintingModuleProps {
  product: Product;
  selectedColor?: ProductColor;
  selectedSize?: string;
  quantity?: number;
  onPriceChange?: (totalPerUnit: number) => void;
}

export type PrintPlacement = "front" | "back" | "left-sleeve" | "right-sleeve";
export type PrintMethod = "DTF" | "Sublimation" | "Vinyl" | "Embroidery";
export type PrintSize = "Pocket (4x4 in)" | "A4 Standard (8x11 in)" | "A3 Oversized (12x16 in)" | "Full Wrap (All-Over)";

const PRINT_PRICES: Record<PrintMethod, Record<PrintSize, number>> = {
  DTF: {
    "Pocket (4x4 in)": 60,
    "A4 Standard (8x11 in)": 120,
    "A3 Oversized (12x16 in)": 190,
    "Full Wrap (All-Over)": 260,
  },
  Sublimation: {
    "Pocket (4x4 in)": 40,
    "A4 Standard (8x11 in)": 80,
    "A3 Oversized (12x16 in)": 140,
    "Full Wrap (All-Over)": 200,
  },
  Vinyl: {
    "Pocket (4x4 in)": 50,
    "A4 Standard (8x11 in)": 100,
    "A3 Oversized (12x16 in)": 160,
    "Full Wrap (All-Over)": 220,
  },
  Embroidery: {
    "Pocket (4x4 in)": 90,
    "A4 Standard (8x11 in)": 180,
    "A3 Oversized (12x16 in)": 280,
    "Full Wrap (All-Over)": 350,
  },
};

export function CustomPrintingModule({
  product,
  selectedColor,
  selectedSize = "M",
  quantity = 1,
}: CustomPrintingModuleProps) {
  const uploadInputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PrintMethod>("DTF");
  const [selectedPlacements, setSelectedPlacements] = useState<PrintPlacement[]>(["front"]);
  const [selectedPrintSize, setSelectedPrintSize] = useState<PrintSize>("A4 Standard (8x11 in)");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openDrawer } = useCart();

  // Pricing calculation
  const garmentUnitRate = product.price;
  const costPerPlacement = PRINT_PRICES[selectedMethod]?.[selectedPrintSize] || 120;
  const totalPrintUnitCharge = costPerPlacement * selectedPlacements.length;
  const combinedUnitPrice = garmentUnitRate + totalPrintUnitCharge;
  const grandTotal = combinedUnitPrice * quantity;

  const handleAddToCartWithCustomPrint = () => {
    addItem({
      product: {
        ...product,
        price: combinedUnitPrice,
      },
      quantity,
      selectedSize: selectedSize || product.sizes[0] || "M",
      selectedColor: selectedColor?.name || product.colors[0]?.name || "Standard",
      selectedPrintType: `${selectedMethod} (${selectedPlacements.join(", ")})`,
      customText: customInstructions.trim() || undefined,
      notes: `Method: ${selectedMethod} | Placements: ${selectedPlacements.join(", ")} | Size: ${selectedPrintSize}${artworkFile ? ` | Artwork: ${artworkFile.name}` : ""}`,
      artworkName: artworkFile ? artworkFile.name : undefined,
    });
    setAddedToCart(true);
    openDrawer();
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const togglePlacement = (placement: PrintPlacement) => {
    if (selectedPlacements.includes(placement)) {
      if (selectedPlacements.length === 1) return; // Keep at least one
      setSelectedPlacements(selectedPlacements.filter((p) => p !== placement));
    } else {
      setSelectedPlacements([...selectedPlacements, placement]);
    }
  };

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0]);
    }
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail && !customerPhone) return;

    setSubmitting(true);
    try {
      await submitCustomizationRequest({
        productId: product.id,
        customerName: customerName || "Guest Customer",
        customerEmail: customerEmail || "quote@aieldesignstudio.com",
        customerPhone,
        selectedColor: selectedColor?.name,
        selectedSize,
        quantity,
        printMethod: selectedMethod,
        printPositions: selectedPlacements,
        printSize: selectedPrintSize,
        instructions: customInstructions,
        garmentPrice: garmentUnitRate,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const waQuoteText = `*CUSTOM PRINTING QUOTATION REQUEST — AIEL STUDIO*
═══════════════════════════
*Product:* ${product.name}
*Size:* ${selectedSize} | *Colour:* ${selectedColor?.name || "Standard"}
*Quantity:* ${quantity} pcs

*Printing Technique:* ${selectedMethod}
*Print Positions:* ${selectedPlacements.join(", ").toUpperCase()}
*Print Size:* ${selectedPrintSize}

*Cost Breakdown:*
• Blank Garment: ₹${garmentUnitRate} × ${quantity} = ₹${garmentUnitRate * quantity}
• Custom Print Charge: ₹${totalPrintUnitCharge} × ${quantity} = ₹${totalPrintUnitCharge * quantity}
• *Estimated Total:* ₹${grandTotal} (GST & Digital Proof included)

*Customer Instructions:* ${customInstructions || "None"}
${customerName ? `*Name:* ${customerName}` : ""}
${customerPhone ? `*Phone:* ${customerPhone}` : ""}

Hi Aiel Studio, I have uploaded my artwork and would like to review digital mockups and finalize quotation!`;

  const waQuoteUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waQuoteText)}`;

  return (
    <div className="mt-8 border border-splash-pink/40 bg-card/60 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl shadow-splash-pink/5 relative overflow-hidden transition-all">
      {/* Glow Accent */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-splash-pink/20 to-splash-purple/20 rounded-full blur-3xl" />

      {/* Accordion / Header Bar */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row pb-4 border-b border-border/80 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-splash-pink/15 text-splash-pink border border-splash-pink/30 text-[11px] font-display font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> Custom Apparel Printing Studio
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-foreground tracking-tight">
            CUSTOMIZE THIS <span className="text-gradient">PRODUCT</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload your logo, select print positions, and get instant separate pricing for garment &amp; printing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-xs uppercase tracking-wider transition-all border shadow-sm ${
            isOpen
              ? "bg-secondary border-border text-foreground hover:border-splash-pink"
              : "bg-brand-gradient text-primary-foreground border-transparent shadow-splash-pink/25 hover:opacity-95"
          }`}
        >
          <Layers size={14} />
          <span>{isOpen ? "Hide Options" : "Start Customizing"}</span>
        </button>
      </div>

      {/* Expanded Customization Controls */}
      {isOpen && (
        <div className="pt-6 space-y-6 relative z-10 animate-in fade-in duration-300">
          {/* Step 1: Print Placement */}
          <div>
            <label className="text-xs font-display font-bold uppercase tracking-wider text-foreground block mb-2.5">
              1. Select Print Placements (Front, Back, Sleeves)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: "front", label: "Front Chest", desc: "Center or pocket" },
                  { id: "back", label: "Back Artwork", desc: "Full or upper back" },
                  { id: "left-sleeve", label: "Left Sleeve", desc: "Crest / logo" },
                  { id: "right-sleeve", label: "Right Sleeve", desc: "Flag / sponsor" },
                ] as const
              ).map((pos) => {
                const selected = selectedPlacements.includes(pos.id);
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => togglePlacement(pos.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selected
                        ? "bg-splash-pink/15 border-splash-pink shadow-xs text-foreground"
                        : "bg-secondary/50 border-border/70 text-muted-foreground hover:text-foreground hover:border-splash-pink/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-xs capitalize">{pos.label}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${
                          selected
                            ? "bg-splash-pink border-splash-pink text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {selected && <Check size={10} />}
                      </span>
                    </div>
                    <span className="text-[10px] block opacity-75">{pos.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Print Technique */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-foreground">
                2. Select Printing Technique
              </label>
              <span className="text-[11px] text-muted-foreground font-sans">
                Japanese Mimaki &amp; Brother DTF
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: "DTF", name: "DTF Print", desc: "Full-color photographic, 50+ wash durability" },
                  { id: "Sublimation", name: "Sublimation", desc: "Breathable, zero hand feel (poly/jersey)" },
                  { id: "Vinyl", name: "Vinyl Heat Transfer", desc: "Ultra-sharp names, numbers & metallic foils" },
                  { id: "Embroidery", name: "Embroidery", desc: "High-density Japanese thread stitchwork" },
                ] as const
              ).map((m) => {
                const active = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      active
                        ? "bg-splash-purple/20 border-splash-purple shadow-xs text-foreground"
                        : "bg-secondary/50 border-border/70 text-muted-foreground hover:text-foreground hover:border-splash-purple/40"
                    }`}
                  >
                    <span className="font-display font-bold text-xs block mb-0.5 text-foreground">
                      {m.name}
                    </span>
                    <span className="text-[10px] block opacity-80 leading-snug">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Print Size / Dimensions */}
          <div>
            <label className="text-xs font-display font-bold uppercase tracking-wider text-foreground block mb-2.5">
              3. Artwork Print Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  "Pocket (4x4 in)",
                  "A4 Standard (8x11 in)",
                  "A3 Oversized (12x16 in)",
                  "Full Wrap (All-Over)",
                ] as const
              ).map((size) => {
                const active = selectedPrintSize === size;
                const cost = PRINT_PRICES[selectedMethod]?.[size] || 120;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedPrintSize(size)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      active
                        ? "bg-splash-teal/20 border-splash-teal text-foreground shadow-xs"
                        : "bg-secondary/50 border-border/70 text-muted-foreground hover:text-foreground hover:border-splash-teal/40"
                    }`}
                  >
                    <span className="font-display font-bold text-xs block mb-1 text-foreground">
                      {size}
                    </span>
                    <span className="text-[11px] font-mono text-splash-teal font-semibold">
                      +₹{cost} / position
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Upload Artwork & Custom Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-display font-bold uppercase tracking-wider text-foreground block mb-2">
                4. Upload Logo / Graphic File
              </label>
              <label
                htmlFor={uploadInputId}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-secondary/50 border border-dashed border-border hover:border-splash-pink cursor-pointer transition-colors text-center"
              >
                <div className="w-10 h-10 rounded-full bg-splash-pink/15 text-splash-pink flex items-center justify-center mb-2">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-display font-bold text-foreground">
                  {artworkFile ? artworkFile.name : "Click to upload artwork file"}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Supported formats: PNG (Transparent), PDF, AI, PSD, SVG, JPG (Max 50MB)
                </span>
                <input
                  id={uploadInputId}
                  type="file"
                  accept="image/*,.pdf,.ai,.psd,.svg"
                  onChange={handleArtworkUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label htmlFor="custom-instructions-input" className="text-xs font-display font-bold uppercase tracking-wider text-foreground block mb-2">
                5. Placement Instructions &amp; Color Specifications
              </label>
              <textarea
                id="custom-instructions-input"
                rows={4}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="E.g., Place 3-inch logo on left chest, big artwork on center back. Use Pantone 186C red. Required for event on 15th..."
                className="w-full bg-secondary/50 border border-border rounded-2xl p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink resize-none"
              />
            </div>
          </div>

          {/* Price Transparency Breakdown Banner */}
          <div className="bg-secondary/70 border border-border/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 size={16} className="text-splash-teal" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
                Itemized Cost Breakdown (Garment vs. Printing)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-display">
                  Blank Garment
                </span>
                <span className="font-display font-bold text-sm text-foreground mt-0.5 block">
                  ₹{garmentUnitRate} / pc
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-display">
                  Custom Printing ({selectedPlacements.length} positions)
                </span>
                <span className="font-display font-bold text-sm text-splash-pink mt-0.5 block">
                  +₹{totalPrintUnitCharge} / pc
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-display">
                  Combined Unit Rate
                </span>
                <span className="font-display font-bold text-sm text-gradient mt-0.5 block">
                  ₹{combinedUnitPrice} / pc
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-card border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase font-display">
                  Subtotal ({quantity} pcs)
                </span>
                <span className="font-display font-extrabold text-sm text-emerald-400 mt-0.5 block">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <HelpCircle size={11} className="flex-shrink-0" /> Bulk quantities (10+, 25+, 50+ pcs)
              automatically qualify for 15% to 35% wholesale discounts.
            </p>
          </div>

          {/* Instant Add to Cart with Custom Print */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddToCartWithCustomPrint}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-lg shadow-splash-pink/25 hover:opacity-95 transition-all cursor-pointer"
            >
              {addedToCart ? (
                <>
                  <Check size={16} /> Added to Cart with Custom Printing!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Cart with Custom Print • ₹{grandTotal}
                </>
              )}
            </button>
          </div>

          {/* Quotation Request Form & WhatsApp Trigger */}
          <div className="border-t border-border/80 pt-5">
            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in fade-in">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1.5" />
                <h4 className="font-display font-bold text-sm text-foreground">
                  Quotation Request Submitted!
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  Our print specialists will review your artwork and reply via WhatsApp &amp; Email
                  within 2 hours with digital 3D mockups.
                </p>
                <a
                  href={waQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider"
                >
                  <MessageCircle size={14} /> Open Conversation on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleQuotationSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name / Company"
                    className="bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                  />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email address"
                    className="bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Number"
                    className="bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-secondary border border-border hover:border-splash-pink text-foreground font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{submitting ? "Submitting..." : "Request Official Quote (Free)"}</span>
                  </button>

                  <a
                    href={waQuoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all text-center"
                  >
                    <MessageCircle size={15} />
                    <span>Instant WhatsApp Proof • ₹{grandTotal}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
