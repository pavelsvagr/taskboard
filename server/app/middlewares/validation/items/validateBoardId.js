const { param } = require("express-validator")

const boardsRepository = require("../../../model/repositories/BoardsRepository")

/**
 *
 * @param {string} idParam
 * @param {function} validator
 * @param {boolean} required
 * @returns {ValidationChain}
 */
module.exports = (
  idParam = "identifier",
  validator = param,
  required = true
) => {
  const boardValidator = validator(idParam, "Given board id is not valid")
    .isMongoId()
    .custom(async (value) => {
      const board = await boardsRepository.findById(value)
      if (!board) {
        throw new Error("Board with given id doesn't exist")
      }
    })
  return required ? boardValidator.exists() : boardValidator.optional()
}
