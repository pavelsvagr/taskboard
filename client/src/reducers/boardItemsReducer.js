import { FETCH_BOARD_ITEMS, NEW_BOARD_ITEMS, REPLACE_BOARD_ITEM } from "actions/types"

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_BOARD_ITEMS:
      return action.payload || []
    case NEW_BOARD_ITEMS:
      return state ? [...state, ...action.payload] : action.payload
    case REPLACE_BOARD_ITEM:
      const newItem = action.payload
      return state
        ? state.map((item) => (item._id === newItem._id ? newItem : item))
        : [newItem]
    default:
      return state
  }
}
