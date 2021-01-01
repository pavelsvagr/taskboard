import { ADD_USER, FETCH_USERS, UPDATE_USER } from "actions/types"
import {
  addToPagination,
  updateInPagination,
} from "../helpers/paginationManipulate"
import { FETCH_USER } from "../actions/types"

export default (state = {}, action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_USERS:
      return { ...state, all: payload || {} }

    case FETCH_USER:
      return { ...state, user: payload }

    case UPDATE_USER:
      return payload
        ? { ...state, all: updateInPagination(state.all, action.payload) }
        : state

    case ADD_USER:
      return payload
        ? { ...state, all: addToPagination(state.all, action.payload) }
        : state

    default:
      return state
  }
}
