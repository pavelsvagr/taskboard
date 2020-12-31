const {URL_API_NAMESPACE} = require('../../constants/http')
const boards = require('./boards')

const URL_TEAMS = '/teams'
const URL_MEMBERS = '/members'
const URL_USERS = '/users'

const users = () => URL_API_NAMESPACE + URL_USERS
const user = (id) => URL_API_NAMESPACE + URL_USERS + '/' + id
const teams = () =>  URL_API_NAMESPACE + URL_TEAMS
const team = (identifier) => teams() + '/' + identifier
const members = (identifier) => team(identifier) + URL_MEMBERS
const boardTeams = (boardIdentifier) => boards.board(boardIdentifier) + URL_TEAMS
const boardTeamMembers = (boardIdentifier, teamIdentifier) => {
    return boardTeams(boardIdentifier, teamIdentifier) + '/' + teamIdentifier + URL_MEMBERS
}

module.exports = {
    teams,
    users,
    user,
    team,
    members,
    boardTeams,
    boardTeamMembers
}