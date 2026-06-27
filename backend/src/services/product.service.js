const { Product } = require("../models");

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Fetch all products
 * @returns {Promise<List<Products>>}
 */
const getProducts = async () => {
  return Product.find({});
};

/**
 * Search products by name or category
 * @param {string} value - search query
 * @returns {Promise<List<Products>>}
 */
const searchProducts = async (value) => {
  return Product.find({
    $or: [
      { name: { $regex: value, $options: "i" } },
      { category: { $regex: value, $options: "i" } },
    ],
  });
};

module.exports = {
  getProductById,
  getProducts,
  searchProducts,
};
