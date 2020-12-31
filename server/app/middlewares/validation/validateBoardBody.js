const { body } = require("express-validator")

const intervalsTypes = require("../../../../shared/constants/intervalsTypes")

const boardRepository = require("../../model/repositories/BoardsRepository")
const credentialsRepository = require("../../model/repositories/CredentialsRepository")
const teamsRepository = require("../../model/repositories/TeamsRepository")

const validateIdentifier = require("./items/validateIdentifier")
const validateAssignmentType = require("./items/validateAssignmentType")
const validatePriorities = require("./items/validatePriorities")

/**
 * @param {boolean} update
 * @returns {*[]}
 */
module.exports = (update = false) => {
  const identifierValidator = validateIdentifier(
    "identifier",
    body,
    !update
  ).custom(async (value, { req }) => {
    if (!update || (update && req.params.identifier !== value)) {
      const board = await boardRepository.findByIdentifier(value)
      if (board) {
        throw new Error("Board with this identifier already exists")
      }
    }
  })

  const nameValidator = body("name", "Board name is invalid")
    .isString()
    .isLength({ min: 5, max: 300 })

  let otherValidators = []
  if (update) {
    nameValidator.optional()
  } else {
    nameValidator.exists()

    otherValidators = [
      body().notEmpty(),
      body("intervals", "Board intervals is invalid")
        .exists()
        .isString()
        .isIn(Object.values(intervalsTypes)),

      validateAssignmentType("assignment", body),

      body("priorities", "Default priority is invalid")
        .exists()
        .isInt({ min: 1, max: 5 })
        .toInt(),

      validatePriorities,

      body("credentials", "Credentials are invalid")
        .exists()
        .isString()
        .custom(async (value) => {
          const credentials = await credentialsRepository.findById(value)
          if (!credentials) {
            throw new Error("Given credentials doesn't exists")
          }
        }),
      body("hasInlineEdit", "Inline edit can be only turned on or off")
        .optional()
        .isBoolean(),
      body("hasAvatars", "Avatars can be only turned on or off")
        .optional()
        .isBoolean(),
      body("hasEmailNotifications", "Email notifications can be only turned on or off")
        .optional()
        .isBoolean(),
      body("teams", "Teams are not valid")
        .optional()
        .isArray()
        .custom(async (value) => {
          const foundCount = await teamsRepository.findByIds(value, { count: true })
          if (foundCount !== value.length) {
            throw new Error(`${value.length - foundCount} of given teams doesn't exist anymore`)
          }
        })
    ]
  }

  return [identifierValidator, nameValidator, ...otherValidators]
}
