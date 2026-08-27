const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!name && !username) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Name is missing" });
  }

  const finalEmail = email || (username ? (username.includes("@") ? username : `${username}@gmail.com`) : null);
  const finalName = name || username;

  if (!finalEmail) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Email is missing" });
  }

  if (!password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Password is missing" });
  }

  try {
    const existingUser = await userService.getUserByEmail(finalEmail);
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ code: httpStatus.CONFLICT, message: "Email is already in use" });
    }
    const user = await userService.createUser({ name: finalName, email: finalEmail, password });
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json({ user, tokens });
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, username, password } = req.body;
  const userIdentifier = email || username;

  if (!userIdentifier) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Email is missing" });
  }

  if (!password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Password is missing" });
  }

  const user = await authService.loginUserWithEmailAndPassword(userIdentifier, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).send({
    user,
    tokens,
    token: tokens.access.token,
    username: user.name || user.email,
    balance: user.walletMoney,
  });
});

module.exports = {
  register,
  login,
};
