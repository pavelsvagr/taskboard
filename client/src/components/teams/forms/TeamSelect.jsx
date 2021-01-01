import React, { Component } from "react"
import { Avatar, Select, Space, Spin, Tag } from "antd"
import PropTypes from "prop-types"
import shapes from "types"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import { fetchTeams, SUBJECT_USERS } from "../../../actions"
import DataPagination from "../../board/forms/DataPagination"
import EmptyData from "../../comon/data/EmptyData"

class TeamSelect extends Component {
  constructor(props) {
    super(props)

    this.handleFetch = debounce(props.fetchTeams, 300)

    this.state = {
      search: "",
    }
  }

  componentDidMount() {
    const { fetchTeams: fetchAction } = this.props
    fetchAction()
  }

  handleSearch = (search) => {
    const { teams } = this.props
    const { offset, limit } = teams
    this.handleFetch(search, offset, limit)
    this.setState({ search })
  }

  selectTagRender = ({ label, closable, onClose }) => {
    return (
      <Tag
        key={label._id}
        className={`color-${label?.color}`}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label?.identifier}
      </Tag>
    )
  }

  render() {
    const {
      value,
      onChange,
      teams,
      loading,
      fetchTeams: fetchAction,
      placeholder,
      disabled,
    } = this.props
    const { search } = this.state
    const { offset = 0, limit = 0, count = 0, data = [] } = teams

    return (
      <Select
        onChange={onChange}
        value={value}
        tagRender={this.selectTagRender}
        mode="multiple"
        searchValue={search}
        onSearch={this.handleSearch}
        placeholder={placeholder}
        optionLabelProp="label"
        optionFilterProp="search"
        dropdownRender={(menu) => (
          <Spin spinning={!!loading?.states[SUBJECT_USERS]}>
            {data.length ? (
              <>
                {menu}
                {limit < count && (
                  <div className="text-center p-md">
                    <DataPagination
                      limit={limit}
                      offset={offset}
                      count={count}
                      search={search}
                      onFetch={fetchAction}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyData title="No user found" />
            )}
          </Spin>
        )}
      >
        {data.map((team) => (
          <Select.Option
            disabled={disabled[team._id]}
            key={team._id}
            value={team._id}
            label={team}
            search={`${team.name}${team.identifier}`}
          >
            <Space>
              <Avatar
                className={`color-picker--disabled color-${team.color}`}
                size="small"
              />
              {" "}
              <span>
                {team.name}
                {' '}
                (
                {team.identifier}
                )
              </span>
            </Space>
          </Select.Option>
        ))}
      </Select>
    )
  }
}

TeamSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  teams: shapes.paginate(shapes.team),
  onChange: PropTypes.func,
  disabled: PropTypes.objectOf(PropTypes.bool),
  fetchTeams: PropTypes.func.isRequired,
  loading: shapes.loading,
}

TeamSelect.defaultProps = {
  teams: {},
  loading: null,
  value: [],
  disabled: {},
  onChange: null,
  placeholder: "use teams...",
}

function mapStateToProps({ teams, loading }) {
  return { teams: teams?.all, loading }
}

export default connect(mapStateToProps, { fetchTeams })(TeamSelect)
