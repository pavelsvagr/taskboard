import moment from "moment"

import { REDIRECT } from "actions/types"

export default (state = null, action) => {
  switch (action.type) {
    case REDIRECT:
      return { url: action.redirect, id: moment() } || null
    default:
      return state
  }
}
