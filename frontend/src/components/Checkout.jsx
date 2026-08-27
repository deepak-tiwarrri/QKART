import { CreditCard, AddLocation } from "@mui/icons-material";
import { Button, Divider, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
import AddressCard from "./AddressCard";
import AddNewAddressView from "./AddNewAddressView";
import useAuthStore from "../stores/authStore";
import { fetchCart, checkoutCart } from "../services/cartService";
import { getAddresses, addAddress, deleteAddress } from "../services/userService";
import apiClient from "../lib/apiClient";

// ─── Checkout component ───────────────────────────────────────────────────
const Checkout = () => {
  const storeToken = useAuthStore((s) => s.token);
  const token = storeToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const { updateBalance } = useAuthStore();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  // Guard — redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.warning("You must be logged in to access checkout");
      history.push("/login");
    }
  }, [token, history]);

  // Fetch products
  const getProducts = async () => {
    try {
      const response = await apiClient.get("/products");
      console.log(`response from getProducts checkout: `, response);
      const data = response ?? [];
      setProducts(data);
      return data;
    } catch {
      toast.error("Could not fetch products. Check that the backend is running.");
      return null;
    }
  };

  // On mount — load products, cart, addresses
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      try {
        const cartData = await fetchCart();
        console.log("fetch cartData: ",cartData);
        if (productsData && cartData) {
          const cartDetails = generateCartItemsFrom(cartData, productsData);
          setItems(cartDetails);
        }
      } catch {
        toast.error("Could not fetch cart.");
      }

      try {
        const addressData = await getAddresses();
        setAddresses({ all: addressData, selected: addressData[0]?._id || "" });
      } catch {
        toast.error("Could not fetch addresses.");
      }
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAddress = async () => {
    try {
      const updatedAddresses = await addAddress(newAddress.value);
      setAddresses({ all: updatedAddresses, selected: updatedAddresses[0]?._id || "" });
      setNewAddress({ isAddingNewAddress: false, value: "" });
      toast.success("Address added successfully!");
    } catch (err) {
      toast.error(err.message || "Could not add address.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const updatedAddresses = await deleteAddress(addressId);
      setAddresses({ all: updatedAddresses, selected: "" });
      toast.success("Address deleted.");
    } catch (err) {
      toast.error(err.message || "Could not delete address.");
    }
  };

  const validateRequest = (items, addresses) => {
    if (localStorage.getItem("balance") < getTotalCartValue(items)) {
      toast.error("You do not have enough balance in your wallet for this purchase");
      return false;
    }
    if (addresses.all.length === 0) {
      toast.error("Please add a new address before proceeding.");
      return false;
    }
    if (addresses.selected === "") {
      toast.error("Please select one shipping address to proceed.");
      return false;
    }
    return true;
  };

  const performCheckout = async () => {
    if (!validateRequest(items, addresses)) return;
    try {
      await checkoutCart(addresses.selected);
      const newBal = Number(localStorage.getItem("balance")) - getTotalCartValue(items);
      updateBalance(newBal);
      toast.success("Order placed successfully! 🎉");
      history.push("/thanks");
    } catch (error) {
      toast.error(error.message || "Checkout failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Grid container>
        {/* Left: Shipping & Payment */}
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">

            {/* Shipping Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Text className="section-title">Shipping</Text>
              <Text className="section-subtitle">
                Manage all the shipping addresses you want. Select the address you want to get your order delivered.
              </Text>
              <Divider className="section-divider" />
            </motion.div>

            {/* Addresses */}
            <Box mt="1rem">
              {addresses.all.length === 0 ? (
                <Text className="no-address-text">
                  No addresses found for this account. Please add one to proceed.
                </Text>
              ) : (
                <AnimatePresence mode="popLayout">
                  {addresses.all.map((data) => (
                    <AddressCard
                      key={data._id}
                      data={data}
                      isSelected={addresses.selected === data._id}
                      onSelect={() => setAddresses((curr) => ({ ...curr, selected: data._id }))}
                      onDelete={() => handleDeleteAddress(data._id)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </Box>

            {/* Add new address toggle */}
            <AnimatePresence>
              {!newAddress.isAddingNewAddress ? (
                <motion.div
                  key="add-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    id="add-new-btn"
                    size="large"
                    startIcon={<AddLocation />}
                    className="add-address-btn"
                    onClick={() =>
                      setNewAddress((curr) => ({ ...curr, isAddingNewAddress: true }))
                    }
                  >
                    Add new address
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="add-form">
                  <AddNewAddressView
                    newAddress={newAddress}
                    handleNewAddress={setNewAddress}
                    onAdd={handleAddAddress}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Text className="section-title" mt="2rem">Payment</Text>
              <Text className="section-subtitle">Payment Method</Text>
              <Divider className="section-divider" />

              <Box className="wallet-section">
                <Box className="wallet-icon-wrap">💳</Box>
                <Box>
                  <Text fw={600} size="sm" className="wallet-label">Wallet Balance</Text>
                  <Text size="sm" className="wallet-amount">
                    Pay <strong>${getTotalCartValue(items)}</strong> from available{" "}
                    <strong className="wallet-balance">${localStorage.getItem("balance")}</strong>
                  </Text>
                </Box>
              </Box>

              <Button
                startIcon={<CreditCard />}
                variant="contained"
                color="primary"
                className="place-order-btn"
                onClick={performCheckout}
                size="large"
              >
                Place Order
              </Button>
            </motion.div>
          </Box>
        </Grid>

        {/* Right: Cart summary */}
        <Grid item xs={12} md={3} className="checkout-cart-col">
          <Cart isReadOnly={true} products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;