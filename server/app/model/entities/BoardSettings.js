const moment = require("moment")
const Entity = require("./Entity")

/**
 * @class BoardSettings
 */
class BoardSettings extends Entity {
  /**
   * @constructor
   * @param {ObjectId|string} board
   * @param {date} date
   * @param {int} priorities
   * @param {array} deactivated
   */
  constructor(board, date, priorities, deactivated) {
    super()
    this.board = board
    this.date =  moment.isMoment(date) ?
      new Date(`${date.format("YYYY-MM-DD")}T00:00:00.000Z`)
      : new Date(`${date}T00:00:00.000Z`)
    this.priorities = priorities
    this.deactivated = deactivated
  }
}

module.exports = BoardSettings
