const { param } = require("express-validator")
const requireNotification = require("../middlewares/data/requireNotification")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const requireLogin = require("../middlewares/requireLogin")
const validate = require("../middlewares/validation/validate")

const { createStream } = require("../services/events/eventDispatcher")
const NotificationsController = require("../controllers/notificationsController")

module.exports = (app) => {
  app.get(
    "/api/notifications",
    requireLogin,
    ...validate(
      validatePaginate()
    ),
    NotificationsController.getNotifications
  )

  app.get(
    "/api/notifications/unread/count",
    requireLogin,
    NotificationsController.getUnreadCount
  )

  app.get(
    "/api/notifications/stream",
    requireLogin,
    createStream
  )

  app.delete(
    "/api/notifications/:id",
    requireLogin,
    ...validate(
      param("id", "Invalid notification id given").isMongoId().exists()
    ),
    requireNotification(),
    NotificationsController.deleteNotification
  )
}
