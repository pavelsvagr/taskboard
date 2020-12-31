const notificationsManager = require("../services/managers/notificationManager")
const notificationsRepository = require("../model/repositories/NotificationsRepository")

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {User} req.user
 * @return {Promise<void>}
 */
exports.getNotifications = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query

  const page = offset + 1

  const count = await notificationsManager.getCountByUser(req.user)
  const notifications = await notificationsManager.getByUser(req.user, limit, page)
  res.send(
    {
      count,
      notifications
    }
  )
}

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @return {Promise<void>}
 */
exports.deleteNotification = async (req, res) => {
  res.send(await notificationsRepository.remove(res.locals.notification))
}

/**
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {User} req.user
 * @return {Promise<void>}
 */
exports.getUnreadCount = async (req, res) => {
  const count = await notificationsRepository.find({
    visited: null,
    user: req.user._id
  }, { count: true })
  res.send({ count })
}
