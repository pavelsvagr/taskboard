import React, { Component } from "react"
import { Select, Spin } from "antd"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import debounce from "lodash.debounce"
import { fetchUsers, SUBJECT_USERS } from "../../../actions"
import shapes from "../../../types"
import DataPagination from "../../board/forms/DataPagination"
import EmptyData from "../data/EmptyData"

class UserSelect extends Component {
  constructor(props) {
    super(props)

    this.handleFetch = debounce(props.fetchUsers, 600)

    this.state = {
      search: "",
    }
  }

  handleSearch = (search) => {
    const { users } = this.props
    const { limit, offset } = users
    this.setState({ search })
    this.handleFetch(search, offset, limit)
  }

  render() {
    const {
      value,
      onChange,
      users,
      disabled,
      loading,
      fetchUsers: fetchAction,
    } = this.props
    const { limit = 0, count = 0, offset = 0, data = [] } = users
    const { search } = this.state

    return (
      <Select
        mode="multiple"
        onChange={onChange}
        onSearch={this.handleSearch}
        searchValue={search}
        value={value}
        placeholder="Add users"
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
        {data.map((user) => (
          <Select.Option
            key={user._id}
            value={user._id}
            disabled={disabled[user._id]}
            label={user.name}
            search={`${user.email}${user.name}`}
          >
            {user.email} 
            {' '}
            {user.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}

UserSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  users: shapes.paginate(shapes.user),
  disabled: PropTypes.objectOf(PropTypes.bool),
  fetchUsers: PropTypes.func.isRequired,
  loading: shapes.loading,
}

UserSelect.defaultProps = {
  value: null,
  onChange: null,
  users: {},
  disabled: [],
  loading: null,
}

function mapStateToProps({ users, loading }) {
  return { users: users.all, loading }
}

export default connect(mapStateToProps, { fetchUsers })(UserSelect)
