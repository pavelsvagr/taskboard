import React from "react"
import PropTypes from "prop-types"
import UserAvatar from "./UserAvatar"

function SiteContent({ children }) {
  return (
    <div className="site-content fill">
      <div className="site-layout-content">{children}</div>
    </div>
  )
}

UserAvatar.propTypes = {
  children: PropTypes.node,
}

UserAvatar.defaultProps = {
  children: null
}

export default SiteContent
