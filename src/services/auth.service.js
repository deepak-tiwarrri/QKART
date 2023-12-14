const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // // try {
  const userResult = await userService.getUserByEmail(email);
  // await userResult.isPasswordMatch(password);
  // if(userResult.password)
  if (!userResult || !(await userResult.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return userResult;

  // // } catch (error) {
  // //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Unable to login');
  // // }


  // try {
    // Retrieve the user by email from the database
    // const userResult = await userService.getUserByEmail(email);
    // console.log(userResult);
    // // Check if the user exists and if the provided password matches
    // if (userResult && (await userResult.isPasswordMatch(password))) {
    //   // If both conditions are true, return the user
    //   return userResult;
    // } else {
    //   // If either the user doesn't exist or the password doesn't match, throw an unauthorized error
    //   throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
    // }
  // } catch (error) {
  //   // Handle any other errors, such as database errors
  //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to login');
  // }
};

module.exports = {
  loginUserWithEmailAndPassword,
};
