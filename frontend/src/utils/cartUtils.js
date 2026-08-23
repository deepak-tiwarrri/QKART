/**
 * Cart utility functions.
 *
 * Extracted from Cart.jsx so they can be shared by:
 * - Cart.jsx (display)
 * - Products.jsx (after add-to-cart API response)
 * - Checkout.jsx (summary and validation)
 */

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} category
 * @property {number} cost
 * @property {number} rating
 * @property {string} image
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {number} qty
 * @property {string} name
 * @property {string} category
 * @property {number} cost
 * @property {number} rating
 * @property {string} image
 */

/**
 * Merges raw cart data from the API with full product details.
 *
 * Handles two cart shapes:
 *   1. Simple array: [{ productId, qty }]
 *   2. Populated object: { cartItems: [{ product: {...}, quantity }] }
 *
 * @param {Array | Object} cartData - Raw cart response from API
 * @param {Array<Product>} productsData - All available products
 * @returns {Array<CartItem>}
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return [];

  let items = [];
  if (Array.isArray(cartData)) {
    items = cartData;
  } else if (cartData.cartItems && Array.isArray(cartData.cartItems)) {
    items = cartData.cartItems.map((item) => ({
      productId: item.product._id,
      qty: item.quantity,
    }));
  } else {
    return [];
  }

  return items.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
};

/**
 * Returns the total monetary value of all cart items.
 * @param {Array<CartItem>} items
 * @returns {number}
 */
export const getTotalCartValue = (items = []) =>
  items.reduce((prev, curr) => prev + curr.qty * curr.cost, 0);

/**
 * Returns the total number of individual items (sum of all qtys) in the cart.
 * @param {Array<CartItem>} items
 * @returns {number}
 */
export const getTotalItems = (items = []) =>
  items.reduce((sum, ele) => sum + ele.qty, 0);

/**
 * Checks if a product is already present in the cart.
 * @param {Array<CartItem>} items
 * @param {string} productId
 * @returns {Array<CartItem>} - Array of matching items (empty if not in cart)
 */
export const getCartItemsForProduct = (items, productId) =>
  items.filter((ele) => ele.productId === productId);
