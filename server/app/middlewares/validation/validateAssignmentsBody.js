const { body } = require("express-validator")

const validateAssignmentType = require("./items/validateAssignmentType")

/**
 * @param {string} parameter
 * @param {boolean} required
 * @returns {(ValidationChain|*)[]}
 */
module.exports = (parameter = "assignments", required = true) => {
  const validators = [
    body(parameter)
      .isArray()
      .custom((value) => {
        const usedPriorities = {}
        for (const assignment of value) {
          if (!assignment.priority) {
            return true
          }
          if (usedPriorities[assignment.priority]) {
            throw new Error("Priorities need to be unique for each assignment")
          }
          usedPriorities[assignment.priority] = true
        }
        return true
      }),

    body(
      `${parameter}.*.id`,
      "Id of assignment is missing or not valid id"
    ).isString(),

    body(
      `${parameter}.*.url`,
      "Url of assignment is missing or not url"
    ).isURL(),

    body(
      `${parameter}.*.title`,
      "Title of assignment is missing or not string"
    ).isString(),

    body(
      `${parameter}.*.type`,
      "Type of assignment is missing or not string"
    ).isString(),

    body(`${parameter}.*.priority`, "Priority of assignment is not integer")
      .isInt()
      .toInt()
  ]

  if (!required) {
    for (const validator of validators) {
      validator.optional()
    }
  }

  return [
    body().notEmpty(),
    ...validators,
    validateAssignmentType(`${parameter}.*.type`, body, required)
  ]
}
