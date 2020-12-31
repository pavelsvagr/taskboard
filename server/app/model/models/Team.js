const mongoose = require("mongoose")
const UserModel = require("./User")

const TeamClass = require("../entities/Team")

const SCHEMA = "team"
const ATTR_NAME = "name"
const ATTR_IDENTIFIER = "identifier"
const ATTR_COLOR = "color"
const ATTR_USERS = "users"

const { Schema } = mongoose

const TeamSchema = new Schema(
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
    [ATTR_COLOR]: {
      type: String
    },
    [ATTR_USERS]: [
      {
        type: Schema.Types.ObjectID,
        ref: UserModel.SCHEMA,
        select: false
      }
    ]
  },
  { timestamps: true }
)

TeamSchema.loadClass(TeamClass)
mongoose.model(SCHEMA, TeamSchema)

module.exports = {
  TeamSchema,
  SCHEMA,
  ATTR_NAME,
  ATTR_IDENTIFIER,
  ATTR_COLOR,
  ATTR_USERS
}
