import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Text } from "@mantine/core";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import useAuthStore from "../stores/authStore";
import "./Thanks.css";

const Thanks = () => {
  const history = useHistory();
  const { token, balance } = useAuthStore();

  useEffect(() => {
    if (!token) {
      history.push("/");
    }
  }, [token, history]);

  const routeToProducts = () => history.push("/");

  return (
    <>
      <Header />
      <Box className="greeting-container">
        <motion.div
          className="thanks-card"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <motion.div
            className="thanks-emoji"
            animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            🎉
          </motion.div>

          <Text size="xl" fw={800} className="thanks-title">Yay! It's ordered!</Text>
          <Text size="sm" className="thanks-subtitle">
            You will receive an invoice for your order shortly.
          </Text>
          <Text size="sm" className="thanks-subtitle">
            Your order will arrive in 7 business days.
          </Text>

          <Box className="wallet-info">
            <Text size="xs" fw={600} className="wallet-overline">Wallet Balance</Text>
            <Text fw={800} className="wallet-balance-value">${balance ?? localStorage.getItem("balance")} Available</Text>
          </Box>

          <Button
            variant="contained"
            size="large"
            id="continue-btn"
            onClick={routeToProducts}
            className="thanks-continue-btn"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;