const User = require("../../model/entities/User")
const userRepository = require("../../model/repositories/UserRepository")

/**
 * Returns all users
 * @return {Promise<any>}
 */
exports.getAll = async () => userRepository.findAll()

/**
 * Returns single user
 * @return {Promise<any>}
 * @param {ObjectId|string} id
 */
exports.getUser = async (id) => userRepository.findById(id)

/**
 * Searches in users
 * @param {string} text
 * @return {Promise<any>}
 */
exports.search = async (text) => {
  const search = { $regex: `.*${text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")}.*` }

  return userRepository.find({
    $or: [
      { name: search },
      { email: search }
    ]
  })
}

/**
 * Creates new user
 * @return {Promise<any>}
 * @param {string} name
 * @param {string} email
 * @param {string} role
 */
exports.create = async (name, email, role) => {
  const user = new User(null, email, null, null, name, role)
  return userRepository.create(user)
}
