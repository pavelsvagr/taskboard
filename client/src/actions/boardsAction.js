import axios from "axios"
import moment from "moment"
import {
  ADD_BOARD,
  DELETE_BOARD,
  FEEDBACK_SUCCESS,
  FETCH_BOARD,
  FETCH_BOARD_ASSIGNMENTS,
  FETCH_BOARD_TEAMS,
  FETCH_BOARDS,
  LOADING,
  LOADING_DONE,
  REDIRECT,
  REORDER_BOARD_TEAMS
} from "./types"
import errorDispatch from "./errorDispatch"
import { fetchBoardMembers, SUBJECT_BOARD_MEMBERS } from "./boardMembersAction"

export const SUBJECT_BOARDS = "boards"
export const SUBJECT_BOARD = "board"
export const SUBJECT_BOARD_TEAMS = "boardTeams"
export const SUBJECT_BOARD_ASSIGNMENTS = "boardAssignments"

/**
 * Fetch all boards
 * @returns {function(...[*]=)}
 */
export const fetchBoards = (search, offset = 0, limit = 25) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARDS })

  search = search || null
  const res = await axios.get("/api/boards", {params: {search, offset, limit}})
    .catch(errorDispatch(dispatch, SUBJECT_BOARDS))

  if (res) {
    dispatch({ type: FETCH_BOARDS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARDS })
}

/**
 * Get specific board from server
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const fetchBoard = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD })

  const res = await axios.get(`/api/boards/${identifier}`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARDS))

  if (res) {
    dispatch({ type: FETCH_BOARD, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD })
}

/**
 * Get team of given board from server
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const fetchBoardTeams = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_TEAMS })

  const res = await axios.get(`/api/boards/${identifier}/teams`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_TEAMS))

  if (res) {
    dispatch({ type: FETCH_BOARD_TEAMS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_TEAMS })
}

/**
 * Reorder teas of board
 * @param {string} identifier
 * @param {array} values
 * @returns {function(...[*]=)}
 */
export const reorderBoardTeams = (identifier, values) => (dispatch) => {
  axios.patch(`/api/boards/${identifier}`, { teams: values.map(t => t._id) })
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_MEMBERS))

  dispatch({ type: REORDER_BOARD_TEAMS, payload: values })
}

/**
 * Updates board on server
 * @param {string} identifier
 * @param {object} values
 * @returns {function(...[*]=)}
 */
export const updateBoard = (identifier, values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD })

  const res = await axios.patch(`/api/boards/${identifier}`, values)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD))

  if (res) {
    dispatch({ type: FETCH_BOARD, payload: res.data })
  }

  const newIdentifier = values.identifier ? values.identifier : identifier
  const resTeams = await axios.get(`/api/boards/${newIdentifier}/teams`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD))

  if (resTeams) {
    dispatch({ type: FETCH_BOARD_TEAMS, payload: resTeams.data })
  }

  if (res && resTeams) {
    dispatch({ type: FEEDBACK_SUCCESS, title: "Board was successfully updated" })
    dispatch({ type: REDIRECT, redirect: `/board/${newIdentifier}` })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD })
}

/**
 * Get all assignments for given board
 * @returns {function(...[*]=)}
 * @param {string|null} search
 * @param {int} offset
 * @param {int} limit
 */
export const fetchBoardAssignments = (search, offset = 0, limit = 15) => async (dispatch, getState) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_ASSIGNMENTS })

  search = search || null

  const {identifier} = getState().boards?.board || {}

  const res = await axios.get(`/api/boards/${identifier}/assignments`, {
    params: {search, offset, limit}
  }).catch(errorDispatch(dispatch, SUBJECT_BOARD_ASSIGNMENTS))

  if (res) {
    dispatch({ type: FETCH_BOARD_ASSIGNMENTS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_ASSIGNMENTS })
}

/**
 * Imports members of board from external server
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const importBoardMembers = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD, message: "Importing users" })

  const res = await axios.patch(
    `/api/boards/${identifier}`,
    {lastSynchronized: moment()}
  ).catch(errorDispatch(dispatch, SUBJECT_BOARD))

  if (res) {
    dispatch({ type: FETCH_BOARD, payload: res.data })
    fetchBoardMembers(identifier)
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD })
}

/**
 * Creates new board
 * @param {array} values
 * @param {boolean} synchronize
 * @returns {function(...[*]=)}
 */
export const sendBoard = (values, synchronize = false) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD, message: "Creating board" })

  const res = await axios.post("/api/boards", values)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD))

  if (res) {
    if (synchronize) {
      await importBoardMembers(values.identifier)(dispatch)
    }

    dispatch({ type: ADD_BOARD, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Board was successfully created" })
    dispatch({ type: REDIRECT, redirect: "/boards" })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD })
}

/**
 * Deletes board
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const deleteBoard = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD })

  const res = await axios.delete(`/api/boards/${identifier}`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD))

  if (res) {
    dispatch({ type: DELETE_BOARD, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Board was successfully deleted" })
    dispatch({ type: REDIRECT, redirect: "/boards" })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD })
}
