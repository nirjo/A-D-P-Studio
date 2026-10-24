import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { createOrderInDatabase } from "@/lib/orders";
import { initiateRazorpayPayment, RAZORPAY_PAYMENT_LINK, RAZORPAY_KEY_ID } from "@/lib/razorpay";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientCity?: string;
}

export function CheckoutModal({ isOpen, onClose, clientCity = "Puducherry" }: CheckoutModalProps) {
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(
    (user?.user_metadata?.["full_name"] as string) || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(clientCity);
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Please provide your name and email address.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order record in Supabase
      const result = await createOrderInDatabase({
        customer: {
          fullName,
          email,
          phone,
          city,
          shippingAddress: { address, city, pincode },
          authUserId: user?.id,
        },
        items,
        subtotal,
        shippingFee,
        grandTotal,
        notes,
        paymentMethod: "razorpay",
      });

      if (!result.success || !result.order) {
        setError(result.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const orderNumber = result.order.orderNumber;

      // 2. Initiate Razorpay Checkout (modal or payment link fallback)
      await initiateRazorpayPayment({
        orderNumber,
        amount: grandTotal,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        onSuccess: (_paymentId) => {
          setLoading(false);
          setSuccessOrderNumber(orderNumber);
          clearCart();
        },
        onDismiss: () => {
          setLoading(false);
          // If modal dismissed, order record is still saved
          setSuccessOrderNumber(orderNumber);
          clearCart();
        },
        onError: (err) => {
          console.error("Payment error:", err);
          setLoading(false);
          setError("Payment was not completed. Your order has been saved.");
        },
      });
    } catch (err: unknown) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {successOrderNumber ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                  Order Received!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you, <strong>{fullName}</strong>. Your custom print order has been registered.
                </p>

                <div className="bg-secondary/60 border border-border rounded-2xl p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Order Number</p>
                  <p className="font-display font-extrabold text-xl text-splash-pink mt-1">
                    #{successOrderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total Amount: <strong>₹{grandTotal}</strong> • 48h Turnaround
                  </p>
                </div>

                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Our design team will contact you at <strong>{email}</strong> or on WhatsApp with digital artwork placement proofs before printing starts.
                </p>

                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/919150234277?text=${encodeURIComponent(`Hi Aiel Studio, I placed order #${successOrderNumber} on your website. Here is my artwork!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg hover:opacity-95 transition-opacity"
                  >
                    Share Artwork on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={18} className="text-splash-pink" />
                  <h3 className="font-display font-bold text-xl text-foreground">
                    Secure Online Checkout
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Powered by Razorpay &amp; Supabase Database. Pre-print proofs included.
                </p>

                {error && (
                  <div className="mb-5 p-3 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                  </div>

                  {/* Phone & City */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Phone (for Delivery &amp; Proof)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Delivery City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Puducherry / Chennai"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                  </div>

                  {/* Address & Pincode */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Shipping Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, Landmark, Apartment"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="605001"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1">
                      Custom Print Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please center the logo on the chest, rush for Saturday event"
                      className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-splash-pink resize-none"
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="bg-secondary/40 border border-border rounded-2xl p-4 space-y-1.5 text-xs font-sans">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                      <span className="text-foreground font-display">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Pan-India Shipping</span>
                      <span className="text-foreground font-display">
                        {shippingFee === 0 ? <strong className="text-splash-teal">FREE</strong> : `₹${shippingFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border font-bold">
                      <span className="text-sm text-foreground">Total Payable</span>
                      <span className="text-gradient font-display text-lg font-extrabold">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Payment Gateway Info */}
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-splash-teal" /> 100% Secure Checkout
                    </span>
                    <span>Razorpay UPI / Cards / NetBanking</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Processing Order...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Pay ₹{grandTotal} via Razorpay
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
