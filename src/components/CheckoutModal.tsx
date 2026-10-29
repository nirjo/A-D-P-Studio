import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  Smartphone,
  MessageCircle,
  QrCode,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { createOrderInDatabase } from "@/lib/orders";
import {
  initiateRazorpayPayment,
  generateUpiUrl,
  getPrefilledPaymentLink,
  UPI_ID,
  WHATSAPP_PHONE,
  RAZORPAY_PAYMENT_LINK,
} from "@/lib/razorpay";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientCity?: string;
}

type PaymentMethodType = "razorpay" | "upi" | "whatsapp";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("razorpay");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

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
        paymentMethod: paymentMethod === "whatsapp" ? "whatsapp_upi" : "razorpay",
      });

      if (!result.success || !result.order) {
        setError(result.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const orderNumber = result.order.orderNumber;

      // 2. Route by payment method
      if (paymentMethod === "whatsapp") {
        setLoading(false);
        setSuccessOrderNumber(orderNumber);
        clearCart();
        const itemsList = items.map((i) => `• ${i.quantity}x ${i.product.name} (${i.selectedSize || "Standard"})`).join("\n");
        const msg = encodeURIComponent(
          `Hi Aiel Studio! I placed Order #${orderNumber} on your website.\n\nTotal: ₹${grandTotal}\nName: ${fullName}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}\n\nItems:\n${itemsList}\n\nPlease share the payment QR & pre-print mockup proof!`
        );
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank");
        return;
      }

      if (paymentMethod === "upi") {
        setLoading(false);
        setSuccessOrderNumber(orderNumber);
        clearCart();
        const upiUrl = generateUpiUrl(grandTotal, orderNumber);
        window.location.href = upiUrl;
        return;
      }

      // 3. Initiate Razorpay Checkout with server-order support
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
          setSuccessOrderNumber(orderNumber);
          clearCart();
        },
        onError: (_err) => {
          setLoading(false);
          // If modal throws an error, order is saved; show success screen with fallback links
          setSuccessOrderNumber(orderNumber);
          clearCart();
        },
      });
    } catch (err: unknown) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const upiUrl = successOrderNumber ? generateUpiUrl(grandTotal, successOrderNumber) : "";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;
  const prefilledRazorpayLink = successOrderNumber ? getPrefilledPaymentLink(grandTotal, successOrderNumber) : RAZORPAY_PAYMENT_LINK;

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
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
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
              /* Success & Payment Options State */
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                  Order Registered!
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Thank you, <strong>{fullName}</strong>. Your custom print order has been queued in Supabase.
                </p>

                {/* Order Summary Pill */}
                <div className="bg-secondary/60 border border-border rounded-2xl p-4 mb-5 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Order ID</span>
                    <span className="font-mono font-bold text-sm text-splash-pink">#{successOrderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-foreground">
                    <span>Payable Total:</span>
                    <span className="text-lg font-extrabold text-splash-teal">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Direct Payment Action Buttons */}
                <div className="space-y-2.5 text-left mb-5">
                  <p className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
                    Complete Payment via Your Preferred Method:
                  </p>

                  {/* 1. Direct Razorpay Verified Link */}
                  <a
                    href={prefilledRazorpayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-500/60 transition-all text-xs text-foreground group"
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard size={17} className="text-blue-400" />
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          Pay ₹{grandTotal} via Razorpay Link
                          <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">Cards, NetBanking, UPI, Wallets</span>
                      </div>
                    </div>
                    <span className="font-bold text-blue-400 text-xs">Open ↗</span>
                  </a>

                  {/* 2. Direct UPI App (PhonePe, GPay, Paytm) */}
                  <a
                    href={upiUrl}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-xs text-foreground"
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone size={17} className="text-emerald-400" />
                      <div>
                        <div className="font-bold">Pay via Any UPI App (Mobile)</div>
                        <span className="text-[10px] text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs">Pay Now →</span>
                  </a>

                  {/* 3. QR Code Toggle for Desktop */}
                  <div className="bg-secondary/40 border border-border rounded-2xl p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <QrCode size={15} />
                        <span>UPI ID: <strong className="text-foreground">{UPI_ID}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="px-2 py-1 rounded-lg bg-secondary text-[11px] text-foreground hover:bg-secondary/80 flex items-center gap-1"
                        >
                          {copiedUpi ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedUpi ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowQr(!showQr)}
                          className="px-2 py-1 rounded-lg bg-secondary text-[11px] text-foreground hover:bg-secondary/80"
                        >
                          {showQr ? "Hide QR" : "Show QR"}
                        </button>
                      </div>
                    </div>

                    {showQr && (
                      <div className="mt-3 p-3 bg-white rounded-xl flex flex-col items-center justify-center">
                        <img
                          src={qrCodeUrl}
                          alt="Scan to Pay via UPI"
                          className="w-40 h-40 object-contain"
                        />
                        <p className="text-[11px] text-zinc-700 font-sans mt-1">Scan with any UPI app to pay ₹{grandTotal}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Proof Action */}
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hi Aiel Studio, I placed Order #${successOrderNumber} (₹${grandTotal}). Here is my custom artwork proof!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg hover:opacity-95 transition-opacity"
                  >
                    <MessageCircle size={15} /> Confirm Proof &amp; Receipt on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={18} className="text-splash-pink" />
                  <h3 className="font-display font-bold text-xl text-foreground">
                    Secure Checkout
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5">
                  Custom print order with pre-print digital proofing included.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-start gap-2.5 text-xs text-destructive">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
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

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-display uppercase tracking-wider text-muted-foreground mb-1.5">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          paymentMethod === "razorpay"
                            ? "bg-splash-pink/10 border-splash-pink text-foreground shadow-sm"
                            : "bg-secondary/40 border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        <CreditCard size={15} className={paymentMethod === "razorpay" ? "text-splash-pink" : ""} />
                        <div className="text-[11px] font-bold mt-1">Razorpay</div>
                        <div className="text-[9px] text-muted-foreground truncate">Cards / UPI / NetBanking</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          paymentMethod === "upi"
                            ? "bg-splash-teal/10 border-splash-teal text-foreground shadow-sm"
                            : "bg-secondary/40 border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        <Smartphone size={15} className={paymentMethod === "upi" ? "text-splash-teal" : ""} />
                        <div className="text-[11px] font-bold mt-1">Direct UPI</div>
                        <div className="text-[9px] text-muted-foreground truncate">GPay / PhonePe / Paytm</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("whatsapp")}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          paymentMethod === "whatsapp"
                            ? "bg-emerald-500/10 border-emerald-500 text-foreground shadow-sm"
                            : "bg-secondary/40 border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        <MessageCircle size={15} className={paymentMethod === "whatsapp" ? "text-emerald-400" : ""} />
                        <div className="text-[11px] font-bold mt-1">WhatsApp</div>
                        <div className="text-[9px] text-muted-foreground truncate">Pay &amp; Proof on Chat</div>
                      </button>
                    </div>
                  </div>

                  {/* Order Summary Box */}
                  <div className="bg-secondary/40 border border-border rounded-2xl p-3.5 space-y-1 text-xs font-sans">
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
                      <span className="text-xs text-foreground">Total Payable</span>
                      <span className="text-gradient font-display text-base font-extrabold">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Gateway Security Badge */}
                  <div className="text-[10px] text-muted-foreground flex items-center justify-between px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-splash-teal" /> 100% Encrypted &amp; Verified
                    </span>
                    <span>Order confirmation sent to email</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Registering Order...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        {paymentMethod === "razorpay" && `Pay ₹${grandTotal} via Razorpay`}
                        {paymentMethod === "upi" && `Proceed to UPI App (₹${grandTotal})`}
                        {paymentMethod === "whatsapp" && `Confirm Order on WhatsApp (₹${grandTotal})`}
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
