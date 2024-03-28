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
  console.log("controller");
  const { name, email, password } = req.body;
  if (!email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ code: httpStatus.BAD_REQUEST, message: "Email is missing" });
  }

  // Check if name and password fields are present in req.body
  if (!name || !password) {
    // If either name or password is missing, send a 400 status response
    res
      .status(httpStatus.BAD_REQUEST)
      .json({
        code: httpStatus.BAD_REQUEST,
        message: "Name or password is missing",
      });
  } else {
    // If both name and password are present, proceed with user registration
    try {
      const existingUser = await userService.getUserByEmail(email);
      console.log(existingUser);
      if (existingUser) {
        // If email is already used, return a 409 status response (Conflict)
        return res
          .status(httpStatus.OK)
          .json({ code: httpStatus.OK, message: "Email is already in use" });
      }
      const user = await userService.createUser(req.body);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(httpStatus.CREATED).json({ user, tokens });
    } catch (error) {
      // Handle registration errors here (e.g., duplicate email)
      console.log(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Internal Server Error",
        });
    }
  }
});

/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
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
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // try {
  // Attempt to log in the user with the provided credentials
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  // If login is successful, generate authentication tokens
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).send({ user, tokens });
});

module.exports = {
  register,
  login,
};
