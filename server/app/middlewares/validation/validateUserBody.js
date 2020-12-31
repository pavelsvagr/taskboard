const { body } = require("express-validator")

const Roles = require("../../../../shared/security/roles")
const userRepository = require("../../model/repositories/UserRepository")

/**
 * @param {boolean} required
 * @return {ValidationChain[]}
 */
module.exports = (required = false) => {
  const validators = [
    body("email").isEmail().custom(async (value, { req }) => {
      const user = await userRepository.findById(req.params.id)

      if (required || (!required && user.email !== value)) {
        const existing = await userRepository.findByEmail(value)
        if (existing) {
          throw new Error("User with this email already exists")
        }
      }
    }),
    body("name").isString().isLength({ min: 3, max: 300 }),
    body("role").isIn(Object.values(Roles))
  ]

  for (const validator of validators) {
    if (required) {
      validator.exists()
    } else {
      validator.optional()
    }
  }

  return [
    body().notEmpty(),
    ...validators,
    body("active").isBoolean().optional()
  ]
}
