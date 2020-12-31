import { ADD_CREDENTIALS, DELETE_CREDENTIALS, FETCH_CREDENTIALS, UPDATE_CREDENTIALS, FETCH_SINGLE_CREDENTIALS } from "actions/types"
import { addToPagination, removeFromPagination, updateInPagination } from "../helpers/paginationManipulate"

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_SINGLE_CREDENTIALS:
      return {...state, credentials: action.payload}
    case FETCH_CREDENTIALS:
      return {...state, all: action.payload}
    case ADD_CREDENTIALS:
      if (state?.all) {
        return {
          ...state,
          all: addToPagination(state.all, action.payload)
        }
      }
      return state
    case UPDATE_CREDENTIALS:
      if (state?.all) {
        return {
          ...state,
          all: updateInPagination(state.all, action.payload)
        }
      }
      return { new: action.payload }
    case DELETE_CREDENTIALS:
      if (state?.all) {
        return {
          ...state,
          all: removeFromPagination(state.all, action.payload)
        }
      }
      return state
    default:
      return state
  }
}
