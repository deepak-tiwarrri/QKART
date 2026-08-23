/**
 * Form utility helpers shared across auth forms (Login, Register, etc.)
 */

/**
 * Creates a generic change handler for controlled form state.
 *
 * Usage:
 *   const handleInput = createInputHandler(setFormData);
 *   <input name="email" onChange={handleInput} />
 *
 * @param {Function} setFormData - React setState setter for the form object
 * @returns {Function} onChange handler
 */
export const createInputHandler = (setFormData) => (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
