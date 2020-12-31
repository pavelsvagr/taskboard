const MembersModel = require("../model/models/Member")

const isAuthorized = require("../../../shared/security/isAuthorized")
const Role = require("../../../shared/security/roles")
const BoardRole = require("../../../shared/security/rolesBoard")
const notificationsTypes = require("../../../shared/constants/notificationTypes")

const membersRepository = require("../model/repositories/MemberRepository")
const boardTeamsRepository = require("../model/repositories/BoardTeamsRepository")
const userRepository = require("../model/repositories/UserRepository")
const membersManager = require("../services/managers/memberManager")
const notificationsManager = require("../services/managers/notificationManager")
const AuthorizationError = require("../exceptions/AuthorizationError")
const MissingEntityError = require("../exceptions/MissingEntityError")

/**
 * Returns all board members
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.getAll = async (req, res) => {
  return res.send(await membersManager.getWithUsersByBoard(res.locals.board))
}

/**
 * Replaces board members
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {User} req.user
 * @return {Promise<void>}
 */
exports.addAll = async (req, res) => {
  const { board } = res.locals
  const usersArray = req.body

  return res.send(await membersManager.addMore(board, usersArray, req.user))
}

/**
 * Delete board member
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {function} next
 * @return {Promise<this | any>}
 */
exports.delete = async (req, res, next) => {
  const { board } = res.locals
  const memberId = req.params.id

  const member = await membersRepository.findById(memberId)

  if (member && member.role !== BoardRole.Owner) {
    await boardTeamsRepository.deleteMember(board._id, member._id)
    await member.delete()
    return res.send(member)
  }
  return next(
    new MissingEntityError("Invalid member id given")
  )
}

/**
 * Replaces all members
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.replaceAll = async (req, res) => {
  const { board } = res.locals
  const members = req.body

  await membersRepository.deleteMany({ [MembersModel.ATTR_BOARD]: board._id })
  await membersRepository.createMany(members)

  const membersDb = await membersManager.getWithUsersByBoard(board)
  return res.send(membersDb)
}

/**
 * Update board member
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {User} req.user
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {
  const { board, boardMember } = res.locals
  const { id } = req.params
  const { nickname, role } = req.body

  let member = await membersRepository.findById(id)

  if (nickname) member.nickname = nickname
  if (role) {
    if (!isAuthorized([Role.Admin, Role.Mod], [BoardRole.Owner], req.user, boardMember)) {
      throw new AuthorizationError("Role can be changed only by admin or owner of the board.")
    }
    member.role = role

    const user = await userRepository.findById(member.user)
    await notificationsManager.createNotification(notificationsTypes.role, board, user, req.user, { role })
  }

  member = await membersRepository.update(member)

  const updated = await membersManager.getWithUsers(member)
  return res.send(updated)
}
