import PropTypes from "prop-types"

export default PropTypes.shape({
  user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  board: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired
})