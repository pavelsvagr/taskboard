import PropTypes from "prop-types"

export default PropTypes.shape({
  date: PropTypes.string.isRequired,
  disabled: PropTypes.arrayOf(PropTypes.string),
  priorities: PropTypes.number.isRequired,
})