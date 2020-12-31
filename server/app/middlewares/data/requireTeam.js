const MissingEntityError = require("../../exceptions/MissingEntityError")
const teamManager = require("../../services/managers/teamManager")

/**
 * Checks if team with given identifier exists and set it mongoose model in locals
 * @param {string} param
 * @return {function(...[any]=)}
 */
module.exports = (param = "identifier") =>
  async (req, res, next) => {
    const team = await teamManager.get(req.params[param])

    if (!team) {
      return next(new MissingEntityError(`Team with id "${req.params[param]}" doesn't exist.`))
    }

    res.locals.team = team
    return next()
  }
