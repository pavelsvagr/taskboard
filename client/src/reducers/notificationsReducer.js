import {
  DELETE_NOTIFICATION,
  FETCH_NOTIFICATION_UNREAD_COUNT,
  FETCH_NOTIFICATIONS,
  NEW_NOTIFICATION,
} from "actions/types"
import {addToPagination, removeFromPagination} from "../helpers/paginationManipulate"

export default (state = {
  all: null,
  unread: null
}, action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_NOTIFICATIONS:
      return (
        {
          ...state,
          all: payload
        } || null
      )

    case DELETE_NOTIFICATION:
      if (state?.all) {
        return {
          ...state,
          all: removeFromPagination(state.all, payload),
        }
      }
      return { new: action.payload }

    case FETCH_NOTIFICATION_UNREAD_COUNT:
      return { ...state, ...{ unread: payload } }

    case NEW_NOTIFICATION:
      if (state?.all) {
        return {
          ...state,
          all: addToPagination(state.all, payload),
          unread: state.unread ? state.unread + 1 : 1
        }
      }
      return state

    default:
      return state
  }
}
