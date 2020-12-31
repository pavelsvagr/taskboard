import PropTypes from "prop-types"
import * as MomentPropTypes from "react-moment-proptypes"

export default PropTypes.shape({
  _id: PropTypes.string,
  member: PropTypes.string,
  board: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, MomentPropTypes.momentObj]),
  assignments: PropTypes.arrayOf(PropTypes.object)
})