import PropTypes from "prop-types"
import Roles from "@shared/security/roles"

export default PropTypes.shape({
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.oneOf(Object.values(Roles)),
  photo: PropTypes.string,
  googleId: PropTypes.string,
  googlePhoto: PropTypes.string,
  active: PropTypes.bool
})