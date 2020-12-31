/**
 * @class {Object} Entity
 */
class Entity {
  /**
   * @constructor
   */
  constructor() {
    /** @type {string|int} */
    this.id = ""
  }

  /**
   * Check if objects are equals
   * @param other
   * @return {boolean | any}
   */
  equals(other) {
    if (!(other instanceof Entity)) {
      return false
    }

    return other.id ? this.referenceEquals(other.id) : this === other
  }

  /**
   * Check if references are equals
   * @return {boolean | string}
   * @param id
   */
  referenceEquals(id) {
    if (!this.id) {
      return this.equals(id)
    }

    const reference = typeof id !== "string" ? id.toString() : id

    return this.id === reference
  }

  /**
   * Converts entity to string
   * @return {string}
   */
  toString() {
    return this.id
  }
}

module.exports = Entity
