const { body } = require("express-validator")

const validatePriorities = require("./items/validatePriorities")

module.exports = [
  validatePriorities,
  body().notEmpty(),
  body("deactivated").exists().isArray()
]
