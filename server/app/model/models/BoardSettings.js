const mongoose = require("mongoose")

const BoardSettings = require("../entities/BoardSettings")
const BoardModel = require("./Board")
const MemberModel = require("./Member")

const SCHEMA = "board_settings"
const ATTR_BOARD = "board"
const ATTR_DATE = "date"
const ATTR_DEACTIVATED = "deactivated"
const ATTR_PRIORITIES = "priorities"

const { Schema } = mongoose

const BoardSettingsSchema = new Schema(
  {
    [ATTR_BOARD]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: BoardModel.SCHEMA
    },
    [ATTR_PRIORITIES]: {
      type: Number,
      required: true,
      default: 0
    },
    [ATTR_DEACTIVATED]: [
      {
        type: Schema.Types.ObjectID,
        ref: MemberModel.SCHEMA
      }
    ],
    [ATTR_DATE]: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

BoardSettingsSchema.loadClass(BoardSettings)
mongoose.model(SCHEMA, BoardSettingsSchema)

module.exports = {
  BoardSettingsSchema,
  SCHEMA,
  ATTR_PRIORITIES,
  ATTR_DEACTIVATED,
  ATTR_BOARD,
  ATTR_DATE
}
