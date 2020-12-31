const moment = require("moment")
const CryptoJS = require("crypto-js")

const Role = require("../../../../shared/security/roles")
const BoardRole = require("../../../../shared/security/rolesBoard")
const notificationsTypes = require("../../../../shared/constants/notificationTypes")
const keys = require("../../../config/keys")

const boardsRepository = require("../../model/repositories/BoardsRepository")
const boardItemsRepository = require("../../model/repositories/BoardItemsRepository")
const boardTeamsRepository = require("../../model/repositories/BoardTeamsRepository")
const membersRepository = require("../../model/repositories/MemberRepository")
const boardSettingsRepository = require("../../model/repositories/BoardSettingsRepository")
const usersRepository = require("../../model/repositories/UserRepository")
const credentialsRepository = require("../../model/repositories/CredentialsRepository")
const teamRepository = require("../../model/repositories/TeamsRepository")
const Member = require("../../model/entities/Member")
const BoardTeam = require("../../model/entities/BoardTeam")
const BoardItem = require("../../model/entities/BoardItem")

const teamManager = require("./teamManager")
const usersManager = require("./userManager")
const notificationManager = require("./notificationManager")
const { createApiConnector } = require("../external/connectors")
const ConnectorError = require("../../exceptions/ConnectorError")

/**
 * @param {User} user
 * @param search
 * @param limit
 * @param offset
 * @return {Promise<any>}
 */
exports.getByUser = async (user, { search, limit, offset }) => {
  const searchProps = {
    limit,
    offset: (offset) * limit,
    populate: {
      path: "credentials",
      select: ["type"]
    }
  }
  const searchQuery = search ? {
    $or: [
      { name: new RegExp(search, "i") },
      { identifier: new RegExp(search, "i") }
    ]
  } : {}

  let count
  let boards
  if (user.role === Role.Admin || user.role === Role.Mod) {
    // Mod or admin, return all
    boards = await boardsRepository.find(searchQuery, searchProps)
    count = await boardsRepository.find(searchQuery, { count: true })
  } else {
    // Return only boards that have user as member
    const boardIds = await membersRepository.findBy(null, [user._id], {
      distinct: "board"
    })
    count = boardIds.length
    boards = await boardsRepository.find({ _id: { $in: boardIds } }, searchProps)
  }

  return { data: boards, count, limit, offset }
}

/**
 * @param {Board} board
 * @param {string} dateFrom
 * @param {string} dateTo
 * @param {int} shift
 * @return {Promise<any>}
 */
exports.copyItems = async (board, dateFrom, dateTo, shift) => {
  const items = await boardItemsRepository.findBy(board._id, dateFrom, dateTo,
    {
      projection: { _id: false },
      lean: true
    }
  )
  // Create duplicates with new dates
  for (let i = 0; i < items.length; i += 1) {
    const date = moment(items[i].date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

    if (shift < 0) {
      // New date is in past
      date.subtract(Math.abs(shift), "days")
    } else {
      // New date is in future
      date.add(shift, "days")
    }
    items[i].date = new Date(`${date.format("YYYY-MM-DD")}T00:00:00.000Z`)
  }
  await boardItemsRepository.createMany(items)
  return items
}

exports.delete = async (board) => {
  await Promise.all([
    membersRepository.deleteMany({ board: board._id }),
    boardItemsRepository.deleteMany({ board: board._id }),
    boardTeamsRepository.deleteMany({ board: board._id }),
    boardSettingsRepository.deleteMany({ board: board._id })
  ])
  return boardsRepository.remove(board)
}

/**
 * @param {Board} board
 * @param {string} boardItemId
 * @param {array<Assignment>} assignments
 * @param {User} user
 * @return {Promise<any>}
 */
exports.updateBoardItem = async (board, boardItemId, assignments, user) => {
  assignments.sort((x, y) => {
    return x.priority < y.priority ? -1 : 1
  })

  const item = await boardItemsRepository.findById(boardItemId)

  for (const task of assignments) {
    const existing = item.assignments.find((a) => a.priority === task.priority)

    const member = await membersRepository.findById(item.member, {
      populate: "user"
    })

    if (!existing || existing.id !== task.id) {
      await notificationManager.createNotification(
        notificationsTypes.task,
        board,
        member.user,
        user,
        {
          assignment: task,
          oldAssignment: existing,
          date: item.date
        }
      )
    }
  }

  item.assignments = assignments
  await boardItemsRepository.update(item)

  return item
}

/**
 * @param {Board} board
 * @param {array<string>} teams
 * @param {User} owner
 * @return {Promise<any>}
 */
exports.create = async (board, teams, owner) => {
  const credentials = await credentialsRepository.findById(board.credentials)

  const encryptedKey = CryptoJS.AES.decrypt(credentials.apiKey, keys.encryptPassphrase)
    .toString(CryptoJS.enc.Utf8)

  // Create external api
  const api = createApiConnector(
    credentials.type,
    credentials.url,
    encryptedKey
  )
  if (!api || !(await api.tryAccess())) {
    throw new ConnectorError(
      "Board creation failed: Credentials are invalid or external API is not available."
    )
  }

  const created = await boardsRepository.create(board)

  // Create owner
  let member = new Member(
    owner._id,
    created._id,
    owner.name,
    1,
    BoardRole.Owner
  )
  member = await membersRepository.create(member)

  // Create board teams and its members
  if (teams) {
    const dbTeams = await teamRepository.findByIds(teams)

    let i = 1
    for (const team of dbTeams) {
      const teamMembers = []

      if (team.users.includes(owner._id)) {
        teamMembers.push(member._id)
      }

      const boardTeam = new BoardTeam(team._id, teamMembers, created._id, i)
      i += 1

      await boardTeamsRepository.create(boardTeam)
    }
  }

  created.credentials = credentials
  return created
}

/**
 * @param {Board} board
 * @param {moment} date
 * @param {ObjectId|string} memberId
 * @param {array<object>} assignments
 * @param {User} author
 * @return {Promise<any>}
 */
exports.createBoardItem = async (board, date, memberId, assignments, author) => {
  const item = await boardItemsRepository.create(
    new BoardItem(board._id, date, memberId, assignments)
  )

  const member = await membersRepository.findById(item.member, {
    populate: "user"
  })

  for (const assignment of assignments) {
    await notificationManager.createNotification(
      notificationsTypes.task,
      board,
      member.user,
      author,
      { assignment, date }
    )
  }
  return item
}

/**
 * @param {Board} board
 * @param {Author} author
 * @return {Promise<null | any>}
 */
exports.synchronizeUsers = async (board, author) => {
  const credentials = await credentialsRepository.findById(board.credentials)

  const encryptedKey = CryptoJS.AES.decrypt(credentials.apiKey, keys.encryptPassphrase)
    .toString(CryptoJS.enc.Utf8)

  // Create external api
  const api = createApiConnector(
    credentials.type,
    credentials.url,
    encryptedKey
  )
  if (!api || !(await api.tryAccess())) {
    throw new ConnectorError(
      "Synchronization failed: Credentials are invalid or external API is not available."
    )
  }

  const limit = 10
  let offset = 0
  let users = null
  let i = (await membersRepository.findMaxOrder(board._id)) + 1

  do {
    users = await api.getUsers(offset, limit) // Got users

    for (const member of users) {
      let user = await usersRepository.findByEmail(member.email)
      if (!user) { // User doest exists, create him
        user = await usersManager.create(member.name, member.email, Role.User)
      }
      let memberEntity = await membersRepository.findBy(board._id, user._id, { one: true })

      if (!memberEntity) { // Ad new member
        memberEntity = new Member(user._id, board._id, member.name, i, BoardRole.Member)
        i += 1
        // Notify users, that they were added to board
        await notificationManager.createNotification(notificationsTypes.boardInvite, board, user, author)
      }
    }
    offset += limit

  } while(users?.users?.length)

  const hasTeams = await boardTeamsRepository.findByBoard(board._id, { count: true })
  if (hasTeams) {
    // Synchronize team members for board at the end of this cycle
    await teamManager.synchronizeBoardTeamMembers(board)
  }
  board.lastSynchronized = moment()
  return boardsRepository.update(board)
}
