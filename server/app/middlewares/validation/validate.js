const handleValidationErrors = require("../errors/handleValidationErrors")

/**
 * Creates validation chain with error handling
 * @param {ValidationChain|array} validations
 * @returns {*[]}
 */
module.exports = function validate(...validations) {
  return [
    ...validations,
    handleValidationErrors
  ]
}