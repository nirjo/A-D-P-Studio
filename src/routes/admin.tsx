import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Layers,
  ArrowLeft,
  Upload,
  Lock,
  Eye,
  Sliders,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadImage,
  adminSyncSeedData,
  adminGetCustomizationRequests,
  type AdminProductPayload,
} from "@/lib/admin-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APPAREL_SUBCATEGORIES, APPAREL_COLORS, APPAREL_SIZES } from "@/lib/apparel-service";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — AIEL Design & Printing Studio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminManagementPage,
});

function AdminManagementPage() {
  const { user, signIn } = useAuth();
  const queryClient = useQueryClient();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"products" | "customizations" | "sync">("products");

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for add/edit product
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("tshirts");
  const [formCategoryLabel, setFormCategoryLabel] = useState("Round Neck T-Shirts");
  const [formPrice, setFormPrice] = useState(499);
  const [formOriginalPrice, setFormOriginalPrice] = useState(699);
  const [formBadge, setFormBadge] = useState<string>("Best Seller");
  const [formInStock, setFormInStock] = useState(true);
  const [formImage, setFormImage] = useState("");
  const [formGsm, setFormGsm] = useState(240);
  const [formMaterial, setFormMaterial] = useState("100% Super-Combed French Terry Cotton");
  const [formFit, setFormFit] = useState("Boxy Drop Shoulder Oversized");
  const [formDescription, setFormDescription] = useState("");
  const [formSizes, setFormSizes] = useState<string[]>(["S", "M", "L", "XL", "XXL", "XXXL"]);
  const [formPrintTypes, setFormPrintTypes] = useState<string[]>([
    "DTF (Direct to Film)",
    "Puff 3D Print",
    "Screen Print",
  ]);

  // Auth mock signin for demo
  const [adminEmail, setAdminEmail] = useState("admin@aieldesignstudio.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Queries
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminGetProducts,
  });

  const { data: customizations = [] } = useQuery({
    queryKey: ["admin-customizations"],
    queryFn: adminGetCustomizationRequests,
    enabled: activeTab === "customizations",
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchCat =
        selectedSubcategory === "all" ||
        (p.category_label || p.categoryLabel || "")
          .toLowerCase()
          .includes(selectedSubcategory.toLowerCase());
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.slug && p.slug.toLowerCase().includes(search.toLowerCase())) ||
        (p.material && p.material.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedSubcategory, search]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (payload: AdminProductPayload) => {
      if (editingProduct?.id) {
        return adminUpdateProduct(editingProduct.id, payload);
      } else {
        return adminCreateProduct(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditModalOpen(false);
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteConfirmId(null);
    },
  });

  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const syncMutation = useMutation({
    mutationFn: adminSyncSeedData,
    onSuccess: (res) => {
      setSyncStatus(`Successfully synchronized ${res.count} apparel products with Supabase.`);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      setSyncStatus(`Sync error: ${err.message}`);
    },
  });

  // Open Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormCategory("tshirts");
    setFormCategoryLabel("Round Neck T-Shirts");
    setFormPrice(499);
    setFormOriginalPrice(699);
    setFormBadge("New");
    setFormInStock(true);
    setFormImage("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80");
    setFormGsm(240);
    setFormMaterial("100% Super-Combed Cotton");
    setFormFit("Regular Fit");
    setFormDescription("Premium custom printed apparel crafted with precision in Puducherry.");
    setFormSizes(["S", "M", "L", "XL", "XXL", "XXXL"]);
    setFormPrintTypes(["DTF (Direct to Film)", "Screen Print"]);
    setEditModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormName(p.name || "");
    setFormSlug(p.slug || "");
    setFormCategory(p.category || "tshirts");
    setFormCategoryLabel(p.category_label || p.categoryLabel || "Round Neck T-Shirts");
    setFormPrice(Number(p.price || 499));
    setFormOriginalPrice(Number(p.original_price || p.originalPrice || 699));
    setFormBadge(p.badge || "Best Seller");
    setFormInStock(p.in_stock !== false && !p.is_sold_out);
    setFormImage(p.image || "");
    setFormGsm(Number(p.gsm || 240));
    setFormMaterial(p.material || "");
    setFormFit(p.fit || "");
    setFormDescription(p.description || "");
    setFormSizes(Array.isArray(p.sizes) ? p.sizes : ["S", "M", "L", "XL", "XXL"]);
    setFormPrintTypes(Array.isArray(p.print_types || p.printTypes) ? (p.print_types || p.printTypes) : ["DTF"]);
    setEditModalOpen(true);
  };

  // Save product form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      formSlug.trim() ||
      formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const payload: AdminProductPayload = {
      id: editingProduct?.id || `app-${Date.now()}`,
      name: formName,
      slug,
      category: formCategory,
      category_label: formCategoryLabel,
      price: formPrice,
      original_price: formOriginalPrice,
      badge: formBadge,
      in_stock: formInStock,
      is_sold_out: !formInStock,
      image: formImage,
      gallery: [formImage],
      description: formDescription,
      sizes: formSizes,
      colors: APPAREL_COLORS.slice(0, 5),
      print_types: formPrintTypes,
      gsm: formGsm,
      material: formMaterial,
      fit: formFit,
    };

    saveMutation.mutate(payload);
  };

  // Quick toggle in-stock directly in table
  const handleQuickToggleStock = async (p: any) => {
    const current = p.in_stock !== false && !p.is_sold_out;
    await adminUpdateProduct(p.id, {
      in_stock: !current,
      is_sold_out: current,
    });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  // Quick price change
  const handleQuickPriceChange = async (p: any, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    await adminUpdateProduct(p.id, { price: newPrice });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  // Image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const res = await adminUploadImage(e.target.files[0]);
      if (res.url) {
        setFormImage(res.url);
      }
    }
  };

  // Handle Admin Sign In
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await signIn(adminEmail, adminPassword || "password123");
    if (res.error) {
      setAuthError(res.error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 w-full relative">
        {/* Glow */}
        <div className="pointer-events-none absolute top-10 right-10 w-96 h-96 bg-splash-pink/10 rounded-full blur-3xl" />

        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4 relative z-10">
          <Link
            to="/tshirts"
            className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-widest text-muted-foreground hover:text-splash-pink transition-colors"
          >
            <ArrowLeft size={13} /> Back to Apparel Catalogue
          </Link>

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-display">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-muted-foreground">Admin:</span>
            <strong className="text-foreground">
              {user ? user.email : "Authorized Admin"}
            </strong>
          </div>
        </div>

        {/* Header Title */}
        <div className="border-b border-border/80 pb-6 mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-splash-purple/20 text-splash-purple border border-splash-purple/40 text-[11px] font-display font-semibold uppercase tracking-wider mb-2">
              <Sliders size={12} /> Store Operations
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Apparel Catalogue <span className="text-gradient">Manager</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Add products, update colors and sizes, toggle stock availability, edit live prices, and synchronize product data with Supabase.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary border border-border hover:border-splash-teal text-foreground font-display text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={`text-splash-teal ${syncMutation.isPending ? "animate-spin" : ""}`}
              />
              <span>{syncMutation.isPending ? "Syncing..." : "Sync Supabase"}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all"
            >
              <Plus size={15} />
              <span>Add Apparel Product</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary border border-splash-teal/40 flex items-center justify-between text-xs text-foreground animate-in fade-in">
            <span>{syncStatus}</span>
            <button
              type="button"
              onClick={() => setSyncStatus(null)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border/80 mb-6 relative z-10 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
              activeTab === "products"
                ? "bg-splash-pink/15 text-splash-pink font-bold border-splash-pink"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <Package size={14} />
            <span>Products ({filteredProducts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("customizations")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
              activeTab === "customizations"
                ? "bg-splash-purple/20 text-splash-purple font-bold border-splash-purple"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <FileText size={14} />
            <span>Quotation Requests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sync")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display uppercase tracking-wider transition-all border ${
              activeTab === "sync"
                ? "bg-splash-teal/20 text-splash-teal font-bold border-splash-teal"
                : "text-muted-foreground hover:text-foreground border-transparent"
            }`}
          >
            <RefreshCw size={14} />
            <span>Data Synchronization</span>
          </button>
        </div>

        {/* TAB 1: Products Table */}
        {activeTab === "products" && (
          <section className="space-y-4 relative z-10">
            {/* Filter controls */}
            <div className="bg-card/70 border border-border/80 p-3.5 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by title, slug, or GSM..."
                  className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-splash-pink"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="bg-secondary border border-border text-foreground font-display text-xs rounded-full px-3.5 py-2 focus:outline-none focus:border-splash-pink"
                >
                  <option value="all" className="bg-card">
                    All Categories
                  </option>
                  <option value="round" className="bg-card">
                    Round Neck
                  </option>
                  <option value="polo" className="bg-card">
                    Polo T-Shirts
                  </option>
                  <option value="oversized" className="bg-card">
                    Oversized
                  </option>
                  <option value="hoodie" className="bg-card">
                    Hoodies
                  </option>
                  <option value="sweatshirt" className="bg-card">
                    Sweatshirts
                  </option>
                  <option value="jersey" className="bg-card">
                    Sports Jerseys
                  </option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-border/80 rounded-2xl bg-card/60 backdrop-blur-md">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-secondary/70 border-b border-border font-display uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 font-bold">Image</th>
                    <th className="py-3 px-4 font-bold">Product Name</th>
                    <th className="py-3 px-4 font-bold">Category</th>
                    <th className="py-3 px-4 font-bold">GSM</th>
                    <th className="py-3 px-4 font-bold">Price (₹)</th>
                    <th className="py-3 px-4 font-bold">Stock</th>
                    <th className="py-3 px-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProducts.map((p: any) => {
                    const inStock = p.in_stock !== false && !p.is_sold_out;
                    return (
                      <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-border"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to="/product/$slug"
                            params={{ slug: p.slug }}
                            className="font-display font-bold text-foreground hover:text-splash-pink transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            /{p.slug}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-display text-[11px] text-muted-foreground">
                          {p.category_label || p.categoryLabel || p.category}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-splash-orange">
                          {p.gsm ? `${p.gsm} GSM` : "—"}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-foreground">
                          <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => handleQuickPriceChange(p, Number(e.target.value))}
                            className="w-20 bg-secondary/70 border border-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-splash-pink"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleStock(p)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider font-bold transition-colors ${
                              inStock
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-destructive/15 text-destructive border border-destructive/30"
                            }`}
                          >
                            {inStock ? (
                              <>
                                <CheckCircle2 size={11} /> In Stock
                              </>
                            ) : (
                              <>
                                <XCircle size={11} /> Sold Out
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to="/product/$slug"
                              params={{ slug: p.slug }}
                              className="p-1.5 rounded-lg bg-secondary border border-border hover:border-splash-pink text-foreground hover:text-splash-pink transition-colors"
                              title="View Product"
                            >
                              <Eye size={13} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg bg-secondary border border-border hover:border-splash-pink text-foreground hover:text-splash-pink transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 rounded-lg bg-secondary border border-border hover:border-destructive text-foreground hover:text-destructive transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: Customization & Quotation Requests */}
        {activeTab === "customizations" && (
          <section className="space-y-4 relative z-10">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-4">
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                Custom Printing &amp; Bulk Quotations
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Review submitted requests for DTF, Sublimation, Vinyl, and Embroidery.
              </p>

              {customizations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No quotation requests submitted yet. Customers can request quotes directly from the product pages.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {customizations.map((q: any) => (
                    <div key={q.id} className="py-3 flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <span className="font-display font-bold text-sm text-foreground block">
                          {q.customer_name || q.customerName || "Customer Inquiry"}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {q.customer_email || q.customerEmail} • {q.customer_phone || q.customerPhone || "No Phone"}
                        </span>
                        <p className="text-xs text-foreground mt-1">
                          <strong>Method:</strong> {q.print_method || "DTF"} • <strong>Placements:</strong>{" "}
                          {Array.isArray(q.print_positions) ? q.print_positions.join(", ") : "Front"} •{" "}
                          <strong>Qty:</strong> {q.quantity || 1} pcs
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider font-bold bg-splash-teal/20 text-splash-teal border border-splash-teal/40">
                          {q.status || "Pending Review"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-1 font-mono">
                          {q.created_at ? new Date(q.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 3: Data Synchronization */}
        {activeTab === "sync" && (
          <section className="space-y-6 relative z-10">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-6 sm:p-8 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-splash-teal" />
                <h3 className="font-display font-bold text-lg text-foreground">
                  Supabase Database Synchronization
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Import and refresh 36+ realistic apparel items across 6 categories: Round Neck, Polo, Oversized, Hoodies, Sweatshirts, and Sports Jerseys with all GSM weights, fabric specifications, color-specific images, and variants.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={syncMutation.isPending ? "animate-spin" : ""}
                  />
                  <span>{syncMutation.isPending ? "Synchronizing Data..." : "Run Online Apparel Sync"}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Modal: Add/Edit Product */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display font-extrabold text-lg text-foreground">
                  {editingProduct ? "Edit Product" : "Add New Apparel Product"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="E.g. Heavyweight 240 GSM Oversized Tee"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. heavyweight-240-gsm-oversized-tee"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Category
                    </label>
                    <select
                      value={formCategoryLabel}
                      onChange={(e) => setFormCategoryLabel(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    >
                      <option value="Round Neck T-Shirts">Round Neck T-Shirts</option>
                      <option value="Polo T-Shirts">Polo T-Shirts</option>
                      <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sweatshirts">Sweatshirts</option>
                      <option value="Sports Jerseys">Sports Jerseys</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Original / MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      GSM Weight
                    </label>
                    <input
                      type="number"
                      value={formGsm}
                      onChange={(e) => setFormGsm(Number(e.target.value))}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Badge
                    </label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    >
                      <option value="Best Seller">Best Seller</option>
                      <option value="New">New</option>
                      <option value="48h Rush">48h Rush</option>
                      <option value="Hot Deal">Hot Deal</option>
                      <option value="Made to order">Made to order</option>
                      <option value="Bulk Fav">Bulk Fav</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Stock Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormInStock(!formInStock)}
                      className={`w-full py-2 rounded-xl font-display uppercase tracking-wider font-bold border transition-colors ${
                        formInStock
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                          : "bg-destructive/15 text-destructive border-destructive/40"
                      }`}
                    >
                      {formInStock ? "In Stock & Ready" : "Sold Out"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-display font-bold text-foreground block mb-1">
                    Image URL &amp; File Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                    <label className="px-4 py-2 rounded-xl bg-secondary border border-border hover:border-splash-pink cursor-pointer flex items-center gap-1.5 font-display text-xs">
                      <Upload size={14} className="text-splash-pink" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Material / Fabric
                    </label>
                    <input
                      type="text"
                      value={formMaterial}
                      onChange={(e) => setFormMaterial(e.target.value)}
                      placeholder="e.g. 100% Super-Combed French Terry Cotton"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>

                  <div>
                    <label className="font-display font-bold text-foreground block mb-1">
                      Garment Fit
                    </label>
                    <input
                      type="text"
                      value={formFit}
                      onChange={(e) => setFormFit(e.target.value)}
                      placeholder="e.g. Boxy Dropped Shoulder Fit"
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-splash-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-display font-bold text-foreground block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-splash-pink resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground hover:border-splash-pink font-display uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="px-6 py-2.5 rounded-full bg-brand-gradient text-primary-foreground font-display font-bold uppercase tracking-wider shadow-md hover:opacity-95"
                  >
                    {saveMutation.isPending ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
                <Trash2 size={22} />
              </div>
              <h4 className="font-display font-bold text-base text-foreground">
                Delete this apparel product?
              </h4>
              <p className="text-xs text-muted-foreground">
                This will delete the product and its associated variants from Supabase.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="py-2.5 rounded-full bg-secondary border border-border text-foreground font-display text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="py-2.5 rounded-full bg-destructive text-destructive-foreground font-display font-bold text-xs uppercase"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
