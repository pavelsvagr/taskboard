import { FETCH_BOARD_SETTINGS } from "actions/types"

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_BOARD_SETTINGS:
      return action.payload || null
    default:
      return state
  }
}
