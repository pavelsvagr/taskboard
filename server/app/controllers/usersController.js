const Roles = require("../../../shared/security/roles")
const notificationsTypes = require("../../../shared/constants/notificationTypes")

const MissingEntityError = require("../exceptions/MissingEntityError")
const userManager = require("../services/managers/userManager")
const userRepository = require("../model/repositories/UserRepository")
const notificationsManager = require("../services/managers/notificationManager")
const AppError = require("../exceptions/AppError")

/**
 * Returns all users
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 * */
exports.getUsers = async (req, res) => {
  const { search, limit = 10, offset = 0, sort } = req.query

  const searchProps = {
    limit,
    offset: (offset) * limit,
    sort
  }
  const searchQuery = search ? {
    $or: [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") }
    ]
  } : {}

  const count = await userRepository.find(searchQuery, { count: true })
  const users = await userRepository.find(searchQuery, searchProps)

  res.send({ data: users, limit, offset, count, sort })
}

/**
 * Returns user
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 * @param next
 * */
exports.getUser = async (req, res, next) => {
  const { id } = req.params

  const user = await userRepository.findById(id)
  if (! user) {
    next(new MissingEntityError("User not found"))
    return
  }
  res.send(user)
}

/**
 * Updates user
 * @param {e.Request} req
 * @param {User} req.user
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  const { user } = res.locals
  const { email, name, role, active } = req.body

  if (email) {
    if (user.email !== email) {
      const exists = await userRepository.findByEmail(email)
      if (exists) {
        throw new Error("User with this email already exists.")
      }
    }
    user.email = email
  }
  if (name) user.name = name
  if (active !== undefined) user.active = active
  if (role) {
    if (user.role === Roles.Admin && role !== Roles.Admin && req.user._id === user._id) {
      throw new AppError("You can't change admin role on yourself")
    }
    user.role = role
    await notificationsManager.createNotification(notificationsTypes.role, null, user, req.user, { role })
  }

  return res.send(
    await userRepository.update(user)
  )
}

/**
 * Creates user
 * @param {e.Request} req
 * @param {User} req.user
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.createUser = async (req, res) => {
  const { name, email, role } = req.body

  return res.send(
    await userManager.create(name, email, role)
  )
}