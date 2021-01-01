import axios from "axios"
import {
  FETCH_BOARD_ITEMS,
  LOADING,
  LOADING_DONE,
  NEW_BOARD_ITEMS,
  REPLACE_BOARD_ITEM,
} from "./types"
import errorDispatch from "./errorDispatch"

export const SUBJECT_BOARD_ITEMS = "boardItems"

/**
 * Access server API
 * @param {string} identifier
 * @param {moment} fromDate
 * @param {moment} toDate
 * @returns {function(...[*]=)}
 */
export const fetchBoardItems = (identifier, fromDate, toDate) => async (
  dispatch
) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_ITEMS })
  const res = await axios
    .get(`/api/boards/${identifier}/items`, {
      params: {
        from: fromDate.format("YYYY-MM-DD"),
        to: toDate.format("YYYY-MM-DD"),
      },
    })
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_ITEMS))

  if (res) {
    dispatch({ type: FETCH_BOARD_ITEMS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_ITEMS })
}

/**
 * @param {string} identifier
 * @param {moment} sourceFrom
 * @param {moment} sourceTo
 * @param {moment} targetFrom
 * @param {moment} targetTo
 * @param {int} shift
 * @return {function(...[any]=)}
 */
export const copyBoardItems = (
  identifier,
  sourceFrom,
  sourceTo,
  targetFrom,
  targetTo,
  shift
) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_ITEMS })

  await axios
    .delete(`/api/boards/${identifier}/items`, {
      params: {
        dateFrom: targetFrom.format("YYYY-MM-DD"),
        dateTo: targetTo.format("YYYY-MM-DD"),
      },
    })
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_ITEMS))

  const res = await axios
    .post(`/api/boards/${identifier}/items`, null, {
      params: {
        sourceFrom: sourceFrom.format("YYYY-MM-DD"),
        sourceTo: sourceTo.format("YYYY-MM-DD"),
        shift,
      },
    })
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_ITEMS))

  if (res) {
    dispatch({ type: NEW_BOARD_ITEMS, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_ITEMS })
}

/**
 *
 * @param {string} identifier
 * @param {string} id
 * @param {object} boardItem
 * @returns {function(...[*]=)}
 */
export const updateBoardItem = (identifier, id, boardItem) => async (
  dispatch
) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_ITEMS })

  const res = await axios
    .put(`/api/boards/${identifier}/items/${id}`, boardItem)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_ITEMS))

  if (res) {
    dispatch({ type: REPLACE_BOARD_ITEM, payload: res.data })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_ITEMS })
}

/**
 * Try to create new board item on server API
 * @param {string} identifier
 * @param {object} item
 * @returns {function(...[*]=)}
 */
export const sendBoardItem = (identifier, item) => async (dispatch) => {
  dispatch({ type: LOADING, subject: SUBJECT_BOARD_ITEMS })

  const res = await axios
    .post(`/api/boards/${identifier}/items`, item)
    .catch(errorDispatch(dispatch, SUBJECT_BOARD_ITEMS))

  if (res) {
    dispatch({ type: NEW_BOARD_ITEMS, payload: [res.data] })
  }
  dispatch({ type: LOADING_DONE, subject: SUBJECT_BOARD_ITEMS })
}
