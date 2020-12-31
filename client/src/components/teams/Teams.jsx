import React, { Component } from "react"
import { Route } from "react-router-dom"
import { connect } from "react-redux"
import { deleteTeam, fetchTeams, sendTeam, SUBJECT_TEAMS, updateTeam } from "actions"

import { Button, Input, Modal, Spin } from "antd"

import Role from "@shared/security/roles"

import history from "helpers/history"
import AddButton from "components/comon/buttons/AddButton"
import ActionButtons from "components/comon/buttons/ActionButtons"
import UnlockAccess from "components/comon/security/UnlockAccess"
import EmptyData from "components/comon/data/EmptyData"
import PropTypes from "prop-types"
import { SyncOutlined } from "@ant-design/icons"
import TeamMembersGrid from "./TeamMembersGrid"
import TeamForm from "./forms/TeamForm"
import TeamsGrid from "./TeamsGrid"
import shapes from "../../types"
import { sortToString } from "../../helpers/sorting"

class Teams extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: ""
    }
  }

  componentDidMount() {
    const { fetchTeams: fetch } = this.props
    fetch()
  }

  handleNewTeam = () => {
    history.push("/teams/new")
  }

  handleSearch = (search) => {
    const { fetchTeams: action, teams } = this.props
    const { limit, offset, sort } = teams

    action(search, offset, limit, sortToString(sort))

    this.setState({ search })
  }

  render() {
    const { teams, loading, deleteTeam: handleDelete } = this.props
    const { search } = this.state

    const spinning = !!loading?.states[SUBJECT_TEAMS]

    return (
      <Spin spinning={spinning}>
        <h1>Teams</h1>
        <Route
          exact
          path="/teams/:teamId"
          render={({ match }) => {
            const { teamId } = match.params
            const edit = teamId === "new" ? null : teamId

            return (
              <Modal
                title={edit ? "Edit team" : "New team"}
                visible
                footer={null}
                closable
                onCancel={() => history.push("/teams")}
              >
                <TeamForm edit={edit} />
              </Modal>
            )
          }}
        />
        <Route
          exact
          path="/teams/:identifier/members"
          render={({ match }) => {
            const { identifier } = match.params

            return (
              <Modal
                title={identifier}
                closable
                visible
                width={1000}
                onCancel={() => history.push("/teams")}
                footer={null}
              >
                <TeamMembersGrid identifier={identifier} />
              </Modal>
            )
          }}
        />
        <div className="box-container__toolbox">
          <Input.Search
            placeholder="Search..."
            onSearch={this.handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Button onClick={this.handleReload} icon={<SyncOutlined />}>Refresh</Button>
        </div>
        <TeamsGrid
          onEdit={(id) => history.push(`/teams/${id}`)}
          onDelete={(id) => handleDelete(id)}
          search={search}
          onShowMembers={(id) => history.push(`/teams/${id}/members`)}
          empty={(
            <UnlockAccess
              globalRoles={[Role.Admin, Role.Mod]}
              lock={<EmptyData description="No team found" />}
            >
              <EmptyData
                description="No team found"
                onClick={!teams?.length ? this.handleNewTeam : null}
              />
            </UnlockAccess>
          )}
        />

        {!!teams?.count && (
          <UnlockAccess globalRoles={[Role.Admin, Role.Mod]}>
            <ActionButtons>
              <AddButton onClick={this.handleNewTeam} shape="circle" />
            </ActionButtons>
          </UnlockAccess>
        )}
      </Spin>
    )
  }
}

Teams.propTypes = {
  loading: shapes.loading,
  teams: shapes.paginate(shapes.team),
  fetchTeams: PropTypes.func.isRequired,
  deleteTeam: PropTypes.func.isRequired
}

Teams.defaultProps = {
  loading: null,
  teams: {}
}


function mapStateToProps({ teams, loading }) {
  return { teams: teams?.all, loading }
}

export default connect(mapStateToProps, {
  fetchTeams,
  sendTeam,
  updateTeam,
  deleteTeam
})(Teams)
