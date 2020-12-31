const { param } = require("express-validator")
const moment = require("moment")

/**
 *
 * @param {string} dateParam
 * @param {function} validator
 * @param {boolean} required
 * @returns {ValidationChain}
 */
module.exports = (dateParam = "date", validator = param, required = true) => {
  const date = validator(
    dateParam,
    `${dateParam} is not valid date. Expected YYYY-MM-DD`
  )
    .isISO8601()
    .customSanitizer((value) => moment(value)
    )

  return required ? date.exists() : date.optional()
}
