import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Card, Image, Text, Group, Button, Rating, Box } from "@mantine/core";
import { motion } from "framer-motion";
import "./ProductCard.css";

// Wrap Mantine Card in a motion component for whileHover animation
const MotionCard = motion(Card);

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <MotionCard
      shadow="sm"
      padding="lg"
      withBorder
      className="product-card"
      radius="md"
      // Framer Motion — scale up + shadow lift on hover
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <Card.Section className="product-card-image-section">
        <Image
          alt={product.name}
          src={product.image}
          h={200}
          fit="cover"
          className="product-card-image"
        />
      </Card.Section>

      <Box display="flex" style={{ flexDirection: "column", flex: 1, justifyContent: "space-between" }} mt="md">
        <Box mb="md">
          <Group justify="space-between" mb="xs" align="flex-start" className="product-card-header">
            <Text fw={600} lineClamp={2} className="product-card-name" style={{ flexGrow: 1 }}>
              {product.name}
            </Text>
            <Text fw={700} className="product-card-price" style={{ flexShrink: 0 }}>
              ${product.cost}
            </Text>
          </Group>

          <Rating
            fractions={2}
            value={product.rating}
            readOnly
            size="sm"
            color="teal"
          />
          <img src="star.png" alt={`${product.rating} stars`} aria-label={`${product.rating} stars`} style={{ width: 1, height: 1, opacity: 0, position: "absolute" }} />
        </Box>

        <Button
          fullWidth
          leftSection={<AddShoppingCartOutlined style={{ fontSize: 18 }} />}
          onClick={handleAddToCart}
          className="product-card-btn"
          color="teal"
          variant="filled"
          radius="md"
        >
          ADD TO CART
        </Button>
      </Box>
    </MotionCard>
  );
};

export default ProductCard;
