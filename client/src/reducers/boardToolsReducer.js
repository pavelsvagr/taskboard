import {
  BOARD_EDIT_MODE,
  BOARD_INITIAL_TOOLS, BOARD_MEMBER_EDIT,
  BOARD_TASK_ASSIGNMENT,
  BOARD_TASK_SEARCH,
  CHANGE_BOARD_DATE,
  COPY_BOARD_ROW,
  COPY_BOARD_TASKS,
} from "actions/types"
import moment from "moment"

const initialState = {
  editMode: false,
  boardCopy: null,
  itemCopy: null,
  assignment: null,
  editMember: null,
  search: "",
  date: moment()
}

export default (state = initialState, action) => {
  switch (action.type) {
    case BOARD_EDIT_MODE:
      return { ...state, editMode: action.payload }

    case COPY_BOARD_TASKS:
      return { ...state, boardCopy: action.tasks }

    case CHANGE_BOARD_DATE:
      return { ...state, date: action.date }

    case COPY_BOARD_ROW:
      return { ...state, itemCopy: action.row }

    case BOARD_INITIAL_TOOLS:
      return { ...state, ...initialState }

    case BOARD_TASK_ASSIGNMENT:
      return { ...state, assignment: action.assignment }

    case BOARD_TASK_SEARCH:
      return { ...state, search: action.search }

    case BOARD_MEMBER_EDIT:
      return { ...state, editMember: action.payload }

    default:
      return state
  }
}
