const {query, param, body} = require("express-validator")

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
  const urlBoards = endpoints.boards.boards()
  const urlBoard = endpoints.boards.board(":identifier")
  const urlBoardSettings = endpoints.boards.settings(":identifier", ":date")
  const urlBoardItems = endpoints.boards.items(":identifier")
  const urlBoardItem = endpoints.boards.item(":identifier", ":id")
  const urlBoardMembers = endpoints.boards.members(":identifier")
  const urlBoardMember = endpoints.boards.member(":identifier", ":id")
  const urlBoardAssignments = endpoints.boards.assignments(":identifier")

  // Boards
  /**
   * @api {get} /api/boards List boards
   * @apiGroup Boards
   * @apiParam (query) {Number} [limit=25]      Limit of returned records.
   * @apiParam (query) {Number} [offset=0]      Actual page of viewed records.
   * @apiParam (query) {String} [search]        Searches boards identifiers and names.
   *
   * @apiSuccess {Number} limit Number of returned records.
   * @apiSuccess {Number} offset Page of returned records.
   * @apiSuccess {array} data List of boards.
   * @apiSuccess {Number} count Count of all records for given parameters.
   * @apiSuccessExample {json} Success-Response:
   *      {
   *      "data":[
   *        {
   *          "_id":"2b54d9a0b64c3bba192ae5bb",
   *          "name":"Week issues",
   *          "identifier":"week-issues-table",
   *          "priorities":4,
   *          "credentials":{
   *            "_id":"512f916cb2f221c27541534b",
   *            "type":"redmine"
   *           },
   *           "intervals":"weeks",
   *           "assignment":"issues",
   *           "owner":"d9d19011a8230a3a566d9da1"
   *        }
   *      ],
   *      "count":1,
   *      "limit":25,
   *      "offset":0
   *      }
   * @apiDescription Returns all boards for logged user from database.
   */
  app.get(
    urlBoards,
    requireLogin,
    ...validate(
      validatePaginate(),
      validateSearch()
    ),
    BoardsController.getAll
  )

  /**
   * @api {post} /api/boards Create new board
   * @apiGroup Boards
   * @apiParam (body) {String} name       Title of the board
   * @apiParam (body) {String} identifier   Unique identifier
   * @apiParam (body) {String} credentials  Credentials id to external application
   * @apiParam (body) {String} assignment   Types of assignment (projects, issues)
   * @apiParam (body) {String} intervals    Interval size (month, days, weeks)
   * @apiParam (body) {String} priorities   How many priorities use on board
   * @apiParam (body) {array} teams         List of team ids that can be used on board.
   * @apiDescription Creates new board and returns it.
   */
  app.post(
    urlBoards,
    requireMod,
    ...validate(
      validateBoardBody(false)
    ),
    BoardsController.createBoard
  )

  /**
   * @api {get} /api/boards/:identifier Get single board
   * @apiGroup Boards
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiDescription Returns single board with given identifier.
   */
  app.get(
    urlBoard,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    BoardsController.getBoard
  )

  /**
   * @api {patch} /api/boards/:identifier Update parts of board
   * @apiGroup Boards
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiParam (body) {String} [name]         Title of the board
   * @apiParam (body) {String} [identifier]   Unique identifier
   * @apiParam (body) {String} [priorities]   How many priorities use on board
   * @apiParam (body) {array} [teams]         List of team ids that can be used on board
   * @apiDescription Updates existing board and returns it.
   */
  app.patch(
    urlBoard,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      validateBoardBody(true)
    ),
    BoardsController.updateBoard
  )

  /**
   * @api {delete} /api/boards/:identifier Delete board
   * @apiGroup Boards
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiDescription Deletes existing board and returns it.
   */
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
  /**
   * @api {get} /api/boards/:identifier/settings/:date Get settings
   * @apiGroup Board
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiParam (url) {String} date            Date in ISO8601 format
   * @apiDescription Returns existing settings for given date.
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "_id":"5fef20c1fbebda588c2ceb81",
   *    "board":"2b54d9a0b64c3bba192ae5bb",
   *    "date":"2020-12-28T00:00:00.000Z",
   *    "priorities":2,
   *    "deactivated":[],
   * }
   */
  app.get(
    urlBoardSettings,
    requireBoardMembership(),
    ...validate(
      validateIdentifier(),
      param("date", "Invalid settings date given").isISO8601()
    ),
    BoardSettingsController.get
  )
  /**
   * @api {delete} /api/boards/:identifier/settings/:date Delete settings
   * @apiGroup Board
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiParam (url) {String} date            Date in ISO8601 format
   * @apiDescription Deletes existing board settings for given date and returns them.
   */
  app.delete(
    urlBoardSettings,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("date", "Invalid settings date given").isISO8601()
    ),
    BoardSettingsController.delete
  )

  /**
   * @api {put} /api/boards/:identifier/settings/:date Replaces settings
   * @apiGroup Board
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiParam (url) {String} date            Date in ISO8601 format
   *
   * @apiParam (body) {String} priorities   Actual priorities on board for given date
   * @apiParam (body) {array}  deactivated  List of deactivated users (id strings)
   * @apiDescription Replaces settings for given date and returns them.
   */
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
  /**
   * @api {get} /api/boards/:identifier/items?from=:from&to=:to Get items
   * @apiGroup Board
   * @apiParam (url) {String} identifier      Identifier of the board
   * @apiParam (query) {String} from          Date in ISO8601 format
   * @apiParam (query) {String} to            Date in ISO8601 format
   * @apiDescription Returns existing items in given interval.
   * @apiSuccessExample {json} Success-Response:
   *  [
   *  {
   *     "_id":"5fef22ff22f88b0c1022fc47",
   *     "board":"2b54d9a0b64c3bba192ae5bb",
   *     "date":"2020-12-28T00:00:00.000Z",
   *     "member":"45b5efa9c0324f2d3e8d7de5",
   *     "assignments":[
   *        {
   *           "_id":"5fef22ff22f88b0c1022fc48",
   *           "id":"54371",
   *           "title":"UI design",
   *           "url":"https://redmine.example.org/issues/1",
   *           "type":"issues",
   *           "priority":1,
   *        },
   *     ],
   *  }
   *  ]
   */
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

  /**
   * @api {post} /api/boards/:identifier/items Create or copy items
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (query) {String} [sourceFrom]    Date in ISO8601 format
   * @apiParam (query) {String} [sourceTo]      Date in ISO8601 format
   * @apiParam (query) {Number} [shift]         How many days will be shifted (negative number for pasting backwards)
   *
   * @apiParam (body) {String} [member]         Member id
   * @apiParam (body) {String} [date]           Date in ISO8601 format
   * @apiParam (body) {array} [assignments]     Array of task objects.
   *
   * @apiDescription Creates new item or copies existing items from one interval to another.  If sourceFrom,
   * sourceTo and shift are given, endpoint do copying. If they are not given, app tries to create new item from given body.
   * Returns new board item or array of copied items.
   */
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

  /**
   * @api {delete} /api/boards/:identifier/items?dateFrom=:dateFrom&dateTo=:dateTo Delete items
   * @apiGroup Board
   * @apiParam (query) {String} [dateFrom]    Date in ISO8601 format
   * @apiParam (query) {String} [dateTo]      Date in ISO8601 format
   *
   * @apiDescription Deletes all items of board in interval given by parameters dateFrom and dateTo.
   */
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

  /**
   * @api {put} /api/boards/:identifier/items/:id Replace item
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (url) {String} id                Id of the board item
   *
   * @apiParam (body) {String} member         Member id
   * @apiParam (body) {String} date          Date in ISO8601 format
   * @apiParam (body) {array}  assignments     Array of task objects.
   *
   * @apiDescription Replaces specific board item with given values
   */
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
  /**
   * @api {get} /api/boards/:identifier/assignments List possible tasks
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   *
   * @apiParam (query) {Number} [limit=25]      Limit of returned records.
   * @apiParam (query) {Number} [offset=0]      Actual page of viewed records.
   * @apiParam (query) {String} [search]        Searches issues or project titles.
   *
   * @apiDescription Returns all tasks (projects or issues) that can be assigned to board members.
   */
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
  /**
   * @api {get} /api/boards/:identifier/members List members
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   *
   * @apiDescription Returns all members of given board.
   */
  app.get(
    urlBoardMembers,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    BoardMembersController.getAll
  )

  /**
   * @api {put} /api/boards/:identifier/members Replace members
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (body) {array} body              Array of member objects.
   *
   * @apiDescription Replaces all members and returns them.
   */
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


  /**
   * @api {post} /api/boards/:identifier/members Create new members.
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (body) {array} body              Array of user ids.
   *
   * @apiDescription Create new members from users ids to given board and returns new members.
   */
  app.post(urlBoardMembers,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier()
    ),
    BoardMembersController.addAll
  )

  /**
   * @api {delete} /api/boards/:identifier/members/:id Delete member
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (url) {String} id                Id of board member
   *
   * @apiDescription Delete user from board and return its deleted member object.
   */
  app.delete(
    urlBoardMember,
    requireBoardAdmin(),
    ...validate(
      validateIdentifier(),
      param("id", "Invalid member id given").isMongoId().exists()
    ),
    BoardMembersController.delete
  )

  /**
   * @api {patch} /api/boards/:identifier/members/:id Update member
   * @apiGroup Board
   * @apiParam (url) {String} identifier        Identifier of the board
   * @apiParam (url) {String} id                Id of board member
   * @apiParam (body) {String} [nickname]       Nickname of member on board
   * @apiParam (body) {String} [role]           New role of the member (need owner access)
   * @apiDescription Updates member of the board and returns its new interpretation.
   */
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
