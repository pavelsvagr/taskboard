const mongoose = require("mongoose")
const logsTypes = require("../../../../shared/constants/logsTypes")

const UserModel = require("./User")

const SCHEMA = "logs"
const ATTR_TYPE = "type"
const ATTR_EXCEPTION = "exception"
const ATTR_MESSAGE = "message"
const ATTR_USER = "user"
const ATTR_PRIORITY = "priority"
const ATTR_URL = "url"

const { Schema } = mongoose

const LogsSchema = new Schema(
  {
    [ATTR_TYPE]: {
      type: String,
      required: true,
      enum: Object.values(logsTypes)
    },
    [ATTR_PRIORITY]: {
      type: String,
      required: true
    },
    [ATTR_MESSAGE]: {
      type: String,
      required: true
    },
    [ATTR_USER]: {
      type: Schema.Types.ObjectID,
      ref: UserModel.SCHEMA,
      required: false
    },
    [ATTR_EXCEPTION]: String,
    [ATTR_URL]: String
  },
  { timestamps: true }
)

mongoose.model(SCHEMA, LogsSchema)

module.exports = {
  LogsSchema,
  SCHEMA,
  ATTR_TYPE,
  ATTR_PRIORITY,
  ATTR_EXCEPTION,
  ATTR_MESSAGE,
  ATTR_USER,
  ATTR_URL
}
