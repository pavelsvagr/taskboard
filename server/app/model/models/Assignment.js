const mongoose = require("mongoose")
const assignmentTypes = require("../../../../shared/constants/assignmentTypes")

const SCHEMA = "assignments"
const ATTR_TYPE = "type"
const ATTR_ID = "id"
const ATTR_URL = "url"
const ATTR_TITLE = "title"
const ATTR_PRIORITY = "priority"

const { Schema } = mongoose

const AssignmentSchema = new Schema(
  {
    [ATTR_TYPE]: {
      type: String,
      required: true,
      enum: Object.values(assignmentTypes)
    },
    [ATTR_ID]: {
      type: String,
      required: true
    },
    [ATTR_URL]: {
      type: String,
      required: false
    },
    [ATTR_TITLE]: {
      type: String,
      required: true
    },
    [ATTR_PRIORITY]: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = {
  AssignmentSchema,
  SCHEMA,
  ATTR_URL,
  ATTR_ID,
  ATTR_PRIORITY,
  ATTR_TYPE,
  ATTR_TITLE
}
