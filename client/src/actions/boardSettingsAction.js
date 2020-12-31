import axios from "axios"
import { FETCH_BOARD_SETTINGS, LOADING, LOADING_DONE } from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_BOARD_SETTINGS = "boardSettings"

/**
 * Gets settings of the board for given interval
 * @param {string} identifier
 * @param {moment} date
 * @returns {function(...[*]=)}
 */
export const fetchBoardSettings = (identifier, date) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_SETTINGS })

  const res = await axios.get(`/api/boards/${identifier}/settings/${date.format("YYYY-MM-DD")}`)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_SETTINGS))

  if (res) {
    dispatch({ type: FETCH_BOARD_SETTINGS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_SETTINGS })
}

/**
 * Updates settings of the board for given interval
 * @param {string} identifier
 * @param {moment} date
 * @param {object} values
 * @param {boolean} send
 * @returns {function(...[*]=)}
 */
export const updateBoardSettings = (identifier, date, values, send = true) => async (dispatch) => {
  const dateString = date.format("YYYY-MM-DD")

  if (send) {
    dispatch({ type: LOADING, subject: SUBJECT_BOARD_SETTINGS })
    const res = await axios.put(`/api/boards/${identifier}/settings/${dateString}`, values)
      .catch(errorDispatch(dispatch, SUBJECT_BOARD_SETTINGS))

    dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_SETTINGS })
    if (res) {
      dispatch({ type: FETCH_BOARD_SETTINGS, payload: res.data })
    }
  } else {
    dispatch({ type: FETCH_BOARD_SETTINGS, payload: { ...values, date: dateString } })
  }
}
