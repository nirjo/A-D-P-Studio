import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  MessageCircle,
  Truck,
  CreditCard,
  LogOut,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";
import {
  getCustomerOrders,
  updateCustomerProfile,
  type CustomerOrder,
} from "@/lib/customer-service";
import { WHATSAPP_PHONE } from "@/lib/cart";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account & Orders — AIEL Design & Printing Studio" },
      {
        name: "description",
        content: "Manage your profile, track custom apparel orders, and view saved shipping addresses.",
      },
    ],
  }),
  component: CustomerAccountPage,
});

const ORDER_STATUS_STEPS = [
  { key: "pending_payment", label: "Order Placed", step: 1 },
  { key: "payment_verified", label: "Payment Verified", step: 2 },
  { key: "mockup_approval", label: "Mockup Approved", step: 3 },
  { key: "in_production", label: "In Printing", step: 4 },
  { key: "dispatched", label: "Dispatched", step: 5 },
  { key: "delivered", label: "Delivered", step: 6 },
];

function getStatusStep(status: string): number {
  switch (status) {
    case "pending_payment":
      return 1;
    case "payment_verified":
      return 2;
    case "mockup_approval":
      return 3;
    case "in_production":
      return 4;
    case "dispatched":
      return 5;
    case "delivered":
      return 6;
    default:
      return 1;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending_payment":
      return {
        label: "Pending Payment",
        className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
      };
    case "payment_verified":
      return {
        label: "Payment Verified",
        className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
      };
    case "mockup_approval":
      return {
        label: "Mockup In Review",
        className: "bg-splash-purple/15 text-splash-purple border border-splash-purple/30",
      };
    case "in_production":
      return {
        label: "In Production",
        className: "bg-splash-blue/15 text-splash-blue border border-splash-blue/30",
      };
    case "dispatched":
      return {
        label: "Dispatched & Tracking",
        className: "bg-splash-orange/15 text-splash-orange border border-splash-orange/30",
      };
    case "delivered":
      return {
        label: "Delivered",
        className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40",
      };
    default:
      return {
        label: status.replace("_", " "),
        className: "bg-secondary text-foreground border border-border",
      };
  }
}

export function CustomerAccountPage() {
  const { user, customerProfile, signOut, loading, reloadProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Puducherry");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Orders state
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Sync profile data to form fields
  useEffect(() => {
    if (customerProfile) {
      setFullName(customerProfile.fullName || "");
      setPhone(customerProfile.phone || "");
      setCity(customerProfile.city || customerProfile.shippingAddress?.city || "Puducherry");
      setAddress(customerProfile.shippingAddress?.address || "");
      setPincode(customerProfile.shippingAddress?.pincode || "");
    } else if (user) {
      setFullName((user.user_metadata?.["full_name"] as string) || "");
    }
  }, [customerProfile, user]);

  // Load customer orders
  useEffect(() => {
    if (user?.email) {
      setOrdersLoading(true);
      getCustomerOrders(user.email, customerProfile?.id)
        .then((data) => {
          setOrders(data);
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [user?.email, customerProfile?.id]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerProfile?.id) return;

    setSavingProfile(true);
    setProfileMsg(null);

    const res = await updateCustomerProfile(customerProfile.id, {
      fullName,
      phone,
      city,
      shippingAddress: {
        address,
        city,
        pincode,
      },
    });

    if (res.success) {
      setProfileMsg({ type: "success", text: "Profile & shipping address updated successfully!" });
      await reloadProfile();
      setTimeout(() => setProfileMsg(null), 3000);
    } else {
      setProfileMsg({ type: "error", text: res.error || "Failed to update profile." });
    }
    setSavingProfile(false);
  };

  return (
    <>
      <TopBar />
      <Header />

      <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={36} className="animate-spin text-splash-pink mx-auto mb-3" />
            <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
              Loading Customer Account...
            </p>
          </div>
        ) : !user ? (
          /* Non-authenticated Guest view */
          <div className="max-w-md mx-auto my-12 bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1.5px] mx-auto mb-4 shadow-lg shadow-splash-pink/20">
              <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                <User size={28} className="text-splash-pink" />
              </div>
            </div>

            <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">
              Customer <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-xs text-muted-foreground mb-6">
              Sign in to view your orders, live production tracking, pre-print digital proofs, and saved delivery addresses.
            </p>

            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3.5 px-6 rounded-full bg-brand-gradient gradient-pan text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-splash-pink/25 hover:opacity-95 transition-all cursor-pointer"
            >
              Sign In or Register
            </button>

            <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-6 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-splash-teal" /> Supabase Secured
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-splash-orange" /> Real-time Tracking
              </span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8 animate-in fade-in">
            {/* Header User Card */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1.5px] flex-shrink-0">
                  <div className="w-full h-full bg-secondary rounded-[14px] flex items-center justify-center font-display font-bold text-lg text-foreground">
                    {fullName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
                      {fullName || "Valued Customer"}
                    </h1>
                    <span className="text-[10px] uppercase font-display px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-sans">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <Link
                  to="/tshirts"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary border border-border hover:border-splash-pink text-foreground font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <ShoppingBag size={14} /> Shop Apparel
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 pb-3 font-display font-bold text-xs uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "orders"
                    ? "border-splash-pink text-splash-pink"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package size={15} />
                <span>My Orders &amp; Live Tracking ({orders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 pb-3 font-display font-bold text-xs uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                  activeTab === "profile"
                    ? "border-splash-pink text-splash-pink"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin size={15} />
                <span>Saved Address &amp; Profile</span>
              </button>
            </div>

            {/* TAB 1: ORDERS & TRACKING */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {ordersLoading ? (
                  <div className="py-12 text-center">
                    <Loader2 size={28} className="animate-spin text-splash-pink mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Fetching your orders from Supabase...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-3">
                    <Package size={36} className="text-muted-foreground mx-auto" />
                    <h3 className="font-display font-bold text-base text-foreground">No Orders Yet</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      You haven't placed any custom print orders yet. Browse our custom apparel catalogue or photo gifts to get started!
                    </p>
                    <Link
                      to="/tshirts"
                      className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95"
                    >
                      <Sparkles size={14} /> Explore T-Shirts &amp; Apparel
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const badge = getStatusBadge(order.status);
                    const currentStep = getStatusStep(order.status);
                    const waTrackMsg = encodeURIComponent(
                      `Hi Aiel Studio! I'm inquiring about the live status and mockup for Order #${order.orderNumber}.`
                    );

                    return (
                      <div
                        key={order.id}
                        className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-display font-extrabold text-base sm:text-lg text-foreground">
                                Order #{order.orderNumber}
                              </span>
                              <span className={`text-[10px] font-display uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${badge.className}`}>
                                {badge.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock size={12} /> Placed on{" "}
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[11px] text-muted-foreground font-sans block">Total Amount</span>
                            <span className="font-display font-extrabold text-xl text-gradient block">
                              ₹{order.grandTotal}
                            </span>
                          </div>
                        </div>

                        {/* Order Tracking Timeline */}
                        <div className="bg-secondary/40 rounded-2xl p-4 sm:p-5">
                          <h4 className="text-[11px] font-display uppercase tracking-widest text-muted-foreground mb-4">
                            Production &amp; Dispatch Timeline
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                            {ORDER_STATUS_STEPS.map((s) => {
                              const isCompleted = currentStep >= s.step;
                              const isCurrent = currentStep === s.step;

                              return (
                                <div key={s.key} className="flex flex-col items-center">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[10px] mb-1.5 transition-all ${
                                      isCurrent
                                        ? "bg-splash-pink text-primary-foreground ring-4 ring-splash-pink/20 scale-110"
                                        : isCompleted
                                        ? "bg-emerald-500 text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border"
                                    }`}
                                  >
                                    {isCompleted && !isCurrent ? (
                                      <CheckCircle2 size={14} />
                                    ) : (
                                      s.step
                                    )}
                                  </div>
                                  <span
                                    className={`text-[10px] font-display tracking-tight leading-snug ${
                                      isCurrent
                                        ? "text-splash-pink font-bold"
                                        : isCompleted
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {s.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-display uppercase tracking-widest text-muted-foreground">
                            Order Items ({order.items.length})
                          </h4>
                          <div className="divide-y divide-border/60">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                                <div>
                                  <p className="font-display font-bold text-foreground">
                                    {item.quantity}x {item.name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {item.size && `Size: ${item.size}`}
                                    {item.color && ` • Color: ${item.color}`}
                                    {item.printType && ` • Style: ${item.printType}`}
                                  </p>
                                  {item.customText && (
                                    <p className="text-[10px] text-splash-pink italic mt-0.5">
                                      Custom text: "{item.customText}"
                                    </p>
                                  )}
                                </div>
                                <span className="font-display font-bold text-foreground whitespace-nowrap">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Footer Actions */}
                        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-[11px] text-muted-foreground">
                            <span>Delivery to: </span>
                            <span className="font-semibold text-foreground">
                              {order.shippingAddress?.address
                                ? `${order.shippingAddress.address}, ${order.shippingAddress.city || order.shippingCity}`
                                : order.shippingCity || "Puducherry"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${WHATSAPP_PHONE}?text=${waTrackMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary border border-border hover:border-splash-pink text-foreground font-display font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                              <MessageCircle size={14} className="text-emerald-500" />
                              <span>Track on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PROFILE & SAVED ADDRESS */}
            {activeTab === "profile" && (
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-sm">
                <div className="mb-6">
                  <h3 className="font-display font-extrabold text-lg text-foreground">
                    Customer Information &amp; Delivery Address
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Saved information is automatically pre-filled during checkout for quick one-click orders.
                  </p>
                </div>

                {profileMsg && (
                  <div
                    className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 ${
                      profileMsg.type === "success"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        : "bg-destructive/15 text-destructive border border-destructive/30"
                    }`}
                  >
                    {profileMsg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nirmalraj Joseph"
                        required
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 97912 77201"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                      Email Address (Account ID)
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-secondary/30 border border-border/60 rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                      Street Address
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Door / Flat No., Street, Landmark"
                      className="w-full bg-secondary/60 border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-splash-pink resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                        City / Town
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Puducherry"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="605009"
                        className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-splash-pink"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-splash-pink/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Profile & Address"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
