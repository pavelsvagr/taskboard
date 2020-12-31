const { ERROR_VALIDATION } = require("../../../shared/constants/errorTypes")
const AppError = require("./AppError")

/**
 * Error in validation
 */
class ValidationError extends AppError {
  constructor(errors) {
    super("Error in validation")
    this.status = 404

    this.errors = errors.map(e => {
      e.type = ERROR_VALIDATION
      return e
    })
  }

  /**
   * Returns json representation
   * @returns {{errors: *}}
   */
  toJSON = () => {
    return { errors: this.errors }
  }
}

module.exports = ValidationError