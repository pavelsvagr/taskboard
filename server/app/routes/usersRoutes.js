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

  /**
   * @api {get} /api/users List users
   * @apiGroup Users
   * @apiParam (query) {Number} [limit=10]      Limit of returned records.
   * @apiParam (query) {Number} [offset=0]      Actual page of viewed records.
   * @apiParam (query) {String} [search]        Searches users names, emails and roles.
   * @apiParam (query) {String} [sort]          Sort by name, email or role.
   *
   * @apiSuccess {Number} limit Number of returned records.
   * @apiSuccess {Number} offset Page of returned records.
   * @apiSuccess {array} data List of teams.
   * @apiSuccess {Number} count Count of all records for given parameters.
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "data":[
   *    {
   *          "_id":"512f916cb2f221c27541534b",
   *          "name":"Martin Novák",
   *          "email":"novak@example.org",
   *          "photo": null,
   *          "role":"user",
   *       }
   *    ],
   *    "limit":25,
   *    "offset":0,
   *    "count":1
   * }
   * @apiDescription Returns paginate of all users from database for given parameters. Requires moderator od admin role.
   */
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
  /**
   * @api {get} /api/users/:id Get single user
   * @apiGroup Users
   * @apiParam (url) {String} id     Id of user.
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "_id":"512f916cb2f221c27541534b",
   *     "name":"Martin Novák",
   *     "email":"novak@example.org",
   *     "photo": null,
   *     "role":"user",
   *  }
   * @apiDescription Returns paginate of all users from database for given parameters. Requires admin role.
   */
  app.get(
    urlUser,
    requireRoles([Roles.Admin]),
    ...validate(
      param("id", "Invalid user id given").isMongoId().exists(),
    ),
    UsersController.getUser
  )

  // Update user
  /**
   * @api {patch} /api/users/:id Update user
   * @apiGroup Users
   * @apiParam (url) {String} id          Id of user.
   * @apiParam (body) {String} [email]    User's email.
   * @apiParam (body) {String} [name]    User's full name.
   * @apiParam (body) {String} [role]    User's role.
   * @apiParam (body) {String} [photo]   Url to user's photo.
   *
   * @apiDescription Update parts of user and return new representation of user. Requires admin role.
   */
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

  /**
   * @api {post} /api/users Create user
   * @apiGroup Users
   * @apiParam (body) {String} email    User's email.
   * @apiParam (body) {String} name    User's full name.
   * @apiParam (body) {String} role    User's role.
   * @apiParam (body) {String} [photo]   Url to user's photo.
   *
   * @apiDescription Creates new user in database. Requires admin role
   */
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