const mongoose = require("mongoose")
const ApiFilterClass = require("../entities/ApiFilter")

const SCHEMA = "api_filters"
const ATTR_NAME = "name"
const ATTR_VALUE = "value"

const { Schema } = mongoose

const ApiFilterSchema = new Schema(
  {
    [ATTR_NAME]: {
      type: String,
      required: true
    },
    [ATTR_VALUE]: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

ApiFilterSchema.loadClass(ApiFilterClass)

module.exports = {
  ApiFilterSchema,
  SCHEMA,
  ATTR_NAME,
  ATTR_VALUE
}
