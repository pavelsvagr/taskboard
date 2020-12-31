const Entity = require("./Entity")

/**
 * @class Team
 */
class Team extends Entity {
  /**
   * @constructor
   * @param {string} name
   * @param {string} identifier
   * @param {string} color
   * @param {array} users
   */
  constructor(name, identifier, color, users = []) {
    super()
    this.name = name
    this.identifier = identifier
    this.color = color
    this.users = users
  }
}

module.exports = Team
