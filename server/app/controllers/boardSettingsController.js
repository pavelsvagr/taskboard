const boardSettingsRepository = require("../model/repositories/BoardSettingsRepository")
const BoardSettings = require("../model/entities/BoardSettings")

/**
 * Update board settings
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.update = async (req, res) => {
  const { date } = req.params
  const { priorities, deactivated } = req.body

  let boardSettings = await boardSettingsRepository.findBy(
    res.locals.board,
    date
  )
  const isNew = !boardSettings

  if (!boardSettings) {
    boardSettings = new BoardSettings(res.locals.board._id, date)
  }

  boardSettings.priorities = priorities
  boardSettings.deactivated = deactivated

  const settings = isNew
    ? await boardSettingsRepository.create(boardSettings)
    : await boardSettingsRepository.update(boardSettings)
  res.send(settings)
}

/**
 * Gets board settings
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.get = async (req, res) => {
  res.send(
    await boardSettingsRepository.findBy(res.locals.board, req.params.date)
  )
}

/**
 * Deletes board settings
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.delete = async (req, res) => {
  const {board} = res.locals

  res.send(
    await boardSettingsRepository.deleteOne({
      board: board._id, date: req.params.date
    })
  )
}
