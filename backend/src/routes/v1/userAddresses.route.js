const express = require("express");
const auth = require("../../middlewares/auth");
const { userService } = require("../../services");
const config = require("../../config/config");
const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

/**
 * GET /v1/user/addresses
 * Returns the user's addresses as an array.
 * The backend stores a single address string per user, so we wrap it in an array format
 * that the frontend expects: [{ _id: "...", address: "..." }]
 */
router.get(
  "/addresses",
  auth,
  catchAsync(async (req, res) => {
    const user = req.user;
    if (!user.address || user.address === config.default_address) {
      return res.status(httpStatus.OK).send([]);
    }
    return res.status(httpStatus.OK).send([
      {
        _id: user._id.toString() + "_addr",
        address: user.address,
      },
    ]);
  })
);

/**
 * POST /v1/user/addresses
 * Add a new address. Since backend only supports one address, we overwrite it.
 * Returns the updated list of addresses.
 */
router.post(
  "/addresses",
  auth,
  catchAsync(async (req, res) => {
    const { address } = req.body;
    if (!address || address.length < 20) {
      return res.status(httpStatus.BAD_REQUEST).send({
        code: httpStatus.BAD_REQUEST,
        message: "Address must be at least 20 characters",
      });
    }
    const user = req.user;
    await userService.setAddress(user, address);
    return res.status(httpStatus.OK).send([
      {
        _id: user._id.toString() + "_addr",
        address: address,
      },
    ]);
  })
);

/**
 * DELETE /v1/user/addresses/:addressId
 * Delete an address by resetting it to the default.
 * Returns the updated (empty) list of addresses.
 */
router.delete(
  "/addresses/:addressId",
  auth,
  catchAsync(async (req, res) => {
    const user = req.user;
    await userService.setAddress(user, config.default_address);
    return res.status(httpStatus.OK).send([]);
  })
);

module.exports = router;
