import React, { Component } from "react"
import { Button, Col, Input, Menu, Modal, Row, Spin, Tag } from "antd"
import ProjectCard from "components/board/cards/ProjectCard"
import IssueCard from "components/board/cards/IssueCard"
import { ASSIGNMENT_PROJECT } from "helpers/assignmentTypes"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import shapes from "../../../types"
import {
  searchAssignments,
  showCellAssignment,
  submitCellAssignment,
} from "../../../actions/boardToolsAction"
import DataPagination from "../forms/DataPagination"
import {
  fetchBoardAssignments,
  SUBJECT_BOARD_ASSIGNMENTS,
} from "../../../actions"

class BoardItemEditModal extends Component {
  constructor(props) {
    super(props)

    const { assignment, fetchBoardAssignments: handleFetch } = props

    this.handleFetch = debounce(handleFetch, 300)

    this.state = {
      value: assignment.boardItem || {
        member: assignment.memberId,
        assignments: [],
      },
    }
  }

  handleSelectAssignment(target, isSelected) {
    const { board, assignment } = this.props
    const { assignment: type } = board
    const { priority } = assignment

    const newValue = assignment.boardItem || {
      member: assignment.memberId,
      assignments: [],
    }
    const tasks = []
    for (const task of newValue.assignments) {
      tasks.push({ ...task })
    }

    if (isSelected) {
      this.setState({
        value: {
          ...newValue,
          assignments: tasks.filter((a) => a.priority !== priority),
        },
      })
      return
    }
    const newTask = { ...target, priority, type }

    const idExists = tasks.findIndex((a) => a.id === newTask.id)
    const pExists = tasks.findIndex((a) => a.priority === priority)

    if (pExists !== -1) {
      if (tasks[pExists].id === newTask.id) {
        this.setState({
          value: { ...newValue, assignments: [...tasks, newTask] },
        })
      } else if (idExists !== -1) {
        tasks[pExists].priority = tasks[idExists].priority
        tasks[idExists] = tasks[pExists]
        tasks[pExists] = newTask
        this.setState({ value: { ...newValue, assignments: [...tasks] } })
      } else {
        this.setState({
          value: {
            ...newValue,
            assignments: tasks.map((a) =>
              a.priority === newTask.priority ? newTask : a
            ),
          },
        })
      }
    } else if (idExists !== -1) {
      this.setState({
        value: {
          ...newValue,
          assignments: tasks.map((a, i) => (i === idExists ? newTask : a)),
        },
      })
    } else {
      this.setState({
        value: { ...newValue, assignments: [...tasks, newTask] },
      })
    }
  }

  renderTitle = (type) => {
    if (type === "projects") {
      return `Select project`
    }
    return `Select issue`
  }

  renderMenuOption = (target, selectedTask) => {
    const { value } = this.state
    const { assignment } = this.props
    const { priority } = assignment

    const isSelected = target.id === selectedTask?.id
    const alreadyAssigned = value.assignments.find((a) => a.id === target.id)
    const isActualPriority = alreadyAssigned?.priority === priority
    const color =
      alreadyAssigned && !isSelected && !isActualPriority ? "red" : "blue"

    return (
      <Menu.Item key={target.id} className="p-0">
        <Button
          type="link"
          className="fill assignment_button"
          onClick={() => this.handleSelectAssignment(target, isSelected)}
        >
          {alreadyAssigned ? (
            <div className="board__col__inline-edit__option">
              <div>{target.title}</div>
              <div className='push'>
                <Tag className={`color-${color}`}>
                  Priority
                  {alreadyAssigned.priority}
                </Tag>
              </div>
            </div>
          ) : (
            <div className="board__col__inline-edit__option">
              <div>{target.title}</div>
            </div>
          )}
        </Button>
      </Menu.Item>
    )
  }

  handleSearch = (event) => {
    const { target } = event

    const { boardAssignments, searchAssignments: searchAction } = this.props
    const { limit, offset } = boardAssignments || {}

    this.handleFetch(target.value, offset, limit)
    searchAction(event.target.value)
  }

  render() {
    const {
      board,
      boardAssignments,
      assignment,
      loading,
      search,
      showCellAssignment: showAssignment,
      submitCellAssignment: submitModal,
      fetchBoardAssignments: handleFetch,
    } = this.props

    const { data = [], limit = 0, offset = 0, count = 0 } =
      boardAssignments || {}
    const { selected, value } = this.state

    const append = []
    let selectedTask = null
    if (value.assignments.length) {
      for (const task of value.assignments) {
        let valueIndex = null
        valueIndex = data.findIndex((a) => a.id === task.id)
        if (valueIndex === -1) {
          append.push(task)
          valueIndex = 0
        }

        if (task.priority === assignment.priority) {
          selectedTask = task
        }
      }
    }

    return (
      <Modal
        visible
        width={1500}
        title={this.renderTitle(board.assignment, assignment.priority)}
        closable
        onCancel={() => showAssignment(null)}
        onOk={() => submitModal(value, assignment)}
      >
        <Spin spinning={!!loading.states[SUBJECT_BOARD_ASSIGNMENTS]}>
          <Row gutter={[32, 0]}>
            <Col md={8} sm={24} xs={24}>
              <Row>
                <Input
                  value={search}
                  onChange={this.handleSearch}
                  placeholder="Search"
                  allowClear
                />
              </Row>
              <Menu
                mode="vertical"
                footer={null}
                selectedKeys={selected ? [selected] : []}
              >
                {append.map((task) =>
                  this.renderMenuOption(task, selectedTask)
                )}
                {append.length && <Menu.Divider />}
                {data.map((task) => this.renderMenuOption(task, selectedTask))}
              </Menu>
              <div className="text-center p-md">
                {limit < count && (
                  <DataPagination
                    limit={limit}
                    offset={offset}
                    count={count}
                    search={search}
                    onFetch={handleFetch}
                  />
                )}
              </div>
            </Col>
            <Col md={16} sm={24} xs={24}>
              <div>
                {board.type === ASSIGNMENT_PROJECT ? (
                  <ProjectCard project={selectedTask} />
                ) : (
                  <IssueCard issue={selectedTask} />
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </Modal>
    )
  }
}

BoardItemEditModal.propTypes = {
  loading: shapes.loading,
  board: shapes.board,
  boardAssignments: shapes.paginate(PropTypes.object),
  assignment: shapes.assignment,
  searchAssignments: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  fetchBoardAssignments: PropTypes.func.isRequired,
  showCellAssignment: PropTypes.func.isRequired,
  submitCellAssignment: PropTypes.func.isRequired,
}

BoardItemEditModal.defaultProps = {
  loading: null,
  board: null,
  boardAssignments: null,
  assignment: null,
}

function mapStateToProps({ boardTools, boardAssignments, boards, loading }) {
  return {
    assignment: boardTools.assignment,
    board: boards?.board,
    search: boardTools.search,
    boardAssignments,
    loading,
  }
}

export default connect(mapStateToProps, {
  submitCellAssignment,
  fetchBoardAssignments,
  showCellAssignment,
  searchAssignments,
})(BoardItemEditModal)
