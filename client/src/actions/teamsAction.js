import axios from "axios"
import {
  ADD_TEAM,
  DELETE_TEAM,
  FEEDBACK_SUCCESS,
  FETCH_TEAM_MEMBERS,
  FETCH_TEAMS,
  LOADING,
  LOADING_DONE,
  REDIRECT,
  UPDATE_BOARD_TEAM_MEMBERS,
  UPDATE_TEAM,
  FETCH_TEAM
} from "./types"
import { SUBJECT_BOARD_TEAMS } from "./boardsAction"
import errorDispatch from "./errorDispatch"

export const SUBJECT_TEAM = "team"
export const SUBJECT_TEAMS = "teams"
export const SUBJECT_TEAM_MEMBERS = "teamMembers"

/**
 * Get teams from server
 * @returns {function(...[*]=)}
 */
export const fetchTeams = (search, offset = 0, limit = 10, sort = null) => async (dispatch) => {
  search = search || null

  dispatch({ type: LOADING, subject: SUBJECT_TEAMS })
  const res = await axios.get("/api/teams", { params: { search, limit, offset, sort } })
    .catch(errorDispatch(dispatch, SUBJECT_TEAM))

  if (res) {
    dispatch({ type: FETCH_TEAMS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAMS })
}

/**
 * Get single team from server
 * @returns {function(...[*]=)}
 */
export const fetchTeam = (id) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_TEAM })
  const res = await axios.get(`/api/teams/${id}`)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM))

  if (res) {
    dispatch({ type: FETCH_TEAM, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM })
}

/**
 * Update board teams
 * @param {string} boardIdentifier
 * @param {string} teamIdentifier
 * @param {object} values
 * @param {boolean} wait
 * @returns {function(...[*]=)}
 */
export const updateBoardTeamMembers = (boardIdentifier, teamIdentifier, values, wait = false) =>
  async (dispatch) => {
    if (wait) dispatch({ type: LOADING, subject: SUBJECT_BOARD_TEAMS })

    const promise = axios.put(`/api/boards/${boardIdentifier}/teams/${teamIdentifier}/members`, values)
      .catch(errorDispatch(dispatch, SUBJECT_BOARD_TEAMS))

    if (wait) await promise

    dispatch({ type: UPDATE_BOARD_TEAM_MEMBERS, payload: { team: teamIdentifier, members: values } })

    if (wait) dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_TEAMS })
  }

/**
 * Create new team
 * @param {object} values
 * @returns {function(...[*]=)}
 */
export const sendTeam = (values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_TEAM })

  const res = await axios.post("/api/teams", values)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM ))

  if (res) {
    dispatch({ type: ADD_TEAM, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Team was created" })
    dispatch({ type: REDIRECT, redirect: `/teams/${res.data.identifier}/members` })
  }

  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM })
}

/**
 * Update existing part of team
 * @param {string} identifier
 * @param {values} values
 * @returns {function(...[*]=)}
 */
export const updateTeam = (identifier, values) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_TEAM })

  const res = await axios.patch(`/api/teams/${identifier}`, values)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM))

  if (res) {
    dispatch({ type: UPDATE_TEAM, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: `Team "${res.data.identifier}" was updated` })
    dispatch({ type: REDIRECT, redirect: "/teams" })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM })
}

/**
 * Delete team from server
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const deleteTeam = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, progress: 0, subject: SUBJECT_TEAM })

  const res = await axios.delete(`/api/teams/${identifier}`)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM))

  if (res) {
    dispatch({ type: DELETE_TEAM, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: `Team "${identifier}" was deleted` })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM })

}

/**
 * Get all members of the team
 * @param {string} identifier
 * @returns {function(...[*]=)}
 */
export const fetchTeamMembers = (identifier) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_TEAM_MEMBERS })

  const res = await axios.get(`/api/teams/${identifier}/members`)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM_MEMBERS))

  if (res) {
    dispatch({ type: FETCH_TEAM_MEMBERS, payload: res.data })
  }

  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM_MEMBERS })
}

/**
 * Replace members of the team
 * @param {string} identifier
 * @param {array} members
 * @returns {function(...[*]=)}
 */
export const updateTeamMembers = (identifier, members) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_TEAM_MEMBERS })

  const res = await axios.put(`/api/teams/${identifier}/members`, members)
    .catch(errorDispatch(dispatch, SUBJECT_TEAM_MEMBERS))

  if (res) {
    dispatch({ type: FETCH_TEAM_MEMBERS, payload: res.data })
    dispatch({ type: FEEDBACK_SUCCESS, title: "Members were changed." })
    dispatch({ type: REDIRECT, redirect: `/teams/${identifier}/members` })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_TEAM_MEMBERS })
}
