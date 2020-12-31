const mongoose = require("mongoose")

const notificationTypes = require("../../../../shared/constants/notificationTypes")

const Notification = require("../entities/Notification")

const SCHEMA = "notifications"
const ATTR_USER = "user"
const ATTR_LINK = "link"
const ATTR_LINK_TEXT = "linkText"
const ATTR_TITLE = "title"
const ATTR_MESSAGE = "message"
const ATTR_TYPE = "message"
const ATTR_VISITED = "visited"

const { Schema } = mongoose

const NotificationSchema = new Schema(
  {
    [ATTR_USER]: {
      type: String,
      required: true
    },
    [ATTR_TITLE]: {
      type: String,
      required: true
    },
    [ATTR_TYPE]: {
      type: String,
      enum: Object.values(notificationTypes),
      required: true
    },
    [ATTR_LINK]: {
      type: String,
      required: true
    },
    [ATTR_LINK_TEXT]: {
      type: String,
      default: "see more"
    },
    [ATTR_MESSAGE]: {
      type: String,
      required: true
    },
    [ATTR_VISITED]: {
      type: Date
    }
  },
  { timestamps: true }
)

NotificationSchema.loadClass(Notification)
mongoose.model(SCHEMA, NotificationSchema)

module.exports = {
  NotificationSchema,
  SCHEMA,
  ATTR_TITLE,
  ATTR_LINK,
  ATTR_LINK_TEXT,
  ATTR_USER,
  ATTR_MESSAGE,
  ATTR_VISITED
}
