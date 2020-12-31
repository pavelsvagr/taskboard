const Role = require("../../../../shared/security/roles")

const requireLogin = require("../requireLogin")
const requireRoles = require("./requireRoles")

const requireMod = [requireLogin, requireRoles([Role.Mod, Role.Admin])]

module.exports = requireMod
