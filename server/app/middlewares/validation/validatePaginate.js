const { query } = require("express-validator")

/**
 * Checks if parameters for pagination are defined
 * @param {string} limitParam
 * @param {string} pageParam
 * @param validator
 * @return {[ValidationChain, ValidationChain]}
 */
module.exports = (
  limitParam = "limit",
  pageParam = "offset",
  validator = query
) => [
  validator(limitParam)
    .optional()
    .isInt({ min: 0, max: 50 })
    .toInt(),
  validator(pageParam).optional().isInt({ min: 0 }).toInt()
]
