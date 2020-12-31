import { ERROR_CLIENT, ERROR_DATA, ERROR_SERVER } from "./types"

/**
 * Helper for dispatching error messages in Axios call
 * @param {function} dispatch
 * @param {object} subject
 * @return {function(...[any]=)}
 */
export default (dispatch, subject) => (error) => {
  if (error.response) {
    dispatch({ type: ERROR_DATA, status: error.response.status, errors: error.response?.data?.errors, subject })
  } else if (error.request) {
    dispatch({ type: ERROR_SERVER })
  } else {
    dispatch({ type: ERROR_CLIENT, message: error.message })
  }
}