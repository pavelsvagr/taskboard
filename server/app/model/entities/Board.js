const Entity = require("./Entity")
const ApiFilter = require("./ApiFilter")

/**
 * @class Board
 */
class Board extends Entity {
  /**
   * @constructor
   * @param {string} name
   * @param {string} identifier
   * @param {ObjectId|string} credentials
   * @param {string} intervals
   * @param {string} assignment
   * @param {int} priorities
   * @param {boolean} hasAvatars
   * @param {boolean} hasEmailNotifications
   * @param {boolean} hasInlineEdit
   * @param {Object} apiFilters
   * @param {User} owner
   * @param {date} lastSynchronized
   */
  constructor(
    name,
    identifier,
    credentials,
    intervals,
    assignment,
    priorities,
    hasAvatars = true,
    hasEmailNotifications = false,
    hasInlineEdit = false,
    apiFilters = null,
    owner = null,
    lastSynchronized = null
  ) {
    super()
    this.name = name
    this.identifier = identifier
    this.credentials = credentials
    this.intervals = intervals
    this.assignment = assignment
    this.priorities = priorities
    this.hasAvatars = hasAvatars
    this.hasEmailNotifications = hasEmailNotifications
    this.hasInlineEdit = hasInlineEdit
    this.apiFilters = apiFilters
    this.owner = owner
    this.lastSynchronized = lastSynchronized
  }

  getApiFilterParams() {
    const params = {}
    for (const filter of this.apiFilters) {
      params[filter.name] = filter.value
    }
    return params
  }

  addApiFilter({ name, value }) {
    if (!this.apiFilters) {
      this.apiFilters = []
    }
    this.apiFilters.push(new ApiFilter(name, value))
  }
}

module.exports = Board
