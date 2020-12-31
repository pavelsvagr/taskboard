const {ERROR_APP} = require("../../../shared/constants/errorTypes")

/**
 * General application error
 */
class AppError extends Error {
  /**
   * @param {string} message Message of error
   */
  constructor(message) {
    super(message)
    this.name = this.constructor.name
    this.type = ERROR_APP
    this.status = 404

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error(message).stack
    }
  }

  toJSON = () => {
    return {
      errors: {
        type: this.type,
        msg: this.message,
        location: null,
        param: null
      }
    }
  }
}

module.exports = AppError
