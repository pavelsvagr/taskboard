const { body } = require("express-validator")

const validateDate = require("./items/validateDate")
const validateMemberId = require("./items/validateMemberId")
const validateBoardId = require("./items/validateBoardId")
const validateAssignmentsBody = require("./validateAssignmentsBody")

/**
 * @param {boolean} required
 * @returns {[*, *, *, *]}
 */
module.exports = (required = true) => [
  body().notEmpty(),
  validateDate("date", body, required),
  validateBoardId("boardId", body, required),
  validateMemberId("member", body, required),
  validateAssignmentsBody("assignments", required)
]
