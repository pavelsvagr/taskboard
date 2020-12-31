import {
  ADD_BOARD,
  ADD_BOARD_MEMBERS,
  DELETE_BOARD,
  DELETE_BOARD_MEMBER,
  FETCH_BOARD,
  FETCH_BOARD_MEMBERS,
  FETCH_BOARD_TEAMS,
  FETCH_BOARDS,
  REORDER_BOARD_TEAMS,
  UPDATE_BOARD,
  UPDATE_BOARD_MEMBER,
  UPDATE_BOARD_TEAM_MEMBERS
} from "actions/types"
import { addToPagination, removeFromPagination, updateInPagination } from "../helpers/paginationManipulate"

export default (state = {}, action) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_BOARDS:
      return payload ? { all: payload } : null

    case FETCH_BOARD:
      return { ...state, board: payload }

    case ADD_BOARD:
      return payload ? { ...state, all: addToPagination(state.all, payload) } : state

    case UPDATE_BOARD:
      return payload ? { ...state, all: updateInPagination(state.all, payload) } : state

    case DELETE_BOARD:
      return payload ? { ...state, all: removeFromPagination(state.all, payload) } : state

    case FETCH_BOARD_MEMBERS:
      return { ...state, ...{ members: payload }, error: null }

    case ADD_BOARD_MEMBERS:
      return { ...state, members: [...state.members, ...payload], error: null }

    case DELETE_BOARD_MEMBER:
      const { teams = [] } = state
      const newTeams = []
      for (const team of teams) {
        const members = team.members.filter((m) => m !== payload._id)
        newTeams.push(Object.assign(team, { members }))
      }

      return {
        ...state, members: [...state.members.filter((m) => m._id !== payload._id)],
        teams: newTeams,
        error: null
      }

    case UPDATE_BOARD_MEMBER:
      return {
        ...state, members: [
          ...state.members.map((m) =>
            m._id === payload._id ? payload : m
          )
        ]
      }

    case FETCH_BOARD_TEAMS:
      return { ...state, teams: payload }

    case REORDER_BOARD_TEAMS:
      return {
        ...state,
        board: state.board ? { ...state.board, teams: payload.map(t => t._id) } : null,
        teams: payload
      }

    case UPDATE_BOARD_TEAM_MEMBERS:
      const oldTeam = state.teams.find(
        (t) => t.identifier === payload.team
      )
      const newTeam = { ...oldTeam, members: payload.members }

      return {
        ...state, teams: [
          ...state.teams.map((t) => (t._id === newTeam._id ? newTeam : t))
        ]
      }

    default:
      return state
  }
}
