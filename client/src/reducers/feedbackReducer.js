import {
  FEEDBACK_INFO,
  FEEDBACK_SUCCESS,
  NEW_NOTIFICATION,
} from "actions/types"
import moment from "moment"

export default (state = null, action) => {
  switch (action.type) {
    case FEEDBACK_SUCCESS:
      return {
        id: moment(),
        type: "success",
        title: action.title,
        description: action.message || null,
      }

    case FEEDBACK_INFO:
    case NEW_NOTIFICATION:
      return {
        id: moment(),
        type: "info",
        title: action.payload.title,
        description: action.payload.message || null,
      }

    default:
      return state
  }
}
