import PropTypes from "prop-types"

export default PropTypes.shape({
  _id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.string,
  name: PropTypes.string,
  creator: PropTypes.string,
})
