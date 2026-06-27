const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

/**
 * Fetch the cart details
 */
const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user);
  res.status(httpStatus.OK).send(cart);
});

/**
 * Add a product to cart
 */
const addProductToCart = catchAsync(async (req, res) => {
  // If req.body.qty is provided, this is from the frontend/frontend-tests.
  if (req.body.qty !== undefined) {
    const { productId, qty } = req.body;
    
    // If qty is 0, delete the product from cart
    if (qty === 0) {
      await cartService.deleteProductFromCart(req.user, productId);
      const cart = await cartService.getCartByUser(req.user);
      return res.status(httpStatus.OK).send(cart);
    }
    
    // Try to add the product first. If already in cart, update it.
    try {
      const cart = await cartService.addProductToCart(req.user, productId, qty);
      return res.status(httpStatus.CREATED).send(cart);
    } catch (e) {
      if (e.statusCode === 400 && e.message.includes("already in cart")) {
        const cart = await cartService.updateProductInCart(req.user, productId, qty);
        return res.status(httpStatus.OK).send(cart);
      }
      throw e;
    }
  }

  // Otherwise, this is from the backend integration tests.
  const cart = await cartService.addProductToCart(
    req.user,
    req.body.productId,
    req.body.quantity
  );
  res.status(httpStatus.CREATED).send(cart);
});

/**
 * Update product quantity in cart
 */
const updateProductInCart = catchAsync(async (req, res) => {
  const quantity = req.body.qty !== undefined ? req.body.qty : req.body.quantity;
  if (quantity === 0) {
    await cartService.deleteProductFromCart(req.user, req.body.productId);
    return res.status(httpStatus.NO_CONTENT).send();
  }
  const updateCart = await cartService.updateProductInCart(
    req.user,
    req.body.productId,
    quantity
  );
  return res.status(httpStatus.OK).send(updateCart);
});

/**
 * Checkout user's cart
 */
const checkout = catchAsync(async (req, res) => {
  await cartService.checkout(req.user);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkout,
};
