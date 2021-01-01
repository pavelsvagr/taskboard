import PropTypes from "prop-types"
import UserShape from "./user"

export default PropTypes.shape({
  _id: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  credentials: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object,
  ]).isRequired,
  owner: PropTypes.oneOfType([PropTypes.string, UserShape]).isRequired,
  assignment: PropTypes.string.isRequired,
  intervals: PropTypes.string.isRequired,
  hasAvatars: PropTypes.bool,
  hasInlineEdit: PropTypes.bool,
  hasEmailNotifications: PropTypes.bool,
  apiFilters: PropTypes.arrayOf(PropTypes.object),
})
