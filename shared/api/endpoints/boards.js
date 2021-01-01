const {URL_API_NAMESPACE} = require('../../constants/http')

const boards = () => `${URL_API_NAMESPACE}/boards`
const board = (identifier) => `${boards()}/${identifier}`

const settings = (identifier, date) => `${board(identifier)}/settings/${date}`

const items = (identifier) => `${board(identifier)}/items`
const item = (identifier, id) => `${items(identifier)}/${id}`

const assignments = (identifier) => `${board(identifier)}/assignments`

const members = (identifier) => `${board(identifier)}/members`
const member = (identifier, id) => `${members(identifier)}/${id}`

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
