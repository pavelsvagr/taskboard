const mongoose = require("mongoose")

const NotificationsModel = require("../models/Notification")
const MongooseRepository = require("./MongooseRepository")

class NotificationsRepository extends MongooseRepository {

  /**
   * Finds notifications by user with given settings
   * @param {string} userId
   * @param {object} sort
   * @param {int} limit
   * @param {int} offset
   * @param {boolean} count
   * @returns {Promise<*>}
   */
  async findByUser(userId, { sort, limit, offset, count }) {
    const query = this.collection.find({
      [NotificationsModel.ATTR_USER]: userId
    })

    if (sort) {
      query.sort(sort)
    }
    if (limit) {
      query.limit(limit)
    }
    if (offset) {
      query.skip(offset)
    }

    if (count) {
      query.countDocuments()
    }
    return query.exec()
  }
}

const Notification = mongoose.model(NotificationsModel.SCHEMA)

module.exports = new NotificationsRepository(Notification)
