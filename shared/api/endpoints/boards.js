const {URL_API_NAMESPACE} = require('../../constants/http')

const URL_BOARDS = URL_API_NAMESPACE + '/boards'

const URL_SETTINGS = '/settings'
const URL_ITEMS =       '/items'
const URL_ASSIGNMENTS = '/assignments'
const URL_MEMBERS =     '/members'

const boards = () => URL_BOARDS
const board = (identifier) => boards() + '/' + identifier
const settings = (identifier, date) => board(identifier) + URL_SETTINGS + '/' + date
const items = (identifier) => board(identifier) + URL_ITEMS
const item = (identifier, id) => items(identifier) + '/' + id
const assignments = (identifier) => board(identifier) + URL_ASSIGNMENTS
const members = (identifier) => board(identifier) + URL_MEMBERS
const member = (identifier, id) => members(identifier) + '/' + id

module.exports = {
    boards,
    board,
    settings,
    items,
    item,
    assignments,
    members,
    member
}
