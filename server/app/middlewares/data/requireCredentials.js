const MissingEntityError = require("../../exceptions/MissingEntityError")
const credentialsRepository = require("../../model/repositories/CredentialsRepository")

/**
 * Checks if credentials with given id exists and set its mongoose entity in locals
 * @param {string} param
 * @return {function(...[any]=)}
 */
module.exports = function requireCredentials(param = "credentialsId") {
  return async (req, res, next) => {

    const credentialsId = req.params[param]
    try {
      const credentials = await credentialsRepository.findById(credentialsId)

      if (!credentials) {
        next(new MissingEntityError(`Credentials with id "${credentialsId}" doesn't exist.`))
        return
      }
      res.locals.credentials = credentials
    } catch (err) {
      next(new MissingEntityError(`Credentials with id "${credentialsId}" doesn't exist.`))
      return
    }
    next()
  }
}
