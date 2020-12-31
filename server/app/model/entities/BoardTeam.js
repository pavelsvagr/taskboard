const Entity = require("./Entity")

/**
 * @class BoardTeam
 */
class BoardTeam extends Entity {
  /**
   * @param {ObjectId} team
   * @param {array} members
   * @param {ObjectId} board
   * @param {int} order
   */
  constructor(team, members, board, order) {
    super()
    this.team = team
    this.members = members
    this.board = board
    this.order = order
  }
}

module.exports = BoardTeam
