const Entity = require("./Entity")

/**
 * @class Credentials
 */
class Credentials extends Entity {
  /**
   * @constructor
   * @param {string} name
   * @param {string} type
   * @param {string} url
   * @param {string} apiKey
   * @param {ObjectId|string} creator
   */
  constructor(name, type, url, apiKey, creator) {
    super()
    this.name = name
    this.url = url
    this.type = type
    this.apiKey = apiKey
    this.creator = creator
  }
}

module.exports = Credentials
