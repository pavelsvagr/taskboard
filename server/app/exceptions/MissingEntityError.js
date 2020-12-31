const { ERROR_MISSING_ENTITY } = require("../../../shared/constants/errorTypes")
const AppError = require("./AppError")

/**
 * Error when checking if entity by given API id exists
 */
class MissingEntityError extends AppError {
  constructor(message, entity = null) {
    super(message)
    this.type = ERROR_MISSING_ENTITY
    this.status = 404
    this.entity = entity
  }
}

module.exports = MissingEntityError