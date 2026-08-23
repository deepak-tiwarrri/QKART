import { toast } from "sonner";
import { updateCartItem } from "../services/cartService";
import { generateCartItemsFrom, getCartItemsForProduct } from "../utils/cartUtils";
import useCartStore from "../stores/cartStore";
import useAuthStore from "../stores/authStore";

/**
 * Custom hook encapsulating all cart mutation logic.
 *
 * Provides a single `addToCart` function used by both Products and Checkout pages.
 * Reads token from authStore (not directly from localStorage).
 *
 * @returns {{ addToCart: Function }}
 */
const useCart = () => {
  const { token } = useAuthStore();
  const { setItems } = useCartStore();

  /**
   * Add a new item or update the quantity of an existing cart item.
   *
   * @param {Array} items - Current cart items (from cartStore)
   * @param {Array} products - All available products (for generateCartItemsFrom)
   * @param {string} productId - The product to add/update
   * @param {number} qty - New quantity (0 removes the item)
   * @param {{ preventDuplicate?: boolean }} options
   */
  const addToCart = async (items, products, productId, qty, options = { preventDuplicate: false }) => {
    if (!token) {
      toast.error("Login to add items to your cart");
      return;
    }

    if (options.preventDuplicate && getCartItemsForProduct(items, productId).length > 0) {
      toast.warning("Item already in cart. Use the cart sidebar to update quantity.");
      return;
    }

    try {
      const cartData = await updateCartItem(productId, qty);
      console.log("card data: ", cartData);
      const cartItems = generateCartItemsFrom(cartData, products);
      setItems(cartItems);
      if (qty > 0) toast.success("Added to cart!");
    } catch (err) {
      toast.error(err?.message || "Failed to update cart");
    }
  };

  return { addToCart };
};

export default useCart;
