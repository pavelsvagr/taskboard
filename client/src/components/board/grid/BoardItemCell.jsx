import React from "react"
import { Col, Space } from "antd"
import UnlockForBoardAdmin from "components/comon/security/UnlockForBoardAdmin"
import PropTypes from "prop-types"

const BoardItemCell = React.forwardRef(
  (
    {
      dragButton,
      toolbox,
      span,
      title,
      disabled,
      avatar,
      children,
      toolboxType = "dropdown",
      ...props
    },
    ref
  ) => {
    return (
      <Col className="board__col" {...span} {...props}>
        <div className="board__col__value ellipsis" ref={ref}>
          {children || (
            <Space>
              {dragButton && (
                <div className="board__col__toolbar">{dragButton}</div>
              )}
              {avatar}
              {title}
            </Space>
          )}
        </div>
        <UnlockForBoardAdmin>
          {toolbox && (
            <div
              className={`board__col__toolbar${
                toolboxType === "absolute" ? "--absolute" : ""
              }`}
            >
              {toolbox}
            </div>
          )}
        </UnlockForBoardAdmin>
      </Col>
    )
  }
)

BoardItemCell.propTypes = {
  dragButton: PropTypes.node,
  toolbox: PropTypes.node,
  span: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  avatar: PropTypes.node,
  children: PropTypes.node,
  toolboxType: PropTypes.string,
}

BoardItemCell.defaultProps = {
  dragButton: null,
  toolbox: null,
  span: {},
  title: null,
  disabled: false,
  avatar: null,
  children: null,
  toolboxType: "dropdown",
}

export default BoardItemCell
