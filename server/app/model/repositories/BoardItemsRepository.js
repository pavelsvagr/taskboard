const mongoose = require("mongoose")

const MongooseRepository = require("./MongooseRepository")

const ItemModel = require("../models/BoardItem")

class MemberRepository extends MongooseRepository {
  /**
   * @param {string} boardId
   * @param {string} dateFrom
   * @param {string} dateTo
   * @param {string} distinct
   * @param {object} projection
   * @param {boolean} lean
   * @returns {Promise<*>}
   */
  async findBy(boardId, dateFrom, dateTo, { distinct, projection, lean } = {}) {
    const query = {}

    if (boardId) {
      query[ItemModel.ATTR_BOARD] = boardId
    }
    if (dateFrom || dateTo) {
      const dateQuery = {}
      if (dateFrom) {
        dateQuery.$gte = dateFrom

      }
      if (dateTo) {
        dateQuery.$lte = dateTo
      }
      query[ItemModel.ATTR_DATE] = dateQuery
    }
    const result = projection
      ? this.collection.find(query, projection)
      : this.collection.find(query)

    if (lean) {
      result.lean()
    }
    if (distinct) {
      result.distinct(distinct)
    }
    return result.exec()
  }

  /**
   *
   * @param {string} boardId
   * @param {string} dateFrom
   * @param {string} dateTo
   * @returns {Promise<*>}
   */
  async deleteManyBy(boardId, dateFrom, dateTo) {
    return this.deleteMany({
      [ItemModel.ATTR_BOARD]: boardId,
      [ItemModel.ATTR_DATE]: {
        $gte: dateFrom,
        $lte: dateTo
      }
    })
  }
}

const BoardItem = mongoose.model(ItemModel.SCHEMA)

module.exports = new MemberRepository(BoardItem)
