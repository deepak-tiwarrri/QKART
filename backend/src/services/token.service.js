const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  try {
    const payload = {
      sub: userId,
      type: type,
      iat: Math.floor(Date.now() / 1000),
      exp: expires,
    };
    return jwt.sign(payload, secret);
  } catch (error) {
    // console.log("msg from token service", error);
    throw error;
  }
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  try {
    const accessTokenExpires =
      Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
    //by default secret is set to config.jwt.secret, so no need to set it
    const accessToken = generateToken(
      user._id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );
    const authTokens = {
      access: { token: accessToken, expires: new Date(accessTokenExpires * 1000) },
    };
    return authTokens;
  } catch (error) {
    // console.log("msg from token service", error);
    throw error;
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
  
};
