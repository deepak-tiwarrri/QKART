import {
  ShoppingCartOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import ItemQuantity from "./ItemQuantity";
import { generateCartItemsFrom, getTotalCartValue, getTotalItems } from "../utils/cartUtils";
import { cartItemVariants } from "../utils/animationVariants";
import "./Cart.css";

// Re-export cartUtils from here for backward compatibility with any existing imports
export { generateCartItemsFrom, getTotalCartValue, getTotalItems };

// ─── Cart component ───────────────────────────────────────────────────────
const Cart = ({ products, items, handleQuantity, isReadOnly = false }) => {
  const history = useHistory();
  const { token } = useAuthStore();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          <ShoppingCartOutlined className="empty-cart-icon" />
        </motion.div>
        <Text size="sm" ta="center" className="empty-cart-text">
          Cart is empty. Add items to start shopping.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* Cart header */}
        <Box className="cart-header">
          <ShoppingCart style={{ fontSize: 18, color: "#00a278" }} />
          <Text fw={700} size="sm" className="cart-header-text">
            My Cart ({getTotalItems(items)} items)
          </Text>
        </Box>

        {/* Cart items list with AnimatePresence for enter/exit */}
        <AnimatePresence mode="popLayout">
          {items.map((ele) => (
            <motion.div
              key={ele.productId}
              variants={cartItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Box display="flex" alignItems="flex-start" className="cart-item">
                <Box className="image-container">
                  <img src={ele.image} alt={ele.name} width="100%" height="100%" />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                  flex={1}
                >
                  <Text size="sm" fw={500} lineClamp={2} className="cart-item-name">
                    {ele.name}
                  </Text>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {!isReadOnly ? (
                      <ItemQuantity
                        value={ele.qty}
                        handleAdd={() =>
                          handleQuantity(
                            token,
                            items, products, ele.productId, ele.qty + 1,
                            { preventDuplicate: false }
                          )
                        }
                        handleDelete={() =>
                          handleQuantity(
                            token,
                            items, products, ele.productId, ele.qty - 1,
                            { preventDuplicate: false }
                          )
                        }
                      />
                    ) : (
                      <Box className="qty-readonly" data-testid="item-qty">
                        Qty: {ele.qty}
                      </Box>
                    )}
                    <Text fw={700} className="cart-item-cost">
                      ${ele.cost}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Order total */}
        <Box className="cart-total-row">
          <Text size="sm" className="cart-total-label">Order total</Text>
          <Text fw={700} size="lg" className="cart-total-value" data-testid="cart-total">
            ${getTotalCartValue(items)}
          </Text>
        </Box>

        {/* Checkout button */}
        {!isReadOnly && (
          <Box className="cart-footer">
            <Button
              onClick={() => history.push("/checkout")}
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              fullWidth
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>

      {/* Order details (readonly view on checkout page) */}
      {isReadOnly && (
        <Box className="cart order-details">
          <Text fw={700} size="md" className="order-details-title">Order Details</Text>

          <Box className="order-details-row">
            <Text size="sm">Products</Text>
            <Text size="sm" fw={500}>{getTotalItems(items)}</Text>
          </Box>
          <Box className="order-details-row">
            <Text size="sm">Subtotal</Text>
            <Text size="sm" fw={500}>${getTotalCartValue(items)}</Text>
          </Box>
          <Box className="order-details-row">
            <Text size="sm">Shipping Charges</Text>
            <Text size="sm" fw={500} className="order-details-free">FREE</Text>
          </Box>
          <Box className="order-details-row order-details-total">
            <Text fw={700}>Total</Text>
            <Text fw={700} className="order-details-total-value">
              ${getTotalCartValue(items)}
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;