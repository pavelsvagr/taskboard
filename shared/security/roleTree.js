const Roles = require('./roles')
const RolesBoard = require('./rolesBoard')

module.exports.higherRoleBoard = (role) => {
  switch (role) {
    case RolesBoard.Mod:
      return RolesBoard.Owner
    case RolesBoard.Member:
      return RolesBoard.Mod
    default:
      return null
  }
}

module.exports.lowerRoleBoard = (role) => {
  switch (role) {
    case RolesBoard.Mod:
      return RolesBoard.Member
    case RolesBoard.Owner:
      return RolesBoard.Mod
    default:
      return null
  }
}

module.exports.higherRole = (role) => {
  switch (role) {
    case Roles.Mod:
      return Roles.Admin
    case Roles.User:
      return Roles.Mod
    default:
      return null
  }
}

module.exports.lowerRole = (role) => {
  switch (role) {
    case Roles.Mod:
      return Roles.User
    case Roles.Admin:
      return Roles.Mod
    default:
      return null
  }
}