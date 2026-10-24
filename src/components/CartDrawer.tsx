import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageCircle, Zap, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { CheckoutModal } from "@/components/CheckoutModal";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    grandTotal,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [clientCity, setClientCity] = useState("Puducherry");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeDrawer]);

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="relative w-full max-w-md bg-card border-l border-border h-full flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-splash-pink" />
                <h3 className="font-display font-bold text-base text-foreground">
                  Your Custom Print Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-5 py-3 bg-secondary/60 border-b border-border">
              <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                <span className="flex items-center gap-1.5 text-splash-orange font-semibold text-[11px]">
                  <Zap size={13} className="text-splash-orange" />
                  {subtotal >= FREE_SHIPPING_THRESHOLD
                    ? "Free Pan-India Express Shipping Unlocked!"
                    : `Add ₹${FREE_SHIPPING_THRESHOLD - subtotal} more for Free Shipping`}
                </span>
                <span className="text-muted-foreground text-[10px]">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gradient transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-none">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-5xl mb-3 block">🎨</span>
                  <h4 className="font-display text-base font-bold text-foreground mb-1">Your cart is empty</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
                    Pick your favourite t-shirt, mug, keychain, tote bag or phone case and start customising.
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="inline-flex items-center gap-2 bg-brand-gradient gradient-pan text-primary-foreground font-display font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:opacity-95 transition-opacity"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-secondary/40 border border-border/60 rounded-2xl p-3.5 flex flex-col gap-2.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-border flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-display font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-gradient">₹{item.product.price}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">₹{item.product.originalPrice}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-sans text-muted-foreground">
                      {item.selectedSize && (
                        <span className="bg-background/80 px-2 py-0.5 rounded border border-border/40">
                          Size: <strong className="text-foreground">{item.selectedSize}</strong>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-background/80 px-2 py-0.5 rounded border border-border/40">
                          Colour: <strong className="text-foreground">{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedPrintType && (
                        <span className="bg-background/80 px-2 py-0.5 rounded border border-border/40">
                          Print: <strong className="text-foreground">{item.selectedPrintType}</strong>
                        </span>
                      )}
                    </div>

                    {/* Custom Text indicator */}
                    {item.customText && (
                      <div className="text-[10px] bg-splash-pink/10 text-splash-pink px-2.5 py-1 rounded-md border border-splash-pink/20 truncate">
                        Custom Text: &ldquo;{item.customText}&rdquo;
                      </div>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <div className="flex items-center bg-background border border-border rounded-full px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-muted-foreground hover:text-foreground text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2.5 text-xs font-display font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="font-display font-bold text-sm text-foreground">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom summary and actions */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-card space-y-3">
                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-display">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pan-India Shipping</span>
                    <span className="font-display text-foreground">
                      {shippingFee === 0 ? <strong className="text-splash-teal uppercase text-[11px]">FREE</strong> : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-foreground pt-2 border-t border-border">
                    <span className="font-display font-bold text-sm">Total Amount</span>
                    <span className="text-gradient font-display text-xl font-extrabold">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Delivery City Input for accurate quote */}
                <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-1.5 border border-border">
                  <span className="text-[11px] text-muted-foreground font-sans">Shipping to:</span>
                  <input
                    type="text"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="City / Pincode"
                    className="flex-1 bg-transparent text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={generateWhatsAppOrderUrl(undefined, clientCity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-opacity"
                  >
                    <MessageCircle size={16} /> Instant WhatsApp Order
                  </a>

                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-display font-bold text-xs uppercase tracking-wider py-3 rounded-full hover:border-splash-pink transition-colors"
                  >
                    Pay Online (Cards / UPI / NetBanking)
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-splash-teal" /> Pre-print Proof Included
                  </span>
                  <span>•</span>
                  <span>GST Invoice Available</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} clientCity={clientCity} />
    </>
  );
}
