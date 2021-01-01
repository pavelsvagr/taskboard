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

  /**
   * @api {get} /api/credentials List credentials
   * @apiGroup Credentials
   * @apiParam (query) {Number} [limit=25]      Limit of returned records.
   * @apiParam (query) {Number} [offset=0]      Actual page of viewed records.
   * @apiParam (query) {String} [search]        Searches credentials names and types.
   *
   * @apiSuccess {Number} limit Number of returned records.
   * @apiSuccess {Number} offset Page of returned records.
   * @apiSuccess {array} data List of credentials.
   * @apiSuccess {Number} count Count of all records for given parameters.
   * @apiSuccessExample {json} Success-Response:
   *  "data":[
   *  {
   *        "_id":"512f916cb2f221c27541534b",
   *        "name":"Redmine test",
   *        "url":"https://redmine.example.org",
   *        "type":"redmine",
   *     }
   *  ],
   *  "limit":25,
   *  "offset":0,
   *  "count":1
   * @apiDescription Returns paginate of all credentials from database for given parameters. Requires mod or admin role.
   */
  app.get(
    credentialsUrl,
    requireMod,
    ...validate(
      validatePaginate(),
      validateSearch()
    ),
    CredentialsController.getAll
  )

  /**
   * @api {get} /api/credentials/:id Get single credentials
   * @apiGroup Credentials
   *
   * @apiParam {String} id Id pf requested credentials
   * @apiDescription Returns single credentials.
   */
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

  /**
   * @api {post} /api/credentials Create new credentials.
   * @apiGroup Credentials
   * @apiParam (body) {String} name       Credentials name
   * @apiParam (body) {String} type       Type of credentials (redmine)
   * @apiParam (body) {String} url        Root URL access point for external API
   * @apiParam (body) {String} apiKey     apiKey for external API
   *
   * @apiDescription Creates new credentials and returns them.
   */
  app.post(
    credentialsUrl,
    requireLogin,
    requireRoles([Role.Admin]),
    ...validate(
      validateCredentials()
    ),
    CredentialsController.create
  )

  /**
   * @api {patch} /api/credentials/:id Updates credentials.
   * @apiGroup Credentials
   * @apiParam (url) {String} id        Credentials id
   * @apiParam (body) {String} name     Name of the credentials
   *
   * @apiDescription Updates existing credentials and returns new representation.
   */
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

  /**
   * @api {delete} /api/credentials/:id Updates credentials.
   * @apiGroup Credentials
   * @apiParam (url) {String} id        Credentials id
   *
   * @apiDescription Deletes existing credentials and returns deleted representation
   */
  app.delete(
    credentialSingle,
    requireMod,
    ...validate(
      param("credentialsId", "Invalid credentials id given").isMongoId().exists()
    ),
    requireCredentials(),
    CredentialsController.delete
  )
}
