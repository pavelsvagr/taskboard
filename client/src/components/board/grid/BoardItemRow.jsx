import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { Row } from "antd"
import getColSpan from "helpers/colSpan"
import UnlockForBoardAdmin from "components/comon/security/UnlockForBoardAdmin"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import BoardItemCell from "./BoardItemCell"
import BoardItemEditCell from "./BoardItemEditCell"
import AssignmentButton from "../buttons/AssignmentButton"
import UserAvatar from "../../comon/UserAvatar"
import DragButton from "../../comon/buttons/DragButton"
import {
  changeEditMode,
  showCellAssignment,
} from "../../../actions/boardToolsAction"
import MemberDropdown from "./specials/MemberDropdown"
import shapes from "../../../types"
import { fetchBoardSettings } from "../../../actions"

function BoardItemRow({
  board,
  member,
  items,
  cols,
  settings,
  index,
  team,
  editMode,
  assignment,
  showCellAssignment: onAssign,
}) {
  const memberItem = items[member._id] || null
  const assignments = memberItem ? memberItem.assignments : []

  const rowItems = []
  let i = 0
  for (const col of cols) {
    const priority = col + 1
    if (assignments[i] && assignments[i].priority === priority) {
      rowItems.push(assignments[i])
      i += 1
    } else {
      rowItems.push(null)
    }
  }

  const disabled =
    !member?.user?.active ||
    (settings && settings.deactivated.includes(member._id))
  let rowClass = disabled ? "board__row board__row--deactivated" : "board__row"
  rowClass += board.hasAvatars ? " board__row--large" : ""

  const getRow = (provided = {}, snapshot) => (
    <Row
      key={member._id}
      className={
        rowClass +
        (snapshot && snapshot.isDragging ? " board__row--dragged" : "")
      }
      ref={provided.innerRef ? provided.innerRef : null}
      {...provided.draggableProps}
    >
      <BoardItemCell
        key="user"
        className="board__col board__col--first ellipsis"
        title={
          member.user.active ? (
            member.nickname
          ) : (
            <span className="strike">{member.nickname}</span>
          )
        }
        dragButton={editMode ? <DragButton provider={provided} /> : null}
        toolbox={
          member.user.active && (
            <MemberDropdown member={member} board={board} item={memberItem} />
          )
        }
        disabled={disabled}
        avatar={board.hasAvatars ? <UserAvatar user={member.user} /> : null}
        span={getColSpan(0, cols.length, false)}
      />
      {cols.map((col) =>
        board.hasInlineEdit &&
        assignment &&
        assignment.memberId === member._id &&
        team?._id === assignment?.teamId &&
        assignment.priority === col + 1 ? (
          <BoardItemEditCell
            key={rowItems[col] ? rowItems[col].id : member._id + col}
            team={team}
            disabled={disabled}
            cellProps={{
              className: "board__col",
              span: getColSpan(col + 1, cols.length, false),
            }}
          />
        ) : rowItems[col] ? (
          <BoardItemCell
            key={rowItems[col].id}
            className="board__col"
            span={getColSpan(col + 1, cols.length, false)}
          >
            <UnlockForBoardAdmin
              lock={(
                <AssignmentButton
                  disabled={disabled}
                  assignment={rowItems[col]}
                  type="see"
                />
              )}
            >
              <AssignmentButton
                disabled={disabled}
                assignment={rowItems[col]}
                type="select"
                onClick={() =>
                  onAssign(
                    member._id,
                    team?._id,
                    rowItems[col].priority,
                    memberItem
                  )}
              />
            </UnlockForBoardAdmin>
          </BoardItemCell>
        ) : (
          <BoardItemCell
            key={member._id + col}
            className="board__col"
            span={getColSpan(col + 1, cols.length, false)}
          >
            <UnlockForBoardAdmin>
              <AssignmentButton
                disabled={disabled}
                type="add"
                onClick={() =>
                  onAssign(member._id, team?._id, col + 1, memberItem)}
              />
            </UnlockForBoardAdmin>
          </BoardItemCell>
        )
      )}
    </Row>
  )

  return editMode ? (
    <Draggable key={member._id} draggableId={member._id} index={index}>
      {(provided, snapshot) => getRow(provided, snapshot)}
    </Draggable>
  ) : (
    getRow()
  )
}

BoardItemRow.propTypes = {
  showCellAssignment: PropTypes.func.isRequired,
  board: shapes.board.isRequired,
  member: shapes.member.isRequired,
  settings: shapes.settings,
  items: shapes.boardItem,
  editMode: PropTypes.bool,
  cols: PropTypes.arrayOf(PropTypes.number).isRequired,
  index: PropTypes.number.isRequired,
  team: shapes.team,
  assignment: shapes.assignment,
}

BoardItemRow.defaultProps = {
  settings: null,
  editMode: false,
  items: [],
  team: null,
  assignment: null,
}

function mapStateToProps({
  boardTools,
  boardSettings: settings,
  boardAssignments,
}) {
  return {
    editMode: boardTools.editMode,
    assignment: boardTools.assignment,
    settings,
    boardAssignments,
  }
}

export default connect(mapStateToProps, {
  changeEditMode,
  fetchBoardSettings,
  showCellAssignment,
})(BoardItemRow)
