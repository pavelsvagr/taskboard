import React, { Component } from "react"
import { connect } from "react-redux"
import { Button, Input, Modal, Spin } from "antd"
import PropTypes from "prop-types"
import { Route } from "react-router-dom"

import { fetchLoggedUser, fetchUsers, SUBJECT_USERS, updateUser } from "actions"
import LoadingShape from "types/loading"
import EmptyData from "components/comon/data/EmptyData"
import history from "helpers/history"
import { SyncOutlined } from "@ant-design/icons"
import shapes from "types"
import Role from "@shared/security/roles"
import UsersGrid from "./UsersGrid"
import UserForm from "./UserForm"
import ActionButtons from "../comon/buttons/ActionButtons"
import AddButton from "../comon/buttons/AddButton"
import { sortToString } from "../../helpers/sorting"
import UnlockAccess from "../comon/security/UnlockAccess"

class Users extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ""
    }
  }

  componentDidMount() {
    this.handleReload()
  }

  handleReload = () => {
    const { fetchUsers: action, users } = this.props
    const { search } = this.state
    const { limit, offset, sort } = users || {}

    action(search, offset, limit, sortToString(sort))
  }

  handleEditUser = (user) => {
    const { updateUser: action } = this.props
    action(user._id, user)
  }

  handleEditForm = (user) => history.push(`/users/${user._id}`)

  handleNewUser = () => history.push("/users/new")

  handleSearch = (search) => {
    const { fetchUsers: action, users } = this.props
    const { limit, offset, sort } = users || {}

    action(search, offset, limit, sortToString(sort))

    this.setState({ search })
  }

  render() {
    const { loading, auth, users } = this.props
    const { search } = this.state

    return (
      <>
        <h1>Users</h1>
        <Route
          exact
          path="/users/:userId"
          render={({ match }) => {
            const { userId } = match.params
            const edit = userId === "new" ? null : userId

            return (
              <Modal
                title={edit ? "Edit user" : "New user"}
                visible
                footer={null}
                closable
                onCancel={() => history.push("/users")}
              >
                <UserForm edit={edit} />
              </Modal>
            )
          }}
        />
        <Spin spinning={!!loading?.states[SUBJECT_USERS]}>
          <div className="box-container__toolbox">
            <Input.Search
              placeholder="Search..."
              onSearch={this.handleSearch}
              style={{ width: 250 }}
              allowClear
            />
            <Button onClick={this.handleReload} icon={<SyncOutlined />}>Refresh</Button>
          </div>
          <UsersGrid
            userId={auth?._id}
            empty={<EmptyData description="No user found" />}
            onEdit={this.handleEditUser}
            search={search}
            onDetail={this.handleEditForm}
          />
          {users?.count && (
            <UnlockAccess globalRoles={[Role.Admin, Role.Mod]}>
              <ActionButtons>
                <AddButton onClick={this.handleNewUser} shape="circle" />
              </ActionButtons>
            </UnlockAccess>
          )}
        </Spin>
      </>
    )
  }
}

Users.propTypes = {
  users: shapes.paginate(shapes.user),
  loading: LoadingShape,
  fetchUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  auth: shapes.user
}

Users.defaultProps = {
  auth: null,
  users: null,
  loading: null
}

function mapStateToProps({ auth, users, loading }) {
  return { auth, users: users.all, loading }
}

export default connect(mapStateToProps, { fetchUsers, updateUser, fetchUser: fetchLoggedUser })(Users)