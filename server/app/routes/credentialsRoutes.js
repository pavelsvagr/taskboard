const { param, body } = require("express-validator")

const Role = require("../../../shared/security/roles")
const endpoints = require("../../../shared/api/endpoints")

const requireLogin = require("../middlewares/requireLogin")
const requireRoles = require("../middlewares/authorization/requireRoles")
const validate = require("../middlewares/validation/validate")
const validateCredentials = require("../middlewares/validation/validateCredentialsBody")
const requireMod = require("../middlewares/authorization/requireMod")
const requireCredentials = require("../middlewares/data/requireCredentials")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const validateSearch = require("../middlewares/validation/validateSearch")

const CredentialsController = require("../controllers/credentialsController")

module.exports = (app) => {
  // Endpoint definitions
  const credentialsUrl = endpoints.credentials.credentials()
  const credentialSingle = endpoints.credentials.one(":credentialsId")
  const credentialsApiKey = endpoints.credentials.apiKey(":credentialsId")

  app.get(
    credentialsUrl,
    requireMod,
    ...validate(
      validatePaginate(),
      validateSearch()
    ),
    CredentialsController.getAll
  )

  app.get(
    credentialSingle,
    requireLogin,
    requireRoles([Role.Admin]),
    ...validate(
      param("credentialsId").isMongoId(),
    ),
    requireCredentials(),
    CredentialsController.get
  )

  app.post(
    credentialsUrl,
    requireLogin,
    requireRoles([Role.Admin]),
    ...validate(
      validateCredentials()
    ),
    CredentialsController.create
  )

  app.patch(
    credentialSingle,
    requireLogin,
    requireRoles([Role.Admin]),
    ...validate(
      param("credentialsId").isMongoId(),
      validateCredentials(true)
    ),
    requireCredentials(),
    CredentialsController.update
  )
  app.delete(
    credentialSingle,
    requireMod,
    ...validate(
      param("credentialsId", "Invalid credentials id given").isMongoId().exists()
    ),
    requireCredentials(),
    CredentialsController.delete
  )

  app.get(
    credentialsApiKey,
    requireLogin,
    requireRoles([Role.Admin]),
    ...validate(
      param("credentialsId", "Invalid credentials id given").isMongoId().exists()
    ),
    requireCredentials(),
    CredentialsController.getApiKey
  )
}
