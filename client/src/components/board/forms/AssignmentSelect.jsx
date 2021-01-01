import React, { Component } from "react"
import { Button, Dropdown, Select, Spin, Tag } from "antd"
import { CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import PropTypes from "prop-types"

import EmptyData from "../../comon/data/EmptyData"
import {
  fetchBoardAssignments,
  SUBJECT_BOARD_ASSIGNMENTS,
} from "../../../actions"
import shapes from "../../../types"
import {
  searchAssignments,
  showCellAssignment,
} from "../../../actions/boardToolsAction"
import DataPagination from "./DataPagination"
import ProjectCard from "../cards/ProjectCard"
import IssueCard from "../cards/IssueCard"

class AssignmentSelect extends Component {
  constructor(props) {
    super(props)
    const { fetchBoardAssignments: handleFetch } = props
    this.fetch = debounce(handleFetch, 300)
  }

  handleHideAssignment = () => {
    const { showCellAssignment: show } = this.props
    show(null)
  }

  handleSearch = (search) => {
    const { boardAssignments, searchAssignments: searchAction } = this.props
    const { limit, offset } = boardAssignments || {}

    this.fetch(search, offset, limit)
    searchAction(search)
  }

  render() {
    const {
      loading,
      onSelect,
      value,
      selected,
      boardAssignments,
      color,
      board,
      fetchBoardAssignments: handleFetch,
      showCellAssignment: show,
      searchAssignments: searchAction,
      search,
      ...otherProps
    } = this.props

    const { limit = 0, offset = 0, count = 0, data = [] } =
      boardAssignments || {}

    let dataWithSelected = data

    let valueIndex = null
    if (value) {
      const foundIndex = data.findIndex((a) => a.id === value.id)
      if (foundIndex === -1 && !offset && !search) {
        dataWithSelected = [value, ...data]
        valueIndex = 0
      }
    }

    return (
      <Select
        showSearch
        value={valueIndex}
        onSelect={onSelect}
        searchValue={search}
        defaultActiveFirstOption={false}
        onSearch={this.handleSearch}
        optionFilterProp="children"
        size="large"
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        dropdownRender={(menu) => (
          <div className="assignment-select">
            {dataWithSelected ? (
              <>
                <Spin spinning={!!loading?.states[SUBJECT_BOARD_ASSIGNMENTS]}>
                  {menu}
                </Spin>
                <div className="text-center p-md">
                  <DataPagination
                    limit={limit}
                    offset={offset}
                    count={count}
                    search={search}
                    onFetch={handleFetch}
                    showSizeChanger
                  />
                </div>
                <div className="text-center">
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ margin: 4 }}
                    onClick={() => onSelect(null)}
                  >
                    Clear
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={this.handleHideAssignment}
                    size="small"
                    style={{ margin: 4 }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <EmptyData title="No task found or API is not responding..." />
            )}
          </div>
        )}
        {...otherProps}
      >
        {dataWithSelected &&
          dataWithSelected.map((assignment, index) => (
            <Select.Option
              key={assignment.id}
              value={index}
              label={assignment.title}
            >
              <div className="board__col__inline-edit__option">
                <div>{assignment.title}</div>
                {selected &&
                  selected[assignment.id] &&
                  value?.id !== assignment.id && (
                    <div className="push">
                      <Tag className={`color-${color}`}>
                        p
                        {selected[assignment.id]}
                      </Tag>
                    </div>
                  )}
                <div
                  className={
                    selected &&
                    selected[assignment.id] &&
                    value?.id !== assignment.id
                      ? ""
                      : "push"
                  }
                >
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      board.assignment === "projects" ? (
                        <ProjectCard
                          project={assignment}
                          className="shadow"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <IssueCard
                          issue={assignment}
                          className="shadow"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )
                    }
                  >
                    <EyeOutlined
                      className="ant-dropdown-link"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              </div>
            </Select.Option>
          ))}
      </Select>
    )
  }
}

AssignmentSelect.propTypes = {
  loading: shapes.loading,
  searchAssignments: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  boardAssignments: shapes.paginate(PropTypes.object),
  board: shapes.board,
  showCellAssignment: PropTypes.func.isRequired,
  fetchBoardAssignments: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: shapes.assignment,
  selected: shapes.assignment,
  color: PropTypes.string.isRequired,
}

AssignmentSelect.defaultProps = {
  loading: null,
  boardAssignments: [],
  value: null,
  selected: null,
  board: null,
}

function mapStateToProps({ boards, boardAssignments, loading, boardTools }) {
  return {
    board: boards?.board,
    boardAssignments,
    loading,
    search: boardTools.search,
  }
}

export default connect(mapStateToProps, {
  fetchBoardAssignments,
  showCellAssignment,
  searchAssignments,
})(AssignmentSelect)
