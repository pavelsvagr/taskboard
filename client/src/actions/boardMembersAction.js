import axios from "axios"
import {
  ADD_BOARD_MEMBERS,
  DELETE_BOARD_MEMBER,
  FEEDBACK_SUCCESS,
  FETCH_BOARD_MEMBERS,
  FETCH_BOARD_TEAMS,
  LOADING,
  LOADING_DONE,
  UPDATE_BOARD_MEMBER,
} from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_BOARD_MEMBERS = "boardMembers"

/**
 * Create board members on server
 * @param {string} identifier
 * @param {array<object>} values
 * @returns {function(...[*]=)}
 */
export const createBoardMembers = (identifier, values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_MEMBERS })

  const res = await axios
    .post(`/api/boards/${identifier}/members`, values)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (res) {
    dispatch({ type: ADD_BOARD_MEMBERS, payload: res.data })
  }

  const resTeams = await axios
    .get(`/api/boards/${identifier}/teams`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (resTeams) {
    dispatch({ type: FETCH_BOARD_TEAMS, payload: resTeams.data })
  }
  if (resTeams && res) {
    dispatch({
      type: FEEDBACK_SUCCESS,
      title: "Board members was successfully updated",
    })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_MEMBERS })
}

/**
 * Updates board member on server
 * @param {string} identifier
 * @param {string} id
 * @param {object} values
 * @returns {function(...[*]=)}
 */
export const updateBoardMember = (identifier, id, values) => async (
  dispatch
) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_MEMBERS })

  const res = await axios
    .patch(`/api/boards/${identifier}/members/${id}`, values)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (res) {
    dispatch({ type: UPDATE_BOARD_MEMBER, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_MEMBERS })
}

/**
 * Replaces board members
 * @param {string} identifier
 * @param {array} values
 * @param {boolean} wait
 * @returns {function(...[*]=)}
 */
export const updateBoardMembers = (identifier, values, wait = false) => async (
  dispatch
) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_MEMBERS })

  const promise = axios
    .put(`/api/boards/${identifier}/members`, values)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (wait) {
    await promise
  }
  dispatch({ type: FETCH_BOARD_MEMBERS, payload: values })
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_MEMBERS })
}

/**
 * Get members of the board from server
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const fetchBoardMembers = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_MEMBERS })

  const res = await axios
    .get(`/api/boards/${identifier}/members`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (res) {
    dispatch({ type: FETCH_BOARD_MEMBERS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_MEMBERS })
}

/**
 * Deletes member of the board
 * @param {string} identifier
 * @param {string} memberId
 * @returns {function(...[*]=)}
 */
export const deleteBoardMember = (identifier, memberId) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_MEMBERS })

  const res = await axios
    .delete(`/api/boards/${identifier}/members/${memberId}`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  if (res) {
    dispatch({ type: DELETE_BOARD_MEMBER, payload: res.data })
  }
  dispatch({ type: FEEDBACK_SUCCESS, title: "Board member was deleted" })
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_MEMBERS })
}
