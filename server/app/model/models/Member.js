const mongoose = require("mongoose")
const UserModel = require("./User")
const BoardModel = require("./Board")
const MemberClass = require("../entities/Member")


const SCHEMA = "member"

const ATTR_USER = "user"
const ATTR_BOARD = "board"
const ATTR_INVITATION_SENT = "invitationSend"
const ATTR_ROLE = "role"
const ATTR_NICKNAME = "nickname"
const ATTR_ORDER = "order"

const { Schema } = mongoose

const MemberSchema = new Schema(
  {
    [ATTR_USER]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: UserModel.SCHEMA
    },
    [ATTR_BOARD]: {
      type: Schema.Types.ObjectID,
      ref: BoardModel.SCHEMA
    },
    [ATTR_NICKNAME]: {
      type: String
    },
    [ATTR_ORDER]: {
      type: Number,
      required: true
    },
    [ATTR_ROLE]: {
      type: String,
      required: true
    },
    [ATTR_INVITATION_SENT]: {
      type: Schema.Types.Date,
      default: null
    }
  },
  { timestamps: true }
)

MemberSchema.loadClass(MemberClass)
mongoose.model(SCHEMA, MemberSchema)

module.exports = {
  MemberSchema,
  SCHEMA,
  ATTR_USER,
  ATTR_BOARD,
  ATTR_NICKNAME,
  ATTR_ORDER,
  ATTR_ROLE,
  ATTR_INVITATION_SENT
}
