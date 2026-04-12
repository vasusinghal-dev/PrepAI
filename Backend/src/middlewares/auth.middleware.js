const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model.js");

/**
 * @name authUser
 * @description Middleware to authenticate requests using JWT stored in cookies.
 * Verifies the token, checks if it is blacklisted, and attaches the decoded user payload to req.user.
 * Rejects the request if the token is missing, invalid, or expired.
 *
 * @access Private
 * @route Used in protected routes
 * @returns Calls next() if authenticated, otherwise sends 401 Unauthorized response
 */
async function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token not provided." });
  }

  try {
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authUser };
