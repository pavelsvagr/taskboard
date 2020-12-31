const AuthenticationError = require("../exceptions/AuthorizationError")

/**
 * @param {e.Request} req
 * @param {e.Response} res
* @param {function} next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  if (!req.user) {
    next(new AuthenticationError("You must be logged in.", 401))
  }
  return next()
}
