import {
  Grid,
  SimpleGrid,
  Box,
  TextInput,
  Loader,
  Text,
  Stack,
  Center,
  Container,
} from "@mantine/core";
import Search from "@mui/icons-material/Search";
import SentimentVeryDissatisfied from "@mui/icons-material/SentimentVeryDissatisfied";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import useAuthStore from "../stores/authStore";
import useCartStore from "../stores/cartStore";
import { fetchCart } from "../services/cartService";
import { generateCartItemsFrom } from "../utils/cartUtils";
import { gridVariants, cardVariants } from "../utils/animationVariants";
import { createDebounce } from "../utils/constant";
import apiClient from "../lib/apiClient";
import useCart from "../hooks/useCart";

// ─── Products component ───────────────────────────────────────────────────
const Products = () => {
  const { email } = useAuthStore();
  const token = useAuthStore((s) => s.token);
  const { items, setItems } = useCartStore();
  const { addToCart } = useCart();

  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products + cart on load
  const performAPICall = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/products");
      const products = res.data ?? res;
      setProductData(products);

      if (token) {
        try {
          const cartData = await fetchCart();
          const cartItems = generateCartItemsFrom(cartData, products);
          setItems(cartItems);
        } catch (error) {
          // Cart fetch failure is non-critical — don't block product display
          console.log("Cart fetch error:", error);
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Check the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search — searches by name/category via API
  const performSearch = async (text) => {
    try {
      const res = await apiClient.get(`/products/search?value=${text}`);
      setProductData(res.data ?? res);
    } catch {
      setProductData([]);
    }
  };

  /**
   * createDebounce returns a stable debounced function.
   * useMemo ensures it's only created once (not recreated on every render).
   */
  const debouncedSearch = useMemo(() => createDebounce(performSearch, 500), []);

  useEffect(() => {
    performAPICall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = !!email;

  return (
    <Box bg="var(--color-bg)" style={{ minHeight: "100vh" }}>
      {/* Header with integrated desktop search */}
      <Header hasHiddenAuthButtons={false}>
        <div className="search-desktop">
          <TextInput
            placeholder="Search for items/categories"
            size="md"
            radius="xl"
            leftSection={<Search size={18} />}
            onChange={(e) => debouncedSearch(e.target.value)}
            w={{ base: "100%", sm: 350, md: 450 }}
            classNames={{ input: "search-input" }}
          />
        </div>
      </Header>

      {/* Mobile search bar */}
      <Container size="xl" className="search-mobile" mt="md">
        <TextInput
          placeholder="Search for items/categories"
          size="md"
          radius="xl"
          leftSection={<Search size={18} />}
          onChange={(e) => debouncedSearch(e.target.value)}
          classNames={{ input: "search-input" }}
        />
      </Container>

      {/* Main layout */}
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Left: Hero + Product grid */}
          <Grid.Col span={{ base: 12, md: isLoggedIn ? 8 : 12 }}>
            <Stack gap="xl">
              {/* Hero banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  className="hero"
                  p="xl"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <Text className="hero-heading" size="xl" fw={700}>
                    India's{" "}
                    <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </Text>
                </Box>
              </motion.div>

              {/* Product grid */}
              {isLoading ? (
                <Center style={{ minHeight: "50vh" }}>
                  <Stack align="center" gap="sm">
                    <Loader size="xl" type="dots" color="teal" />
                    <Text c="dimmed" fw={500}>Loading Products...</Text>
                  </Stack>
                </Center>
              ) : productData.length > 0 ? (
                <motion.div variants={gridVariants} initial="hidden" animate="visible">
                  <SimpleGrid
                    cols={{ base: 2, sm: 3, md: isLoggedIn ? 3 : 4 }}
                    spacing="lg"
                    verticalSpacing="lg"
                  >
                    {productData.map((item) => (
                      <motion.div key={item._id} variants={cardVariants} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <ProductCard
                          product={item}
                          handleAddToCart={() =>
                            addToCart(items, productData, item._id, 1, {
                              preventDuplicate: true,
                            })
                          }
                        />
                      </motion.div>
                    ))}
                  </SimpleGrid>
                </motion.div>
              ) : (
                <Center style={{ minHeight: "50vh" }}>
                  <Stack align="center" gap="xs">
                    <SentimentVeryDissatisfied
                      style={{ fontSize: 48, color: "var(--color-text-muted)" }}
                    />
                    <Text size="lg" fw={600} c="dimmed">No products found</Text>
                    <Text size="sm" c="dimmed">Try adjusting your search</Text>
                  </Stack>
                </Center>
              )}
            </Stack>
          </Grid.Col>

          {/* Right: Sticky cart sidebar (auth only) */}
          {isLoggedIn && (
            <Grid.Col span={{ base: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.2 }}
                style={{ position: "sticky", top: "90px" }}
              >
                <Cart
                  products={productData}
                  items={items}
                  handleQuantity={(token, items, products, productId, qty, opts) =>
                    addToCart(items, products, productId, qty, opts)
                  }
                />
              </motion.div>
            </Grid.Col>
          )}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Products;