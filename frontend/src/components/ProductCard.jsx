import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  CardActions
} from "@mui/material";
import { Card, Image, Text, Group, Button, Rating } from '@mantine/core';
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card shadow="md" padding={"lg"} withBorder className="card" radius={"md"}>
      <Card.Section>
        <Image alt={product.name} src={product.image} h={200} fit="cover" />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs" h={48} align="flex-start" style={{ flexWrap: 'nowrap' }}>
        <Text fw={500} lineClamp={2} style={{ flexGrow: 1 }}>{product.name}</Text>
        <Text fw={700} c="dimmed" style={{ flexShrink: 0 }}>${product.cost}</Text>
      </Group>
      <Rating fractions={2} value={product.rating} readOnly mb="md" />
      <CardActions className="card-actions">
        <Button className="card-button" fullWidth leftSection={<AddShoppingCartOutlined />} onClick={handleAddToCart}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
