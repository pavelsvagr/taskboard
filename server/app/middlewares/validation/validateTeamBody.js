const { body } = require("express-validator")

const boardColors = require("../../../../shared/constants/boardColors")
const teamManager = require("../../services/managers/teamManager")

const validateIdentifier = require("./items/validateIdentifier")

/**
 * @param update
 * @return {array<ValidatorChain>}
 */
module.exports = (update = false) => {
  const identifierValidator = validateIdentifier(
    "identifier",
    body,
    update
  ).custom(async (value, { req }) => {
    if (!update || (update && req.params.identifier !== value)) {
      const team = await teamManager.get(value)
      if (team) {
        throw new Error("Team with this identifier already exists")
      }
    }
  })

  const nameValidator = body("name", "Team name is invalid")
  const colorValidator = body("color", "Color is invalid")

  if (update) {
    nameValidator.optional()
    colorValidator.optional()
  } else {
    nameValidator.exists()
    colorValidator.exists()
  }

  return [
    body().notEmpty(),
    identifierValidator,
    nameValidator.isString().isLength({ min: 5, max: 300 }),
    colorValidator.exists().isString().isIn(boardColors)
  ]
}
