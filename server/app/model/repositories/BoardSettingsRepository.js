const mongoose = require("mongoose")

const MongooseRepository = require("./MongooseRepository")

const SettingsModel = require("../models/BoardSettings")

class BoardSettingsRepository extends MongooseRepository {
  /**
   *
   * @param {Board} board
   * @param {date} date
   * @returns {Promise<*>}
   */
  async findBy(board, date) {
    return this.collection
      .findOne({
        [SettingsModel.ATTR_DATE]: date,
        [SettingsModel.ATTR_BOARD]: board._id
      })
      .exec()
  }
}

const Settings = mongoose.model(SettingsModel.SCHEMA)

module.exports = new BoardSettingsRepository(Settings)
