const { query, param, body } = require("express-validator")

const endpoints = require("../../../shared/api/endpoints")

const Role = require("../../../shared/security/roles")
const BoardRole = require("../../../shared/security/rolesBoard")

const validate = require("../middlewares/validation/validate")
const validateIdentifier = require("../middlewares/validation/items/validateIdentifier")
const validateBoardBody = require("../middlewares/validation/validateBoardBody")
const validateBoardItemBody = require("../middlewares/validation/validateBoardItemBody")
const validateBoardSettingsBody = require("../middlewares/validation/validateBoardSettingsBody")
const validateMemberBody = require("../middlewares/validation/validateMemberBody")
const validateAssignmentsBody = require("../middlewares/validation/validateAssignmentsBody")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const validateSearch = require("../middlewares/validation/validateSearch")

const requireLogin = require("../middlewares/requireLogin")
const requireRoles = require("../middlewares/authorization/requireRoles")
const requireMod = require("../middlewares/authorization/requireMod")
const requireBoardAdmin = require("../middlewares/authorization/requireBoardAdmin")
const requireBoardMembership = require("../middlewares/authorization/requireBoardMembership")
const requireBoard = require("../middlewares/data/requireBoard")

const BoardsController = require("../controllers/boardsController")
const BoardMembersController = require("../controllers/boardMembersController")
const BoardSettingsController = require("../controllers/boardSettingsController")

module.exports = (app) => {
  // Endpoint definitions
  const boardId = ":identifier"
  const urlBoards = endpoints.boards.boards()
  const urlBoard = endpoints.boards.board(boardId)
  const urlBoardSettings = endpoints.boards.settings(boardId, ":date")
  const urlBoardItems = endpoints.boards.items(boardId)
  const urlBoardItem = endpoints.boards.item(boardId, ":id")
  const urlBoardMembers = endpoints.boards.members(boardId)
  const urlBoardMember = endpoints.boards.member(boardId, ":id")
  const urlBoardAssignments = endpoints.boards.assignments(boardId)

  // Boards
  app.get(
    urlBoards,
    requireLogin,
    ...validate(
      validatePaginate(),
      validateSearch()
    ),
    BoardsController.getAll
  )
  app.post(
    urlBoards,
    requireMod,
    ...validate(
      validateBoardBody(false)
    ),
    BoardsController.createBoard
  )
  app.get(
    urlBoard,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    BoardsController.getBoard
  )

  app.patch(
    urlBoard,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      validateBoardBody(true)
    ),
    BoardsController.updateBoard
  )
  app.delete(
    urlBoard,
    requireLogin,
    requireBoard(),
    requireRoles([Role.Admin, Role.Mod], [BoardRole.Owner]),
    ...validate(
      validateIdentifier()
    ),
    BoardsController.deleteBoard
  )

  // Board settings
  app.get(
    urlBoardSettings,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    BoardSettingsController.get
  )

  app.delete(
    urlBoardSettings,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("date", "Invalid settings date given").isISO8601()
    ),
    BoardSettingsController.delete
  )

  app.put(
    urlBoardSettings,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("date", "Invalid settings date given").isISO8601(),
      validateBoardSettingsBody
    ),
    BoardSettingsController.update
  )

  // Items
  app.get(
    urlBoardItems,
    requireBoardMembership(),
    ...validate(
      validateIdentifier(),
      query("from").optional().isISO8601(),
      query("to").optional().isISO8601()
    ),
    BoardsController.getBoardItems
  )
  app.post(
    urlBoardItems,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      query("sourceFrom").optional().isISO8601(),
      query("sourceTo").optional().isISO8601(),
      query("shift").optional().isInt().toInt(),
      validateBoardItemBody(false)
    ),
    BoardsController.createBoardItem
  )
  app.delete(
    urlBoardItems,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      query("dateFrom").exists().isISO8601(),
      query("dateTo").exists().isISO8601()
    ),
    BoardsController.deleteBoardItems
  )
  app.put(
    urlBoardItem,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("id", "Invalid item id given").isMongoId().exists(),
      validateAssignmentsBody()
    ),
    BoardsController.updateBoardItem
  )

  // Assignments
  app.get(
    urlBoardAssignments,
    requireBoardMembership(),
    ...validate(
      validateIdentifier(),
      validatePaginate(),
      validateSearch()
    ),
    BoardsController.getBoardAssignments
  )

  // Members
  app.get(
    urlBoardMembers,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    BoardMembersController.getAll
  )
  app.put(
    urlBoardMembers,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      body().isArray(),
      validateMemberBody.arrayValidator
    ),
    BoardMembersController.replaceAll
  )
  app.post(urlBoardMembers,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier()
    ),
    BoardMembersController.addAll
  )
  app.delete(
    urlBoardMember,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("id", "Invalid member id given").isMongoId().exists()
    ),
    BoardMembersController.delete
  )
  app.patch(
    urlBoardMember,
    requireBoardAdmin(),
    ...validate(
      param("id", "Invalid member id given").isMongoId().exists(),
      validateIdentifier(),
      validateMemberBody.bodyValidator
    ),
    BoardMembersController.update
  )
}
