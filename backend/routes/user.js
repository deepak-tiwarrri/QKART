var express = require("express");
var router = express.Router();
const { nanoid } = require("nanoid");
const { handleError, verifyAuth, sendResponse } = require("../utils");
var { users } = require("../db");

// GET /user/addresses — fetch all addresses for the logged-in user
router.get("/addresses", verifyAuth, (req, res) => {
  console.log(`GET request received to "/user/addresses"`);
  return sendResponse(res, 200, true, "Addresses fetched successfully", req.user.addresses);
});

// POST /user/addresses — add a new address
router.post("/addresses", verifyAuth, (req, res) => {
  console.log(`POST request received to "/user/addresses"`);

  if (req.body.address.length < 20) {
    return sendResponse(res, 400, false, "Address should be greater than 20 characters", null);
  }
  if (req.body.address.length > 128) {
    return sendResponse(res, 400, false, "Address should be less than 128 characters", null);
  }

  req.user.addresses.push({
    _id: nanoid(),
    address: req.body.address,
  });

  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        return handleError(res, err);
      }
      console.log(
        `Address "${req.body.address}" added to user ${req.user.username}'s address list`
      );
      return sendResponse(res, 200, true, "Address added successfully", req.user.addresses);
    }
  );
});

// DELETE /user/addresses/:id — delete an address by id
router.delete("/addresses/:id", verifyAuth, async (req, res) => {
  console.log(`DELETE request received to "/user/addresses/:id"`);

  const index = await req.user.addresses.findIndex(
    (element) => element._id === req.params.id
  );

  if (index === -1) {
    return sendResponse(res, 404, false, "Address to delete was not found", null);
  }

  req.user.addresses.splice(index, 1);

  users.update(
    { _id: req.user._id },
    { $set: { addresses: req.user.addresses } },
    {},
    (err) => {
      if (err) {
        return handleError(res, err);
      }
      console.log(
        `Address with id ${req.params.id} deleted from user ${req.user.username}'s address list`
      );
      return sendResponse(res, 200, true, "Address deleted successfully", req.user.addresses);
    }
  );
});

module.exports = router;
