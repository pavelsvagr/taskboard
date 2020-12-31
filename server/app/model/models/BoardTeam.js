const mongoose = require("mongoose")
const BoardModel = require("./Board")
const TeamModel = require("./Team")
const MemberModel = require("./Member")

const BoardTeamClass = require("../entities/BoardTeam")


const SCHEMA = "board_teams"
const ATTR_MEMBERS = "members"
const ATTR_BOARD = "board"
const ATTR_TEAM = "team"
const ATTR_ORDER = "order"

const { Schema } = mongoose

const BoardTeamSchema = new Schema(
  {
    [ATTR_TEAM]: {
      type: Schema.Types.ObjectID,
      ref: TeamModel.SCHEMA,
      required: true
    },
    [ATTR_MEMBERS]: [
      {
        type: Schema.Types.ObjectID,
        ref: MemberModel.SCHEMA
      }
    ],
    [ATTR_BOARD]: {
      type: Schema.Types.ObjectID,
      ref: BoardModel.SCHEMA,
      required: true
    },
    [ATTR_ORDER]: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

BoardTeamSchema.loadClass(BoardTeamClass)
mongoose.model(SCHEMA, BoardTeamSchema)

module.exports = {
  BoardTeamSchema,
  SCHEMA,
  ATTR_BOARD,
  ATTR_MEMBERS,
  ATTR_TEAM,
  ATTR_ORDER
}
