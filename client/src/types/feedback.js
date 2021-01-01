import PropTypes from "prop-types"
import moment from "moment"

export default PropTypes.shape({
  id: PropTypes.instanceOf(moment),
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
})
