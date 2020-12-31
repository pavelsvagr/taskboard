import React from "react"
import { QuestionOutlined } from "@ant-design/icons"
import { Button } from "antd"
import PropTypes from "prop-types"

function HelpButton({ size, onClick }) {
  return (
    <Button
      shape="circle"
      type='dashed'
      size={size}
      icon={<QuestionOutlined />}
      onClick={onClick}
    />
  )
}

HelpButton.propTypes = {
  size: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

HelpButton.defaultProps = {
  size: "large"
}

export default HelpButton