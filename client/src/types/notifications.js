import PropTypes from "prop-types"

export default PropTypes.shape({
  unread: PropTypes.number,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string,
      type: PropTypes.string,
      message: PropTypes.string,
      link: PropTypes.string,
      linkText: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date)
    })
  )
})