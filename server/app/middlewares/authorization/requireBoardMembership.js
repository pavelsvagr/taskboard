const Role = require("../../../../shared/security/roles")
const BoardRole = require("../../../../shared/security/rolesBoard")

const requireLogin = require("../requireLogin")
const requireBoard = require("../data/requireBoard")
const requireRoles = require("./requireRoles")

/**
 * @param {string} param
 * @returns {array<function>}
 */
const requireBoardMembership = (param = "identifier") => [
  requireLogin,
  requireBoard(param),
  requireRoles(
    [Role.Mod, Role.Admin],
    [BoardRole.Owner, BoardRole.Mod, BoardRole.Member]
  ),
]

module.exports = requireBoardMembership
