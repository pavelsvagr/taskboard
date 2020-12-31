const moment = require("moment")
const Entity = require("./Entity")

/**
 * @class BoardItem
 */
class BoardItem extends Entity {
  /**
   * @constructor
   * @param {ObjectId|string} board
   * @param {moment|string} date
   * @param {ObjectId|string} member
   * @param {array} assignments
   */
  constructor(board, date, member, assignments) {
    super()
    this.board = board
    this.date = moment.isMoment(date) ?
      new Date(`${date.format("YYYY-MM-DD")}T00:00:00.000Z`)
      : new Date(`${date}T00:00:00.000Z`)
    this.member = member
    this.assignments = assignments
  }
}

module.exports = BoardItem
