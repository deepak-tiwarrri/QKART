import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";

/**
 * Quantity control for a single cart item.
 * Renders a decrement button, the current quantity, and an increment button.
 *
 * @param {number} value - Current quantity
 * @param {Function} handleAdd - Called when the + button is clicked
 * @param {Function} handleDelete - Called when the - button is clicked
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => (
  <Stack direction="row" alignItems="center" className="item-qty-control">
    <IconButton size="small" color="primary" onClick={handleDelete} className="qty-btn">
      <RemoveOutlined />
    </IconButton>
    <Box className="qty-value" data-testid="item-qty">
      {value}
    </Box>
    <IconButton size="small" color="primary" onClick={handleAdd} className="qty-btn">
      <AddOutlined />
    </IconButton>
  </Stack>
);

export default ItemQuantity;
