import React, { Component } from "react"
import AssignmentSelect from "components/board/forms/AssignmentSelect"
import { isChild } from "helpers/dom"
import { connect } from "react-redux"
import shapes from "types"
import PropTypes from "prop-types"
import BoardItemCell from "./BoardItemCell"
import { showCellAssignment, submitCellAssignment } from "../../../actions/boardToolsAction"
import { fetchBoard } from "../../../actions"

class BoardItemEditCell extends Component {
  wrapperRef = React.createRef()

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside)
  }



  handleHideAssignment = () => {
    const { showCellAssignment: show } = this.props
    show(null)
  }

  handleClickOutside = (event) => {
    if (
      this.wrapperRef &&
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target) &&
      !isChild(event.target, "assignment-select")
    ) {
      this.handleHideAssignment()
    }
  }

  handleSelect = (valueIndex) => {
    const { assignment, submitCellAssignment: onSubmit, boardAssignments, board } = this.props

    const tasks = boardAssignments.data
    const type = board.assignment

    const { boardItem, priority } = assignment

    if (valueIndex === null && boardItem) {
      const { assignments } = boardItem
      const priorityExists = assignments.findIndex(
        (a) => a.priority === priority
      )
      if (priorityExists > -1) {
        assignments.splice(priorityExists, 1)
      }
      onSubmit({ assignments }, assignment)
      return
    }

    const target = tasks[valueIndex]
    const value = {
      id: target.id,
      url: target.url,
      title: target.title,
      priority,
      type
    }

    if (boardItem) {
      const assignments = boardItem.assignments.length ? [...boardItem.assignments] : []

      const exists = assignments.findIndex((a) => a.id === target.id)
      if (exists > -1) {
        assignments.splice(exists, 1)
      }
      const priorityExists = assignments.findIndex(
        (a) => a.priority === priority
      )
      if (priorityExists > -1) {
        assignments[priorityExists] = value
      } else {
        assignments.push(value)
      }
      onSubmit({ ...boardItem, assignments }, assignment)
    } else {
      onSubmit({ assignments: [value] }, assignment)
    }
  }

  render() {
    const {
      team,
      assignment,
      cellProps
    } = this.props

    const itemAssignments = assignment?.boardItem?.assignments || []
    const { priority } = assignment
    const selected = {}
    for (const item of itemAssignments) {
      selected[item.id] = item.priority
    }

    const selectedValue = itemAssignments.find((a) => a.priority === priority)
    const value = selectedValue || null

    return (
      <BoardItemCell {...cellProps} ref={this.wrapperRef}>
        <AssignmentSelect
          className="board__row__inline-edit"
          selected={selected}
          color={team ? team.color : "blue"}
          onSelect={this.handleSelect}
          placeholder="Select task"
          value={value}
          autoFocus
          open
        />
      </BoardItemCell>
    )
  }
}

BoardItemEditCell.propTypes = {
  board: shapes.board,
  team: shapes.team,
  boardAssignments: shapes.paginate(PropTypes.object),
  assignment: shapes.assignment,
  cellProps: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])),
  fetchBoard: PropTypes.func.isRequired,
  showCellAssignment: PropTypes.func.isRequired,
  submitCellAssignment: PropTypes.func.isRequired
}

BoardItemEditCell.defaultProps = {
  board: null ,
  team: null,
  assignment: null,
  cellProps: {},
  boardAssignments: {}
}


function mapStateToProps({ boardTools, boards, boardAssignments }) {
  return { assignment: boardTools.assignment, board: boards?.board, boardAssignments }
}

export default connect(mapStateToProps, {
  submitCellAssignment,
  fetchBoard,
  showCellAssignment
})(BoardItemEditCell)
