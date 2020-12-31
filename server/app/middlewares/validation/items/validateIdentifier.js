const { param } = require("express-validator")

/**
 * @param {string} idParam
 * @param {function} validator
 * @param {boolean} required
 * @returns {any}
 */
module.exports = (
  idParam = "identifier",
  validator = param,
  required = true
) => {
  const identifier = validator(idParam, `${idParam} is not valid identifier`)
    .isString()
    .isLength({ min: 3, max: 300 })
    .isSlug()
    .matches( /^([a-zA-Z0-9-])*$/)

  return required ? identifier.exists() : identifier.optional()
}
