const mongoose = require("mongoose")

const assignmentsTypes = require("../../../../shared/constants/assignmentTypes")
const intervalsTypes = require("../../../../shared/constants/intervalsTypes")
const CredentialsModel = require("./Credentials")
const UserModel = require("./User")
const BoardClass = require("../entities/Board")
const { ApiFilterSchema } = require("./ApiFilter")

const SCHEMA = "boards"
const ATTR_NAME = "name"
const ATTR_IDENTIFIER = "identifier"
const ATTR_CREDENTIALS = "credentials"
const ATTR_INTERVALS = "intervals"
const ATTR_ASSIGNMENT = "assignment"
const ATTR_PRIORITIES = "priorities"
const ATTR_SHOW_AVATARS = "hasAvatars"
const ATTR_EMAIL_NOTIFICATIONS = "hasEmailNotifications"
const ATTR_INLINE_EDITING = "hasInlineEdit"
const ATTR_API_FILTERS = "apiFilters"
const ATTR_LAST_SYNCHRONIZED = "lastSynchronized"
const ATTR_OWNER = "owner"

const { Schema } = mongoose

const BoardSchema = new Schema(
  {
    [ATTR_NAME]: {
      type: String,
      required: true
    },
    [ATTR_IDENTIFIER]: {
      type: String,
      required: true,
      unique: true
    },
    [ATTR_CREDENTIALS]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: CredentialsModel.SCHEMA
    },
    [ATTR_OWNER]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: UserModel.SCHEMA
    },
    [ATTR_PRIORITIES]: {
      type: Number,
      default: 3
    },
    [ATTR_INTERVALS]: {
      type: String,
      enum: Object.values(intervalsTypes),
      required: true
    },
    [ATTR_ASSIGNMENT]: {
      type: String,
      enum: Object.values(assignmentsTypes),
      required: true
    },
    [ATTR_SHOW_AVATARS]: {
      type: Boolean,
      default: true
    },
    [ATTR_EMAIL_NOTIFICATIONS]: {
      type: Boolean,
      default: false
    },
    [ATTR_INLINE_EDITING]: {
      type: Boolean,
      default: true
    },
    [ATTR_LAST_SYNCHRONIZED]: {
      type: Date
    },
    [ATTR_API_FILTERS]: [ApiFilterSchema]
  },
  { timestamps: true }
)

BoardSchema.loadClass(BoardClass)
mongoose.model(SCHEMA, BoardSchema)

module.exports = {
  BoardSchema,
  SCHEMA,
  ATTR_NAME,
  ATTR_IDENTIFIER,
  ATTR_INTERVALS,
  ATTR_ASSIGNMENT,
  ATTR_PRIORITIES,
  ATTR_CREDENTIALS,
  ATTR_SHOW_AVATARS,
  ATTR_INLINE_EDITING,
  ATTR_API_FILTERS,
  ATTR_OWNER
}
