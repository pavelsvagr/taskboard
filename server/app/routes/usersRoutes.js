const { param } = require("express-validator")
const endpoints = require("../../../shared/api/endpoints")
const Roles = require("../../../shared/security/roles")

const validate = require("../middlewares/validation/validate")
const validateUserBody = require("../middlewares/validation/validateUserBody")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const validateSort = require("../middlewares/validation/validateSort")
const validateSearch = require("../middlewares/validation/validateSearch")

const requireMod = require("../middlewares/authorization/requireMod")
const requireRoles = require("../middlewares/authorization/requireRoles")
const requireLogin = require("../middlewares/requireLogin")
const requireUser = require("../middlewares/data/reuireUser")
const UsersController = require("../controllers/usersController")

module.exports = (app) => {
  // Endpoint definitions
  const urlUsers = endpoints.teams.users()
  const urlUser = endpoints.teams.user(":id")

  app.get(
    urlUsers,
    requireMod,
    ...validate(
      validatePaginate(),
      validateSort(),
      validateSearch()
    ),
    UsersController.getUsers
  )

  // Single user
  app.get(
    urlUser,
    requireRoles([Roles.Admin]),
    ...validate(
      param("id", "Invalid user id given").isMongoId().exists(),
    ),
    UsersController.getUser
  )

  // Update user
  app.patch(
    urlUser,
    requireLogin,
    requireRoles([Roles.Admin]),
    ...validate(
      param("id", "Invalid user id given").isMongoId().exists(),
      validateUserBody(false)
    ),
    requireUser("id"),
    UsersController.updateUser
  )

  // Update user
  app.post(
    urlUsers,
    requireLogin,
    requireRoles([Roles.Admin]),
    ...validate(
      validateUserBody(true)
    ),
    UsersController.createUser
  )
}