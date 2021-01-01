import PropTypes from "prop-types"

export default PropTypes.shape({
  active: PropTypes.number,
  states: PropTypes.objectOf(
    PropTypes.shape({
      message: PropTypes.string,
      progress: PropTypes.number,
    })
  ),
})
