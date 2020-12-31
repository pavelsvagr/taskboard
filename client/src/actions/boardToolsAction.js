import { getDateFromTo } from "@shared/utils/interval"

import history from "helpers/history"
import { message } from "antd"
import {
  BOARD_EDIT_MODE,
  BOARD_TASK_ASSIGNMENT,
  CHANGE_BOARD_DATE,
  COPY_BOARD_ROW,
  COPY_BOARD_TASKS,
  BOARD_INITIAL_TOOLS
} from "./types"
import { fetchBoardMembers } from "./boardMembersAction"
import { fetchBoardAssignments, fetchBoardTeams } from "./boardsAction"
import { fetchBoardSettings, updateBoardSettings } from "./boardSettingsAction"
import { copyBoardItems, fetchBoardItems, sendBoardItem, updateBoardItem } from "./boardItemsAction"


/**
 * Reload all items needed for task board
 * @param {object} board
 * @param {object|string} date
 */
export const reloadTaskBoard = (board, date) => (dispatch) => {
  const [dateFrom, dateTo] = getDateFromTo(date, board.intervals)

  dispatch(fetchBoardMembers(board.identifier))
  dispatch(fetchBoardTeams(board.identifier))
  dispatch(fetchBoardSettings(board.identifier, dateFrom))
  dispatch(fetchBoardItems(board.identifier, dateFrom, dateTo))
  dispatch(fetchBoardAssignments())
}

export const copyBoardRow = (row) => (dispatch) => {
  dispatch({ type: COPY_BOARD_ROW, row })
  message.success("Task were copied.")
}

export const initialBoardToolsState = () => (dispatch) => {
  dispatch({ type: BOARD_INITIAL_TOOLS })
}

export const showCellAssignment = (memberId, teamId, priority, boardItem = null) => (dispatch) => {
  if (memberId === null) {
    dispatch({ type: BOARD_TASK_ASSIGNMENT, assignment: null })
  } else {
    dispatch({
      type: BOARD_TASK_ASSIGNMENT,
      assignment: {
        boardItem,
        memberId,
        teamId,
        priority
      }
    })
  }
}

export const submitCellAssignment = (boardItem, assignment) => (dispatch, getState) => {
  const { boardItem: item, memberId } = assignment
  const { boards, boardTools } = getState()
  const { board } = boards
  const { date } = boardTools

  if (item) {
    updateBoardItem(board.identifier, item._id, {
      assignments: boardItem.assignments,
      date: date.format("YYYY-MM-DD")
    })(dispatch)
  } else {
    sendBoardItem(board.identifier, {
      member: memberId,
      date: date.format("YYYY-MM-DD"),
      assignments: boardItem.assignments
    })(dispatch)
  }
  dispatch({ type: BOARD_TASK_ASSIGNMENT, assignment: null })
}

export const pasteBoardRow = (board, date, member, copiedRow, oldRow) => async (dispatch) => {
  if (!oldRow) {
    const newRow = { ...copiedRow }
    newRow.member = member._id
    newRow.date = date.format("YYYY-MM-DD")
    await sendBoardItem(board.identifier, newRow)(dispatch)
  } else {
    const updatedRow = { assignments: copiedRow.assignments || [] }
    await updateBoardItem(board.identifier, oldRow._id, updatedRow)(dispatch)
  }
}

export const cutBoardRow = (board, row) => (dispatch) => {
  dispatch({ type: COPY_BOARD_ROW, row })

  if (row) {
    const newRow = {
      assignments: []
    }
    updateBoardItem(board.identifier, row._id, newRow)(dispatch)
  }
}


/**
 * Changes actual visible board
 * @param {object} board
 * @param {object} date
 * @param {boolean} reload
 * @returns {function(...[*]=)}
 */
export const changeBoardDate = (board, date, reload = true) => (dispatch) => {
  const [dateFrom, dateTo] = getDateFromTo(date, board.intervals)

  if (reload) {
    fetchBoardItems(board.identifier, dateFrom, dateTo)(dispatch)
    fetchBoardSettings(board.identifier, dateFrom)(dispatch)
  }

  dispatch({ type: BOARD_TASK_ASSIGNMENT, assignment: null })

  history.push({
    pathname: `/board/${board.identifier}`,
    search: `?date=${date.format("YYYY-MM-DD")}`
  })

  dispatch({ type: CHANGE_BOARD_DATE, date })
}

/**
 * Copies actual visible board items and settings
 * @param {object} board
 * @param {moment} date
 * @param {object} settings
 * @returns {function(...[*]=)}
 */
export const copyBoardTasks = (board, date, settings) => (dispatch) => {
  if (board) {
    const [fromDate, toDate] = getDateFromTo(date, board.intervals)
    dispatch({ type: COPY_BOARD_TASKS, tasks: { fromDate, toDate, settings } })
    message.success("Board settings and tasks were copied.")
  } else {
    dispatch({ type: COPY_BOARD_TASKS, tasks: null })
  }
}

/**
 * Paste copied board settings and tasks to actual visible board
 * @param {object} board
 * @param {moment} targetDate
 * @param {object} boardCopy
 * @returns {function(...[*]=)}
 */
export const pasteBoardTasks = (board, targetDate, boardCopy) => async (dispatch) => {
  if (!board || !boardCopy) {
    return
  }
  const { fromDate, toDate, settings } = boardCopy

  const [targetFrom, targetTo] = getDateFromTo(targetDate, board.intervals)

  const shift = targetFrom.diff(fromDate, "days")

  await copyBoardItems(board.identifier, fromDate, toDate, targetFrom, targetTo, shift)(dispatch)

  if (settings) {
    await updateBoardSettings(board.identifier, targetFrom, settings)(dispatch)
  }
  message.success("Board settings and tasks were pasted.")
  dispatch({ type: COPY_BOARD_TASKS, tasks: null })
}


export const activateBoardMember = (board, date, member, settings) => (dispatch) => {
  const [dateFrom] = getDateFromTo(date, board.intervals)
  if (
    settings &&
    settings.deactivated &&
    settings.deactivated.includes(member._id)
  ) {
    const deactivated = [
      ...settings.deactivated.filter((id) => id !== member._id)
    ]
    updateBoardSettings(
      board.identifier,
      dateFrom,
      { ...settings, deactivated }
    )(dispatch)
  }
}


export const deactivateBoardMember = (board, date, member, settings) => (dispatch) => {
  const [dateFrom] = getDateFromTo(date, board.intervals)

  if (
    settings &&
    settings.deactivated &&
    !settings.deactivated.includes(member._id)
  ) {
    const deactivated = [...settings.deactivated, member._id]
    updateBoardSettings(
      board.identifier,
      dateFrom,
      { ...settings, deactivated }
    )(dispatch)
  }
  if (!settings || !settings.deactivated) {
    updateBoardSettings(
      board.identifier,
      dateFrom,
      { priorities: board.priorities, deactivated: [member._id] }
    )(dispatch)
  }
}

export const assignBoardTask = (memberId, teamId, priority, boardItem = null) => (dispatch) => {
  dispatch({ type: BOARD_TASK_ASSIGNMENT, assignment: { memberId, teamId, priority, boardItem } })
}

/**
 * Changes edit mode for actual visible board
 * @param {boolean} editMode
 * @returns {function(...[*]=)}
 */
export const changeEditMode = (editMode) => (dispatch) => {
  dispatch({ type: BOARD_EDIT_MODE, payload: editMode })
}

