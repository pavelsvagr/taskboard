const {URL_API_NAMESPACE} = require('../../constants/http')
const boards = require('./boards')

const users = () => `${URL_API_NAMESPACE}/users`
const user = (id) => `${users()}/${id}`

const teams = () => `${URL_API_NAMESPACE}/teams`
const team = (identifier) => `${teams()}/${identifier}`

const members = (identifier) => `${team(identifier)}/members`

const boardTeams = (boardIdentifier) => `${boards.board(boardIdentifier)}/teams`
const boardTeamMembers = (boardIdentifier, teamIdentifier) => `${boardTeams(boardIdentifier, teamIdentifier)}/${teamIdentifier}/members`

module.exports = {
  teams,
  users,
  user,
  team,
  members,
  boardTeams,
  boardTeamMembers
}