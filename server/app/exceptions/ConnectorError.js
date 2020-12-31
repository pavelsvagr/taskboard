const { ERROR_EXTERNAL } = require("../../../shared/constants/errorTypes")
const AppError = require("./AppError")

/**
 * Error in external connection
 */
class ConnectorError extends AppError {
  constructor(message) {
    super(message)
    this.type = ERROR_EXTERNAL
    this.status = 503
  }
}

module.exports = ConnectorError
