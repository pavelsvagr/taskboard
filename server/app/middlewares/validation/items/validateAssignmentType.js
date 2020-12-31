const { param } = require("express-validator")

const assignmentTypes = require("../../../../../shared/constants/assignmentTypes")

/**
 * @param {string} idParam
 * @param {function} validator
 * @param {boolean} required
 * @returns {ValidationChain}
 */
module.exports = (
  idParam = "assignment",
  validator = param,
  required = true
) => {
  const assignmentValidator = validator(idParam, "Assignment type is invalid")
    .isString()
    .isIn(Object.values(assignmentTypes))

  return required
    ? assignmentValidator.exists()
    : assignmentValidator.optional()
}
