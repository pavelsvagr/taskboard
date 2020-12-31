const { body } = require("express-validator")

module.exports = body("priorities", "Default priority is invalid")
  .exists()
  .isInt({ min: 1, max: 5 })
  .toInt()
