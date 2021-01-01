import { ERROR_DELETE } from "./types"

/**
 * Delete error
 * @returns {function(...[*]=)}
 */
export default () => async (dispatch) => {
  dispatch({ type: ERROR_DELETE })
}
