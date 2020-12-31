const teamsRepository = require("../../model/repositories/TeamsRepository")
const boardTeamsRepository = require("../../model/repositories/BoardTeamsRepository")
const memberRepository = require("../../model/repositories/MemberRepository")
const boardsRepository = require("../../model/repositories/BoardsRepository")

const BoardTeam = require("../../model/entities/BoardTeam")

/**
 * Retruns all teams by given parameters
 * @returns {Promise<any>}
 */
exports.getAll = async ({limit, offset, search, sort}) => {
  const searchProps = {
    limit,
    offset: (offset) * limit,
    sort
  }
  const searchQuery = search ? {
    $or: [
      { name: new RegExp(search, "i") },
      { identifier: new RegExp(search, "i") },
      { color: new RegExp(search, "i") }
    ]
  } : {}

  const count = await teamsRepository.find(searchQuery, { count: true })
  const users = await teamsRepository.find(searchQuery, searchProps)

  return { data: users, limit, offset, count, sort }
}

/**
 * Returns teams showed on board
 * @param identifier
 * @returns {Promise<any>}
 */
exports.get = async (identifier) => teamsRepository.findByIdentifier(identifier)

/**
 * Returns all board members
 * @param {Team} team
 * @returns {Promise<any>}
 */
exports.getMembers = async (team) => teamsRepository.findTeamMembers(team)

/**
 * Returns all teams showed on board
 * @param {Board} board
 * @returns {Promise<[]>}
 */
exports.getBoardTeams = async (board) => {
  const boardTeams = await boardTeamsRepository.findByBoard(board._id)
  const teams = []

  for (const boardTeam of boardTeams) {
    // Create teams in structure like Team, but members are members of board not users
    const { team } = boardTeam
    team.members = boardTeam.members.map((m) => m._id)
    teams.push(team)
  }
  return teams
}

/**
 * Synchronize team and board team members
 * @param {Board} board
 * @returns {Promise<any>}
 */
const synchronizeBoardTeamMembers = async (board) => {
  const boardTeams = await boardTeamsRepository.findByBoard(board._id, { populateUsers: true })

  for (const boardTeam of boardTeams) {
    const foundMembers = await memberRepository.findBy(boardTeam.board, boardTeam.team.users, { distinct: "_id" })
    await boardTeamsRepository.update(boardTeam, { members: foundMembers })
  }

  return board
}

exports.synchronizeBoardTeamMembers = synchronizeBoardTeamMembers

/**
 * Updates members of board team
 * @param {Board} board
 * @param {Team} team
 * @param {array<string>} members
 * @returns {Promise<any>}
 */
exports.updateBoardTeamMembers = async (board, team, members) => {
  const boardTeam = await boardTeamsRepository.findByBoardAndTeam(
    board._id,
    team._id
  )
  boardTeam.members = members
  const updated = await boardTeamsRepository.update(boardTeam)
  return updated.members
}

/**
 * Deletes existing team
 * @param {Team} team
 * @returns {Promise<any>}
 */
exports.delete = async (team) => {
  await boardTeamsRepository.deleteMany({ team: team._id })
  return teamsRepository.remove(team)
}

/**
 * Creates new team
 * @param {Team} team
 * @returns {Promise<any>}
 */
exports.create = async (team) => {
  return teamsRepository.create(team)
}
/**
 * Updates team
 * @param {Team} team
 * @returns {Promise<any>}
 */
exports.updateTeam = async (team) => teamsRepository.update(team)

/**
 * Updates board teams
 * @param {Board} board
 * @param {Team} teams
 * @returns {Promise<*>}
 */
exports.updateBoardTeams = async (board, teams) => {
  const promises = []
  const boardTeams = (await boardTeamsRepository.findByBoard(board._id)) || []
  const notExisting = {}
  const order = {}
  let i = 1
  for (const team of teams) {
    order[team] = i
    notExisting[team] = team
    i += 1
  }

  const toDelete = []
  const toCheck = []
  for (const boardTeam of boardTeams) {
    if (notExisting[boardTeam.team._id.toString()]) {
      toCheck.push(boardTeam)
      delete notExisting[boardTeam.team._id.toString()]
    } else {
      toDelete.push(boardTeam._id.toString())
    }
  }

  await boardTeamsRepository.deleteMany({ _id: { $in: toDelete } })

  for (const boardTeam of toCheck) {
    const newOrder = order[boardTeam.team._id]
    if (boardTeam.order !== newOrder) {
      promises.push(boardTeamsRepository.update(boardTeam, { order: newOrder }))
    }
  }

  const toCreate = Object.values(notExisting)
  for (const team of toCreate) {
    const boardTeam = new BoardTeam(team, [], board._id, order[team])
    promises.push(boardTeamsRepository.create(boardTeam))
  }
  await Promise.all(promises)

  board.teams = teams
  const updatedBoard = await boardsRepository.update(board)

  if (toCreate.length) {
    await synchronizeBoardTeamMembers(updatedBoard)
  }

  return updatedBoard
}

/**
 *
 * @param {Team} team
 * @param {array<string>} members
 * @returns {Promise<*>}
 */
exports.updateTeamMembers = async (team, members) => {
  team.users = members
  await teamsRepository.update(team)

  // Update all boardTeams
  const boardTeams = await boardTeamsRepository.findByTeam(team.id)

  for (const boardTeam of boardTeams) {
    boardTeam.members = await memberRepository.findBy(
      boardTeam.board,
      members,
      { distinct: "_id" }
    )
    await boardTeamsRepository.update(boardTeam)
  }

  return team
}
