import React from "react"
import { Button, Col, Row } from "antd"
import {
  DownCircleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons"
import PropTypes from "prop-types"

function AssignmentButton({
  onClick,
  disabled,
  assignment = null,
  type = "select",
}) {
  const buttonProps = {
    disabled,
  }

  let buttonIcon
  switch (type) {
    case "select":
      buttonIcon = <DownCircleOutlined />
      buttonProps.onClick = onClick
      break
    case "add":
      buttonIcon = <PlusCircleOutlined />
      buttonProps.onClick = onClick
      break
    case "see":
      buttonIcon = <EyeOutlined />
      buttonProps.href = assignment ? assignment.url : "#"
      break
    default:
      buttonIcon = null
  }

  return (
    <Button disabled={disabled} className="board__assignment" {...buttonProps}>
      <Row>
        <Col span={22} className="ellipsis board__assignment__selected">
          {assignment && assignment.title}
        </Col>
        <Col span={2}>{buttonIcon}</Col>
      </Row>
    </Button>
  )
}

AssignmentButton.propTypes = {
  onClick: PropTypes.func,
  assignment: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["select", "add", "see"]),
}

AssignmentButton.defaultProps = {
  onClick: null,
  assignment: null,
  disabled: false,
  type: "select",
}

export default AssignmentButton
