const moment = require("moment")
const CryptoJS = require("crypto-js")

const assignmentsTypes = require("../../../shared/constants/assignmentTypes")

const boardsRepository = require("../model/repositories/BoardsRepository")
const boardItemsRepository = require("../model/repositories/BoardItemsRepository")
const boardsManager = require("../services/managers/boardsManager")
const teamsManager = require("../services/managers/teamManager")
const ConnectorError = require("../exceptions/ConnectorError")
const Board = require("../model/entities/Board")
const {createApiConnector} = require("../services/external/connectors")
const AppError = require("../exceptions/AppError")
const keys = require("../../config/keys")

const PARAM_BOARD_ID = "identifier"
exports.PARAM_BOARD_ID = PARAM_BOARD_ID

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.getAll = async (req, res) => {
  res.send(await boardsManager.getByUser(req.user, req.query))
}

/**
 * Create board item or copy board items
 * @param {e.Request} req
 * @param {e.Response} res
 * @param next
 * @return {Promise<any>}
 */
exports.createBoardItem = async (req, res, next) => {
  const {sourceFrom, sourceTo, shift} = req.query
  const {board} = res.locals

  // Copy from one place to another
  if (sourceFrom && sourceTo && shift) {
    res.send(await boardsManager.copyItems(board, sourceFrom, sourceTo, shift))
    return
  }

  // Create new from body
  const {member, date, assignments} = req.body
  if (member && date && assignments) {
    res.send(await boardsManager.createBoardItem(board, date, member, assignments, req.user))
    return
  }
  next(new AppError("Invalid board tasks create request"))
}

/**
 * Update board item assignments
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.updateBoardItem = async (req, res) => {
  const {board} = res.locals
  const {user} = req
  const {assignments} = req.body

  res.send(
    await boardsManager.updateBoardItem(board, req.params.id, assignments, user)
  )
}

/**
 * Deletes board items from to
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.deleteBoardItems = async (req, res) => {
  const {board} = res.locals
  const {dateFrom, dateTo} = req.query

  await boardItemsRepository.deleteManyBy(board._id, dateFrom, dateTo)
  res.status(204).send()
}

/**
 * Returns board items from to
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.getBoardItems = async (req, res) => {
  const {board} = res.locals

  const fromDate = req.query.from || moment().format("YYYY-MM-DD")
  const toDate = req.query.to || moment().format("YYYY-MM-DD")

  res.send(await boardItemsRepository.findBy(board._id, fromDate, toDate))
}

/**
 * Returns board assignments
 * @param {e.Request} req
 * @param {e.Response} res
 * @param next
 * @return {Promise<any>}
 */
exports.getBoardAssignments = async (req, res, next) => {
  const {board} = res.locals
  const credentials = await boardsRepository.findCredentials(board, {select: ["apiKey", "url", "type"]})
  const {apiKey, url, type} = credentials
  const {limit, offset, search} = req.query

  const decryptedKey = CryptoJS.AES.decrypt(apiKey, keys.encryptPassphrase).toString(CryptoJS.enc.Utf8)

  const api = createApiConnector(type, url, decryptedKey)

  board.addApiFilter({name: "limit", value: limit})
  board.addApiFilter({name: "offset", value: offset * limit})

  if (board.assignment === assignmentsTypes.projects) {
    const projects = await api.getProjects(board.apiFilters || [], search)
    if (projects === null) {
      return next(new ConnectorError("External API is not responding on list projects call"))
    }
    projects.offset = offset
    return res.send(projects)
  }

  if (board.assignment === assignmentsTypes.issues) {
    const issues = await api.getIssues(board.apiFilters || [], search)
    if (issues === null) {
      return next(new ConnectorError("External API is not responding on list issues call"))
    }
    issues.offset = offset
    return res.send(issues)
  }
  return next(new AppError("Invalid request for tasks list"))
}

/**
 * Returns one single board with credentials
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.getBoard = async (req, res) => {
  const {board} = res.locals
  board.credentials = await boardsRepository.findCredentials(board)
  res.send(board)
}

/**
 * Delete single board
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.deleteBoard = async (req, res) => {
  res.send(await boardsManager.delete(res.locals.board))
}

/**
 * Creates board
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<any>}
 * @param next
 */
exports.createBoard = async (req, res, next) => {
  const {name, identifier, credentials, assignment, priorities, intervals, teams} = req.body

  let board = new Board(name, identifier, credentials, intervals, assignment, priorities)
  board.owner = req.user._id

  try {
    board = await boardsManager.create(board, teams, req.user)
  } catch (err) {
    if (err instanceof ConnectorError) {
      next(new ConnectorError(`External API error: ${err.message}`))
    }
    next(err)
  }
  return res.send(board)
}

/**
 * Updates board
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<any>}
 * @param next
 */
exports.updateBoard = async (req, res, next) => {
  const {board} = res.locals
  const {name, identifier, priorities, teams, hasAvatars, hasInlineEdit, hasEmailNotifications, apiFilters, lastSynchronized} = req.body

  if (name) board.name = name
  if (identifier) board.identifier = identifier
  if (priorities) board.priorities = priorities
  if (teams) board.team = teams
  if (hasAvatars !== undefined) board.hasAvatars = hasAvatars
  if (hasInlineEdit !== undefined) board.hasInlineEdit = hasInlineEdit
  if (hasEmailNotifications !== undefined)
    board.hasEmailNotifications = hasEmailNotifications
  if (apiFilters) board.apiFilters = apiFilters

  if (lastSynchronized) { // import users from external API
    const date = moment(lastSynchronized)
    const previousDate = board.lastSynchronized && moment(board.lastSynchronized)
    if (date && (!previousDate || (date > previousDate))) {

      try {
        await boardsManager.synchronizeUsers(board, req.user)
      } catch (err) {
        if (err instanceof ConnectorError) {
          next(new ConnectorError(`External API error: ${err.message}`))
          return
        }
        next(err)
        return
      }
    }
  }

  let updatedBoard = await boardsRepository.update(board)

  if (teams) {
    updatedBoard = await teamsManager.updateBoardTeams(board, teams)
  }
  updatedBoard.credentials = await boardsRepository.findCredentials(board)

  res.send(updatedBoard)
}
