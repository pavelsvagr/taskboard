import React, { Component } from "react"
import { Button, Select, Spin, Tag } from "antd"
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import PropTypes from "prop-types"
import EmptyData from "../../comon/data/EmptyData"
import { fetchBoardAssignments, SUBJECT_BOARD_ASSIGNMENTS } from "../../../actions"
import shapes from "../../../types"
import { showCellAssignment } from "../../../actions/boardToolsAction"
import DataPagination from "./DataPagination"

class AssignmentSelect extends Component {
  constructor(props) {
    super(props)

    const { fetchBoardAssignments: handleFetch } = props

    this.state = {
      search: ""
    }

    this.fetch = debounce(handleFetch, 300)
  }

  handleHideAssignment = () => {
    const { showCellAssignment: show } = this.props
    show(null)
  }

  handleSearch = (search) => {
    const { boardAssignments } = this.props
    const { limit, offset } = boardAssignments || {}

    this.fetch(search, offset, limit)

    this.setState({ search })
  }

  render() {
    const { loading, onSelect, value, selected, boardAssignments, color, fetchBoardAssignments: handleFetch, showCellAssignment: show, ...otherProps } = this.props
    const { limit = 0, offset = 0, count = 0, data = [] } = boardAssignments || {}
    const { search } = this.state

    let dataWithSelected = data

    let valueIndex = null
    if (value) {
      valueIndex = data.findIndex(a => a.id === value.id)
      if (valueIndex === -1 && !offset && !search) {
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
        filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        dropdownRender={(menu) => (
          <div className="assignment-select">
            {dataWithSelected ? (
              <>
                <Spin spinning={!!loading?.states[SUBJECT_BOARD_ASSIGNMENTS]}>
                  {menu}
                </Spin>
                {limit < count && (
                  <div className="text-center p-md">
                    <DataPagination limit={limit} offset={offset} count={count} search={search} onFetch={handleFetch} />
                  </div>
                )}
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
        {dataWithSelected && dataWithSelected.map((assignment, index) => (
          <Select.Option
            key={assignment.id}
            value={index}
            label={assignment.title}
          >
            <div className="board__col__inline-edit__option">
              <span>{assignment.title}</span>
              {selected && selected[assignment.id] && value?.id !== assignment.id && (
                <Tag className={`color-${color}`}>
                  p
                  {selected[assignment.id]}
                </Tag>
              )}
            </div>
          </Select.Option>
        ))}
      </Select>
    )
  }
}

AssignmentSelect.propTypes = {
  loading: shapes.loading,
  boardAssignments: shapes.paginate(PropTypes.object),
  showCellAssignment: PropTypes.func.isRequired,
  fetchBoardAssignments: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: shapes.assignment,
  selected: shapes.assignment,
  color: PropTypes.string.isRequired
}

AssignmentSelect.defaultProps = {
  loading: null,
  boardAssignments: [],
  value: null,
  selected: null
}

function mapStateToProps({ boardAssignments, loading }) {
  return { boardAssignments, loading }
}

export default connect(mapStateToProps, { fetchBoardAssignments, showCellAssignment })(AssignmentSelect)
