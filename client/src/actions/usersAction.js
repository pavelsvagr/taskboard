import axios from "axios"
import {
  ADD_USER,
  FEEDBACK_SUCCESS,
  FETCH_AUTH_ERRORS,
  FETCH_LOGGED_USER,
  FETCH_USER,
  FETCH_USERS,
  LOADING,
  LOADING_DONE,
  REDIRECT,
  UPDATE_USER,
} from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_USER = "user"
export const SUBJECT_USERS = "users"

/**
 * Get all users from server
 * @param {string|null} search
 * @param {int} offset
 * @param {int} limit
 * @param {string|null} sort
 * @returns {function(...[*]=)}
 */
export const fetchUsers = (
  search,
  offset = 0,
  limit = 10,
  sort = null
) => async (dispatch) => {
  search = search || null

  dispatch({ type: LOADING, subject: SUBJECT_USERS })
  const res = await axios
    .get("/api/users", { params: { search, limit, offset, sort } })
    .catch(errorDispatch(dispatch, SUBJECT_USERS))

  if (res) {
    dispatch({ type: FETCH_USERS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_USERS })
}

/**
 * Get errors from auth
 * @returns {function(...[*]=)}
 */
export const fetchAuthErrors = () => async (dispatch) => {
  const res = await axios.get("/api/auth/errors").catch(errorDispatch(dispatch))

  dispatch({ type: FETCH_AUTH_ERRORS, payload: res.data })
}

/**
 * Get actual signed user
 * @returns {function(...[*]=)}
 */
export const fetchLoggedUser = () => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_USER })

  const res = await axios
    .get("/api/user")
    .catch(errorDispatch(dispatch, SUBJECT_USER))

  if (res) {
    dispatch({ type: FETCH_LOGGED_USER, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_USER })
}

/**
 * Get single  user
 * @returns {function(...[*]=)}
 */
export const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_USER })

  const res = await axios
    .get(`/api/users/${id}`)
    .catch(errorDispatch(dispatch, SUBJECT_USER))

  if (res) {
    dispatch({ type: FETCH_USER, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_USER })
}

/**
 * Update specific user
 * @param {string} id
 * @param {object} user
 * @returns {function(...[*]=)}
 */
export const updateUser = (id, user) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_USERS })

  const res = await axios
    .patch(`/api/users/${id}`, user)
    .catch(errorDispatch(dispatch, SUBJECT_USERS))

  if (res) {
    dispatch({ type: UPDATE_USER, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "User was updated" })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_USERS })
  dispatch({ type: REDIRECT, redirect: "/users" })
}

/**
 * Create new user
 * @param {object} user
 * @returns {function(...[*]=)}
 */
export const createUser = (user) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_USERS })

  const res = await axios
    .post("/api/users", user)
    .catch(errorDispatch(dispatch, SUBJECT_USERS))

  if (res) {
    dispatch({ type: ADD_USER, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "User was created" })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_USERS })
  dispatch({ type: REDIRECT, redirect: "/users" })
}
