import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  id: string; // unique item id (e.g. product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize?: string | undefined;
  selectedColor?: string | undefined;
  selectedPrintType?: string | undefined;
  customText?: string | undefined;
  notes?: string | undefined;
  artworkName?: string | undefined;
}

export const WHATSAPP_PHONE = "919150234277";
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 70;

const STORAGE_KEY = "aiel-studio-cart";

let cartListeners: Array<() => void> = [];
let cartState: { items: CartItem[]; isDrawerOpen: boolean } = {
  items: [],
  isDrawerOpen: false,
};

// Initialize from localStorage in browser
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      cartState.items = JSON.parse(saved);
    }
  } catch (_) {}
}

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState.items));
    } catch (_) {}
  }
  cartListeners.forEach((fn) => fn());
}

export const cart = {
  getItems: () => cartState.items,
  isOpen: () => cartState.isDrawerOpen,

  openDrawer: () => {
    cartState.isDrawerOpen = true;
    notify();
  },

  closeDrawer: () => {
    cartState.isDrawerOpen = false;
    notify();
  },

  toggleDrawer: () => {
    cartState.isDrawerOpen = !cartState.isDrawerOpen;
    notify();
  },

  addItem: (item: Omit<CartItem, "id">) => {
    const id = `${item.product.id}-${item.selectedSize || "default"}-${item.selectedColor || "default"}-${item.selectedPrintType || "default"}`;
    const existingIndex = cartState.items.findIndex((i) => i.id === id);

    if (existingIndex > -1) {
      const existing = cartState.items[existingIndex];
      if (existing) {
        existing.quantity += item.quantity;
        if (item.customText) existing.customText = item.customText;
        if (item.notes) existing.notes = item.notes;
      }
    } else {
      cartState.items.push({ ...item, id });
    }

    cartState.isDrawerOpen = true;
    notify();
  },

  removeItem: (id: string) => {
    cartState.items = cartState.items.filter((i) => i.id !== id);
    notify();
  },

  updateQuantity: (id: string, qty: number) => {
    if (qty <= 0) {
      cart.removeItem(id);
    } else {
      const item = cartState.items.find((i) => i.id === id);
      if (item) {
        item.quantity = qty;
        notify();
      }
    }
  },

  clearCart: () => {
    cartState.items = [];
    notify();
  },

  getTotalItems: () => cartState.items.reduce((acc, i) => acc + i.quantity, 0),

  getSubtotal: () => cartState.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

  getShippingFee: () => {
    const sub = cart.getSubtotal();
    if (sub === 0 || sub >= FREE_SHIPPING_THRESHOLD) return 0;
    return STANDARD_SHIPPING_FEE;
  },

  getGrandTotal: () => cart.getSubtotal() + cart.getShippingFee(),

  generateWhatsAppOrderUrl: (clientName?: string, clientCity?: string) => {
    const items = cartState.items;
    if (items.length === 0) return `https://wa.me/${WHATSAPP_PHONE}?text=Hi%20Aiel%20Studio%2C%20I%20have%20an%20inquiry%20about%20custom%20prints!`;

    const subtotal = cart.getSubtotal();
    const shipping = cart.getShippingFee();
    const total = cart.getGrandTotal();

    let text = `*NEW CUSTOM PRINT ORDER — AIEL STUDIO*\n`;
    text += `═══════════════════════════\n\n`;

    items.forEach((i, idx) => {
      text += `*${idx + 1}. ${i.product.name}*\n`;
      text += `   • Qty: ${i.quantity}\n`;
      if (i.selectedSize) text += `   • Size/Model: ${i.selectedSize}\n`;
      if (i.selectedColor) text += `   • Colour: ${i.selectedColor}\n`;
      if (i.selectedPrintType) text += `   • Print Style: ${i.selectedPrintType}\n`;
      if (i.customText) text += `   • Custom Text: "${i.customText}"\n`;
      if (i.notes) text += `   • Notes: ${i.notes}\n`;
      text += `   • Rate: ₹${i.product.price} × ${i.quantity} = ₹${i.product.price * i.quantity}\n\n`;
    });

    text += `═══════════════════════════\n`;
    text += `*Subtotal:* ₹${subtotal}\n`;
    text += `*Shipping:* ${shipping === 0 ? "FREE (Pan-India)" : `₹${shipping}`}\n`;
    text += `*Grand Total:* ₹${total}\n\n`;
    if (clientName) text += `*Name:* ${clientName}\n`;
    if (clientCity) text += `*Delivery City:* ${clientCity}\n`;
    text += `*Turnaround:* 48-Hour Rush Required?\n\n`;
    text += `I have attached my logo/artwork file here on WhatsApp. Please share pre-print digital mockups and payment link!`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  },
};

export function useCart() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    cartListeners.push(handleUpdate);
    return () => {
      cartListeners = cartListeners.filter((fn) => fn !== handleUpdate);
    };
  }, []);

  return {
    items: cartState.items,
    isOpen: cartState.isDrawerOpen,
    openDrawer: cart.openDrawer,
    closeDrawer: cart.closeDrawer,
    toggleDrawer: cart.toggleDrawer,
    addItem: cart.addItem,
    removeItem: cart.removeItem,
    updateQuantity: cart.updateQuantity,
    clearCart: cart.clearCart,
    totalItems: cart.getTotalItems(),
    subtotal: cart.getSubtotal(),
    shippingFee: cart.getShippingFee(),
    grandTotal: cart.getGrandTotal(),
    generateWhatsAppOrderUrl: cart.generateWhatsAppOrderUrl,
  };
}
