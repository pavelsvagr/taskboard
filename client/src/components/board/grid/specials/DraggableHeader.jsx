import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { Space } from "antd"
import PropTypes from "prop-types"
import DragButton from "../../../comon/buttons/DragButton"

function DraggableHeader({
  header,
  droppableKey,
  isDragDisabled,
  index,
  children,
  headerClass = "",
  className,
  ...otherProps
}) {
  const content = (provided = {}, snapshot = {}) => (
    <div
      {...provided.draggableProps}
      {...otherProps}
      ref={provided.innerRef}
      className={`draggable-content${
        snapshot.isDragging ? " dragging " : " "
      }${className}`}
    >
      <div
        className={`draggable-content__header ${headerClass}`}
        ref={provided.innerRef}
      >
        <Space>
          <DragButton
            provider={provided}
            className="board__col__toolbar__button"
            size="small"
          />
          <span>{header}</span>
        </Space>
      </div>
      <div className="draggable-content__rest">{children}</div>
    </div>
  )

  return droppableKey ? (
    <Draggable
      key={droppableKey}
      draggableId={droppableKey}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => content(provided, snapshot)}
    </Draggable>
  ) : (
    content()
  )
}

DraggableHeader.propTypes = {
  header: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  droppableKey: PropTypes.string.isRequired,
  isDragDisabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
  headerClass: PropTypes.string,
  className: PropTypes.string,
}

DraggableHeader.defaultProps = {
  header: null,
  isDragDisabled: false,
  children: null,
  headerClass: "",
  className: "",
}

export default DraggableHeader
