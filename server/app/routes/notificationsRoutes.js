const { param } = require("express-validator")
const requireNotification = require("../middlewares/data/requireNotification")
const validatePaginate = require("../middlewares/validation/validatePaginate")
const requireLogin = require("../middlewares/requireLogin")
const validate = require("../middlewares/validation/validate")

const { createStream } = require("../services/events/eventDispatcher")
const NotificationsController = require("../controllers/notificationsController")

module.exports = (app) => {
  /**
   * @api {get} /api/notifications List notifications
   * @apiGroup Notifications
   * @apiDescription Returns paginated notifications for logged user
   */
  app.get(
    "/api/notifications",
    requireLogin,
    ...validate(
      validatePaginate()
    ),
    NotificationsController.getNotifications
  )

  /**
   * @api {get} /api/notifications/unread/count Number of unread notifications
   * @apiGroup Notifications
   * @apiSuccessExample {json} Success-Response:
   *  {
   *    "count": 2,
   *  }
   * @apiDescription Returns number of actual unread notifications in application for logged user
   */
  app.get(
    "/api/notifications/unread/count",
    requireLogin,
    NotificationsController.getUnreadCount
  )

  /**
   * @api {get} /api/notifications/stream SSE notification stream
   * @apiGroup Notifications
   * @apiDescription Opens SSE stream for actual browser window.
   */
  app.get(
    "/api/notifications/stream",
    requireLogin,
    createStream
  )

  /**
   * @api {delete} /api/notifications/:id Delete notification
   * @apiGroup Notifications
   * @apiParam (url) {String} id        Notification id
   *
   * @apiDescription Deletes existing notification and returns its representation
   */
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
