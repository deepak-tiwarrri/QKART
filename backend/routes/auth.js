var express = require("express");
var router = express.Router();
const { handleError, sendResponse, sha256 } = require("../utils");
var { users } = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

router.post("/register", (req, res) => {
  console.log(`POST request to "/auth/register" received`);

  users.findOne({ username: req.body.email }, (err, user) => {
    if (err) {
      return handleError(res, err);
    }
    if (user) {
      return sendResponse(res, 400, false, "Email already registered", null);
    }

    users.insert({
      username: req.body.email,
      name: req.body.name || req.body.email,
      password: sha256(req.body.password),
      balance: 5000,
      cart: [],
      addresses: [],
    });

    console.log(`Registered user: ${req.body.email}`);

    return sendResponse(res, 201, true, "Registration successful", null);
  });
});

router.post("/login", (req, res) => {
  console.log(`POST request to "/auth/login" received`);

  users.findOne({ username: req.body.email }, (err, user) => {
    if (err) {
      return handleError(res, err);
    }
    if (!user) {
      return sendResponse(res, 400, false, "Email does not exist", null);
    }
    if (user.password !== sha256(req.body.password)) {
      return sendResponse(res, 400, false, "Password is incorrect", null);
    }

    const token = jwt.sign({ username: user.username }, config.jwtSecret, {
      expiresIn: "6h",
    });

    console.log(`Logged in as user: ${user.username}`);

    return sendResponse(res, 200, true, "Login successful", {
      user: {
        email: user.username,
        walletMoney: user.balance,
        name: user.name || user.username,
      },
      tokens: {
        access: {
          token,
        },
      },
    });
  });
});

module.exports = router;
