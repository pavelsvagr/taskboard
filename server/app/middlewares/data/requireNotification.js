const MissingEntityError = require("../../exceptions/MissingEntityError")
const notificationsRepository = require("../../model/repositories/NotificationsRepository")

/**
 * Checks if notification with given id exists and set it mongoose model in locals
 * @param {string} param
 * @return {function(...[any]=)}
 */
module.exports = function requireNotification(param = "id") {
  return async (req, res, next) => {
    const notification = await notificationsRepository.findById(
      req.params[param]
    )
    if (notification && req.user._id.toString() === notification.user.toString()) {
      // Notification exists and actual user is its owner
      res.locals.notification = notification
      return next()
    }
    return next(new MissingEntityError(`Notification with id "${req.params[param]}" doesn't exist.`))
  }
}
