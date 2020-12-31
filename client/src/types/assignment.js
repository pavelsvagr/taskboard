import PropTypes from "prop-types"
import boardItem from "./boardItem"

export default PropTypes.shape({
  _id: PropTypes.string,
  memberId: PropTypes.string,
  board: PropTypes.string,
  boardItem,
  priority: PropTypes.number
})