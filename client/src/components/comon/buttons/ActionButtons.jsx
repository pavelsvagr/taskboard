import { Affix } from "antd"
import React from "react"
import PropTypes from "prop-types"

function ActionButtons({ children }) {
  return (
    <Affix
      offsetBottom={30}
      style={{ textAlign: "right" }}
      className="button-action" 
    >
      {children}
    </Affix>
  )
}

ActionButtons.propTypes = {
  children: PropTypes.node.isRequired
}

export default ActionButtons
