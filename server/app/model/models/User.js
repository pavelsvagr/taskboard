const mongoose = require("mongoose")

const Role = require("../../../../shared/security/roles")
const UserClass = require("../entities/User")

const SCHEMA = "users"

const ATTR_GOOGLE_ID = "googleId"
const ATTR_EMAIL = "email"
const ATTR_PHOTO = "photo"
const ATTR_GOOGLE_PHOTO_ID = "googlePhoto"
const ATTR_NAME = "name"
const ATTR_ROLE = "role"
const ATTR_ACTIVE = "active"

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    [ATTR_GOOGLE_ID]: {
      type: String
    },
    [ATTR_EMAIL]: {
      type: String,
      unique: true,
      required: true
    },
    [ATTR_GOOGLE_PHOTO_ID]: {
      type: String
    },
    [ATTR_PHOTO]: {
      type: String
    },
    [ATTR_NAME]: {
      type: String
    },
    [ATTR_ROLE]: {
      type: String,
      enum: Object.values(Role),
      required: true
    },
    [ATTR_ACTIVE]: {
      type: Boolean,
      default: true,
      required: true
    }
  },
  { timestamps: true }
)

UserSchema.loadClass(UserClass)

mongoose.model(SCHEMA, UserSchema)

module.exports = {
  UserSchema,
  SCHEMA,
  ATTR_GOOGLE_ID,
  ATTR_EMAIL,
  ATTR_PHOTO,
  ATTR_GOOGLE_PHOTO_ID,
  ATTR_NAME,
  ATTR_ROLE,
  ATTR_ACTIVE
}
