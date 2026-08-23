import apiClient from "../lib/apiClient";

/**
 * User service — all user-related API calls (addresses, profile, etc.)
 * Token is auto-attached by the apiClient request interceptor.
 */

/**
 * Fetch all saved addresses for the logged-in user
 * @returns {Promise<Array<{ _id: string, address: string }>>}
 */
export const getAddresses = async () => {
  const result = await apiClient.get("/user/addresses");
  return result ?? [];
};

/**
 * Add a new shipping address
 * @param {string} address - Full address string (20-128 chars)
 * @returns {Promise<Array<{ _id: string, address: string }>>}
 */
export const addAddress = async (address) => {
  const result = await apiClient.post("/user/addresses", { address });
  return result ?? [];
};

/**
 * Delete a shipping address by ID
 * @param {string} addressId - The _id of the address to delete
 * @returns {Promise<Array<{ _id: string, address: string }>>}
 */
export const deleteAddress = async (addressId) => {
  const result = await apiClient.delete(`/user/addresses/${addressId}`);
  return result ?? [];
};
