import {
  ADD_TEAM,
  DELETE_TEAM,
  FETCH_TEAM,
  FETCH_TEAM_MEMBERS,
  FETCH_TEAMS,
  UPDATE_TEAM,
} from "actions/types"
import {
  addToPagination,
  removeFromPagination,
  updateInPagination,
} from "../helpers/paginationManipulate"

export default (state = {}, action) => {
  const { payload, type } = action

  switch (type) {
    case FETCH_TEAM:
      return { ...state, team: payload }

    case FETCH_TEAMS:
      return { ...state, all: payload }

    case ADD_TEAM:
      return payload
        ? { ...state, all: addToPagination(state.all, payload) }
        : state

    case UPDATE_TEAM:
      return payload
        ? { ...state, all: updateInPagination(state.all, payload) }
        : state

    case DELETE_TEAM:
      return payload
        ? { ...state, all: removeFromPagination(state.all, payload) }
        : state

    case FETCH_TEAM_MEMBERS:
      return state?.all
        ? {
            ...state,
            members: action.payload,
            error: null,
          }
        : state

    default:
      return state
  }
}
