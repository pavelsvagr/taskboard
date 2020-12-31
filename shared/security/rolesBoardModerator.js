const Role = require('./roles')
const BoardRole = require('./rolesBoard')

module.exports = {
    global: [Role.Admin, Role.Mod],
    board: [BoardRole.Owner, BoardRole.Mod]
}