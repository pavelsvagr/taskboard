import React from "react"
import { PlusOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import ResizableButton from "./ResizableButton"

function AddButton({ onClick, type = "primary", ...otherProps }) {
  return (
    <ResizableButton
      onClick={onClick}
      type={type}
      icon={<PlusOutlined />}
      {...otherProps}
    />
  )
}

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
}

AddButton.defaultProps = {
  type: "primary",
}

export default AddButton
