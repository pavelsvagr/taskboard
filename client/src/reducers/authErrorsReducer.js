import { FETCH_AUTH_ERRORS } from "actions/types"

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_AUTH_ERRORS:
      return action.payload || null
    default:
      return state
  }
}
