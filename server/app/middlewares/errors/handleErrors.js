/* eslint no-unused-vars: 0 */
const mongoose = require("mongoose")

const AppError = require("../../exceptions/AppError")
const { ERROR_DB, ERROR_APP } = require("../../../../shared/constants/errorTypes")


/**
 * Error handler for returning json responses with errors
 * @param err
 * @param {e.Request} req
 * @param {e.Response} res
* @param {function} next
 * @returns {Promise<*>}
 */
module.exports = async function handleErrors(err, req, res, next) {
  if (err instanceof AppError) {
    // Error is thrown by application
    return res.status(err.status || err.statusCode).json(err)
  }

  if (err instanceof mongoose.Error) {
    // Error during database update
    return res.status(500).json({
      errors: {
        type: ERROR_DB,
        msg: err.message
      }
    })
  }

  // Rest errors
  return res.status(500).json({
    errors: {
      type: ERROR_APP,
      msg: err.message
    }
  })
}
