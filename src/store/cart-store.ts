import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "@/types/menu";
import { CartItem, Order } from "@/types/order";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";

interface CartStoreState {
  items: CartItem[];
  taxPercent: number;
  lastOrder: Order | null;
  orderHistory: Order[];

  addItem: (item: MenuItem, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setLastOrder: (order: Order) => void;
  setTaxPercent: (tax: number) => void;

  // Computed helper values
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (itemId: string) => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      taxPercent: DEFAULT_CAFE_CONFIG.taxPercent,
      lastOrder: null,
      orderHistory: [],

      addItem: (item, notes) => {
        const items = get().items;
        const existingIndex = items.findIndex((i) => i.item.id === item.id);

        if (existingIndex > -1) {
          const updated = items.map((ci, idx) =>
            idx === existingIndex
              ? { ...ci, quantity: ci.quantity + 1, notes: notes || ci.notes }
              : ci
          );
          set({ items: updated });
        } else {
          set({ items: [...items, { item, quantity: 1, notes }] });
        }
      },

      removeItem: (itemId) => {
        const items = get().items.filter((i) => i.item.id !== itemId);
        set({ items });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const updated = get().items.map((i) =>
          i.item.id === itemId ? { ...i, quantity } : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      setLastOrder: (order) => {
        set((state) => ({
          lastOrder: order,
          orderHistory: [order, ...state.orderHistory.filter((o) => o.orderId !== order.orderId)],
        }));
      },

      setTaxPercent: (taxPercent) => set({ taxPercent }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
          0
        );
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const taxPercent = get().taxPercent;
        const rawTax = (subtotal * taxPercent) / 100;
        return Math.round(rawTax * 100) / 100;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxAmount();
        return Math.round((subtotal + tax) * 100) / 100;
      },

      getItemCount: () => {
        return get().items.reduce((count, cartItem) => count + cartItem.quantity, 0);
      },

      getItemQuantity: (itemId) => {
        const found = get().items.find((i) => i.item.id === itemId);
        return found ? found.quantity : 0;
      },
    }),
    {
      name: "cafe-cart-store",
    }
  )
);
