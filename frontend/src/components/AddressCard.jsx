import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Text, Badge } from "@mantine/core";
import { motion } from "framer-motion";

/**
 * Displays a single saved address as a selectable, deletable card.
 *
 * @param {{ address: string, _id: string }} data - The address object
 * @param {boolean} isSelected - Whether this address is currently chosen
 * @param {Function} onSelect - Called when the card is clicked
 * @param {Function} onDelete - Called when the delete button is clicked
 */
const AddressCard = ({ data, isSelected, onSelect, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 28 }}
    className={`address-card ${isSelected ? "address-card--selected" : ""}`}
    onClick={onSelect}
    role="button"
    tabIndex={0}
  >
    {isSelected && (
      <Badge color="teal" variant="filled" className="address-selected-badge" size="sm">
        Selected
      </Badge>
    )}
    <Text size="sm" className="address-text">{data.address}</Text>
    <Button
      variant="text"
      size="small"
      startIcon={<Delete />}
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      className="address-delete-btn"
    >
      Delete
    </Button>
  </motion.div>
);

export default AddressCard;
