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
  const {name,email,password} = req.body;
  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: "Email is missing" });
  }
  
  // Check if name and password fields are present in req.body
  if (!name || !password) {
    // If either name or password is missing, send a 400 status response
    res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: "Name or password is missing" });
  } else {
    // If both name and password are present, proceed with user registration
    try {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        // If email is already used, return a 409 status response (Conflict)
        return res.status(httpStatus.OK).json({ code: httpStatus.OK, message: "Email is already in use" });
      }
      const user = await userService.createUser(req.body);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(httpStatus.CREATED).json({ user, tokens });
    } catch (error) {
      // Handle registration errors here (e.g., duplicate email)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ code: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
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

  // Check if email and password are provided
  // if (!email || !password) {
  //   return res.status(httpStatus.BAD_REQUEST).json({ code: httpStatus.BAD_REQUEST, message: "Email or password is missing" });
  // }

  // try {
    // Attempt to log in the user with the provided credentials
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    // If login is successful, generate authentication tokens
    const tokens = await tokenService.generateAuthTokens(user);
    // if((email===user.email &&  password===user.password)){
    //   // res.status(httpStatus.OK).json({code:httpStatus.OK,message:"Incorrect email or password"});
    //   res.status(httpStatus.OK).json({user,tokens});
    // }

    // Return 200 status and user information along with tokens
    // res.status(httpStatus.OK).json({ user, tokens });
    res.status(httpStatus.OK).send({user,tokens});
  // } catch (error) {
  //   // If login fails (e.g., incorrect password), return 401 status
  //   res.status(httpStatus.UNAUTHORIZED).json({ code: httpStatus.UNAUTHORIZED, message: "Incorrect email or password v1" });
  // }
});

module.exports = {
  register,
  login,
};
