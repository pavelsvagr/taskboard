const logManager = require("../../services/managers/logManager")
const { PRIORITY_HIGH } = require("../../../../shared/constants/logsPriorities")
const AppError = require("../../exceptions/AppError")

/**
 * Error logger
 * @param err
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {function} next
 * @returns {Promise<void>}
 */
module.exports = async function logErrors(err, req, res, next) {
  if (!(err instanceof AppError)) {
    // Errors by db or code
    await logManager.logError(err, req, PRIORITY_HIGH)
    console.error(err)
  }
  next(err)
}