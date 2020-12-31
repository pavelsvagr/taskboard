import axios from "axios"
import {
  ADD_CREDENTIALS,
  DELETE_CREDENTIALS,
  FEEDBACK_SUCCESS,
  FETCH_CREDENTIALS, FETCH_SINGLE_CREDENTIALS,
  LOADING,
  LOADING_DONE,
  REDIRECT,
  UPDATE_CREDENTIALS
} from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_CREDENTIALS = "credentials"

/**
 * Fetch credentials from server
 * @returns {function(...[*]=)}
 */
export const fetchCredentials = (search, offset = 0, limit = 25) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_CREDENTIALS })

  search = search || null

  const res = await axios.get("/api/credentials", { params: { search, offset, limit } })
    .catch(errorDispatch(dispatch, SUBJECT_CREDENTIALS))

  if (res) {
    dispatch({ type: FETCH_CREDENTIALS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_CREDENTIALS })
}


/**
 * Fetch single credentials from server
 * @returns {function(...[*]=)}
 */
export const fetchSingleCredentials = (id) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_CREDENTIALS })

  const res = await axios.get(`/api/credentials/${id}`)
    .catch(errorDispatch(dispatch, SUBJECT_CREDENTIALS))

  if (res) {
    dispatch({ type: FETCH_SINGLE_CREDENTIALS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_CREDENTIALS })
}

/**
 * Send credentials to the server
 * @param {object} values
 * @returns {function(...[*]=)}
 */
export const sendCredentials = (values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_CREDENTIALS })

  const res = await axios.post("/api/credentials", values)
    .catch(errorDispatch(dispatch, SUBJECT_CREDENTIALS))

  if (res) {
    dispatch({ type: ADD_CREDENTIALS, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Credentials were created" })
    dispatch({ type: REDIRECT, redirect: `/credentials` })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_CREDENTIALS })
}

/**
 * Delete credentials form server
 * @param {string} credentialsId
 * @returns {function(...[*]=)}
 */
export const deleteCredentials = (credentialsId) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_CREDENTIALS })

  const res = await axios.delete(`/api/credentials/${credentialsId}`)
    .catch(errorDispatch(dispatch, SUBJECT_CREDENTIALS))

  if (res) {
    dispatch({ type: FEEDBACK_SUCCESS, title: "Credentials were deleted" })
    dispatch({ type: DELETE_CREDENTIALS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_CREDENTIALS })
}

/**
 * Update credentials on server
 * @param {string} credentialsId
 * @param {object} values
 * @returns {function(...[*]=)}
 */
export const updateCredentials = (credentialsId, values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_CREDENTIALS })

  const res = await axios.patch(`/api/credentials/${credentialsId}`, values)
    .catch(errorDispatch(dispatch, SUBJECT_CREDENTIALS))

  if (res) {
    dispatch({ type: UPDATE_CREDENTIALS, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Credentials were updated" })
    dispatch({ type: REDIRECT, redirect: `/credentials/${res.data._id}` })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_CREDENTIALS })
}

