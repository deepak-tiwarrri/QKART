import { create } from "zustand";

/**
 * Zustand cart store.
 *
 * Manages cart items (full product data + qty) across the app.
 * Used by ProductCard, Cart, Products, and Checkout components.
 *
 * State: { items: CartItem[] }
 * Actions: setItems(), clearCart()
 */
const useCartStore = create((set) => ({
  /** @type {import('../components/Cart').CartItem[]} */
  items: [],

  /**
   * Replace cart items with a new list (called after every API response)
   * @param {Array} items - Full cart item array from generateCartItemsFrom()
   */
  setItems: (items) => set({ items }),

  /**
   * Clear all items from cart (called after checkout)
   */
  clearCart: () => set({ items: [] }),
}));

export default useCartStore;
