const Joi = require("joi");
const { password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
const register = {
  body: Joi.object().keys({
    username: Joi.string().trim().optional(),
    email: Joi.string().trim().email({ tlds: { allow: false } }).optional(),
    password: Joi.string().custom(password).required(),
    name: Joi.string().trim().allow('', null).optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().trim().optional(),
    email: Joi.string().trim().email({ tlds: { allow: false } }).optional(),
    password: Joi.string().custom(password).required(),
  }),
};

module.exports = {
  register,
  login,
};
