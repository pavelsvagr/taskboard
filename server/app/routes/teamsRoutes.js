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

  app.get(
    urlTeam,
    requireLogin,
    requireTeam(),
    TeamsController.get
  )

  app.post(
    urlTeams,
    requireMod,
    ...validate(
      validateTeamBody(false),
    ),
    TeamsController.create
  )

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
  app.get(
    urlTeamMembers,
    requireLogin,
    ...validate(
      validateIdentifier()
    ),
    requireTeam(),
    TeamsController.getMembers
  )
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
  app.get(
    urlBoardTeams,
    requireBoardMembership(),
    ...validate(
      validateIdentifier()
    ),
    TeamsController.getByBoard
  )

  // Update members of board team
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
