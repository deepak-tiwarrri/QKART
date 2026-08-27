import { Button } from "@mui/material";
import { Textarea, Stack } from "@mantine/core";
import { motion } from "framer-motion";

/**
 * Form for adding a new delivery address.
 * Animates in when the user clicks "Add new address".
 *
 * @param {Object} newAddress - Current state: { isAddingNewAddress, value }
 * @param {Function} handleNewAddress - Setter for the newAddress state
 * @param {Function} onAdd - Called when "Add Address" is confirmed
 */
const AddNewAddressView = ({ newAddress, handleNewAddress, onAdd }) => {
  const handleChange = (e) => {
    handleNewAddress({ ...newAddress, isAddingNewAddress: true, value: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="new-address-form">
        <textarea
          rows={3}
          placeholder="Enter your complete address"
          value={newAddress.value || ""}
          onChange={handleChange}
          className="checkout-input"
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }}
        />
        <Stack direction="row" gap="sm" mt="sm" style={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            className="add-address-btn"
            onClick={onAdd}
          >
            Add
          </Button>
          <Button
            variant="text"
            onClick={() => handleNewAddress({ ...newAddress, isAddingNewAddress: false })}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </Stack>
      </div>
    </motion.div>
  );
};

export default AddNewAddressView;
