import apiClient from "../lib/apiClient";

/**
 * Auth service — all authentication API calls.
 * Uses the centralized apiClient (auto Bearer token + envelope unwrapping).
 */

/**
 * Login with email and password
 * @param {{ email: string, password: string }} formData
 * @returns {Promise<{ user: { email, walletMoney }, tokens: { access: { token } } }>}
 */
export const loginUser = async (formData) => {
  const result = await apiClient.post("/auth/login", formData);
  return result;
};

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} formData
 * @returns {Promise<null>}
 */
export const registerUser = async (formData) => {
  const result = await apiClient.post("/auth/register", formData);
  return result;
};
