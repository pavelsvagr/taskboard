import React, { Component } from "react"
import { connect } from "react-redux"
import { fetchTeam, fetchTeamMembers, SUBJECT_TEAM_MEMBERS, updateTeamMembers } from "actions"

import { Button, Space, Spin, Table, Tooltip } from "antd"

import Role from "@shared/security/roles"
import isAuthorized from "@shared/security/isAuthorized"

import { lexicalSort } from "helpers/sorting"
import { DeleteOutlined } from "@ant-design/icons"
import EmptyData from "components/comon/data/EmptyData"
import UnlockAccess from "components/comon/security/UnlockAccess"
import PropTypes from "prop-types"
import shapes from "types"
import UserMemberForm, { TYPE_TEAM_MEMBERS } from "./forms/UserMemberForm"
import { fetchLoggedUser, SUBJECT_TEAM } from "../../actions"

class TeamMembersGrid extends Component {
  columns = [
    {
      dataIndex: "email",
      title: "Email",
      sorter: lexicalSort(false, (item) => item.email),
      showSorterTooltip: false
    },
    {
      dataIndex: "name",
      title: "Name",
      sorter: lexicalSort(false, (item) => item.name),
      showSorterTooltip: false
    }
  ]

  componentDidMount() {
    const { fetchTeamMembers: fetchMembers, fetchTeam: fetch, identifier } = this.props
    fetch(identifier)
    fetchMembers(identifier)
  }

  handleDeleteMembers(ids) {
    const { team, members, updateTeamMembers: action } = this.props

    if (!team) {
      return
    }
    const toDelete = {}
    for (const id of ids) {
      toDelete[id] = true
    }
    const newMembers = members.filter((item) => !toDelete[item._id])
    action(team.identifier, newMembers)
  }

  render = () => {
    const { user, members, team, loading } = this.props
    const columns = [...this.columns]

    if (isAuthorized([Role.Admin, Role.Mod], [], user)) {
      columns.push({
        title: "Actions",
        key: "action",
        render: (text, record) => {
          return (
            <Space size="middle">
              <Tooltip title="Remove member">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => this.handleDeleteMembers([record._id])}
                  danger
                />
              </Tooltip>
            </Space>
          )
        }
      })
    }

    const spinning = !team || !!(
      loading.states[SUBJECT_TEAM_MEMBERS] ||
      loading.states[SUBJECT_TEAM]
    )


    return (
      <div>
        <Spin spinning={spinning}>
          <UnlockAccess globalRoles={[Role.Admin, Role.Mod]}>
            {members && (
              <UserMemberForm
                type={TYPE_TEAM_MEMBERS}
                team={team}
                taken={members}
              />
            )}
          </UnlockAccess>
          <Table
            size="small"
            rowKey="_id"
            dataSource={members}
            columns={columns}
            pagination={{ position: ["bottomCenter"] }}
            locale={{
              emptyText: (
                <EmptyData description="Team has no member." />
              )
            }}
          />
        </Spin>
      </div>
    )
  }
}

TeamMembersGrid.propTypes = {
  loading: shapes.loading,
  team: shapes.team,
  members: PropTypes.arrayOf(shapes.user),
  user: shapes.user,
  identifier: PropTypes.string.isRequired,
  fetchTeam: PropTypes.func.isRequired,
  fetchTeamMembers: PropTypes.func.isRequired,
  updateTeamMembers: PropTypes.func.isRequired
}

TeamMembersGrid.defaultProps = {
  loading: null,
  user: null,
  members: [],
  team: null
}

function mapStateToProps({ loading, teams, auth }) {
  const { members, team } = teams
  return { loading, user: auth, teams, team, members }
}

export default connect(mapStateToProps, {
  fetchTeam,
  fetchUser: fetchLoggedUser,
  fetchTeamMembers,
  updateTeamMembers
})(TeamMembersGrid)
