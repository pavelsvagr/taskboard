const Entity = require("./Entity")

/**
 * @class Notification
 */
class Notification extends Entity {
  /**
   * @constructor
   * @param {ObjectId|string} user
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @param {string} link
   * @param {string} linkText
   * @param {date} createdAt
   */
  constructor(
    user,
    type,
    title = "",
    message = "",
    link = "",
    linkText = "",
    createdAt = null
  ) {
    super()
    this.user = user
    this.type = type
    this.title = title
    this.message = message
    this.link = link
    this.linkText = linkText
    this.createdAt = createdAt
  }
}

module.exports = Notification
