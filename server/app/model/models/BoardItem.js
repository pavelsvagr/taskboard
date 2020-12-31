const mongoose = require("mongoose")
const BoardModel = require("./Board")
const MemberModel = require("./Member")
const { AssignmentSchema } = require("./Assignment")

const BoardItem = require("../entities/BoardItem")


const SCHEMA = "board_items"
const ATTR_MEMBER = "member"
const ATTR_BOARD = "board"
const ATTR_DATE = "date"
const ATTR_ASSIGNMENTS = "assignments"

const { Schema } = mongoose

const BoardItemSchema = new Schema(
  {
    [ATTR_MEMBER]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: MemberModel.SCHEMA
    },
    [ATTR_BOARD]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: BoardModel.SCHEMA
    },
    [ATTR_DATE]: {
      type: Date,
      required: true
    },
    [ATTR_ASSIGNMENTS]: [
      {
        type: AssignmentSchema
      }
    ]
  },
  { timestamps: true }
)

BoardItemSchema.loadClass(BoardItem)
mongoose.model(SCHEMA, BoardItemSchema)

module.exports = {
  BoardItemSchema,
  SCHEMA,
  ATTR_MEMBER,
  ATTR_BOARD,
  ATTR_DATE,
  ATTR_ASSIGNMENTS
}
