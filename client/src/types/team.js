import PropTypes from "prop-types"

export default PropTypes.shape({
  name: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  order: PropTypes.number,
  users: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  members: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
})
