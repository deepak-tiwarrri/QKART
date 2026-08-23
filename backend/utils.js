const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./config.json');
var { users, products } = require('./db');

// UTILS

/**
 * Sends a standardized JSON response.
 * All responses follow: { success, message, statusCode, data }
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Whether the operation succeeded
 * @param {string} message - Human-readable message
 * @param {any} data - Actual response payload (null for empty responses)
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        statusCode,
        data,
    });
};

const getProduct = (productId) => {
    return new Promise((resolve, reject) => {
        products.findOne({ _id: productId }, (err, docs) => {
            if (err) {
                reject(err);
            }
            resolve(docs);
        });
    });
};

const verifyAuth = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ').length > 1 &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            config.jwtSecret,
            {},
            (err, payload) => {
                if (err) {
                    return sendResponse(res, 400, false, 'Bad or expired token');
                }
                users.findOne({ username: payload.username }, (err, user) => {
                    if (err) {
                        return handleError(res, err);
                    }
                    if (!user) {
                        return sendResponse(res, 400, false, 'Bad token or user no longer exists');
                    }
                    req.user = user;
                    next();
                });
            }
        );
    } else {
        return sendResponse(res, 401, false, 'Protected route, Oauth2 Bearer token not found');
    }
};

const handleError = (res, err) => {
    console.log(err);
    return sendResponse(res, 500, false, 'Something went wrong. Check the backend console for more details');
};

/**
 * Hashes a string with SHA-256 (used for password hashing).
 * Extracted from routes/auth.js so it can be reused without duplication.
 * @param {string} input
 * @returns {string} hex digest
 */
const sha256 = (input) =>
    crypto.createHash('sha256').update(input, 'utf8').digest('hex');

/**
 * Finds the index of an item in an array by a specific key/value pair.
 * Replaces repetitive inline findIndex calls in cart.js and user.js.
 * @param {Array} array
 * @param {string} key - Property name to match on
 * @param {*} value - Value to find
 * @returns {number} index, or -1 if not found
 */
const findItemIndex = (array, key, value) =>
    array.findIndex((element) => element[key] === value);

module.exports.handleError = handleError;
module.exports.verifyAuth = verifyAuth;
module.exports.getProduct = getProduct;
module.exports.sendResponse = sendResponse;
module.exports.sha256 = sha256;
module.exports.findItemIndex = findItemIndex;
