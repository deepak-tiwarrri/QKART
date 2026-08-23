var express = require("express");
var router = express.Router();
const { handleError, getProduct, sendResponse } = require("../utils");
var { products } = require("../db");

router.get("/", (req, res) => {
  console.log("Request received for retrieving products list");

  products.find({}, (err, docs) => {
    if (err) {
      return handleError(res, err);
    }
    return sendResponse(res, 200, true, "Products fetched successfully", docs);
  });
});

// /search?value=
router.get("/search", (req, res) => {
  console.log("Request received for searching ", req.query.value);

  //Creating a RegEx to search
  const searchRegex = new RegExp(req.query.value.replace(/['"]+/g, ""), "i");

  products.find(
    { $or: [{ name: searchRegex }, { category: searchRegex }] },
    (err, docs) => {
      if (err) {
        return handleError(res, err);
      }

      if (docs.length) {
        return sendResponse(res, 200, true, "Search results", docs);
      } else {
        return sendResponse(res, 404, false, "No products found", []);
      }
    }
  );
});

router.get("/:id", async (req, res) => {
  console.log(
    `Request received for retrieving product with id: ${req.params.id}`
  );
  try {
    const product = await getProduct(req.params.id);
    if (product) {
      return sendResponse(res, 200, true, "Product fetched successfully", product);
    } else {
      return sendResponse(res, 404, false, "Product not found", null);
    }
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
