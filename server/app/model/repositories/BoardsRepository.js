const mongoose = require("mongoose")

const BoardModel = require("../models/Board")
const CredentialsModel = require("../models/Credentials")
const MongooseRepository = require("./MongooseRepository")

class BoardRepository extends MongooseRepository {
  /**
   *
   * @param {Entity|object} board
   * @param {object} select
   * @returns {Promise<*>}
   */
  async findCredentials(board, {select} = {}) {
    const credentials = await this.reload(board, {
      populate: {
        path: BoardModel.ATTR_CREDENTIALS,
        select: select || ["_id", CredentialsModel.ATTR_TYPE, CredentialsModel.ATTR_NAME]
      }
    })
    return credentials[BoardModel.ATTR_CREDENTIALS]
  }

  /**
   *
   * @param {string} identifier
   * @returns {Promise<*>}
   */
  async findByIdentifier(identifier) {
    return this.collection.findOne({
      [BoardModel.ATTR_IDENTIFIER]: identifier
    }).exec()
  }
}

const Board = mongoose.model(BoardModel.SCHEMA)

module.exports = new BoardRepository(Board)
