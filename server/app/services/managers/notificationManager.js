const moment = require("moment")


const Notification = require("../../model/entities/Notification")
const keys = require("../../../config/keys")

const notificationTypes = require("../../../../shared/constants/notificationTypes")
const assignmentTypes = require("../../../../shared/constants/assignmentTypes")
const renderBoardDate = require("../../../../shared/format/renderBoardDate")
const { getDateFromTo } = require("../../../../shared/utils/interval")

const notificationTemplate = require("../emails/emailTemplates/notification")
const Mailer = require("../emails/Mailer")
const AppError = require("../../exceptions/AppError")
const notificationsRepository = require("../../model/repositories/NotificationsRepository")
const { sendEvent } = require("../events/eventDispatcher")

/**
 * Creates notification about invitation to board
 * @param {User} user
 * @param {User} author
 * @param {Board} board
 * @return {Notification}
 */
const createBoardInvite = (board, user, author) => {
  const notification = new Notification(user._id, notificationTypes.boardInvite)

  const authorName = author.name || author.email

  notification.title = `Board invite: "${board.identifier}"`
  notification.message = `${authorName} added you to board "${board.name}".`
  notification.link = `/board/${board.identifier}`
  notification.linkText = `open board`

  return notification
}

/**
 * Creates notification about role change
 * @param {User} user
 * @param {User} author
 * @param {string} role
 * @param {Board} board
 * @return {Notification}
 */
const createRoleNotification = (user, author, role, board = null) => {
  const notification = new Notification(user._id, notificationTypes.role)

  const authorName = author.name || author.email

  notification.title = "Permissions changed"
  notification.message = `${authorName} changed your role to ${role}`

  if (board) {
    notification.title += ` "${board.identifier}"`
    notification.message += ` "${board.name}"`
  }

  notification.link = board ? `/board/${board.identifier}` : "/boards"
  notification.linkText = board ? "open board" : "show boards"

  return notification
}

/**
 * Creates notification about new assignment
 * @param {User} user
 * @param {User} author
 * @param {Board} board
 * @param {Assignment} assignment
 * @param {Assignment} oldAssignment
 * @param {moment} date
 * @return {Notification}
 * */
const createTaskAssignment = (board, user, author, assignment, oldAssignment, date) => {
  const notification = new Notification(user._id, notificationTypes.task)

  const authorName = author.name || author.email

  const [dateFrom] = getDateFromTo(date)
  const dateRendered = renderBoardDate(date, board.intervals)

  let taskType
  switch (board.assignment) {
    case assignmentTypes.projects:
      taskType = "project"
      break
    case assignmentTypes.issues:
      taskType = "issue"
      break
    default:
      taskType = "task"
  }

  notification.title = `Task assigned: ${assignment.title}`
  if (oldAssignment) {
    notification.message = `${authorName} changed your assigned ${taskType} from "${oldAssignment.title}" to "${assignment.title}" on board ${board.name} for ${dateRendered}.`
  } else {
    notification.message = `${authorName} assigned you ${taskType} "${assignment.title}" on board "${board.name}" for ${dateRendered}.`
  }
  notification.link = `/board/${board.identifier}?date=${dateFrom.format(
    "YYYY-MM-DD"
  )}`
  notification.linkText = `open board`

  return notification
}

/**
 * Creates notification for given parameters
 * @param type
 * @param {User} user
 * @param {User} author
 * @param {Board} board
 * @param {Assignment} assignment
 * @param {Assignment} oldAssignment
 * @param {moment} date
 * @param {string} role
 * @return {Promise<null | any>}
 * */
exports.createNotification = async (type, board, user, author, { assignment, oldAssignment, date, role } = {}) => {
  if (author._id.toString() === user._id.toString()) {
    return null // Dont create notifications for actions done by author on him self
  }

  let notification
  switch (type) {
    case notificationTypes.boardInvite:
      notification = createBoardInvite(board, user, author)
      break
    case notificationTypes.task:
      notification = createTaskAssignment(board, user, author, assignment, oldAssignment, date)
      break
    case notificationTypes.role:
      notification = createRoleNotification(user, author, role, board)
      break
    default:
      throw new AppError("Unknown notification type")
  }

  const newNotification = await notificationsRepository.create(notification)

  if (keys.sendGridKey && (!board || board.hasEmailNotifications)) {
    const mailer = new Mailer(
      notification.title,
      [user.email],
      notificationTemplate(newNotification)
    )
    mailer.send()
  }
  sendEvent(user._id, newNotification, "notification")

  return newNotification
}

/**
 * @param {User} user
 * @param {int} limit
 * @param {int} offset
 * @return {Promise<any>}
 */
exports.getByUser = async (user, limit = 10, offset = 0) => {
  const searchProps = {
    sort: { createdAt: -1 },
    limit,
    offset: offset * limit
  }

  const response = await notificationsRepository.findByUser(user._id, { ...searchProps, lean: true })
  const toUpdate = await notificationsRepository.findByUser(user._id, searchProps)

  const results = []
  for (const notification of toUpdate) {
    if (!notification.visited) {
      notification.visited = moment()
      results.push(notificationsRepository.update(notification))
    }
  }
  await Promise.all(results)

  return response
}

/**
 * @param user
 * @return {Promise<any>}
 */
exports.getCountByUser = async (user) => {
  return notificationsRepository.findByUser(user._id, { count: true })
}