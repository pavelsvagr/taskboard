import {
  DELETE_NOTIFICATION,
  FETCH_NOTIFICATION_UNREAD_COUNT,
  FETCH_NOTIFICATIONS,
  NEW_NOTIFICATION
} from "actions/types"

export default (state = null, action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_NOTIFICATIONS:
      return { ...state, notifications: payload.notifications, count: payload.count } || null
    case DELETE_NOTIFICATION:
      if (!state) {
        return null
      }
      return {
        ...state,
        notifications: state?.notifications?.filter((m) => m._id !== action.payload._id),
        count: state?.count ? state.count - 1 : 0
      }
    case FETCH_NOTIFICATION_UNREAD_COUNT:
      return { ...state, ...{ unread: payload } }
    case NEW_NOTIFICATION:
      return {
        unread: state?.unread ? state.unread + 1 : 1,
        count: state?.count ? state.count + 1 : 1,
        notifications: state?.notifications ? [payload, ...state.notifications.slice(0, 9)] : [payload]
      }
    default:
      return state
  }
}
