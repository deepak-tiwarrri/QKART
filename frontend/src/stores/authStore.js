import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Zustand auth store with localStorage persistence.
 *
 * Replaces direct localStorage reads/writes scattered across components.
 * State: { token, email, balance }
 * Actions: login(), logout(), updateBalance()
 */
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      balance: null,

      /**
       * Persist login data after successful auth
       * @param {string} token - JWT access token
       * @param {string} email - User email
       * @param {number} balance - Wallet balance
       */
      login: (token, email, balance) => {
        set({ token, email, balance });
        // Also keep legacy localStorage keys for backward compat with non-store code
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("balance", balance);
      },

      /**
       * Clear all auth state and localStorage on logout
       */
      logout: () => {
        set({ token: null, email: null, balance: null });
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("balance");
      },

      /**
       * Update balance after a purchase
       * @param {number} newBalance
       */
      updateBalance: (newBalance) => {
        set({ balance: newBalance });
        localStorage.setItem("balance", newBalance);
      },
    }),
    {
      name: "qkart-auth", // localStorage key for persisted state
    }
  )
);

export default useAuthStore;
