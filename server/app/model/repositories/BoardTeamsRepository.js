const mongoose = require("mongoose")
const BoardTeamModel = require("../models/BoardTeam")
const TeamModel = require("../models/Team")
const MongooseRepository = require("./MongooseRepository")

class BoardTeamsRepository extends MongooseRepository {
  /**
   *
   * @param {string} boardId
   * @param {string} distinct
   * @param {boolean} count
   * @param {boolean} populateUsers
   * @returns {Promise<*>}
   */
  async findByBoard(boardId, { distinct, count, populateUsers} = {}) {
    const query = this.collection.find({
      [BoardTeamModel.ATTR_BOARD]: boardId
    })

    if (distinct) {
      return query.distinct(distinct).exec()
    }

    if (count) {
      return query.countDocuments()
    }

    const populateSelect = [TeamModel.ATTR_NAME, TeamModel.ATTR_COLOR, TeamModel.ATTR_IDENTIFIER]
    if (populateUsers) {
      populateSelect.push(TeamModel.ATTR_USERS)
    }

    return query
      .populate(BoardTeamModel.ATTR_TEAM, populateSelect)
      .sort(BoardTeamModel.ATTR_ORDER)
      .lean()
      .exec()
  }

  /**
   *
   * @param {string} boardId
   * @param {string} memberId
   * @returns {Promise<*>}
   */
  async deleteMember(boardId, memberId) {
    return this.collection.updateMany(
      {
        [BoardTeamModel.ATTR_BOARD]: boardId,
        [BoardTeamModel.ATTR_MEMBERS]: memberId
      },
      {
        $pull: {
          [BoardTeamModel.ATTR_MEMBERS]: memberId
        }
      }
    )
  }

  /**
   *
   * @param {string} boardId
   * @param {string} teamId
   * @returns {Promise<void|null|number|Model.collection>}
   */
  async findByBoardAndTeam(boardId, teamId) {
    return this.collection.findOne({
      [BoardTeamModel.ATTR_BOARD]: boardId,
      [BoardTeamModel.ATTR_TEAM]: teamId
    })
  }

  /**
   *
   * @param {string} teamId
   * @returns {Promise<*>}
   */
  async findByTeam(teamId) {
    return this.find({
      [BoardTeamModel.ATTR_TEAM]: teamId
    })
  }

  /**
   *
   * @param {string} boardId
   * @returns {Promise<*>}
   */
  async findMaxOrder(boardId) {
    const boardTeam = await this.collection
      .find({
        [BoardTeamModel.ATTR_BOARD]: boardId
      })
      .select({ [BoardTeamModel.ATTR_ORDER]: true })
      .sort({ [BoardTeamModel.ATTR_ORDER]: -1 })
      .limit(1)

    return boardTeam.length ? boardTeam[0].order : 0
  }
}

const BoardTeam = mongoose.model(BoardTeamModel.SCHEMA)

module.exports = new BoardTeamsRepository(BoardTeam)
