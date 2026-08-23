import apiClient from "../lib/apiClient";

/**
 * Cart service — all cart-related API calls.
 * Token is auto-attached by the apiClient request interceptor.
 */

/**
 * Fetch the current user's cart
 * @returns {Promise<Array<{ productId: string, qty: number }>>}
 */
export const fetchCart = async () => {
  const result = await apiClient.get("/cart");
  return result ?? [];
};

/**
 * Add or update a cart item
 * @param {string} productId
 * @param {number} qty - 0 to remove item
 * @returns {Promise<Array<{ productId: string, qty: number }>>}
 */
export const updateCartItem = async (productId, qty) => {
  const result = await apiClient.post("/cart", { productId, qty });
  return result || [];
};

/**
 * Place an order for the current cart
 * @param {string} addressId - Selected delivery address ID
 * @returns {Promise<null>}
 */
export const checkoutCart = async (addressId) => {
  const result = await apiClient.post("/cart/checkout", { addressId });
  console.log('result of checkoutcart service: ', result);
  return result;
};
