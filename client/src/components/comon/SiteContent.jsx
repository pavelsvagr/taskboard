import React from "react"
import PropTypes from "prop-types"

function SiteContent({ children }) {
  return (
    <div className="site-content fill">
      <div className="site-layout-content">{children}</div>
    </div>
  )
}

SiteContent.propTypes = {
  children: PropTypes.node,
}

SiteContent.defaultProps = {
  children: null,
}

export default SiteContent
