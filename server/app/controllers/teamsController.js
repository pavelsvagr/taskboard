const teamManager = require("../services/managers/teamManager")

const Team = require("../model/entities/Team")

const PARAM_TEAM_ID = "identifier"
exports.PARAM_TEAM_ID = PARAM_TEAM_ID

/**
 * Searches for given teams
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  const teams = await teamManager.getAll(req.query)
  res.send(teams)
}

/**
 * Returns single team
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.get = async (req, res) => {
  const { team } = res.locals
  res.send(team)
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.getMembers = async (req, res) => {
  const { team } = res.locals
  const members = await teamManager.getMembers(team)
  res.send(members)
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.getByBoard = async (req, res) => {
  const { board } = res.locals

  const teams = await teamManager.getBoardTeams(board)
  res.send(teams)
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<*>}
 */
exports.updateBoardTeamMembers = async (req, res) => {
  const members = req.body
  const { board, team } = res.locals

  return res.send(
    await teamManager.updateBoardTeamMembers(board, team, members)
  )
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.delete = async (req, res) => {
  const { team } = res.locals
  await teamManager.delete(team)
  res.send(team)
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  const { name, identifier, color } = req.body

  let team = new Team(name, identifier, color)
  team = await teamManager.create(team)

  res.send(team)
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.updateMembers = async (req, res) => {
  const { team } = res.locals
  const members = req.body

  const newTeam = await teamManager.updateTeamMembers(team, members)
  res.send(await teamManager.getMembers(newTeam))
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  const { team } = res.locals
  const { name, identifier, color } = req.body

  if (name) {
    team.name = name
  }
  if (identifier) {
    team.identifier = identifier
  }
  if (color) {
    team.color = color
  }
  const updated = await teamManager.updateTeam(team)

  res.send(updated)
}
