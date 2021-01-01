import React from "react"
import { Button } from "antd"
import PropTypes from "prop-types"

function ResizableButton({ size, className, children, ...otherProps }) {
  let classSize
  switch (size) {
    case "large":
      classSize = "--large"
      break
    default:
      classSize = ""
  }
  return (
    <Button
      className={`button${classSize}${className ? ` ${className}` : ""}`}
      {...otherProps}
    >
      {children}
    </Button>
  )
}

ResizableButton.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

ResizableButton.defaultProps = {
  size: null,
  className: null,
  children: null,
}

export default ResizableButton
