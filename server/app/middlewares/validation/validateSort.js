const { query } = require("express-validator")

/**
 * Checks if parameters for pagination are defined
 * @param validator
 * @return {ValidationChain[]}
 * @param paramName
 */
module.exports = (
  paramName = "sort",
  validator = query
) => [
  validator(paramName, "Sort is not valid.")
    .optional()
    .isString()
    .matches("^[a-zA-Z]+,(ASC|DESC)$")
    .customSanitizer((value) => {
      const [item, order] = value.split(",")

      return {
        [item]: order === 'ASC' ? 1 : -1
      }
    })
]
