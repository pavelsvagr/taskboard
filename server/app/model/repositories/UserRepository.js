const mongoose = require("mongoose")

const UserModel = require("../models/User")
const MongooseRepository = require("./MongooseRepository")

 
class UserRepository extends MongooseRepository {
  /**
   * @param {string} googleId
   * @param {boolean|null} active
   * @returns {Promise<*>}
   */
  async findByGoogleId(googleId, active = null) {
    const query = {
      [UserModel.ATTR_GOOGLE_ID]: googleId
    }

    if (active !== null) {
      query[UserModel.ATTR_ACTIVE] = active
    }

    return this.collection.findOne(query).exec()
  }

  /**
   * @param {string} email
   * @returns {Promise<void|null|number|Model.collection>}
   */
  async findByEmail(email) {
    return this.collection.findOne({
      [UserModel.ATTR_EMAIL]: email
    })
  }
}

const User = mongoose.model(UserModel.SCHEMA)

module.exports = new UserRepository(User)
