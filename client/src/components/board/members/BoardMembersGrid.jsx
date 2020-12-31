import React, { Component } from "react"
import { connect } from "react-redux"

import { Button, Spin, Tag, Tooltip } from "antd"
import { CrownOutlined, DeleteOutlined, DownSquareOutlined, UpSquareOutlined } from "@ant-design/icons"
import { createBoardMembers, deleteBoardMember, SUBJECT_BOARD_MEMBERS, updateBoardMember } from "actions"

import Role from "@shared/security/roles"
import BoardRole from "@shared/security/rolesBoard"
import { higherRoleBoard, lowerRoleBoard } from "@shared/security/roleTree"
import UserMemberForm, { TYPE_BOARD_MEMBERS } from "components/teams/forms/UserMemberForm"
import EditableTable from "components/comon/grids/EditableTable"
import getBoardRoleColor from "helpers/boardRoles"
import EmptyData from "components/comon/data/EmptyData"
import UnlockAccess from "components/comon/security/UnlockAccess"
import PropTypes from "prop-types"
import BoardShape from "../../../types/board"
import LoadingShape from "../../../types/loading"
import shapes from "../../../types"

class BoardMembersGrid extends Component {
  constructor(props, context) {
    super(props, context)

    this.columns = [
      {
        dataIndex: "nickname",
        title: "Name on board",
        editable: true,
        onSave: (value) => {
          const { members, board, updateBoardMember: updateMember } = this.props

          const editedMember = members.find((m) => m._id === value._id)
          if (editedMember && editedMember.nickname === value.nickname.trim()) {
            return
          }
          updateMember(board.identifier, value._id, { nickname: value.nickname.trim() })
        }
      },
      {
        dataIndex: ["user", "email"],
        title: "Email"
      },
      {
        dataIndex: "role",
        title: "Role",
        render: (text) => <Tag color={getBoardRoleColor(text)}>{text}</Tag>
      },
      {
        title: "Actions",
        key: "action",
        render: (text, record) => {
          const upRole = higherRoleBoard(record.role)
          const downRole = lowerRoleBoard(record.role)

          return (
            <div className="table__actions">
              <UnlockAccess
                globalRoles={[Role.Admin, Role.Mod]}
                boardRoles={[BoardRole.Owner]}
              >
                {upRole && (
                  <Tooltip title={`Change role to ${upRole}`}>
                    <Button
                      shape="circle"
                      icon={
                        upRole === BoardRole.Owner ? (
                          <CrownOutlined />
                        ) : (
                          <UpSquareOutlined />
                        )
                      }
                      onClick={() =>
                        this.handleRoleChangeMember(record, upRole)}
                      type="primary"
                    />
                  </Tooltip>
                )}
                {downRole && (
                  <Tooltip title={`Change role to ${downRole}`}>
                    <Button
                      shape="circle"
                      icon={<DownSquareOutlined />}
                      onClick={() =>
                        this.handleRoleChangeMember(record, downRole)}
                      danger
                    />
                  </Tooltip>
                )}
              </UnlockAccess>
              <Tooltip title="Remove member">
                {record.role !== BoardRole.Owner && (
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => this.handleDeleteMember(record._id)}
                    danger
                  />
                )}
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }

  handleRoleChangeMember = (member, targetRole) => {
    const { board, updateBoardMember: action } = this.props
    const newMember = { ...member, ...{ role: targetRole } }
    action(board?.identifier, newMember?._id, newMember)
  }

  handleDeleteMember(id) {
    const { deleteBoardMember: action, board } = this.props
    action(board.identifier, id)
  }

  render = () => {
    const { members, board, loading } = this.props

    const taken = members.map((m) => m.user)

    const spinning =
      !members ||
      (loading.active !== 0 &&
        loading.states[SUBJECT_BOARD_MEMBERS] !== undefined)

    return (
      <div>
        <Spin spinning={spinning}>
          <UserMemberForm
            type={TYPE_BOARD_MEMBERS}
            board={board}
            taken={taken}
          />
          <EditableTable
            size="small"
            rowKey="_id"
            dataSource={members}
            columns={this.columns}
            locale={{
              emptyText: (
                <EmptyData description={`${board.name} has no member.`} />
              )
            }}
          />
        </Spin>
      </div>
    )
  }
}

BoardMembersGrid.propTypes = {
  board: BoardShape,
  loading: LoadingShape,
  members: PropTypes.arrayOf(shapes.member),
  updateBoardMember: PropTypes.func.isRequired,
  deleteBoardMember: PropTypes.func.isRequired,
}

BoardMembersGrid.defaultProps = {
  board: null,
  loading: null,
  members: []
}

function mapStateToProps({ loading, boards }) {
  if (boards && boards.members) {
    return { loading, members: boards.members }
  }
  return { loading }
}

export default connect(mapStateToProps, {
  createBoardMembers,
  deleteBoardMember,
  updateBoardMember
})(BoardMembersGrid)
