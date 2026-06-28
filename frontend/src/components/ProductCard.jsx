import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Card, Image, Text, Group, Button, Rating } from '@mantine/core';
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card shadow="md" padding={"lg"} withBorder className="card" radius={"md"}>
      <Card.Section>
        <Image alt={product.name} src={product.image} fit="cover" />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{product.name}</Text>
        <Text fw={700} color="dimmed">${product.cost}</Text>
      </Group>
      <Rating fractions={2} value={product.rating} readOnly mb="md" />
      <CardActions className="card-actions">
        <Button className="card-button" fullWidth variant="filled" leftSection={<AddShoppingCartOutlined />} onClick={handleAddToCart}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
