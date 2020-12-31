const mongoose = require("mongoose")

const credentialTypes = require("../../../../shared/constants/credentialTypes")
const UserModel = require("./User")
const CredentialsClass = require("../entities/Credentials")

const SCHEMA = "credentials"
const ATTR_NAME = "name"
const ATTR_TYPE = "type"
const ATTR_URL = "url"
const ATTR_API_KEY = "apiKey"
const ATTR_CREATOR = "creator"

const { Schema } = mongoose

const CredentialsSchema = new Schema(
  {
    [ATTR_NAME]: {
      type: String,
      unique: false,
      required: true
    },
    [ATTR_TYPE]: {
      type: String,
      required: true,
      enum: Object.values(credentialTypes)
    },
    [ATTR_URL]: {
      type: String,
      required: true
    },
    [ATTR_API_KEY]: {
      type: String,
      required: true
    },
    [ATTR_CREATOR]: {
      type: Schema.Types.ObjectID,
      required: true,
      ref: UserModel.SCHEMA
    }
  },
  { timestamps: true }
)

CredentialsSchema.loadClass(CredentialsClass)
mongoose.model(SCHEMA, CredentialsSchema)

module.exports = {
  CredentialsSchema,
  SCHEMA,
  ATTR_NAME,
  ATTR_TYPE,
  ATTR_URL,
  ATTR_API_KEY,
  ATTR_CREATOR
}
