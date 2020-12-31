const { param } = require("express-validator")

const memberRepository = require("../../../model/repositories/MemberRepository")

/**
 * @param {string} idParam
 * @param {function} validator
 * @param {boolean} required
 * @returns {ValidationChain}
 */
module.exports = (idParam = "member", validator = param, required = true) => {
  const memberValidator = validator(idParam)
    .isMongoId()
    .custom(async (value) => {
      const board = await memberRepository.findById(value)
      if (!board) {
        throw new Error("Member with given id doesn't exist")
      }
    })
  return required ? memberValidator.exists() : memberValidator.optional()
}
