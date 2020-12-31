const Entity = require("./Entity")

/**
 * @class User
 */
class User extends Entity {
  /**
   * @constructor
   * @param {string|null} googleId
   * @param {string} email
   * @param {string|null} googlePhoto
   * @param {string|null} photo
   * @param {string|null} name
   * @param {string} role
   * @param {boolean} active
   */
  constructor(googleId, email, googlePhoto, photo, name, role, active = true) {
    super()
    this.googleId = googleId
    this.email = email
    this.googlePhoto = googlePhoto
    this.photo = photo
    this.name = name
    this.role = role
    this.active = active
  }
}

module.exports = User
