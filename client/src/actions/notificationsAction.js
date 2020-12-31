import axios from "axios"
import {
  DELETE_NOTIFICATION,
  FETCH_NOTIFICATION_UNREAD_COUNT,
  FETCH_NOTIFICATIONS,
  LOADING,
  LOADING_DONE,
  NEW_NOTIFICATION
} from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_NOTIFICATIONS = "notifications"

/**
 * Get all notifications for actual user from server
 * @param {int} page
 * @returns {function(...[*]=)}
 */
export const fetchNotifications = (page = 1) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_NOTIFICATIONS })

  const res = await axios.get("/api/notifications",
    {params: { page }}
    )
    .catch(errorDispatch(dispatch, SUBJECT_NOTIFICATIONS))

  if (res) {
    dispatch({ type: FETCH_NOTIFICATIONS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_NOTIFICATIONS })

}

/**
 * Delete specific notification from server
 * @param {string} id
 * @returns {function(...[*]=)}
 */
export const deleteNotification = (id) => (dispatch) => {
  axios.delete(`/api/notifications/${id}`)
    .catch(errorDispatch(dispatch, SUBJECT_NOTIFICATIONS))

  dispatch({ type: DELETE_NOTIFICATION, payload: { _id: id } })
}

/**
 * Fetch notifications count for actual user
 * @returns {function(...[*]=)}
 */
export const fetchNotificationsCount = () => async (dispatch) => {
  const res = await axios.get("/api/notifications/unread/count")
    .catch(errorDispatch(dispatch, SUBJECT_NOTIFICATIONS))

  if (res) {
    dispatch({ type: FETCH_NOTIFICATION_UNREAD_COUNT, payload: res.data.count })
  }
}

/**
 * Create new notification from ginve stream
 * @param {notification} data
 * @returns {function(...[*]=)}
 */
export const newNotification = (data) => async (dispatch) => {
  if (data.type !== "notification") return

  dispatch({ type: NEW_NOTIFICATION, payload: data.data })
}