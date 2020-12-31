const MissingEntityError = require("../../exceptions/MissingEntityError")
const boardRepository = require("../../model/repositories/BoardsRepository")

/**
 * Checks if board with given identifier exists and set it mongoose model in locals
 * @param {string} param Name of checking parameter
 * @return {function(...[any]=)}
 */
module.exports = function requireBoard(param = "identifier") {
  return async (req, res, next) => {
    const board = await boardRepository.findByIdentifier(req.params[param])

    if (!board) {
      // Missing board
      return next(
        new MissingEntityError(`Board with identifier "${req.params[param]}" doesn't exist.`)
      )
    }

    res.locals.board = board
    return next()
  }
}
