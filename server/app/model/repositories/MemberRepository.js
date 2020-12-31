const mongoose = require("mongoose")

const MongooseRepository = require("./MongooseRepository")

const MemberModel = require("../models/Member")

class MemberRepository extends MongooseRepository {

  /**
   * @param boardId
   * @param users
   * @param distinct
   * @param one
   * @param populate
   * @returns {Promise<*>}
   */
  async findBy(boardId, users, { distinct, one, populate } = {}) {
    const query = {}

    if (boardId) {
      query[MemberModel.ATTR_BOARD] = boardId
    }
    if (users) {
      query[MemberModel.ATTR_USER] = { $in: users }
    }
    const result = one
      ? this.collection.findOne(query)
      : this.collection.find(query)

    if (distinct) {
      result.distinct(distinct)
    } else {
      result.sort(MemberModel.ATTR_ORDER)
    }

    if (populate) {
      result.populate(populate)
    }

    return result.exec()
  }

  /**
   * @param boardId
   * @returns {Promise<*>}
   */
  async findMaxOrder(boardId) {
    const member = await this.collection
      .find({
        [MemberModel.ATTR_BOARD]: boardId
      })
      .select({ [MemberModel.ATTR_ORDER]: true })
      .sort({ [MemberModel.ATTR_ORDER]: -1 })
      .limit(1)

    return member.length ? member[0].order : 0
  }
}

const Member = mongoose.model(MemberModel.SCHEMA)

module.exports = new MemberRepository(Member)
