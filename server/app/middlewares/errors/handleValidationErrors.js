const { validationResult } = require("express-validator")

const ValidationError = require("../../exceptions/ValidationError")

/**
 * Checks if any validation errors was created
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {function} next
 * @returns {*}
 */
module.exports = function handleValidationErrors(req, res, next) {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw new ValidationError(errors.errors)
  } 
    return next()
}
