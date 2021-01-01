const { body } = require("express-validator")

const boardRoles = require("../../../../shared/security/rolesBoard")

module.exports = {
  bodyValidator: [
    body().notEmpty(),
    body("nickname").optional().isString().isLength({ min: 3, max: 100 }),
    body("role").optional().isString().isIn(Object.values(boardRoles)),
    body("user").optional().isMongoId()
  ],
  arrayValidator: [
    body("*.nickname").exists().isString().isLength({ min: 3, max: 100 }),
    body("*.role").exists().isString().isIn(Object.values(boardRoles)),
    body("*.user").exists().isMongoId()
  ]
}
