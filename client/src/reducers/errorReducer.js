import { ERROR_CLIENT, ERROR_DATA, ERROR_DELETE, ERROR_SERVER } from "actions/types"
import moment from "moment"

export default (state = null, action) => {
  switch (action.type) {
    case ERROR_DATA:
      if (action.status === 403) {
        return {
          id: moment(),
          type: "auth",
          errors: action.errors,
          subject: action.subject
        }
      }
      if (action.status === 404 || action.status === 422) {
        return {
          id: moment(),
          type: "request",
          errors: action.errors,
          subject: action.subject
        }
      }
      return {
        id: moment(),
        type: "data",
        errors: action.errors,
        subject: action.subject
      }
    case ERROR_SERVER:
      return {
        id: moment(),
        errors: [{ message: "Server is not responding." }],
        subject: "server"
      }
    case ERROR_CLIENT:
      return {
        id: moment(),
        errors: [{ message: action.message }],
        subject: "client"
      }
    case ERROR_DELETE:
      return null
    default:
      return state
  }
}
