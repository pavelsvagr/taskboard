import PropTypes from "prop-types"
import MomentPropTypes from "react-moment-proptypes"

export default PropTypes.shape({
  id: MomentPropTypes.momentObj,
  redirect: PropTypes.string
})