const { ERROR_AUTH } = require("../../../shared/constants/errorTypes")
const AppError = require("./AppError")

/**
 * Error in authorization of user rights
 */
class AuthorizationError extends AppError {
  constructor(message, status = 403) {
    super(message)
    this.type = ERROR_AUTH
    this.status = status
  }
}

module.exports = AuthorizationError
