const endpoints = require("../../../shared/api/endpoints")

const validate = require("../middlewares/validation/validate")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const validateSearch = require("../middlewares/validation/validateSearch")
const validateSort = require("../middlewares/validation/validateSort")
const validateTeamBody = require("../middlewares/validation/validateTeamBody")
const validateIdentifier = require("../middlewares/validation/items/validateIdentifier")

const requireTeam = require("../middlewares/data/requireTeam")
const requireLogin = require("../middlewares/requireLogin")
const requireMod = require("../middlewares/authorization/requireMod")
const requireBoardAdmin = require("../middlewares/authorization/requireBoardAdmin")
const requireBoardMembership = require("../middlewares/authorization/requireBoardMembership")

const TeamsController = require("../controllers/teamsController")

module.exports = (app) => {
  // Endpoint definitions
  const teamIdParam = ":identifier"
  const urlTeams = endpoints.teams.teams()
  const urlTeam = endpoints.teams.team(teamIdParam)
  const urlTeamMembers = endpoints.teams.members(teamIdParam)
  const urlBoardTeams = endpoints.teams.boardTeams(":identifier")
  const urlBoardTeamMembers = endpoints.teams.boardTeamMembers(
    ":boardIdentifier",
    ":teamIdentifier"
  )

  // Teams
  /**
   * @api {get} /api/teams List teams
   * @apiGroup Teams
   * @apiParam (query) {Number} [limit=10]      Limit of returned records.
   * @apiParam (query) {Number} [offset=0]      Actual page of viewed records.
   * @apiParam (query) {String} [search]        Searches teams names, colors and identifiers.
   * @apiParam (query) {String} [sort]          Sort by name, identifier or color.
   *
   * @apiSuccess {Number} limit Number of returned records.
   * @apiSuccess {Number} offset Page of returned records.
   * @apiSuccess {array} data List of teams.
   * @apiSuccess {Number} count Count of all records for given parameters.
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "data":[
   *  {
   *        "_id":"512f916cb2f221c27541534b",
   *        "name":"Test Team",
   *        "identifier":"test-team",
   *        "color":"white",
   *     }
   *  ],
   *  "limit":25,
   *  "offset":0,
   *  "count":1
   * }
   * @apiDescription Returns paginate of all teams from database for given parameters.
   */
  app.get(
    urlTeams,
    requireLogin,
    ...validate(
    validatePaginate(),
    validateSort(),
    validateSearch()
    ),
    TeamsController.getAll
  )

  /**
   * @api {get} /api/teams/:identifier Get single team
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of team
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *        "_id":"512f916cb2f221c27541534b",
   *        "name":"Test Team",
   *        "identifier":"test-team",
   *        "color":"white",
   * }
   * @apiDescription Returns single team by given identifier.
   */
  app.get(
    urlTeam,
    requireLogin,
    requireTeam(),
    TeamsController.get
  )

  /**
   * @api {post} /api/teams Create team
   * @apiGroup Teams
   * @apiParam (body) {String} name            Name of the team.
   * @apiParam (body) {String} identifier      Unique identifier.
   * @apiParam (body) {String} color           Name of the team color.
   *
   * @apiDescription Creates new team with no member. Returns created team.
   */
  app.post(
    urlTeams,
    requireMod,
    ...validate(
      validateTeamBody(false),
    ),
    TeamsController.create
  )

  /**
   * @api {delete} /api/teams/:identifier Delete team
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of team
   *
   * @apiDescription Deletes specified team from board with all its members.
   */
  app.delete(urlTeam, requireMod, requireTeam(), TeamsController.delete)
  app.patch(
    urlTeam,
    requireTeam(),
    requireMod,
    ...validate(
      validateIdentifier(),
      validateTeamBody(true)
    ),
    TeamsController.update
  )

  // Team members
  /**
   * @api {get} /api/teams/:identifier/members List team members
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of the team
   *
   * @apiDescription Returns members for given team
   */
  app.get(
    urlTeamMembers,
    requireLogin,
    ...validate(
      validateIdentifier()
    ),
    requireTeam(),
    TeamsController.getMembers
  )
  /**
   * @api {put} /api/teams/:identifier/members Replace team members
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of the team.
   * @apiParam (body) {Array} body            Collection of user ids that should be in team.
   *
   * @apiDescription Returns members for given team
   */
  app.put(
    urlTeamMembers,
    requireMod,
    ...validate(
      validateIdentifier()
    ),
    requireTeam(),
    TeamsController.updateMembers
  )

  // Board teams
  /**
   * @api {get} /api/boards/:identifier/teams List board teams
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of the board.
   *
   * @apiDescription Returns all teams that are on specified board.
   */
  app.get(
    urlBoardTeams,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    TeamsController.getByBoard
  )

  // Update members of board team
  /**
   * @api {put} /api/boards/:boardIdentifier/teams/:teamIdentifier/members Replace board team members
   * @apiGroup Teams
   * @apiParam (url) {String} identifier      Identifier of the board.
   * @apiParam (body) {Array} members         Collection of member ids that should be in team
   *
   * @apiDescription Replaces members of the actual board.
   */
  app.put(
    urlBoardTeamMembers,
    requireBoardAdmin("boardIdentifier"),
    ...validate(
      validateIdentifier("boardIdentifier"),
      validateIdentifier("teamIdentifier")
    ),
    requireTeam("teamIdentifier"),
    TeamsController.updateBoardTeamMembers
  )
}
