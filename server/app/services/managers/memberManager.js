const UsersModel = require("../../model/models/User")
const MembersModel = require("../../model/models/Member")
const TeamModel = require("../../model/models/Team")

const notificationsTypes = require("../../../../shared/constants/notificationTypes")
const notificationManager = require("./notificationManager")

const BoardRole = require("../../../../shared/security/rolesBoard")

const membersRepository = require("../../model/repositories/MemberRepository")
const usersRepository = require("../../model/repositories/UserRepository")
const boardTeamsRepository = require("../../model/repositories/BoardTeamsRepository")
const teamsRepository = require("../../model/repositories/TeamsRepository")

const Member = require("../../model/entities/Member")

/**
 * @param {Board} board
 * @return {Promise<any>}
 */
exports.getWithUsersByBoard = async (board) => {
  return membersRepository.findBy(board._id, null, {
    populate: {
      path: MembersModel.ATTR_USER,
      select: [
        "_id",
        UsersModel.ATTR_EMAIL,
        UsersModel.ATTR_NAME,
        UsersModel.ATTR_PHOTO,
        UsersModel.ATTR_ACTIVE
      ]
    }
  })
}

/**
 * @param {Board} board
 * @param {array<string>} usersIds
 * @param {User} author
 * @return {Promise<[]>}
 */
exports.addMore = async (board, usersIds, author) => {
  const boardTeams = await boardTeamsRepository.findByBoard(board._id, {
    distinct: "team"
  })
  const users = await usersRepository.findByIds(usersIds)

  let order = await membersRepository.findMaxOrder(board._id)

  const created = []
  for (const user of users) {
    // Create member
    order += 1
    let member = new Member(
      user._id,
      board._id,
      user.name || user.email,
      order,
      BoardRole.Member
    )
    member = await membersRepository.create(member)

    // Notify users, that they were added to board
    await notificationManager.createNotification(
      notificationsTypes.boardInvite,
      board,
      user,
      author
    )

    created.push(
      await membersRepository.reload(member, {
        populate: {
          path: MembersModel.ATTR_USER,
          select: [
            "_id",
            UsersModel.ATTR_EMAIL,
            UsersModel.ATTR_NAME,
            UsersModel.ATTR_PHOTO,
            UsersModel.ATTR_ACTIVE
          ]
        }
      })
    )

    // Update existing teams
    const teams = await teamsRepository.find({
      [TeamModel.ATTR_USERS]: user._id,
      _id: { $in: boardTeams }
    })
    for (const team of teams) {
      const boardTeam = await boardTeamsRepository.findByBoardAndTeam(
        board._id,
        team._id
      )
      boardTeam.members.push(member._id)
      await boardTeamsRepository.update(boardTeam)
    }
  }

  return created
}

/**
 * @param {Member} member
 * @return {Promise<any>}
 */
exports.getWithUsers = async (member) => {
  return membersRepository.reload(member, {
    populate: {
      path: MembersModel.ATTR_USER,
      select: [
        "_id",
        UsersModel.ATTR_EMAIL,
        UsersModel.ATTR_NAME,
        UsersModel.ATTR_PHOTO,
        UsersModel.ATTR_ACTIVE
      ]
    }
  })
}
