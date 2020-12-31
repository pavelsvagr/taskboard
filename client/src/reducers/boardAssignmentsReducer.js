import { FETCH_BOARD_ASSIGNMENTS } from "actions/types"

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_BOARD_ASSIGNMENTS:
      return action.payload || null
    default:
      return state
  }
}
