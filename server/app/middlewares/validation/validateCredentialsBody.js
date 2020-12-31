const { body } = require("express-validator")

/**
 * @param {boolean} update
 * @return {[ValidationChain, ValidationChain, ValidationChain, ValidationChain]}
 */
module.exports = (update = false) => {
  const name = body("name").isString().isLength({ min: 5, max: 300 })

  const url = body("url").isURL()

  const type = body("type").isString()

  const apiKey = body("apiKey").isString().isLength({ min: 5, max: 300 })

  if (update) {
    apiKey.optional()
    url.optional()
    type.optional()
    name.optional()
  } else {
    apiKey.exists()
    url.exists()
    type.exists()
    name.exists()
  }

  return [body().notEmpty(), name, url, type, apiKey]
}
