const Joi = require("joi");
const { objectId } = require("./custom.validation");

const addProductToCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number(),
    qty: Joi.number(),
  }).or('quantity', 'qty'),
};

module.exports = {
  addProductToCart,
};
