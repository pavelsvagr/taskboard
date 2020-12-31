const MissingEntityError = require("../../exceptions/MissingEntityError")
const userRepository = require("../../model/repositories/UserRepository")

/**
 * Checks if user with given id exists and set it mongoose model in locals
 * @param {string} param
 * @return {[function(...[any]=)]}
 */
module.exports = function requireUser(param = "id") {
  return async (req, res, next) => {
    const user = await userRepository.findById(req.params[param])

    if (!user) {
      return next(new MissingEntityError(`User with id "${req.params[param]}" doesn't exist.`))
    }

    res.locals.user = user
    return next()
  }
}
