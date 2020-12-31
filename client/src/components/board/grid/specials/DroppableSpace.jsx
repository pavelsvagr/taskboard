import React from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import PropTypes from "prop-types"

function DroppableSpace({ onDragEnd, droppableId, children, ...otherProps }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {/* eslint-disable-next-line no-unused-vars */}
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            {...otherProps}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

DroppableSpace.propTypes = {
  children: PropTypes.node,
  droppableId: PropTypes.string.isRequired,
  onDragEnd: PropTypes.func.isRequired,
}

DroppableSpace.defaultProps = {
  children: null,
}

export default DroppableSpace
