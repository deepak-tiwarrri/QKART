var express = require("express");
var router = express.Router();
const { handleError, verifyAuth, getProduct, sendResponse } = require("../utils");
var { users, products } = require("../db");

// GET /cart — returns user's cart items
router.get("/", verifyAuth, (req, res) => {
  console.log(`GET request to "/cart" received`);
  return sendResponse(res, 200, true, "Cart fetched successfully", req.user.cart);
});

// POST /cart — add or update item in cart
router.post("/", verifyAuth, async (req, res) => {
  console.log(`POST request to "/cart" received`);

  products.findOne({ _id: req.body.productId }, async (err, product) => {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return sendResponse(res, 404, false, "Product doesn't exist", null);
    }

    const index = await req.user.cart.findIndex(
      (element) => element.productId === req.body.productId
    );

    if (index === -1) {
      req.user.cart.push({
        productId: req.body.productId,
        qty: req.body.qty,
      });
    } else if (req.body.qty === 0) {
      // delete item
      req.user.cart.splice(index, 1);
    } else {
      // modify qty
      req.user.cart[index].qty = req.body.qty;
    }

    users.update(
      { _id: req.user._id },
      { $set: { cart: req.user.cart } },
      {},
      (err) => {
        if (err) {
          return handleError(res, err);
        }
        console.log(
          `User ${req.user.username}'s cart updated to`,
          req.user.cart
        );
        return sendResponse(res, 200, true, "Cart updated successfully", req.user.cart);
      }
    );
  });
});

// POST /cart/checkout — place order
router.post("/checkout", verifyAuth, async (req, res) => {
  console.log(
    `POST request received to "/cart/checkout": ${req.user.username}`
  );

  let total = 0;
  for (let element of req.user.cart) {
    try {
      const product = await getProduct(element.productId);
      if (product == null) {
        throw new Error("Invalid product in cart.");
      }
      total = total + element.qty * product.cost;
    } catch (error) {
      return handleError(res, error);
    }
  }

  if (total === 0) {
    return sendResponse(res, 400, false, "Cart is empty", null);
  }
  if (req.user.balance < total) {
    return sendResponse(res, 400, false, "Wallet balance not sufficient to place order", null);
  }
  if (!req.body.addressId) {
    return sendResponse(res, 400, false, "Address not set", null);
  }

  const addressIndex = await req.user.addresses.findIndex(
    (element) => element._id === req.body.addressId
  );
  if (addressIndex === -1) {
    return sendResponse(res, 404, false, "Bad address specified", null);
  }

  req.user.balance -= total;
  req.user.cart = [];

  users.update({ _id: req.user._id }, req.user, {}, (err) => {
    if (err) {
      return handleError(res, err);
    }
    console.log("Order placed successfully");
    return sendResponse(res, 200, true, "Order placed successfully", null);
  });
});

module.exports = router;
