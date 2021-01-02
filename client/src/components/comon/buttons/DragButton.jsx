import React from "react"
import { Button } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"

function DragButton({ provider, className, size }) {
  return (
    <Button
      className={className}
      size={size}
      shape="circle"
      ghost
      icon={<MenuOutlined />}
      {...provider.dragHandleProps}
    />
  )
}

DragButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  provider: PropTypes.object.isRequired,
  className: PropTypes.string,
  size: PropTypes.string,
}

DragButton.defaultProps = {
  className: null,
  size: null,
}

export default DragButton
