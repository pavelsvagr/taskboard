const mongoose = require("mongoose")

const MongooseRepository = require("./MongooseRepository")

const TeamModel = require("../models/Team")
const UserModel = require("../models/User")

class TeamRepository extends MongooseRepository {
  /**
   * @param {string} identifier
   * @returns {Promise<*>}
   */
  async findByIdentifier(identifier) {
    return this.collection
      .findOne({
        [TeamModel.ATTR_IDENTIFIER]: identifier
      })
      .exec()
  }

  /**
   * @param {Entity|object} document
   * @returns {Promise<*>}
   */
  async findTeamMembers(document) {
    const model = await this.findById(document.id, {
      populate: {
        path: TeamModel.ATTR_USERS,
        select: [UserModel.ATTR_NAME, UserModel.ATTR_EMAIL, UserModel.ATTR_ACTIVE, "_id"]
      }
    })
    return model.users
  }
}

const Team = mongoose.model(TeamModel.SCHEMA)

module.exports = new TeamRepository(Team)
