const Entity = require("./Entity")

/**
 * @class Member
 */
class Member extends Entity {
  /**
   * @param {ObjectId|string} user
   * @param {ObjectId|string} board
   * @param {string} nickname
   * @param {int} order
   * @param {string} role
   */
  constructor(user, board, nickname, order, role) {
    super()
    this.user = user
    this.board = board
    this.nickname = nickname
    this.order = order
    this.role = role
  }
}

module.exports = Member
