import { LOADING, LOADING_DONE } from "actions/types"

export default (loading = { states: {}, active: 0 }, action) => {
  let newLoading

  switch (action.type) {
    case LOADING:
      newLoading = { ...loading }
      if (!loading.states[action.subject]) {
        newLoading.active += 1
      }
      newLoading.states[action.subject] = {
        progress: action.progress,
        message: action.message,
      }
      return newLoading

    case LOADING_DONE:
      newLoading = { ...loading }
      if (loading.states[action.subject]) {
        newLoading.active -= 1
        delete newLoading.states[action.subject]
      }
      return newLoading
    default:
      return loading
  }
}
